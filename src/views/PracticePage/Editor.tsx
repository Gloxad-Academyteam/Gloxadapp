"use client";

import { BlockSkeleton, CardGridSkeleton, DetailSkeleton, ListSkeleton, Skeleton, TableRowsSkeleton } from "@components/Skeleton";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { LuCheck, LuCloudOff, LuFileCode2, LuHistory, LuLoader, LuPlay, LuRotateCcw, LuTerminal, LuTrash2, LuAlertTriangle, LuX } from "react-icons/lu";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { practiceApi, TPracticeFile, TWorkspace } from "@services/practice";
import { runCode, TLogLine } from "../Lms/components/runCode";
import { buildPreviewDocument, createPythonSession, PREVIEW_CHANNEL } from "./runners";
import { languageLabel, STARTERS } from "./starters";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="skeleton h-[400px] w-full" role="status" aria-label="Loading editor" />,
});

const extensionFor = (fileName: string): Extension => {
  if (fileName.endsWith(".py")) return python();
  if (fileName.endsWith(".html")) return html();
  if (fileName.endsWith(".css")) return css();
  return javascript();
};

const LOG_COLOR: Record<string, string> = { log: "text-[#d4d4d4]", info: "text-[#9cdcfe]", warn: "text-[#dcdcaa]", error: "text-[#f48771]" };
const SAVE_DELAY_MS = 2000;
const MAX_CONSOLE_LINES = 300;

type TStatus = "saved" | "dirty" | "saving" | "offline" | "error" | "conflict" | "local";
type TLocalCopy = { base: number; files: TPracticeFile[]; title: string; dirty: boolean };

const localKey = (id: string) => `gloxad-practice:${id}`;
const readLocal = (id: string): TLocalCopy | null => {
  try {
    const raw = window.localStorage.getItem(localKey(id));
    return raw ? (JSON.parse(raw) as TLocalCopy) : null;
  } catch {
    return null;
  }
};
const writeLocal = (id: string, copy: TLocalCopy) => {
  try {
    window.localStorage.setItem(localKey(id), JSON.stringify(copy));
  } catch {
    // Storage can be blocked or full; cloud saving still works
  }
};
const clearLocal = (id: string) => {
  try {
    window.localStorage.removeItem(localKey(id));
  } catch {
    // ignore
  }
};

const sameFiles = (a: TPracticeFile[], b: TPracticeFile[]) => a.length === b.length && a.every((file, i) => file.name === b[i].name && file.content === b[i].content);

const STATUS_TEXT: Record<TStatus, string> = {
  saved: "Saved",
  dirty: "Unsaved changes",
  saving: "Saving...",
  offline: "Offline. Will retry",
  error: "Save failed",
  conflict: "Changed elsewhere",
  local: "Saved in this browser",
};

