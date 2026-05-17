"use client";

import { useCallback, useEffect, useState } from "react";

import { ActionMenu } from "@/components/admin/action-menu";
import { AdminTable } from "@/components/admin/admin-table";
import { DrawerPanel } from "@/components/admin/drawer-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { SectionHeader } from "@/components/dashboard/section-header";
import { blockAdminUser, fetchAdminUsers } from "@/lib/admin/api";
import type { AdminUser } from "@/lib/admin/types";
import { SITE_CONTACT_EMAIL } from "@/lib/constants/site-contact";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailUser, setDetailUser] = useState<AdminUser | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setUsers(await fetchAdminUsers());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Users"
        subtitle="Full contact details for every account — use phone or email for follow-up."
      />

      <AdminTable headers={["User", "Email", "Phone", "Role", "Bookings", "Actions"]}>
        {loading ? (
          <tr>
            <td colSpan={6} className="py-6 text-small text-muted">
              Loading users…
            </td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user.id} className="border-b border-border">
              <td className="py-3 pr-4 text-small text-ink">{user.name}</td>
              <td className="py-3 pr-4 text-small">
                <a href={`mailto:${user.email}`} className="text-accent hover:underline">
                  {user.email}
                </a>
              </td>
              <td className="py-3 pr-4 text-small">
                {user.phone ? (
                  <a href={`tel:${user.phone.replace(/\s/g, "")}`} className="text-ink hover:underline">
                    {user.phone}
                  </a>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td className="py-3 pr-4">
                <AdminStatusBadge status={user.role} />
              </td>
              <td className="py-3 pr-4 text-small text-muted">{user.bookingsCount}</td>
              <td className="py-3 text-small">
                <ActionMenu
                  actions={[
                    {
                      label: "View details",
                      onClick: () => setDetailUser(user),
                    },
                    {
                      label: user.isBlocked ? "Enable" : "Disable",
                      onClick: async () => {
                        await blockAdminUser(user.id, !user.isBlocked);
                        await load();
                      },
                    },
                  ]}
                />
              </td>
            </tr>
          ))
        )}
      </AdminTable>

      <DrawerPanel
        open={detailUser !== null}
        title={detailUser?.name ?? "User"}
        onClose={() => setDetailUser(null)}
      >
        {detailUser ? (
          <dl className="space-y-4 text-small">
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-1 font-medium text-ink">
                <a href={`mailto:${detailUser.email}`} className="text-accent hover:underline">
                  {detailUser.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="mt-1 font-medium text-ink">
                {detailUser.phone ? (
                  <a href={`tel:${detailUser.phone.replace(/\s/g, "")}`} className="hover:underline">
                    {detailUser.phone}
                  </a>
                ) : (
                  "Not provided"
                )}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Address</dt>
              <dd className="mt-1 font-medium text-ink">{detailUser.address ?? "Not provided"}</dd>
            </div>
            <div>
              <dt className="text-muted">Role</dt>
              <dd className="mt-1 font-medium text-ink">{detailUser.role}</dd>
            </div>
            <div>
              <dt className="text-muted">Status</dt>
              <dd className="mt-1 font-medium text-ink">
                {detailUser.isBlocked ? "Disabled" : "Active"}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Bookings</dt>
              <dd className="mt-1 font-medium text-ink">{detailUser.bookingsCount}</dd>
            </div>
            <div>
              <dt className="text-muted">Joined</dt>
              <dd className="mt-1 font-medium text-ink">{formatDate(detailUser.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">User ID</dt>
              <dd className="mt-1 break-all font-mono text-[12px] text-muted">{detailUser.id}</dd>
            </div>
          </dl>
        ) : null}
      </DrawerPanel>

      <p className="text-small text-muted">
        Operations email:{" "}
        <a href={`mailto:${SITE_CONTACT_EMAIL}`} className="font-medium text-accent hover:underline">
          {SITE_CONTACT_EMAIL}
        </a>
      </p>
    </div>
  );
}
