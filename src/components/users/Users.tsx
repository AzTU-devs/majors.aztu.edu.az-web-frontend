import Swal from "sweetalert2";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Button from "../ui/button/Button";
import {
  ManagedUser,
  getUsers,
  setUserApproval,
  rejectUser,
} from "../../services/user/userService";

type Tab = "pending" | "all";

const roleLabel = (role: number) => (role === 1 ? "Admin" : "Kafedra müdiri");

export default function Users() {
  const [tab, setTab] = useState<Tab>("pending");
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await getUsers(tab === "pending" ? false : undefined);
    setUsers(list);
    setLoading(false);
  }, [tab]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleApprove = async (user: ManagedUser, approved: boolean) => {
    setBusy(user.fin_kod);
    const result = await setUserApproval(user.fin_kod, approved);
    setBusy(null);
    if (result === "SUCCESS") {
      Swal.fire({
        icon: "success",
        title: approved ? "Təsdiqləndi" : "Təsdiq ləğv edildi",
        text: `${user.name} ${user.surname}`,
        timer: 1600,
        showConfirmButton: false,
      });
      refresh();
    } else {
      Swal.fire("Xəta!", "Əməliyyat yerinə yetirilə bilmədi.", "error");
    }
  };

  const handleReject = async (user: ManagedUser) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Rədd edilsin?",
      text: `${user.name} ${user.surname} (${user.fin_kod}) silinəcək.`,
      showCancelButton: true,
      confirmButtonText: "Bəli, rədd et",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;

    setBusy(user.fin_kod);
    const result = await rejectUser(user.fin_kod);
    setBusy(null);
    if (result === "SUCCESS") {
      Swal.fire({
        icon: "success",
        title: "Rədd edildi",
        timer: 1400,
        showConfirmButton: false,
      });
      refresh();
    } else {
      Swal.fire("Xəta!", "İstifadəçi silinə bilmədi.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="inline-flex rounded-xl border border-gray-200 bg-white/70 p-1 dark:border-white/10 dark:bg-gray-900/60">
        {([
          { key: "pending", label: "Təsdiq gözləyənlər" },
          { key: "all", label: "Bütün istifadəçilər" },
        ] as { key: Tab; label: string }[]).map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              tab === item.key
                ? "bg-brand-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={72} />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          {tab === "pending"
            ? "Təsdiq gözləyən istifadəçi yoxdur."
            : "İstifadəçi tapılmadı."}
        </p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.fin_kod}
              className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name} {user.surname} {user.father_name}
                  </p>
                  <span className="inline-flex items-center rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
                    {roleLabel(user.role)}
                  </span>
                  {user.approved ? (
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      Təsdiqlənib
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      Gözləyir
                    </span>
                  )}
                </div>
                <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-mono">{user.fin_kod}</span>
                  {" · "}
                  {user.email}
                  {user.cafedra_code ? ` · ${user.cafedra_code}` : ""}
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-2">
                {user.approved ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={busy === user.fin_kod}
                    onClick={() => handleApprove(user, false)}
                  >
                    Təsdiqi ləğv et
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    disabled={busy === user.fin_kod}
                    startIcon={<CheckCircleIcon fontSize="small" />}
                    onClick={() => handleApprove(user, true)}
                  >
                    Təsdiqlə
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={busy === user.fin_kod}
                  startIcon={<CloseIcon fontSize="small" />}
                  onClick={() => handleReject(user)}
                >
                  Rədd et
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
