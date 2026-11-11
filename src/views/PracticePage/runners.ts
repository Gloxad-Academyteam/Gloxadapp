import { TLogLine, TRunResult } from "../Lms/components/runCode";
import type { TPracticeFile } from "@services/practice";

// ---------- Python (Pyodide, in a Web Worker) ----------
// Pyodide is Python compiled to WebAssembly. It is downloaded the first time it is needed (about 10 MB, then cached by the browser)
// and runs inside a worker, so a learner's code can never touch the page and an endless loop can be stopped.
const PYODIDE_VERSION = "0.26.4";
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

const PY_WORKER_SOURCE = `
importScripts(${JSON.stringify(PYODIDE_BASE + "pyodide.js")});
let pyodidePromise = null;
const load = () => (pyodidePromise ||= loadPyodide({ indexURL: ${JSON.stringify(PYODIDE_BASE)} }));
self.onmessage = async (event) => {
  const { type, code } = event.data;
  if (type === "warm") {
    try { await load(); self.postMessage({ type: "ready" }); } catch (err) { self.postMessage({ type: "failed", error: String((err && err.message) || err) }); }
    return;
  }
  const logs = [];
  const started = Date.now();
  let error;
  try {
    const pyodide = await load();
    self.postMessage({ type: "started" });
    const push = (level) => (text) => { if (logs.length < 500) logs.push({ level, text }); };
    pyodide.setStdout({ batched: push("log") });
    pyodide.setStderr({ batched: push("error") });
    // A fresh namespace each run, so one run never leaks names into the next
    const globals = pyodide.globals.get("dict")();
    try { await pyodide.runPythonAsync(code, { globals }); } finally { globals.destroy(); }
  } catch (err) {
    // Drop Pyodide's own frames: show the learner's lines from <exec> onward
    const text = String((err && err.message) || err).trim().split("\\n");
    const start = text.findIndex((line) => line.includes('File "<exec>"'));
    error = start >= 0 ? ["Traceback (most recent call last):"].concat(text.slice(start)).join("\\n") : text.slice(-6).join("\\n");
  }
  self.postMessage({ type: "done", logs, error, ms: Date.now() - started });
};
`;

type TPythonSession = { run: (code: string, timeoutMs?: number) => Promise<TRunResult>; warm: () => void; dispose: () => void; onStatus: (cb: (status: "idle" | "loading" | "ready" | "failed") => void) => void };

export const createPythonSession = (): TPythonSession => {
  let worker: Worker | null = null;
  let url: string | null = null;
  let ready = false;
  let statusCb: (status: "idle" | "loading" | "ready" | "failed") => void = () => {};

  const stop = () => {
    worker?.terminate();
    if (url) URL.revokeObjectURL(url);
    worker = null;
    url = null;
    ready = false;
  };
  const start = () => {
    if (worker) return worker;
    url = URL.createObjectURL(new Blob([PY_WORKER_SOURCE], { type: "text/javascript" }));
    worker = new Worker(url);
    statusCb("loading");
    return worker;
  };

  return {
    onStatus: (cb) => {
      statusCb = cb;
    },
    warm: () => {
      if (ready || worker) return;
      const w = start();
      w.onmessage = (event) => {
        if (event.data.type === "ready") {
          ready = true;
          statusCb("ready");
        } else if (event.data.type === "failed") {
          stop();
          statusCb("failed");
        }
      };
      w.postMessage({ type: "warm" });
    },
    run: (code, timeoutMs = 10000) =>
      new Promise((resolve) => {
        const w = start();
        const began = performance.now();
        let runTimer: number | undefined;
        // Downloading the runtime is not the learner's code running, so the timeout only starts once Python says it has begun
        const armTimer = () => {
          runTimer = window.setTimeout(() => {
            stop();
            statusCb("idle");
            resolve({ logs: [], tests: [], error: `Your code took longer than ${timeoutMs / 1000} seconds and was stopped. Check for an infinite loop.`, timedOut: true, ms: Math.round(performance.now() - began) });
          }, timeoutMs);
        };
        w.onmessage = (event) => {
          const data = event.data;
          if (data.type === "ready") {
            ready = true;
            statusCb("ready");
          } else if (data.type === "started") {
            ready = true;
            statusCb("ready");
            armTimer();
          } else if (data.type === "failed") {
            stop();
            statusCb("failed");
            resolve({ logs: [], tests: [], error: "Python could not be loaded. Check your internet connection and try again.", ms: 0 });
          } else if (data.type === "done") {
            window.clearTimeout(runTimer);
            resolve({ logs: data.logs as TLogLine[], tests: [], error: data.error, ms: data.ms });
          }
        };
        w.onerror = (event) => {
          event.preventDefault();
          window.clearTimeout(runTimer);
          stop();
          statusCb("failed");
          resolve({ logs: [], tests: [], error: "Python could not be loaded. Check your internet connection and try again.", ms: 0 });
        };
        w.postMessage({ type: "run", code });
      }),
    dispose: stop,
  };
};

