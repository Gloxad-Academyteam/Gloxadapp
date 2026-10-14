"use client";

import { KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import {
  MdOutlineCancel,
  MdOutlineCheckCircle,
  MdOutlineLightbulb,
  MdOutlineLock,
  MdOutlinePlayArrow,
  MdOutlineRestartAlt,
  MdOutlineTerminal,
} from "react-icons/md";
import { LuFileCode2 } from "react-icons/lu";
import { toast } from "react-toastify";
import LmsShell from "./components/LmsShell";
import { cardClass, outlineButton } from "./components/ui";
import { runCode, TRunResult } from "./components/runCode";
import { CODE_LAB, TLabFile } from "./data";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="flex h-[440px] items-center justify-center bg-[#1e1e1e] text-[13px] text-[#9da0b5]">Loading editor...</div>,
});

const languageExtension = (language: TLabFile["language"]): Extension => {
  switch (language) {
    case "python":
      return python();
    case "html":
      return html();
    case "css":
      return css();
    case "json":
      return json();
    default:
      return javascript();
  }
};

const storageKey = (file: string) => `gloxad-lab:${CODE_LAB.id}:${file}`;
const DONE_KEY = `gloxad-lab:${CODE_LAB.id}:done`;

const readStored = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};
const writeStored = (key: string, value: string | null) => {
  try {
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked (private mode); the lab still works, it just won't autosave.
  }
};

type TPanel = "console" | "tests";

const LOG_COLOR: Record<string, string> = { log: "text-[#d4d4d4]", info: "text-[#9cdcfe]", warn: "text-[#dcdcaa]", error: "text-[#f48771]" };

