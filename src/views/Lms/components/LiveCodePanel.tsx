"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Extension } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { json } from "@codemirror/lang-json";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { MdOutlineCallSplit, MdOutlineContentCopy, MdOutlinePlayArrow, MdOutlineSync, MdOutlineTerminal } from "react-icons/md";
import { toast } from "react-toastify";
import { lmsApi } from "@services/lms";
import { runCode, TRunResult } from "./runCode";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="flex h-[320px] items-center justify-center bg-[#1e1e1e] text-[13px] text-[#9da0b5]">Loading editor...</div>,
});

type TLanguage = "javascript" | "python" | "json" | "html" | "css";
const LANGUAGES: { key: TLanguage; label: string }[] = [
  { key: "javascript", label: "JavaScript" },
  { key: "html", label: "HTML" },
  { key: "css", label: "CSS" },
  { key: "json", label: "JSON" },
  { key: "python", label: "Python" },
];

const extensionFor = (language: TLanguage): Extension => {
  switch (language) {
    case "python": return python();
    case "html": return html();
    case "css": return css();
    case "json": return json();
    default: return javascript();
  }
};

type TProps = {
  sessionId: string;
  isTeacher: boolean;
  instructor?: string;
  // What the server currently holds (refreshed by the class page while this tab is open)
  remote?: { content: string; language: string; updatedAt: string | null } | null;
  // Whether the class is still running: the editor stays editable for the instructor only while it is
  canEdit: boolean;
};

// Output of the last run: JS runs in a sandboxed worker, HTML renders in a sandboxed frame, JSON is validated
type TOutput = { kind: "js"; result: TRunResult } | { kind: "html"; doc: string } | { kind: "text"; text: string; error?: boolean };

