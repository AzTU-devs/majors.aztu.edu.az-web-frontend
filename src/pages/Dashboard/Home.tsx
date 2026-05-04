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

      <div className="mx-auto max-w-5xl space-y-6 p-6">
        {/* Hero Banner */}
        <div className="flex flex-col gap-6 overflow-hidden rounded-2xl bg-gradient-to-r from-brand-700 to-brand-500 p-8 sm:flex-row sm:items-center">
          <div className="flex-shrink-0">
            <img
              src="/aztu-logo-light.png"
              alt="AzTU"
              className="h-16 w-auto object-contain"
            />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
              AzTU İxtisas İnformasiya Sistemi
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/80 leading-relaxed">
              İxtisas informasiya sistemi AzTU-da tədris olunan ixtisaslar barədə məlumat, məzunların iş imkanları, kompetensiyalar və sillabusları əhatə edir.
            </p>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {loadingStats ? (
            <>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
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
              className="group flex items-center justify-between rounded-2xl border-2 border-brand-200 bg-brand-50 p-5 transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 dark:border-brand-500/30 dark:bg-brand-500/[0.08] dark:hover:bg-brand-500"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white group-hover:bg-white/20">
                  <SchoolIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="font-semibold text-brand-700 transition-colors group-hover:text-white dark:text-brand-300">
                    İxtisaslar
                  </p>
                  <p className="text-xs text-brand-500/70 group-hover:text-white/70 dark:text-brand-400/70">
                    Bütün ixtisaslara bax
                  </p>
                </div>
              </div>
              <ArrowForwardIcon
                className="text-brand-400 transition-all group-hover:translate-x-1 group-hover:text-white dark:text-brand-500"
                sx={{ fontSize: 20 }}
              />
            </Link>

            <Link
              to="/literatures"
              className="group flex items-center justify-between rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 dark:border-gray-700 dark:bg-white/[0.03] dark:hover:border-brand-500 dark:hover:bg-brand-500"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-600 transition-colors group-hover:bg-white/20 group-hover:text-white dark:bg-gray-700 dark:text-gray-300">
                  <MenuBookIcon sx={{ fontSize: 20 }} />
                </div>
                <div>
                  <p className="font-semibold text-gray-700 transition-colors group-hover:text-white dark:text-gray-300">
                    Ədəbiyyat
                  </p>
                  <p className="text-xs text-gray-400 group-hover:text-white/70">
                    Ədəbiyyat siyahısına bax
                  </p>
                </div>
              </div>
              <ArrowForwardIcon
                className="text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-white"
                sx={{ fontSize: 20 }}
              />
            </Link>

            {auth.role === 1 && (
              <Link
                to="/new-specialty"
                className="group flex items-center justify-between rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 transition-all duration-200 hover:border-brand-500 hover:bg-brand-500 dark:border-gray-700 dark:bg-white/[0.03] dark:hover:border-brand-500 dark:hover:bg-brand-500"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-200 text-gray-600 transition-colors group-hover:bg-white/20 group-hover:text-white dark:bg-gray-700 dark:text-gray-300">
                    <SchoolIcon sx={{ fontSize: 20 }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 transition-colors group-hover:text-white dark:text-gray-300">
                      Yeni İxtisas
                    </p>
                    <p className="text-xs text-gray-400 group-hover:text-white/70">
                      Yeni ixtisas əlavə et
                    </p>
                  </div>
                </div>
                <ArrowForwardIcon
                  className="text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-white"
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