const CodingLabPage = () => {
  const initial = useMemo(() => Object.fromEntries(CODE_LAB.files.map((file) => [file.name, file.content])), []);
  const [contents, setContents] = useState<Record<string, string>>(initial);
  const [activeFile, setActiveFile] = useState(CODE_LAB.files[0].name);
  const [panel, setPanel] = useState<TPanel>("console");
  const [result, setResult] = useState<TRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const runningRef = useRef(false);

  // Restore the student's saved work after mount (kept out of the initial render to avoid a hydration mismatch)
  useEffect(() => {
    setContents((current) => {
      const next = { ...current };
      for (const file of CODE_LAB.files) {
        if (file.readOnly) continue;
        const stored = readStored(storageKey(file.name));
        if (stored !== null) next[file.name] = stored;
      }
      return next;
    });
    setIsSolved(readStored(DONE_KEY) === "1");
  }, []);

  const file = CODE_LAB.files.find((entry) => entry.name === activeFile) ?? CODE_LAB.files[0];
  const testsFile = CODE_LAB.files.find((entry) => entry.readOnly);
  const code = contents[CODE_LAB.files[0].name];
  const passed = result?.tests.filter((test) => test.passed).length ?? 0;
  const total = result?.tests.length ?? 0;
  const allPassed = !!result && !result.error && total > 0 && passed === total;

  const onChange = useCallback(
    (value: string) => {
      if (file.readOnly) return;
      setContents((current) => ({ ...current, [file.name]: value }));
      writeStored(storageKey(file.name), value);
    },
    [file]
  );

  const run = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;
    setIsRunning(true);
    try {
      const outcome = await runCode(code, testsFile?.content);
      setResult(outcome);
      setPanel(outcome.error || outcome.tests.length === 0 ? "console" : "tests");
    } finally {
      runningRef.current = false;
      setIsRunning(false);
    }
  }, [code, testsFile]);

  const reset = () => {
    for (const entry of CODE_LAB.files) if (!entry.readOnly) writeStored(storageKey(entry.name), null);
    writeStored(DONE_KEY, null);
    setContents(initial);
    setResult(null);
    setIsSolved(false);
    toast.info("Your code was reset to the starter files.");
  };

  const submit = () => {
    // The submission endpoint doesn't exist yet; this records completion in the browser only.
    writeStored(DONE_KEY, "1");
    setIsSolved(true);
    toast.success("Solution submitted. Nice work!");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      run();
    }
  };

  return (
    <LmsShell active="code" topTab="trimesters" search="Search curriculum...">
      <div className="mx-auto max-w-[1360px]" onKeyDown={onKeyDown}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-[#2a2c42]">
              <span className="rounded-[4px] bg-[#d6ebf8] px-2.5 py-1 text-[12px] font-bold tracking-[0.06em] text-[#1a1a7a]">{CODE_LAB.trimester}</span>
              <span>&bull; {CODE_LAB.module} &bull; {CODE_LAB.estimate}</span>
            </p>
            <h1 className="mt-3 text-[28px] font-bold leading-tight tracking-tight text-[#14162b] sm:text-[40px]">{CODE_LAB.title}</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={reset} className={outlineButton}>
              <MdOutlineRestartAlt size={18} aria-hidden /> Reset
            </button>
            <button
              type="button"
              onClick={run}
              disabled={isRunning}
              className="inline-flex items-center justify-center gap-2 rounded-[8px] bg-[#00658f] px-6 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#00577c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00658f] disabled:cursor-wait disabled:opacity-60"
            >
              <MdOutlinePlayArrow size={20} aria-hidden /> {isRunning ? "Running..." : "Run"}
              <kbd className="hidden rounded bg-white/20 px-1.5 py-0.5 text-[11px] font-normal sm:inline">Ctrl+Enter</kbd>
            </button>
          </div>
        </div>

        <div className="mt-7 grid items-start gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex flex-col gap-5">
            <section className={`${cardClass} p-6`} aria-labelledby="task-title">
              <h2 id="task-title" className="text-[18px] font-bold text-[#14162b]">Your task</h2>
              <ol className="mt-4 flex flex-col gap-3.5">
                {CODE_LAB.steps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-[14px] leading-relaxed text-[#2a2c42]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e3e6fb] text-[12px] font-bold text-[#1a1a7a]">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
              <button type="button" onClick={() => setShowHints((value) => !value)} aria-expanded={showHints} className="mt-5 inline-flex items-center gap-2 text-[14px] font-medium text-[#00658f] hover:underline">
                <MdOutlineLightbulb size={18} aria-hidden /> {showHints ? "Hide hints" : "Need a hint?"}
              </button>
              {showHints && (
                <ul className="mt-3 list-disc rounded-[8px] bg-[#eaf4fa] py-3 pl-8 pr-4 text-[13px] leading-relaxed text-[#1b3a4b]">
                  {CODE_LAB.hints.map((hint) => (
                    <li key={hint}>{hint}</li>
                  ))}
                </ul>
              )}
            </section>

            <section className={`${cardClass} p-6`} aria-labelledby="checks-title">
              <div className="flex items-center justify-between">
                <h2 id="checks-title" className="text-[18px] font-bold text-[#14162b]">Checks</h2>
                {result && total > 0 && <span className="text-[13px] font-medium text-[#4a4d66]">{passed}/{total} passing</span>}
              </div>
              {!result || total === 0 ? (
                <p className="mt-3 text-[14px] text-[#4a4d66]">Run your code to see which checks pass.</p>
              ) : (
                <ul className="mt-4 flex flex-col gap-2.5">
                  {result.tests.map((test) => (
                    <li key={test.name} className="flex items-start gap-2.5 text-[14px]">
                      {test.passed ? <MdOutlineCheckCircle size={20} className="mt-px shrink-0 text-[#1a8f5a]" aria-label="Passed" /> : <MdOutlineCancel size={20} className="mt-px shrink-0 text-[#c62828]" aria-label="Failed" />}
                      <span className="text-[#2a2c42]">{test.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={submit}
                disabled={!allPassed && !isSolved}
                className="mt-6 inline-flex w-full items-center justify-center rounded-[8px] bg-[#020060] px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-[#10107a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSolved ? "Submitted" : "Submit solution"}
              </button>
              {!allPassed && !isSolved && <p className="mt-2 text-center text-[12px] text-[#6a6d83]">Pass every check to submit.</p>}
              <Link href="/lms/curriculum" className="mt-4 block text-center text-[13px] font-medium text-[#1a1a7a] hover:underline">Back to the weekly path</Link>
            </section>
          </aside>

          <section aria-label="Code editor" className="min-w-0 overflow-hidden rounded-[12px] border border-[#2b2b3a] bg-[#1e1e1e] shadow-[0_24px_50px_-28px_rgba(0,0,0,0.8)]">
            <div role="tablist" aria-label="Files" className="flex items-center gap-0.5 overflow-x-auto bg-[#252526] pr-3">
              {CODE_LAB.files.map((entry) => {
                const isActive = entry.name === activeFile;
                return (
                  <button
                    key={entry.name}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFile(entry.name)}
                    className={`flex shrink-0 items-center gap-2 border-t-2 px-4 py-2.5 text-[13px] transition-colors ${
                      isActive ? "border-[#00a2e8] bg-[#1e1e1e] text-white" : "border-transparent text-[#9da0b5] hover:bg-[#2a2a2c]"
                    }`}
                  >
                    <LuFileCode2 size={15} aria-hidden /> {entry.name}
                    {entry.readOnly && <MdOutlineLock size={13} aria-label="Read only" className="text-[#9da0b5]" />}
                  </button>
                );
              })}
              <span className="ml-auto shrink-0 pl-4 text-[12px] uppercase tracking-wider text-[#6e7186]">{file.language}</span>
            </div>

            <CodeMirror
              key={file.name}
              value={contents[file.name]}
              height="440px"
              theme={vscodeDark}
              extensions={[languageExtension(file.language)]}
              readOnly={!!file.readOnly}
              editable={!file.readOnly}
              onChange={onChange}
              aria-label={`${file.name} editor`}
              basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: !file.readOnly, autocompletion: true, bracketMatching: true, closeBrackets: true, indentOnInput: true }}
              style={{ fontSize: 14 }}
            />

            <div className="border-t border-[#333] bg-[#1e1e1e]">
              <div role="tablist" aria-label="Output" className="flex items-center gap-1 bg-[#252526] px-2">
                {([["console", "Console"], ["tests", "Test results"]] as [TPanel, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    role="tab"
                    aria-selected={panel === key}
                    onClick={() => setPanel(key)}
                    className={`px-3 py-2 text-[12px] font-medium uppercase tracking-wider transition-colors ${panel === key ? "border-b border-[#00a2e8] text-white" : "text-[#9da0b5] hover:text-white"}`}
                  >
                    {label}
                  </button>
                ))}
                <span className="ml-auto flex items-center gap-2 pr-2 text-[12px] text-[#9da0b5]">
                  <MdOutlineTerminal size={15} aria-hidden />
                  {isRunning ? "Running..." : result ? `${result.ms} ms${total ? ` · ${passed}/${total} passed` : ""}` : "Not run yet"}
                </span>
              </div>
              <div role="log" aria-live="polite" className="h-[190px] overflow-auto p-4 font-mono text-[13px] leading-relaxed">
                {!result && <p className="text-[#6e7186]">Press Run to execute your code.</p>}
                {result && panel === "console" && (
                  <>
                    {result.logs.map((line, index) => (
                      <pre key={index} className={`whitespace-pre-wrap break-words ${LOG_COLOR[line.level]}`}>{line.text}</pre>
                    ))}
                    {result.error && <pre className="mt-1 whitespace-pre-wrap break-words text-[#f48771]">{result.error}</pre>}
                    {!result.logs.length && !result.error && <p className="text-[#6e7186]">Your code ran with no console output.</p>}
                  </>
                )}
                {result && panel === "tests" && (
                  <>
                    {result.error && <pre className="mb-2 whitespace-pre-wrap break-words text-[#f48771]">{result.error}</pre>}
                    {result.tests.map((test) => (
                      <div key={test.name} className="mb-2">
                        <p className={test.passed ? "text-[#89d185]" : "text-[#f48771]"}>{test.passed ? "✓" : "✗"} {test.name}</p>
                        {!test.passed && test.message && <pre className="ml-5 whitespace-pre-wrap break-words text-[#c8c8c8]">{test.message}</pre>}
                      </div>
                    ))}
                    {!result.tests.length && <p className="text-[#6e7186]">No tests ran.</p>}
                  </>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </LmsShell>
  );
};

export default CodingLabPage;
