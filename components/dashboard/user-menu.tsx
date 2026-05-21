"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteAccountAction } from "@/app/dashboard/actions";

export function UserMenu() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
        setConfirmDelete(false);
        setError(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isLoaded || !isSignedIn || !user) return null;

  const initials = [user.firstName, user.lastName].filter(Boolean).map((n) => n!.charAt(0)).join("").toUpperCase() || user.emailAddresses[0]?.emailAddress.charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    try {
      const result = await deleteAccountAction();
      if (result.success) {
        await signOut();
        router.push("/");
      } else {
        setError(result.error ?? "Something went wrong");
        setDeleting(false);
      }
    } catch {
      setError("Failed to delete account");
      setDeleting(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/[0.07] text-sm font-semibold text-white transition hover:bg-white/[0.12]"
      >
        {initials}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-72 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0c0c0e] shadow-2xl">
          <div className="border-b border-white/[0.06] px-5 py-4">
            <p className="text-sm font-semibold text-white">
              {user.firstName ?? ""} {user.lastName ?? ""}
            </p>
            <p className="mt-0.5 text-xs text-white/45">
              {user.emailAddresses[0]?.emailAddress ?? ""}
            </p>
          </div>

          {error && (
            <div className="mx-5 mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="p-2">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/65 transition hover:bg-white/[0.07] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Log out
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400/80 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                Delete account
              </button>
            ) : (
              <div className="mt-1 space-y-2 rounded-lg border border-red-500/15 bg-red-500/5 p-3">
                <p className="text-xs leading-relaxed text-red-200/80">
                  Are you sure? This permanently deletes all your data and cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setConfirmDelete(false); setError(null); }}
                    className="flex-1 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
