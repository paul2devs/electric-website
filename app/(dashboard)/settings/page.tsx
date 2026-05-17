"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/components/dashboard/section-header";
import { ApiError } from "@/lib/api/errors";
import {
  fetchDashboardProfile,
  updateDashboardPassword,
  updateDashboardProfile,
} from "@/lib/dashboard/api";
import { validatePhoneRequired } from "@/lib/validation/phone";

export default function DashboardSettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [securityMessage, setSecurityMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const profile = await fetchDashboardProfile();
        if (!active) return;
        setName(profile.name);
        setEmail(profile.email);
        setPhone(profile.phone ?? "");
        setAddress(profile.address ?? "");
      } catch (error) {
        if (!active) return;
        setErrorMessage(error instanceof ApiError ? error.message : "Could not load settings");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-10">
      <SectionHeader title="Settings" subtitle="Manage profile details and account security." />

      {errorMessage ? (
        <p className="rounded-sm border border-error/25 bg-error-muted px-3 py-2 text-small text-error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <section className="flex flex-col gap-4">
        <SectionHeader title="Profile" />
        <div className="grid gap-4 rounded-sm border border-border bg-surface p-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="settings-name">
              Full name
            </label>
            <Input
              id="settings-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={loading || profileSaving}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="settings-email">
              Email
            </label>
            <Input id="settings-email" value={email} disabled />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="settings-phone">
              Phone <span className="text-error">*</span>
            </label>
            <Input
              id="settings-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={loading || profileSaving}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="settings-address">
              Address
            </label>
            <Input
              id="settings-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              disabled={loading || profileSaving}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={async () => {
              setErrorMessage(null);
              setProfileMessage(null);
              setSecurityMessage(null);
              setProfileSaving(true);
              try {
                const phoneError = validatePhoneRequired(phone);
                if (phoneError) {
                  setErrorMessage(phoneError);
                  return;
                }
                const updated = await updateDashboardProfile({
                  name: name.trim(),
                  phone: phone.trim(),
                  address: address.trim() ? address.trim() : undefined,
                });
                setName(updated.name);
                setPhone(updated.phone ?? "");
                setAddress(updated.address ?? "");
                setProfileMessage("Profile updated successfully.");
              } catch (error) {
                setErrorMessage(error instanceof ApiError ? error.message : "Could not save profile");
              } finally {
                setProfileSaving(false);
              }
            }}
            disabled={loading || profileSaving}
          >
            {profileSaving ? "Saving..." : "Save profile"}
          </Button>
          {profileMessage ? <p className="text-small text-success">{profileMessage}</p> : null}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <SectionHeader title="Security" />
        <div className="grid gap-4 rounded-sm border border-border bg-surface p-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="settings-current-password">
              Current password
            </label>
            <Input
              id="settings-current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={passwordSaving}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-small font-medium text-ink" htmlFor="settings-next-password">
              New password
            </label>
            <Input
              id="settings-next-password"
              type="password"
              value={nextPassword}
              onChange={(event) => setNextPassword(event.target.value)}
              disabled={passwordSaving}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={async () => {
              setErrorMessage(null);
              setProfileMessage(null);
              setSecurityMessage(null);
              setPasswordSaving(true);
              try {
                await updateDashboardPassword({
                  currentPassword: currentPassword.trim(),
                  nextPassword: nextPassword.trim(),
                });
                setCurrentPassword("");
                setNextPassword("");
                setSecurityMessage("Password updated successfully.");
              } catch (error) {
                setErrorMessage(
                  error instanceof ApiError ? error.message : "Could not update password",
                );
              } finally {
                setPasswordSaving(false);
              }
            }}
            disabled={passwordSaving || !currentPassword || !nextPassword}
          >
            {passwordSaving ? "Updating..." : "Update password"}
          </Button>
          {securityMessage ? <p className="text-small text-success">{securityMessage}</p> : null}
        </div>
      </section>
    </div>
  );
}
