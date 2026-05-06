import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BadgeIcon from "@mui/icons-material/Badge";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Skeleton from "@mui/material/Skeleton";

import PageMeta from "../../components/common/PageMeta";
import StatCard from "../../components/common/StatCard";
import { RootState } from "../../redux/store";
import { getAllSpecialties, getSpecialtiesByCafedra } from "../../services/specialty/specialtyService";

export default function Home() {
  const auth = useSelector((state: RootState) => state.auth);
  const [specialtyCount, setSpecialtyCount] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!auth.token) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        if (auth.role === 1) {
          const result = await getAllSpecialties(auth.token!);
          if (Array.isArray(result)) {
            setSpecialtyCount(result.length);
          }
        } else if (auth.role === 2 && auth.cafedra_code) {
          const result = await getSpecialtiesByCafedra(auth.cafedra_code, auth.token!, 0, 1000);
          if (result && typeof result === "object" && "total_specialties" in result) {
            setSpecialtyCount(result.total_specialties as number);
          }
        }
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [auth.token, auth.role, auth.cafedra_code]);

  const roleName = auth.role === 2 ? "Kafedra müdiri" : "Admin";

  return (
    <>
      <PageMeta
        title="AzTU İxtisas informasiya sistemi"
        description="AzTU-da tədris olunan bütün ixtisaslar və onların iş imkanları"
      />

      <div className="mx-auto max-w-6xl space-y-8 p-6">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl p-8 shadow-elevated sm:p-10">
          <div className="absolute inset-0 brand-gradient" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />
          <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="grid h-20 w-20 flex-shrink-0 place-items-center rounded-3xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <img
                src="/aztu-logo-light.png"
                alt="AzTU"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/90 ring-1 ring-white/20">
                Salam, {auth.name || "istifadəçi"}
              </span>
              <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">
                AZTU İxtisas İnformasiya Sistemi
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80">
                İxtisaslar, fənlər, kafedralar və öyrənmə nəticələri üçün
                vahid idarəetmə paneli — sürətli, müasir, təhlükəsiz.
              </p>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {loadingStats ? (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="surface-card flex items-center gap-4 p-5"
                >
                  <Skeleton variant="rounded" width={48} height={48} />
                  <div className="flex-1">
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="80%" height={20} />
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <StatCard
                icon={<SchoolIcon sx={{ fontSize: 24 }} />}
                label="Ümumi ixtisas sayı"
                value={specialtyCount ?? "—"}
                color="brand"
              />
              <StatCard
                icon={<BadgeIcon sx={{ fontSize: 24 }} />}
                label="İstifadəçi rolu"
                value={roleName}
                color="success"
              />
              <StatCard
                icon={<MenuBookIcon sx={{ fontSize: 24 }} />}
                label="Sistem statusu"
                value="Aktiv"
                color="warning"
              />
            </>
          )}
        </div>

        {/* Quick Navigation */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Sürətli keçid
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              to="/specialties"
              className="group surface-card relative flex items-center justify-between overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-60" />
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl brand-gradient text-white shadow-glow">
                  <SchoolIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    İxtisaslar
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Bütün ixtisaslara bax
                  </p>
                </div>
              </div>
              <ArrowForwardIcon
                className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500"
                sx={{ fontSize: 20 }}
              />
            </Link>

            <Link
              to="/literatures"
              className="group surface-card relative flex items-center justify-between overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-100 text-gray-600 transition group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-white/5 dark:text-gray-300 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-200">
                  <MenuBookIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    Ədəbiyyat
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Ədəbiyyat siyahısına bax
                  </p>
                </div>
              </div>
              <ArrowForwardIcon
                className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500"
                sx={{ fontSize: 20 }}
              />
            </Link>

            {auth.role === 1 && (
              <Link
                to="/new-specialty"
                className="group surface-card relative flex items-center justify-between overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gray-100 text-gray-600 transition group-hover:bg-brand-50 group-hover:text-brand-600 dark:bg-white/5 dark:text-gray-300 dark:group-hover:bg-brand-500/15 dark:group-hover:text-brand-200">
                    <SchoolIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Yeni İxtisas
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Yeni ixtisas əlavə et
                    </p>
                  </div>
                </div>
                <ArrowForwardIcon
                  className="text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand-500"
                  sx={{ fontSize: 20 }}
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
