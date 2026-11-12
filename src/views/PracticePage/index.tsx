"use client";

import { dialog } from "@components/Dialog";
import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LuCloudOff, LuCode, LuGlobe, LuPlus, LuTerminal } from "react-icons/lu";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import useDemoMode from "../Lms/useDemoMode";
import { practiceApi, TPracticeLanguage, TWorkspace } from "@services/practice";
import Editor from "./Editor";
import { LANGUAGES, languageLabel, STARTERS } from "./starters";

const LANGUAGE_ICON: Record<TPracticeLanguage, typeof LuCode> = { javascript: LuCode, python: LuTerminal, web: LuGlobe };

// Without a working practice API (demo accounts, or a server that has not been updated yet) the three starter spaces are kept in this browser
const localWorkspace = (language: TPracticeLanguage): TWorkspace => ({
  id: `local-${language}`,
  title: `${languageLabel(language)} scratchpad`,
  language,
  version: 0,
  updatedAt: "",
  files: STARTERS[language],
});

const LanguageChoices = ({ onPick, disabled }: { onPick: (language: TPracticeLanguage) => void; disabled?: boolean }) => (
  <div className="grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]">
    {LANGUAGES.map(({ id, label, blurb }) => {
      const Icon = LANGUAGE_ICON[id];
      return (
        <button
          key={id}
          type="button"
          disabled={disabled}
          onClick={() => onPick(id)}
          className="flex flex-col items-start gap-2 rounded-2xl border border-[#e3e8f4] bg-white p-5 text-left transition hover:border-[#b9c6ea] hover:shadow-[0_8px_24px_-12px_rgba(11,31,77,0.25)] disabled:opacity-60"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#eef1f8] text-[20px] text-[#0B1F4D]"><Icon aria-hidden /></span>
          <span className="text-[15px] font-bold text-[#14162b]">{label}</span>
          <span className="text-[13px] leading-[1.5] text-[#52607A]">{blurb}</span>
        </button>
      );
    })}
  </div>
);