const StatusPill = ({ status }: { status: TStatus }) => {
  const tone =
    status === "saved" || status === "local" ? "bg-[#e6f6ec] text-[#15803d]" : status === "saving" || status === "dirty" ? "bg-[#eef1f8] text-[#52607A]" : "bg-[#fdecec] text-[#b42318]";
  const Icon = status === "saved" || status === "local" ? LuCheck : status === "saving" ? LuLoader : status === "offline" ? LuCloudOff : status === "dirty" ? LuHistory : LuAlertTriangle;
  return (
    <span role="status" aria-live="polite" className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${tone}`}>
      <Icon aria-hidden className={`text-[13px] ${status === "saving" ? "animate-spin" : ""}`} /> {STATUS_TEXT[status]}
    </span>
  );
};

type TProps = {
  workspace: TWorkspace;
  // Cloud workspaces autosave to the account; local ones live only in this browser
  cloud: boolean;
  onDelete?: () => void;
  onSaved?: () => void;
};

const Editor = ({ workspace, cloud, onDelete, onSaved }: TProps) => {
  const id = workspace.id;
  const isWeb = workspace.language === "web";

  const [files, setFiles] = useState<TPracticeFile[]>(workspace.files);
  const [title, setTitle] = useState(workspace.title);
  const [activeName, setActiveName] = useState(workspace.files[0]?.name ?? "");
  const [status, setStatus] = useState<TStatus>(cloud ? "saved" : "local");
  const [conflict, setConflict] = useState<TWorkspace | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const filesRef = useRef(files);
  const titleRef = useRef(title);
  const versionRef = useRef(workspace.version);
  const savingRef = useRef(false);
  const conflictRef = useRef(false);
  const timerRef = useRef<number>();

  // ----- saving -----
  const persistLocal = useCallback((dirty: boolean) => writeLocal(id, { base: versionRef.current, files: filesRef.current, title: titleRef.current, dirty }), [id]);

  const save = useCallback(async () => {
    if (!cloud || savingRef.current || conflictRef.current) return;
    savingRef.current = true;
    setStatus("saving");
    const sentFiles = filesRef.current;
    const sentTitle = titleRef.current;
    try {
      const result = await practiceApi.autosave(id, { baseVersion: versionRef.current, files: sentFiles, title: sentTitle });
      versionRef.current = result.version;
      savingRef.current = false;
      if (filesRef.current !== sentFiles || titleRef.current !== sentTitle) {
        // More typing happened while this save was on its way
        persistLocal(true);
        setStatus("dirty");
        timerRef.current = window.setTimeout(save, 400);
      } else {
        persistLocal(false);
        setStatus("saved");
        onSaved?.();
      }
    } catch (error) {
      savingRef.current = false;
      const response = (error as AxiosError<{ code?: string; current?: TWorkspace; error?: string }>).response;
      if (response?.status === 409 && response.data?.current) {
        conflictRef.current = true;
        setConflict(response.data.current);
        setStatus("conflict");
      } else if (!response) {
        setStatus("offline");
        timerRef.current = window.setTimeout(save, 8000);
      } else if (response.status === 400) {
        setStatus("error");
        toast.error(response.data?.error ?? "We couldn't save this. Check the file names and sizes.");
      } else {
        setStatus("error");
        timerRef.current = window.setTimeout(save, 15000);
      }
    }
  }, [cloud, id, persistLocal, onSaved]);

  const scheduleSave = useCallback(
    (delay = SAVE_DELAY_MS) => {
      window.clearTimeout(timerRef.current);
      if (!cloud) return;
      timerRef.current = window.setTimeout(save, delay);
    },
    [cloud, save]
  );

  // Work typed before a refresh, a crash or a lost connection comes back from the browser copy
  useEffect(() => {
    const local = readLocal(id);
    if (!local || sameFiles(local.files, workspace.files)) return;
    if (!cloud) {
      filesRef.current = local.files;
      setFiles(local.files);
      setActiveName((current) => (local.files.some((file) => file.name === current) ? current : local.files[0].name));
    } else if (local.dirty) {
      if (local.base === workspace.version) {
        filesRef.current = local.files;
        titleRef.current = local.title || workspace.title;
        setFiles(local.files);
        setTitle(titleRef.current);
        setStatus("dirty");
        scheduleSave(500);
      } else {
        // The account has a newer copy than the one this browser started from: ask, never overwrite
        conflictRef.current = true;
        setConflict(workspace);
        filesRef.current = local.files;
        setFiles(local.files);
        setStatus("conflict");
      }
    }
    // Runs once per workspace (the editor is keyed by workspace id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const retry = () => {
      if (status === "offline") save();
    };
    window.addEventListener("online", retry);
    return () => window.removeEventListener("online", retry);
  }, [status, save]);

  const statusRef = useRef(status);
  statusRef.current = status;

  // Last chance: save when leaving the tab or the page
  useEffect(() => {
    const flush = () => {
      if (document.visibilityState === "hidden" && cloud && (statusRef.current === "dirty" || statusRef.current === "offline")) save();
    };
    document.addEventListener("visibilitychange", flush);
    return () => {
      document.removeEventListener("visibilitychange", flush);
      window.clearTimeout(timerRef.current);
      if (cloud && statusRef.current === "dirty") save();
    };
  }, [cloud, save]);

  const applyServerCopy = (copy: TWorkspace) => {
    window.clearTimeout(timerRef.current);
    conflictRef.current = false;
    setConflict(null);
    versionRef.current = copy.version;
    filesRef.current = copy.files;
    titleRef.current = copy.title;
    setFiles(copy.files);
    setTitle(copy.title);
    setActiveName((current) => (copy.files.some((file) => file.name === current) ? current : copy.files[0].name));
    persistLocal(false);
    setStatus("saved");
  };

  const keepMine = () => {
    if (!conflict) return;
    // Take the account's version number so the next save goes through, and replaces the other copy on purpose
    versionRef.current = conflict.version;
    conflictRef.current = false;
    setConflict(null);
    persistLocal(true);
    setStatus("dirty");
    save();
  };

  const changeFile = useCallback(
    (name: string, content: string) => {
      const next = filesRef.current.map((file) => (file.name === name ? { ...file, content } : file));
      filesRef.current = next;
      setFiles(next);
      persistLocal(true);
      if (cloud) {
        if (!conflictRef.current) {
          setStatus("dirty");
          scheduleSave();
        }
      }
    },
    [cloud, persistLocal, scheduleSave]
  );

  const changeTitle = (value: string) => {
    setTitle(value);
    titleRef.current = value;
    persistLocal(true);
    if (cloud && !conflictRef.current) {
      setStatus("dirty");
      scheduleSave();
    }
  };

  const reset = () => {
    if (!window.confirm("Reset to the starter code? Your current code is kept in version history.")) return;
    const starter = STARTERS[workspace.language];
    filesRef.current = starter;
    setFiles(starter);
    setActiveName(starter[0].name);
    persistLocal(true);
    if (cloud) {
      setStatus("dirty");
      scheduleSave(300);
    }
  };

  // ----- running -----
  const [logs, setLogs] = useState<TLogLine[]>([]);
  const [runError, setRunError] = useState<string | undefined>();
  const [ranMs, setRanMs] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [pyStatus, setPyStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const pySession = useMemo(() => (workspace.language === "python" ? createPythonSession() : null), [workspace.language]);
  const warmedRef = useRef(false);

  useEffect(() => {
    pySession?.onStatus(setPyStatus);
    return () => pySession?.dispose();
  }, [pySession]);

  const mainFile = files[0];
  const run = useCallback(async () => {
    if (running || !mainFile) return;
    if (workspace.language === "javascript") {
      setRunning(true);
      const result = await runCode(mainFile.content);
      setLogs(result.logs);
      setRunError(result.error);
      setRanMs(result.ms);
      setRunning(false);
    } else if (workspace.language === "python" && pySession) {
      setRunning(true);
      setLogs([]);
      setRunError(undefined);
      const result = await pySession.run(mainFile.content);
      setLogs(result.logs);
      setRunError(result.error);
      setRanMs(result.ms);
      setRunning(false);
    }
  }, [running, mainFile, workspace.language, pySession]);

  // Web pages: rebuild the preview shortly after typing stops
  const [previewDoc, setPreviewDoc] = useState(() => (isWeb ? buildPreviewDocument(workspace.files) : ""));
  const [previewKey, setPreviewKey] = useState(0);
  useEffect(() => {
    if (!isWeb) return;
    const timer = window.setTimeout(() => {
      setLogs([]);
      setRunError(undefined);
      setPreviewDoc(buildPreviewDocument(filesRef.current));
    }, 450);
    return () => window.clearTimeout(timer);
  }, [files, isWeb]);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (!isWeb) return;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow || event.data?.channel !== PREVIEW_CHANNEL) return;
      const level = ["log", "info", "warn", "error"].includes(event.data.level) ? event.data.level : "log";
      setLogs((current) => [...current.slice(-(MAX_CONSOLE_LINES - 1)), { level, text: String(event.data.text).slice(0, 2000) }]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [isWeb]);

  const runWeb = () => {
    setLogs([]);
    setPreviewDoc(buildPreviewDocument(filesRef.current));
    setPreviewKey((value) => value + 1);
  };
  const onRun = isWeb ? runWeb : run;

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onRun();
    } else if (event.key.toLowerCase() === "s" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      window.clearTimeout(timerRef.current);
      save();
    }
  };

  const active = files.find((file) => file.name === activeName) ?? files[0];

  // ----- history -----
  const versions = useQuery({ queryKey: ["practice", "versions", id, historyOpen], queryFn: () => practiceApi.versions(id), enabled: cloud && historyOpen, gcTime: 0 });
  const restore = async (version: number) => {
    if (!window.confirm(`Go back to version ${version}? Your current code is kept in history.`)) return;
    try {
      applyServerCopy(await practiceApi.restore(id, version));
      setHistoryOpen(false);
      toast.success("Version restored.");
    } catch {
      toast.error("We couldn't restore that version. Please try again.");
    }
  };

  const consoleBody = (
    <div role="log" aria-live="polite" className="h-full min-h-[120px] overflow-auto p-4 font-mono text-[13px] leading-relaxed">
      {pyStatus === "loading" && running && <p className="text-[#9cdcfe]">Loading Python. This happens once and can take a few seconds...</p>}
      {logs.map((line, index) => (
        <pre key={index} className={`whitespace-pre-wrap break-words ${LOG_COLOR[line.level]}`}>{line.text}</pre>
      ))}
      {runError && <pre className="mt-1 whitespace-pre-wrap break-words text-[#f48771]">{runError}</pre>}
      {!logs.length && !runError && !(pyStatus === "loading" && running) && (
        <p className="text-[#6e7186]">{isWeb ? "console.log from your page appears here." : ranMs === null ? "Press Run to execute your code." : "Your code ran with no output."}</p>
      )}
    </div>
  );

  return (
    <div onKeyDown={onKeyDown} onFocusCapture={() => {
      if (pySession && !warmedRef.current) {
        warmedRef.current = true;
        pySession.warm();
      }
    }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={title}
          onChange={(event) => changeTitle(event.target.value)}
          maxLength={80}
          aria-label="Practice title"
          className="w-full min-w-0 rounded-lg sm:flex-1 sm:basis-[260px] sm:w-auto border border-transparent bg-transparent px-2 py-1.5 text-[20px] font-bold text-[#14162b] outline-none transition hover:border-[#e3e8f4] focus:border-[#c9d3ee] focus:bg-white"
        />
        <span className="rounded-full bg-[#eef1f8] px-3 py-1 text-[12px] font-semibold text-[#52607A]">{languageLabel(workspace.language)}</span>
        <StatusPill status={status} />
        {cloud && (
          <button type="button" onClick={() => setHistoryOpen((value) => !value)} aria-expanded={historyOpen} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d6dbea] bg-white px-4 text-[13px] font-semibold text-[#37394b] transition hover:bg-[#f4f6fb]">
            <LuHistory aria-hidden /> History
          </button>
        )}
        <button type="button" onClick={reset} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#d6dbea] bg-white px-4 text-[13px] font-semibold text-[#37394b] transition hover:bg-[#f4f6fb]">
          <LuRotateCcw aria-hidden /> Reset
        </button>
        {onDelete && (
          <button type="button" onClick={onDelete} aria-label="Delete this practice" title="Delete" className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d6dbea] bg-white text-[#b42318] transition hover:bg-[#fdecec]">
            <LuTrash2 aria-hidden />
          </button>
        )}
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[#0B1F4D] px-6 text-[14px] font-semibold text-white shadow-[0_2px_6px_rgba(11,31,77,0.25)] transition hover:bg-[#13306f] disabled:cursor-wait disabled:opacity-60"
        >
          <LuPlay aria-hidden /> {running ? "Running..." : isWeb ? "Refresh" : "Run"}
          <kbd className="hidden rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-normal sm:inline">Ctrl+Enter</kbd>
        </button>
      </div>

      {conflict && (
        <div role="alert" className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-[#f5c2c0] bg-[#fdecec] px-4 py-3 text-[13.5px] text-[#7a1d14]">
          <LuAlertTriangle aria-hidden className="shrink-0 text-[18px]" />
          <p className="min-w-0 flex-1 basis-[240px]">This practice was changed on another device or tab. Nothing was overwritten. Choose which copy to keep.</p>
          <button type="button" onClick={() => applyServerCopy(conflict)} className="h-9 rounded-full bg-white px-4 text-[13px] font-semibold text-[#7a1d14] ring-1 ring-[#f5c2c0] hover:bg-[#fff5f5]">Load the latest</button>
          <button type="button" onClick={keepMine} className="h-9 rounded-full bg-[#b42318] px-4 text-[13px] font-semibold text-white hover:bg-[#9a1d14]">Keep mine</button>
        </div>
      )}

      {historyOpen && cloud && (
        <div className="mt-4 rounded-xl border border-[#e3e8f4] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#14162b]">Earlier versions</h2>
            <button type="button" onClick={() => setHistoryOpen(false)} aria-label="Close history" className="text-[#717480] hover:text-[#14162b]"><LuX /></button>
          </div>
          {versions.isLoading ? (
            <div className="mt-3 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-4/5" /></div>
          ) : versions.data && versions.data.versions.length > 0 ? (
            <ul className="mt-3 flex max-h-[220px] flex-col divide-y divide-[#eef1f8] overflow-auto">
              {versions.data.versions.map((entry) => (
                <li key={entry.version} className="flex items-center justify-between gap-3 py-2.5 text-[13px]">
                  <span className="min-w-0 text-[#37394b]">
                    <b className="font-semibold">Version {entry.version}</b> <span className="text-[#717480]">· {new Date(entry.savedAt).toLocaleString()} · {entry.files.join(", ")}</span>
                  </span>
                  <button type="button" onClick={() => restore(entry.version)} className="shrink-0 rounded-full border border-[#d6dbea] px-3 py-1 text-[12px] font-semibold text-[#0B1F4D] hover:bg-[#f4f6fb]">Restore</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[13px] text-[#717480]">Earlier versions appear here as you keep working. A snapshot is kept at most once a minute.</p>
          )}
        </div>
      )}

      {/* Editor and output */}
      <div className={`mt-4 grid gap-4 ${isWeb ? "lg:grid-cols-2" : ""}`}>
        <section aria-label="Code editor" className="min-w-0 overflow-hidden rounded-xl border border-[#2b2b3a] bg-[#1e1e1e] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.7)]">
          <div role="tablist" aria-label="Files" className="flex items-center gap-0.5 overflow-x-auto bg-[#252526]">
            {files.map((file) => (
              <button
                key={file.name}
                type="button"
                role="tab"
                aria-selected={file.name === active?.name}
                onClick={() => setActiveName(file.name)}
                className={`flex shrink-0 items-center gap-2 border-t-2 px-4 py-2.5 text-[13px] transition-colors ${file.name === active?.name ? "border-[#00a2e8] bg-[#1e1e1e] text-white" : "border-transparent text-[#9da0b5] hover:bg-[#2a2a2c]"}`}
              >
                <LuFileCode2 size={15} aria-hidden /> {file.name}
              </button>
            ))}
          </div>
          {active && (
            <CodeMirror
              key={active.name}
              value={active.content}
              height="400px"
              theme={vscodeDark}
              extensions={[extensionFor(active.name)]}
              onChange={(value) => changeFile(active.name, value)}
              aria-label={`${active.name} editor`}
              basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true, autocompletion: true, bracketMatching: true, closeBrackets: true, indentOnInput: true }}
              style={{ fontSize: 14 }}
            />
          )}
        </section>

        <section aria-label="Output" className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-[#2b2b3a] bg-[#1e1e1e]">
          {isWeb && (
            <>
              <div className="flex items-center bg-[#252526] px-4 py-2.5 text-[12px] font-medium uppercase tracking-wider text-[#9da0b5]">Live preview</div>
              <iframe
                key={previewKey}
                ref={iframeRef}
                title="Live preview of your page"
                sandbox="allow-scripts"
                srcDoc={previewDoc}
                className="h-[250px] w-full flex-none border-0 bg-white lg:h-[260px]"
              />
            </>
          )}
          <div className="flex items-center gap-2 bg-[#252526] px-4 py-2.5 text-[12px] font-medium uppercase tracking-wider text-[#9da0b5]">
            <LuTerminal aria-hidden size={14} /> Console
            <span className="ml-auto normal-case tracking-normal">{running ? "Running..." : ranMs !== null && !isWeb ? `${ranMs} ms` : ""}</span>
          </div>
          <div className={isWeb ? "h-[120px] flex-none" : "h-[200px]"}>{consoleBody}</div>
        </section>
      </div>
    </div>
  );
};

export default Editor;
