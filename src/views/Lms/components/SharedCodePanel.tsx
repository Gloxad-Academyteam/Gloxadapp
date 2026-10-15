"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { MdOutlineContentCopy, MdOutlineOpenInNew } from "react-icons/md";
import { toast } from "react-toastify";
import { LIVE_SHARED_CODE } from "../data";

const CodeMirror = dynamic(() => import("@uiw/react-codemirror"), {
  ssr: false,
  loading: () => <div className="flex h-[300px] items-center justify-center rounded-[8px] bg-[#1e1e1e] text-[13px] text-[#9da0b5]">Loading code...</div>,
});

// Read-only view of the code the instructor is sharing in the live class
type TProps = { code?: string; instructor?: string };

const SharedCodePanel = ({ code, instructor }: TProps = {}) => {
  const live = typeof code === "string";
  const value = live ? code : LIVE_SHARED_CODE;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Code copied to your clipboard.");
    } catch {
      toast.error("Could not copy. Select the code and copy it manually.");
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-center gap-2 text-[13px] text-[#4a4d66]">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[#e5322d]" /> {live ? (code ? `${instructor ?? "Your instructor"} is sharing code` : "No code has been shared yet") : "Dr. Emily Chen is sharing code"}
      </p>
      <div className="overflow-hidden rounded-[8px] border border-[#2b2b3a]">
        <CodeMirror
          value={value}
          height="300px"
          theme={vscodeDark}
          extensions={[javascript()]}
          readOnly
          editable={false}
          aria-label="Code shared by the instructor"
          basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false }}
          style={{ fontSize: 12.5 }}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={copy} className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#c9c8dc] bg-white px-3 py-2.5 text-[13px] font-medium text-[#1b1d33] hover:bg-[#f3f2fb]">
          <MdOutlineContentCopy size={16} aria-hidden /> Copy code
        </button>
        <Link href="/lms/code" className="inline-flex items-center justify-center gap-2 rounded-[6px] bg-[#020060] px-3 py-2.5 text-[13px] font-medium text-white hover:bg-[#10107a]">
          <MdOutlineOpenInNew size={16} aria-hidden /> Coding Lab
        </Link>
      </div>
      <p className="text-[11px] text-[#6a6d83]">{live ? "The code refreshes here every few seconds while the instructor shares it." : "The code updates here as the instructor types once live sessions are connected."}</p>
    </div>
  );
};

export default SharedCodePanel;