const PracticePage = () => {
  const demo = useDemoMode();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);

  const list = useQuery({ queryKey: ["practice", "list"], queryFn: practiceApi.list, enabled: demo === false, retry: false, refetchOnWindowFocus: false });
  const cloud = demo === false && !list.isError;
  const workspaces = cloud ? list.data ?? [] : LANGUAGES.map(({ id }) => localWorkspace(id));

  // Open the most recent one when the page opens
  useEffect(() => {
    if (selectedId && workspaces.some((entry) => entry.id === selectedId)) return;
    setSelectedId(workspaces[0]?.id ?? null);
  }, [workspaces, selectedId]);

  const workspace = useQuery({
    queryKey: ["practice", "workspace", selectedId],
    queryFn: () => practiceApi.get(selectedId as string),
    enabled: cloud && Boolean(selectedId),
    // Always fetch the latest copy when a workspace is opened; the editor is not reset by later refetches
    gcTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const create = useMutation({
    mutationFn: (language: TPracticeLanguage) => practiceApi.create(language, `${languageLabel(language)} practice`),
    onSuccess: async (created) => {
      await queryClient.invalidateQueries({ queryKey: ["practice", "list"] });
      setSelectedId(created.id);
      setNewOpen(false);
    },
    onError: (error) => toast.error((error as AxiosError<{ error?: string }>).response?.data?.error ?? "We couldn't start a new practice. Please try again."),
  });

  const remove = useMutation({
    mutationFn: (id: string) => practiceApi.remove(id),
    onSuccess: async () => {
      setSelectedId(null);
      await queryClient.invalidateQueries({ queryKey: ["practice", "list"] });
      toast.success("Practice deleted.");
    },
    onError: () => toast.error("We couldn't delete that. Please try again."),
  });

  const refreshList = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["practice", "list"] });
  }, [queryClient]);

  if (demo === null || (demo === false && list.isLoading)) {
    return (
      <div className="mx-auto w-full max-w-[1360px] px-4 py-5 sm:px-6 md:px-8 md:py-8" role="status" aria-label="Loading">
        <div className="skeleton h-9 w-48 rounded-full" />
        <div className="skeleton mt-6 h-[520px] w-full rounded-2xl" />
      </div>
    );
  }

  const current: TWorkspace | undefined = cloud ? workspace.data : workspaces.find((entry) => entry.id === selectedId) && localWorkspace((selectedId as string).replace("local-", "") as TPracticeLanguage);
  const showEmpty = cloud && workspaces.length === 0;

  return (
    <div className="mx-auto w-full max-w-[1360px] px-4 py-5 sm:px-6 md:px-8 md:py-8">
      <header>
        <h1 className="text-[26px] font-bold leading-tight text-[#14162b] sm:text-[32px]">Practice</h1>
        <p className="mt-1.5 max-w-[680px] text-[14px] leading-[1.6] text-[#52607A]">
          Write and run code right here. Your work saves as you type, so you can pick it up on any device.
        </p>
      </header>

      {!cloud && (
        <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#f1e0b8] bg-[#fff8e6] px-4 py-3 text-[13.5px] leading-[1.55] text-[#7a5b12]">
          <LuCloudOff aria-hidden className="mt-0.5 shrink-0 text-[18px]" />
          <p>
            {demo ? "You are using a demo account, so" : "Saving to your account isn't available right now, so"} your code is kept in this browser only. It still runs here as normal.
          </p>
        </div>
      )}

      {showEmpty ? (
        <section className="mt-8" aria-label="Start practising">
          <h2 className="text-[17px] font-bold text-[#14162b]">What do you want to practise?</h2>
          <p className="mb-4 mt-1 text-[13.5px] text-[#52607A]">Pick a language to open an editor. You can start more later.</p>
          <LanguageChoices onPick={(language) => create.mutate(language)} disabled={create.isPending} />
        </section>
      ) : (
        <>
          <div className="mt-6 flex items-center gap-2">
            <div role="tablist" aria-label="Your practice spaces" className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {workspaces.map((entry) => {
                const Icon = LANGUAGE_ICON[entry.language];
                const selected = entry.id === selectedId;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setSelectedId(entry.id)}
                    className={`inline-flex h-10 max-w-[220px] shrink-0 items-center gap-2 rounded-full border px-4 text-[13px] font-semibold transition ${
                      selected ? "border-[#0B1F4D] bg-[#0B1F4D] text-white" : "border-[#d6dbea] bg-white text-[#37394b] hover:bg-[#f4f6fb]"
                    }`}
                  >
                    <Icon aria-hidden className="shrink-0" /> <span className="truncate">{entry.title}</span>
                  </button>
                );
              })}
            </div>
            {cloud && (
              <button
                type="button"
                onClick={() => setNewOpen((value) => !value)}
                aria-expanded={newOpen}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-dashed border-[#9fb0dc] bg-white px-4 text-[13px] font-semibold text-[#0B1F4D] transition hover:bg-[#f4f6fb]"
              >
                <LuPlus aria-hidden /> New
              </button>
            )}
          </div>

          {newOpen && cloud && (
            <div className="mt-4">
              <LanguageChoices onPick={(language) => create.mutate(language)} disabled={create.isPending} />
            </div>
          )}

          <div className="mt-5">
            {workspace.isError && cloud ? (
              <div role="alert" className="rounded-xl border border-[#f5c2c0] bg-[#fdecec] px-4 py-3 text-[13.5px] text-[#7a1d14]">
                We couldn&apos;t open that practice. <button type="button" onClick={() => workspace.refetch()} className="font-semibold underline">Try again</button>
              </div>
            ) : current ? (
              <Editor
                key={current.id}
                workspace={current}
                cloud={cloud}
                onSaved={refreshList}
                onDelete={cloud ? async () => { if (await dialog.confirm({ title: "Delete this practice?", message: "You will not be able to get it back.", tone: "danger" })) remove.mutate(current.id); } : undefined}
              />
            ) : (
              <div className="skeleton h-[520px] w-full rounded-2xl" role="status" aria-label="Loading your practice" />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PracticePage;
