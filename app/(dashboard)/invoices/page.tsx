"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api/errors";
import { routes } from "@/lib/constants/routes";
import {
  fetchDashboardInvoice,
  fetchDashboardInvoices,
} from "@/lib/dashboard/api";
import type { DashboardInvoice } from "@/lib/dashboard/types";
import { formatNgn } from "@/lib/utils";

function InvoicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invoices, setInvoices] = useState<DashboardInvoice[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [detail, setDetail] = useState<DashboardInvoice | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const queryId = searchParams.get("invoiceId");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await fetchDashboardInvoices();
        if (active) {
          setInvoices(data);
        }
      } finally {
        if (active) {
          setListLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const selectedId = useMemo(() => {
    if (queryId && invoices.some((inv) => inv.id === queryId)) {
      return queryId;
    }
    return invoices[0]?.id ?? null;
  }, [invoices, queryId]);

  useEffect(() => {
    if (listLoading || invoices.length === 0 || !selectedId) {
      return;
    }
    if (queryId !== selectedId) {
      router.replace(`${routes.dashboardInvoices}?invoiceId=${selectedId}`, {
        scroll: false,
      });
    }
  }, [invoices.length, listLoading, queryId, router, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      queueMicrotask(() => {
        setDetail(null);
      });
      return;
    }
    let active = true;
    (async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const row = await fetchDashboardInvoice(selectedId);
        if (active) {
          setDetail(row);
        }
      } catch (err) {
        if (active) {
          setDetail(null);
          setDetailError(
            err instanceof ApiError ? err.message : "Could not load invoice.",
          );
        }
      } finally {
        if (active) {
          setDetailLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [selectedId]);

  const selectInvoice = (id: string) => {
    router.push(`${routes.dashboardInvoices}?invoiceId=${id}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader
        title="Invoices"
        subtitle="Issued billing records linked to your bookings."
      />
      {listLoading ? (
        <p className="text-small font-medium text-muted">Loading invoices</p>
      ) : invoices.length === 0 ? (
        <EmptyState
          icon={
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M7 3h8l4 4v14H7z" />
              <path d="M15 3v4h4M10 12h6M10 16h6" />
            </svg>
          }
          title="No invoices yet"
          description="Invoices are created when you complete a booking."
          ctaLabel="Book a service"
          ctaHref={routes.book}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-t border-border">
            <thead>
              <tr className="border-b border-border text-left text-small font-semibold text-muted">
                <th className="py-3 pr-4">Invoice</th>
                <th className="py-3 pr-4">Issued</th>
                <th className="py-3 pr-4">Amount</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => {
                const activeRow = invoice.id === selectedId;
                return (
                  <tr
                    key={invoice.id}
                    className={`cursor-pointer border-b border-border transition-colors ${
                      activeRow ? "bg-accent-muted/40" : "hover:bg-hover"
                    }`}
                    onClick={() => selectInvoice(invoice.id)}
                  >
                    <td className="py-3 pr-4 text-small font-semibold text-ink">
                      {invoice.id.slice(0, 8)}…
                    </td>
                    <td className="py-3 pr-4 text-small font-medium text-muted">
                      {invoice.issuedAt.slice(0, 10)}
                    </td>
                    <td className="py-3 pr-4 text-small font-semibold text-ink">
                      {formatNgn(invoice.amount)}
                    </td>
                    <td className="py-3 pr-4 text-small font-medium text-muted">{invoice.status}</td>
                    <td className="py-3 text-small">
                      <Link
                        href={`${routes.dashboardInvoices}?invoiceId=${invoice.id}`}
                        className="font-semibold underline"
                        onClick={(event) => event.stopPropagation()}
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {detailLoading ? (
        <p className="text-small font-medium text-muted">Loading invoice detail</p>
      ) : null}

      {detailError ? (
        <p className="text-small font-semibold text-error" role="alert">
          {detailError}
        </p>
      ) : null}

      {detail && !detailLoading ? (
        <article
          className="border border-border bg-surface p-6 sm:p-8"
          aria-label="Invoice detail"
        >
          <header className="border-b border-border pb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
              Invoice
            </p>
            <h2 className="mt-2 text-title font-semibold tracking-tight text-ink">
              {detail.booking.serviceName ?? "Service invoice"}
            </h2>
            <p className="mt-2 text-small font-medium text-muted">
              Invoice ID <span className="font-mono text-ink">{detail.id}</span>
            </p>
            <p className="mt-1 text-small font-medium text-muted">
              Booking ID <span className="font-mono text-ink">{detail.bookingId}</span>
            </p>
            <p className="mt-1 text-small font-medium text-muted">
              Issued {detail.issuedAt.slice(0, 10)} · Status{" "}
              <span className="font-semibold text-ink">{detail.status}</span>
            </p>
          </header>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="space-y-2 text-small font-medium text-muted">
              <p>
                <span className="text-ink">Service date:</span> {detail.booking.date} ·{" "}
                {detail.booking.time}
              </p>
              <p>
                <span className="text-ink">Amount due:</span>{" "}
                <span className="font-semibold text-ink">{formatNgn(detail.amount)}</span>
              </p>
            </div>
            <div className="space-y-2 text-small font-medium text-muted">
              <p>
                <span className="text-ink">Base:</span> {formatNgn(detail.booking.pricing.base)}
              </p>
              <p>
                <span className="text-ink">Urgency:</span>{" "}
                {formatNgn(detail.booking.pricing.urgency)}
              </p>
              <p>
                <span className="text-ink">Distance:</span>{" "}
                {formatNgn(detail.booking.pricing.distance)}
              </p>
              <p>
                <span className="text-ink">Add-ons:</span>{" "}
                {formatNgn(detail.booking.pricing.addons)}
              </p>
              <p className="pt-2 font-semibold text-ink">
                Total: {formatNgn(detail.booking.pricing.total)}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="mt-8 inline-flex items-center justify-center rounded-sm bg-gradient-to-r from-ink via-zinc-800 to-zinc-950 px-4 py-2 text-small font-semibold text-white shadow-md transition hover:brightness-110 print:hidden"
            onClick={() => window.print()}
          >
            Print or save as PDF
          </button>
        </article>
      ) : null}
    </div>
  );
}

export default function DashboardInvoicesPage() {
  return (
    <Suspense fallback={<p className="text-small font-medium text-muted">Loading invoices</p>}>
      <InvoicesContent />
    </Suspense>
  );
}