const LiveCodePanel = ({ sessionId, isTeacher, instructor, remote, canEdit }: TProps) => {
  const [language, setLanguage] = useState<TLanguage>("javascript");
  const [content, setContent] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [forked, setForked] = useState(false);
  const [output, setOutput] = useState<TOutput | null>(null);
  const [running, setRunning] = useState(false);
  const seeded = useRef(false);
  const saveTimer = useRef<number | undefined>(undefined);

  // Instructors take the server copy once, then their own edits win. Students follow the server until they fork.
  useEffect(() => {
    if (!remote) return;
    if (isTeacher && seeded.current) return;
    if (!isTeacher && forked) return;
    seeded.current = true;
    setContent(remote.content ?? "");
    if (LANGUAGES.some((entry) => entry.key === remote.language)) setLanguage(remote.language as TLanguage);
  }, [remote, isTeacher, forked]);

  useEffect(() => () => window.clearTimeout(saveTimer.current), []);

  const save = useCallback(
    (nextContent: string, nextLanguage: TLanguage) => {
      window.clearTimeout(saveTimer.current);
      setSaveState("saving");
      saveTimer.current = window.setTimeout(async () => {
        try {
          await lmsApi.updateSharedCode(sessionId, nextContent, nextLanguage);
          setSaveState("saved");
        } catch {
          setSaveState("error");
        }
      }, 700);
    },
    [sessionId]
  );

  const editable = isTeacher ? canEdit : forked;

  const onChange = (value: string) => {
    if (!editable) return;
    setContent(value);
    if (isTeacher) save(value, language);
  };

  const onLanguage = (next: TLanguage) => {
    setLanguage(next);
    if (isTeacher && canEdit) save(content, next);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    try {
      if (language === "javascript") {
        setOutput({ kind: "js", result: await runCode(content) });
      } else if (language === "html") {
        setOutput({ kind: "html", doc: content });
      } else if (language === "css") {
        setOutput({ kind: "html", doc: `<style>${content}</style><h1>Heading</h1><p>A paragraph with a <a href="#">link</a>.</p><button>Button</button>` });
      } else if (language === "json") {
        try {
          setOutput({ kind: "text", text: JSON.stringify(JSON.parse(content), null, 2) });
        } catch (error) {
          setOutput({ kind: "text", text: `Invalid JSON: ${(error as Error).message}`, error: true });
        }
      } else {
        setOutput({ kind: "text", text: "Python can't run in the browser yet. Copy the code and run it on your computer, or use JavaScript in the Coding Lab.", error: true });
      }
    } finally {
      setRunning(false);
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Code copied to your clipboard.");
    } catch {
      toast.error("Could not copy. Select the code and copy it manually.");
    }
  };

  const fork = () => {
    setForked(true);
    toast.info("You're editing your own copy now. It won't change what the class sees.");
  };

  const rejoin = () => {
    setForked(false);
    if (remote) setContent(remote.content ?? "");
  };

  const hasCode = Boolean(content.trim()) || isTeacher;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-[13px] text-[#4a4d66]">
          <span aria-hidden className={`h-2 w-2 rounded-full ${isTeacher || !forked ? "bg-[#e5322d]" : "bg-[#b6b7c8]"}`} />
          {isTeacher ? "You're sharing code with the class" : forked ? "Your own copy" : hasCode ? `${instructor ?? "Your instructor"} is sharing code` : "No code has been shared yet"}
        </p>
        <label className="flex items-center gap-2 text-[12px] text-[#4a4d66]">
          Language
          <select value={language} onChange={(event) => onLanguage(event.target.value as TLanguage)} disabled={!isTeacher && !forked} className="rounded-[6px] border border-[#d6d4e6] bg-white px-2 py-1 text-[12px] disabled:opacity-70">
            {LANGUAGES.map((entry) => <option key={entry.key} value={entry.key}>{entry.label}</option>)}
          </select>
        </label>
      </div>

      <div className="overflow-hidden rounded-[8px] border border-[#2b2b3a]">
        <CodeMirror
          value={content}
          height="320px"
          theme={vscodeDark}
          extensions={[extensionFor(language)]}
          readOnly={!editable}
          editable={editable}
          onChange={onChange}
          aria-label={editable ? "Code editor" : "Code shared by the instructor"}
          basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: editable, autocompletion: editable, bracketMatching: true, closeBrackets: editable, indentOnInput: true }}
          style={{ fontSize: 13 }}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={run} disabled={running || !content.trim()} className="inline-flex items-center gap-1.5 rounded-[6px] bg-[#00658f] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#00577c] disabled:opacity-50">
          <MdOutlinePlayArrow size={18} aria-hidden /> {running ? "Running..." : "Run"}
        </button>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#c9c8dc] bg-white px-3 py-2 text-[13px] font-medium text-[#1b1d33] hover:bg-[#f3f2fb]">
          <MdOutlineContentCopy size={16} aria-hidden /> Copy
        </button>
        {!isTeacher && !forked && (
          <button type="button" onClick={fork} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#c9c8dc] bg-white px-3 py-2 text-[13px] font-medium text-[#1b1d33] hover:bg-[#f3f2fb]">
            <MdOutlineCallSplit size={16} aria-hidden /> Edit my copy
          </button>
        )}
        {!isTeacher && forked && (
          <button type="button" onClick={rejoin} className="inline-flex items-center gap-1.5 rounded-[6px] border border-[#c9c8dc] bg-white px-3 py-2 text-[13px] font-medium text-[#1b1d33] hover:bg-[#f3f2fb]">
            <MdOutlineSync size={16} aria-hidden /> Back to live code
          </button>
        )}
        {isTeacher && (
          <span role="status" className="ml-auto text-[12px] text-[#6a6d83]">
            {saveState === "saving" ? "Saving..." : saveState === "saved" ? "Shared with the class" : saveState === "error" ? "Couldn't save. Keep typing to retry." : canEdit ? "Edits are shared as you type" : "The class has ended"}
          </span>
        )}
      </div>

      <section aria-label="Output" className="overflow-hidden rounded-[8px] border border-[#2b2b3a] bg-[#1e1e1e]">
        <header className="flex items-center gap-2 bg-[#252526] px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-[#9da0b5]">
          <MdOutlineTerminal size={15} aria-hidden /> Output
          {output?.kind === "js" && <span className="ml-auto normal-case tracking-normal">{output.result.ms} ms</span>}
        </header>
        <div role="log" aria-live="polite" className="max-h-[260px] min-h-[110px] overflow-auto p-3 font-mono text-[12.5px] leading-relaxed">
          {!output && <p className="text-[#6e7186]">Press Run to see the result here.</p>}
          {output?.kind === "js" && (
            <>
              {output.result.logs.map((line, index) => (
                <pre key={index} className={`whitespace-pre-wrap break-words ${line.level === "error" ? "text-[#f48771]" : line.level === "warn" ? "text-[#dcdcaa]" : line.level === "info" ? "text-[#9cdcfe]" : "text-[#d4d4d4]"}`}>{line.text}</pre>
              ))}
              {output.result.error && <pre className="whitespace-pre-wrap break-words text-[#f48771]">{output.result.error}</pre>}
              {output.result.timedOut && <pre className="text-[#f48771]">Stopped: the code ran for too long.</pre>}
              {!output.result.logs.length && !output.result.error && <p className="text-[#6e7186]">Ran with no console output. Use console.log(...) to print.</p>}
            </>
          )}
          {output?.kind === "text" && <pre className={`whitespace-pre-wrap break-words ${output.error ? "text-[#f48771]" : "text-[#d4d4d4]"}`}>{output.text}</pre>}
          {output?.kind === "html" && (
            <iframe title="Result preview" sandbox="allow-scripts" srcDoc={output.doc} className="h-[220px] w-full rounded bg-white" />
          )}
        </div>
      </section>
    </div>
  );
};

export default LiveCodePanel;
