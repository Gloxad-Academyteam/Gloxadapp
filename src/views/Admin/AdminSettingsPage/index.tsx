"use client";

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axiosInstance from "@utils/axiosInstance";
import { Skeleton } from "../../../components/Skeleton";
import { card, ErrorBox } from "../shared";

type TSettings = { allowSignups: boolean; allowPasswordReset: boolean; deletionGraceDays: number; signatureUrl: string };

const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-[#5d5fef]" : "bg-[#d3d6e6]"}`}
  >
    <span className={`absolute top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-all ${checked ? "left-[23px]" : "left-[3px]"}`} />
  </button>
);

const Row = ({ title, text, children }: { title: string; text: string; children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center justify-between gap-4 py-5">
    <div className="max-w-[520px]">
      <h3 className="text-[14.5px] font-semibold text-[#12142b]">{title}</h3>
      <p className="mt-0.5 text-[13px] leading-relaxed text-[#6b7087]">{text}</p>
    </div>
    {children}
  </div>
);

const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin.settings"],
    queryFn: async () => (await axiosInstance.get("/admin/settings")).data.settings as TSettings,
  });
  const [form, setForm] = useState<TSettings | null>(null);
  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (values: TSettings) => (await axiosInstance.put("/admin/settings", values)).data,
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["admin.settings"] });
    },
    onError: (error: any) => toast.error(error?.response?.data?.error || "We could not save your settings."),
  });

  const header = (
    <div className="mb-6">
      <h2 className="text-[24px] font-semibold tracking-tight text-[#12142b]">Settings</h2>
      <p className="text-[14px] text-[#6b7087]">Rules that apply to the whole platform.</p>
    </div>
  );

  if (isLoading || (!form && !isError)) {
    return <div className="mx-auto w-full max-w-[800px]">{header}<Skeleton className="h-[360px] rounded-2xl" /></div>;
  }
  if (isError || !form) {
    return <div className="mx-auto w-full max-w-[800px]">{header}<ErrorBox onRetry={() => refetch()} /></div>;
  }

  const dirty = JSON.stringify(form) !== JSON.stringify(data);
  const graceInvalid = !Number.isFinite(form.deletionGraceDays) || form.deletionGraceDays < 1;

  return (
    <div className="mx-auto w-full max-w-[800px] pb-10">
      {header}

      <section className={`${card} divide-y divide-[#eef0f6] px-6`}>
        <Row title="Allow new sign-ups" text="When this is off, nobody new can create an account on the site.">
          <div className="flex items-center gap-3">
            <span className={`text-[13px] font-semibold ${form.allowSignups ? "text-[#5d5fef]" : "text-[#8a90a8]"}`}>{form.allowSignups ? "On" : "Off"}</span>
            <Toggle checked={form.allowSignups} onChange={(value) => setForm({ ...form, allowSignups: value })} label="Allow new sign-ups" />
          </div>
        </Row>
        <Row title="Allow password resets" text="Lets people who forgot their password reset it by email.">
          <div className="flex items-center gap-3">
            <span className={`text-[13px] font-semibold ${form.allowPasswordReset ? "text-[#5d5fef]" : "text-[#8a90a8]"}`}>{form.allowPasswordReset ? "On" : "Off"}</span>
            <Toggle checked={form.allowPasswordReset} onChange={(value) => setForm({ ...form, allowPasswordReset: value })} label="Allow password resets" />
          </div>
        </Row>
        <Row title="Account deletion delay" text="Days an account stays recoverable after someone asks to delete it. After that it is removed for good.">
          <input
            type="number"
            min={1}
            value={Number.isFinite(form.deletionGraceDays) ? form.deletionGraceDays : ""}
            onChange={(event) => setForm({ ...form, deletionGraceDays: event.target.value === "" ? NaN : Number(event.target.value) })}
            aria-label="Days before deletion"
            className="h-10 w-24 rounded-lg border border-[#dfe2ee] bg-white text-center text-[14px] font-medium outline-none focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/15"
          />
        </Row>
        <div className="py-5">
          <h3 className="text-[14.5px] font-semibold text-[#12142b]">Certificate signature</h3>
          <p className="mt-0.5 text-[13px] leading-relaxed text-[#6b7087]">The signature printed on every certificate. Paste the link to a PNG with a transparent background.</p>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <input
              type="url"
              value={form.signatureUrl}
              onChange={(event) => setForm({ ...form, signatureUrl: event.target.value })}
              placeholder="https://..."
              aria-label="Signature image link"
              className="h-10 min-w-[240px] flex-1 rounded-lg border border-[#dfe2ee] bg-white px-3 text-[14px] outline-none focus:border-[#5d5fef] focus:ring-4 focus:ring-[#5d5fef]/15"
            />
            <div className="flex h-[60px] w-[120px] items-center justify-center overflow-hidden rounded-lg border border-dashed border-[#cfd3e6] bg-[#f6f7fb]">
              {form.signatureUrl ? <img src={form.signatureUrl} alt="Signature preview" className="max-h-full max-w-full object-contain" onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = "none"; }} /> : <span className="text-[11px] font-medium text-[#9aa0b8]">No signature</span>}
            </div>
          </div>
        </div>
      </section>

      <div className="mt-5 flex items-center justify-end gap-3">
        {dirty && <button type="button" onClick={() => data && setForm(data)} className="h-10 rounded-lg px-4 text-[14px] font-medium text-[#4a4f6b] hover:bg-[#eef0f6]">Discard</button>}
        <button
          type="button"
          disabled={!dirty || graceInvalid || save.isPending}
          onClick={() => save.mutate(form)}
          className="h-10 rounded-lg bg-[#12142b] px-5 text-[14px] font-semibold text-white transition hover:bg-[#1d2040] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {save.isPending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettingsPage;
