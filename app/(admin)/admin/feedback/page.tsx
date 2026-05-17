"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { DrawerPanel } from "@/components/admin/drawer-panel";
import { SectionHeader } from "@/components/dashboard/section-header";
import { fetchAdminFeedback, updateAdminFeedbackStatus } from "@/lib/admin/api";
import type { AdminFeedback, AdminFeedbackStatus } from "@/lib/admin/types";

const statusFilters: Array<{ label: string; value: AdminFeedbackStatus | "all" }> = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function displayName(row: AdminFeedback): string {
  return row.user?.name ?? row.name ?? "Anonymous";
}

function displayEmail(row: AdminFeedback): string | null {
  return row.user?.email ?? row.email;
}

export default function AdminFeedbackPage() {
  const [filter, setFilter] = useState<AdminFeedbackStatus | "all">("all");
  const [rows, setRows] = useState<AdminFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<AdminFeedback | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminFeedback(filter === "all" ? undefined : filter);
      setRows(data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const newCount = useMemo(() => rows.filter((row) => row.status === "new").length, [rows]);

  const setStatus = async (id: string, status: AdminFeedbackStatus) => {
    setUpdatingId(id);
    try {
      const updated = await updateAdminFeedbackStatus(id, status);
      setRows((current) => current.map((row) => (row.id === id ? updated : row)));
      setDetail((current) => (current?.id === id ? updated : current));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Feedback"
        subtitle={`Customer submissions from the site and dashboard. ${newCount} new in this view.`}
      />

      <div className="flex flex-wrap gap-2">
        {statusFilters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            className={
              filter === item.value
                ? "rounded-sm border border-ink bg-ink px-3 py-1.5 text-small font-medium text-white"
                : "rounded-sm border border-border px-3 py-1.5 text-small font-medium text-muted hover:bg-hover hover:text-ink"
            }
          >
            {item.label}
          </button>
        ))}
      </div>

      <AdminTable headers={["From", "Message", "Status", "Submitted", "Actions"]}>
        {loading ? (
          <tr>
            <td colSpan={5} className="py-6 text-small text-muted">
              Loading feedback…
            </td>
          </tr>
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={5} className="py-6 text-small text-muted">
              No feedback for this filter.
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <tr key={row.id} className="border-b border-border align-top">
              <td className="py-3 pr-4 text-small text-ink">
                <p className="font-medium">{displayName(row)}</p>
                {displayEmail(row) ? (
                  <a href={`mailto:${displayEmail(row)}`} className="text-accent hover:underline">
                    {displayEmail(row)}
                  </a>
                ) : (
                  <span className="text-muted">No email</span>
                )}
              </td>
              <td className="max-w-md py-3 pr-4 text-small text-muted">
                <p className="line-clamp-2">{row.message}</p>
              </td>
              <td className="py-3 pr-4">
                <AdminStatusBadge status={row.status} />
              </td>
              <td className="py-3 pr-4 text-small text-muted">{formatDate(row.createdAt)}</td>
              <td className="py-3 text-small">
                <button
                  type="button"
                  className="text-accent hover:underline"
                  onClick={() => setDetail(row)}
                >
                  View
                </button>
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      <DrawerPanel open={Boolean(detail)} title="Feedback detail" onClose={() => setDetail(null)}>
        {detail ? (
          <div className="flex flex-col gap-4 text-small">
            <div>
              <p className="text-muted">From</p>
              <p className="mt-1 font-medium text-ink">{displayName(detail)}</p>
              {displayEmail(detail) ? (
                <a href={`mailto:${displayEmail(detail)}`} className="text-accent hover:underline">
                  {displayEmail(detail)}
                </a>
              ) : null}
              {detail.user?.phone ? (
                <p className="mt-1 text-muted">Account phone: {detail.user.phone}</p>
              ) : null}
            </div>
            <div>
              <p className="text-muted">Message</p>
              <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink">{detail.message}</p>
            </div>
            <div>
              <p className="text-muted">Submitted</p>
              <p className="mt-1 text-ink">{formatDate(detail.createdAt)}</p>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {(["new", "read", "archived"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={detail.status === status || updatingId === detail.id}
                  onClick={() => void setStatus(detail.id, status)}
                  className="rounded-sm border border-border px-3 py-1.5 font-medium capitalize text-ink hover:bg-hover disabled:opacity-50"
                >
                  Mark {status}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </DrawerPanel>
    </div>
  );
}
