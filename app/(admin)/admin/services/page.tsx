"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ActionMenu } from "@/components/admin/action-menu";
import { AdminTable } from "@/components/admin/admin-table";
import { DrawerPanel } from "@/components/admin/drawer-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  createAdminService,
  deleteAdminService,
  fetchAdminServices,
  updateAdminService,
} from "@/lib/admin/api";
import { ADMIN_SERVICE_CATEGORY_OPTIONS } from "@/lib/admin/service-categories";
import type { AdminServiceRow } from "@/lib/admin/types";
import { ApiError } from "@/lib/api/errors";
import { formatNgn } from "@/lib/utils";

type ServiceFormState = {
  name: string;
  slug: string;
  imageUrl: string;
  category: string;
  basePrice: string;
  duration: string;
};

const emptyForm: ServiceFormState = {
  name: "",
  slug: "",
  imageUrl: "",
  category: "installation",
  basePrice: "",
  duration: "120",
};

function parseForm(
  form: ServiceFormState,
):
  | {
      ok: true;
      payload: {
        name: string;
        slug?: string;
        imageUrl?: string;
        category: string;
        basePrice: number;
        duration: number;
      };
    }
  | { ok: false; message: string } {
  const name = form.name.trim();
  if (name.length < 2) {
    return { ok: false, message: "Name must be at least 2 characters." };
  }
  const category = form.category.trim();
  if (category.length < 2) {
    return { ok: false, message: "Select a valid category." };
  }
  const basePrice = Number(form.basePrice);
  if (!Number.isFinite(basePrice) || basePrice < 0) {
    return { ok: false, message: "Base price must be a valid non-negative number." };
  }
  const duration = Number(form.duration);
  if (!Number.isFinite(duration) || duration < 15) {
    return { ok: false, message: "Duration must be at least 15 minutes." };
  }
  return {
    ok: true,
    payload: {
      name,
      slug: form.slug.trim() || undefined,
      imageUrl: form.imageUrl.trim() || undefined,
      category,
      basePrice,
      duration,
    },
  };
}

function formFromRow(row: AdminServiceRow): ServiceFormState {
  return {
    name: row.name,
    slug: row.slug ?? "",
    imageUrl: row.imageUrl ?? "",
    category: row.category,
    basePrice: String(row.basePrice),
    duration: String(row.duration),
  };
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<AdminServiceRow[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceFormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const load = useCallback(async () => {
    setListError(null);
    setListLoading(true);
    try {
      const rows = await fetchAdminServices();
      setServices(rows);
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : "Could not load services.");
    } finally {
      setListLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  const drawerTitle = useMemo(
    () => (drawerMode === "create" ? "New service" : "Edit service"),
    [drawerMode],
  );

  const openCreate = () => {
    setDrawerMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setFormError(null);
    setDrawerOpen(true);
  };

  const openEdit = (row: AdminServiceRow) => {
    setDrawerMode("edit");
    setEditingId(row.id);
    setForm(formFromRow(row));
    setFormError(null);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSubmitting(false);
    setFormError(null);
  };

  const submitForm = async () => {
    setFormError(null);
    const parsed = parseForm(form);
    if (!parsed.ok) {
      setFormError(parsed.message);
      return;
    }
    setSubmitting(true);
    try {
      if (drawerMode === "create") {
        await createAdminService(parsed.payload);
        setBanner("Service created.");
      } else if (editingId) {
        await updateAdminService(editingId, parsed.payload);
        setBanner("Service updated.");
      }
      closeDrawer();
      await load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Request failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (row: AdminServiceRow) => {
    const confirmed = window.confirm(`Delete service “${row.name}”? This cannot be undone.`);
    if (!confirmed) {
      return;
    }
    setBanner(null);
    try {
      await deleteAdminService(row.id);
      setBanner("Service deleted.");
      await load();
    } catch (err) {
      setListError(err instanceof ApiError ? err.message : "Could not delete service.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="Services" subtitle="Manage service catalogue" />

      {listError ? (
        <p className="rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error" role="alert">
          {listError}
        </p>
      ) : null}
      {banner ? (
        <p className="rounded-sm border border-border bg-hover px-3 py-2 text-small text-ink" role="status">
          {banner}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={openCreate} disabled={listLoading}>
          Add service
        </Button>
        <Button type="button" variant="secondary" onClick={() => void load()} disabled={listLoading}>
          {listLoading ? "Refreshing…" : "Refresh"}
        </Button>
      </div>

      <AdminTable headers={["Service", "Category", "Base Price", "Duration", "Actions"]}>
        {listLoading ? (
          <tr>
            <td colSpan={5} className="py-6 text-small text-muted">
              Loading services…
            </td>
          </tr>
        ) : (
          services.map((service) => (
            <tr key={service.id} className="border-b border-border">
              <td className="py-3 pr-4 text-small text-ink">{service.name}</td>
              <td className="py-3 pr-4 text-small text-muted">{service.category}</td>
              <td className="py-3 pr-4 text-small text-ink">{formatNgn(service.basePrice)}</td>
              <td className="py-3 pr-4 text-small text-muted">{service.duration} min</td>
              <td className="py-3 text-small">
                <ActionMenu
                  actions={[
                    {
                      label: "Edit",
                      onClick: () => openEdit(service),
                    },
                    {
                      label: "Delete",
                      onClick: () => void handleDelete(service),
                    },
                  ]}
                />
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      <DrawerPanel open={drawerOpen} title={drawerTitle} onClose={closeDrawer}>
        <div className="flex flex-col gap-4">
          {formError ? (
            <p className="text-small text-error" role="alert">
              {formError}
            </p>
          ) : null}
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="svc-name">
              Name
            </label>
            <Input
              id="svc-name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              disabled={submitting}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="svc-slug">
              Slug
            </label>
            <Input
              id="svc-slug"
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              disabled={submitting}
              placeholder="smart-home-automation"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="svc-image">
              Image path
            </label>
            <Input
              id="svc-image"
              value={form.imageUrl}
              onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
              disabled={submitting}
              placeholder="/services/smart-home-automation.svg"
              autoComplete="off"
            />
            <p className="text-[12px] text-muted">Public folder path, e.g. /services/your-image.jpg</p>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="svc-category">
              Category
            </label>
            <select
              id="svc-category"
              className="h-10 rounded-sm border border-border bg-surface px-3 text-small text-ink"
              value={form.category}
              onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
              disabled={submitting}
            >
              {ADMIN_SERVICE_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="svc-price">
              Base price (₦)
            </label>
            <Input
              id="svc-price"
              inputMode="decimal"
              value={form.basePrice}
              onChange={(event) => setForm((prev) => ({ ...prev, basePrice: event.target.value }))}
              disabled={submitting}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="svc-duration">
              Duration (minutes)
            </label>
            <Input
              id="svc-duration"
              inputMode="numeric"
              value={form.duration}
              onChange={(event) => setForm((prev) => ({ ...prev, duration: event.target.value }))}
              disabled={submitting}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button type="button" onClick={() => void submitForm()} disabled={submitting}>
              {submitting ? "Saving…" : drawerMode === "create" ? "Create service" : "Save changes"}
            </Button>
            <Button type="button" variant="secondary" onClick={closeDrawer} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </div>
      </DrawerPanel>
    </div>
  );
}
