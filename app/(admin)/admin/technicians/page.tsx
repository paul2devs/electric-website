"use client";

import { useEffect, useState } from "react";

import { ActionMenu } from "@/components/admin/action-menu";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { AdminTable } from "@/components/admin/admin-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/dashboard/section-header";
import {
  createAdminTechnician,
  fetchAdminTechnicians,
  updateAdminTechnician,
} from "@/lib/admin/api";
import type { AdminTechnician } from "@/lib/admin/types";

const defaultForm: {
  name: string;
  phone: string;
  skills: string;
  status: "available" | "busy" | "offline";
} = {
  name: "",
  phone: "",
  skills: "",
  status: "available",
};

export default function AdminTechniciansPage() {
  const [technicians, setTechnicians] = useState<AdminTechnician[]>([]);
  const [form, setForm] = useState(defaultForm);

  const load = async () => {
    setTechnicians(await fetchAdminTechnicians());
  };

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <SectionHeader title="Technicians" subtitle="Manage technician roster and workload" />

      <div className="grid gap-3 sm:grid-cols-4">
        <Input
          placeholder="Name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
        />
        <Input
          placeholder="Phone"
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
        />
        <Input
          placeholder="Skills comma separated"
          value={form.skills}
          onChange={(event) => setForm((prev) => ({ ...prev, skills: event.target.value }))}
        />
        <select
          className="rounded-sm border border-border bg-surface px-3 py-2 text-small"
          value={form.status}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              status: event.target.value as "available" | "busy" | "offline",
            }))
          }
        >
          <option value="available">available</option>
          <option value="busy">busy</option>
          <option value="offline">offline</option>
        </select>
      </div>

      <Button
        onClick={async () => {
          await createAdminTechnician({
            name: form.name,
            phone: form.phone,
            skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
            status: form.status,
          });
          setForm(defaultForm);
          await load();
        }}
      >
        Add technician
      </Button>

      <AdminTable headers={["Name", "Skills", "Status", "Active Jobs", "Actions"]}>
        {technicians.map((tech) => (
          <tr key={tech.id} className="border-b border-border">
            <td className="py-3 pr-4 text-small text-ink">{tech.name}</td>
            <td className="py-3 pr-4 text-small text-muted">{tech.skills.join(", ")}</td>
            <td className="py-3 pr-4"><AdminStatusBadge status={tech.status} /></td>
            <td className="py-3 pr-4 text-small text-muted">{tech.activeJobs}</td>
            <td className="py-3 text-small">
              <ActionMenu
                actions={[
                  {
                    label: "Set available",
                    onClick: async () => {
                      await updateAdminTechnician(tech.id, { status: "available" });
                      await load();
                    },
                  },
                  {
                    label: "Set busy",
                    onClick: async () => {
                      await updateAdminTechnician(tech.id, { status: "busy" });
                      await load();
                    },
                  },
                  {
                    label: "Set offline",
                    onClick: async () => {
                      await updateAdminTechnician(tech.id, { status: "offline" });
                      await load();
                    },
                  },
                ]}
              />
            </td>
          </tr>
        ))}
      </AdminTable>
    </div>
  );
}