// ---------- Web page preview (sandboxed iframe) ----------
// The page runs with sandbox="allow-scripts" and no allow-same-origin, so it cannot read the app, its cookies or its storage.
export const PREVIEW_CHANNEL = "gloxad-practice-preview";

const CONSOLE_BRIDGE = `<script>(function(){
  var send=function(level,args){try{parent.postMessage({channel:${JSON.stringify(PREVIEW_CHANNEL)},level:level,text:Array.prototype.map.call(args,function(v){if(typeof v==="string")return v;if(v instanceof Error)return v.stack||String(v);try{var t=JSON.stringify(v);return t===undefined?String(v):t}catch(e){return String(v)}}).join(" ")},"*")}catch(e){}};
  ["log","info","warn","error"].forEach(function(l){var o=console[l];console[l]=function(){send(l,arguments);o&&o.apply(console,arguments)}});
  window.addEventListener("error",function(e){send("error",[e.message])});
  window.addEventListener("unhandledrejection",function(e){send("error",["Unhandled promise rejection: "+(e.reason&&e.reason.message||e.reason)])});
})();</script>`;

// Joins index.html with the other files: <link href="style.css"> and <script src="script.js"> are replaced by the file's contents.
export const buildPreviewDocument = (files: TPracticeFile[]): string => {
  const byName = new Map(files.map((file) => [file.name, file.content]));
  const escapeClose = (text: string, tag: string) => text.replace(new RegExp(`</${tag}`, "gi"), `<\\/${tag}`);
  let page = byName.get("index.html") ?? files.find((file) => file.name.endsWith(".html"))?.content ?? "";
  const used = new Set<string>();

  page = page.replace(/<link\b[^>]*href=["']([^"']+)["'][^>]*>/gi, (tag, href: string) => {
    const content = byName.get(href.replace(/^\.\//, ""));
    if (content === undefined || !/stylesheet/i.test(tag)) return tag;
    used.add(href.replace(/^\.\//, ""));
    return `<style>${escapeClose(content, "style")}</style>`;
  });
  page = page.replace(/<script\b[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (tag, src: string) => {
    const content = byName.get(src.replace(/^\.\//, ""));
    if (content === undefined) return tag;
    used.add(src.replace(/^\.\//, ""));
    return `<script>${escapeClose(content, "script")}</script>`;
  });

  // Files the page did not mention are still included, so a learner who forgets the <link> still sees their CSS
  const extraCss = files.filter((file) => file.name.endsWith(".css") && !used.has(file.name)).map((file) => `<style>${escapeClose(file.content, "style")}</style>`).join("");
  const extraJs = files.filter((file) => file.name.endsWith(".js") && !used.has(file.name)).map((file) => `<script>${escapeClose(file.content, "script")}</script>`).join("");

  const head = `${CONSOLE_BRIDGE}${extraCss}`;
  let doc: string;
  if (/<head[^>]*>/i.test(page)) doc = page.replace(/<head[^>]*>/i, (match) => match + head);
  else if (/<html[^>]*>/i.test(page)) doc = page.replace(/<html[^>]*>/i, (match) => `${match}<head>${head}</head>`);
  else doc = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">${head}</head><body>${page}</body></html>`;
  return /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, (match) => extraJs + match) : doc + extraJs;
};
