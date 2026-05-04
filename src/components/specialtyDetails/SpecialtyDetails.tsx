import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { RootState } from "../../redux/store";
import { useLocation, useNavigate } from "react-router";
import { getPloBySpecailty, Plo } from "../../services/plo/ploService";
import { getSloBySpecialty, Slo } from "../../services/slo/sloService";
import { Gco, getGcosBySpecailty } from "../../services/gco/gcoService";
import { Competency, getCompetencyBySpecialty } from "../../services/competency/competencyService";
import { getSpecialtyChar, SpecialtyChar } from "../../services/specialtCharacteristics/specialtyChar";
import SectionTabStrip from "../common/SectionTabStrip";
import EmptyState from "../common/EmptyState";

type TabKey = "overview" | "plo" | "slo" | "gco" | "competency" | "curriculum";

const TABS = [
  { key: "overview", label: "Ümumi məlumat" },
  { key: "plo", label: "PLO" },
  { key: "slo", label: "SLO" },
  { key: "gco", label: "Məzun İmkanları" },
  { key: "competency", label: "Kompetensiyalar" },
  { key: "curriculum", label: "Kurikulum" },
];

export default function SpecialtyDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [, setError] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);
  const { specialtyCode } = location.state as { specialtyCode: string };
  const { specialtyName } = location.state as { specialtyName: string };

  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  // Specialty characteristics
  const [specialtyChar, setSpecilatyChar] = useState<SpecialtyChar>();
  const [, setCharLoading] = useState(false);
  const [charNoContent, setCharNoContent] = useState(false);

  useEffect(() => {
    const getSpecChar = async () => {
      try {
        setCharLoading(true);
        const result = await getSpecialtyChar(specialtyCode, token ? token : "");
        if (typeof result === "object") {
          setSpecilatyChar(result);
        } else if (result === "NO CONTENT") {
          setCharNoContent(true);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      }
    };
    getSpecChar();
  }, []);

  // PLO
  const [plo, setPlo] = useState<Plo[]>([]);
  const [ploNoContent, setPloNoContent] = useState(false);

  useEffect(() => {
    const getPlos = async () => {
      try {
        const result = await getPloBySpecailty(specialtyCode);
        if (typeof result === "object") {
          setPlo(result);
        } else if (result === "NO CONTENT") {
          setPloNoContent(true);
        }
      } catch (e) {
        setError(true);
      }
    };
    getPlos();
  }, []);

  // SLO
  const [slo, setSlo] = useState<Slo[]>([]);
  const [sloNoContent, setSloNoContent] = useState(false);

  useEffect(() => {
    const getSlos = async () => {
      try {
        const result = await getSloBySpecialty(specialtyCode, token ? token : "");
        if (typeof result === "object") {
          setSlo(result);
        } else if (result === "NO CONTENT") {
          setSloNoContent(true);
        }
      } catch (e) {
        setError(true);
      }
    };
    getSlos();
  }, []);

  // GCO
  const [gco, setGco] = useState<Gco[]>([]);
  const [gcoNoContent, setGcoNoContent] = useState(false);

  useEffect(() => {
    const getGcos = async () => {
      try {
        const result = await getGcosBySpecailty(specialtyCode, token ? token : "");
        if (typeof result === "object") {
          setGco(result);
        } else if (result === "NO CONTENT") {
          setGcoNoContent(true);
        }
      } catch (e) {
        setError(true);
      }
    };
    getGcos();
  }, []);

  // Competency
  const [competency, setCompetency] = useState<Competency[]>([]);
  const [compNoContent, setCompNoContent] = useState(false);

  useEffect(() => {
    const getCompetencies = async () => {
      try {
        const result = await getCompetencyBySpecialty(specialtyCode, token ? token : "");
        if (typeof result === "object") {
          setCompetency(result);
        } else if (result === "NO CONTENT") {
          setCompNoContent(true);
        }
      } catch (e) {
        setError(true);
      }
    };
    getCompetencies();
  }, []);

  return (
    <div className="space-y-4">
      {/* Specialty header card */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{specialtyName}</h2>
          <span className="mt-2 inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {specialtyCode}
          </span>
        </div>
      </div>

      {/* Tab navigation */}
      <SectionTabStrip
        tabs={TABS}
        activeTab={activeTab}
        onChange={(tab) => setActiveTab(tab as TabKey)}
      />

      {/* Tab content */}
      <div>
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {specialtyChar ? (
              <>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-800/30">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Proqramın Təsviri
                  </h4>
                  <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {specialtyChar.program_desc || "—"}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-5 dark:border-gray-800 dark:bg-gray-800/30">
                  <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Proqramın Tələbləri
                  </h4>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {Array.isArray(specialtyChar.degree_requirements)
                      ? specialtyChar.degree_requirements.join("\n")
                      : specialtyChar.degree_requirements || "—"}
                  </p>
                </div>
              </>
            ) : charNoContent ? (
              <EmptyState
                message="Kvalifikasiya xarakteristikası tapılmadı"
                actionLabel="Əlavə et"
                onAction={() =>
                  navigate("/specialty-details/new-specialty-characteristics", {
                    state: { specialtyCode, specialtyName },
                  })
                }
              />
            ) : (
              <div className="space-y-4">
                <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              </div>
            )}
          </div>
        )}

        {/* PLO TAB */}
        {activeTab === "plo" && (
          <div className="space-y-3">
            {plo.length > 0 ? (
              <>
                {plo.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.plo_content}
                    </p>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() =>
                      navigate("/specialty-details/new-plo", { state: { specialtyCode, specialtyName } })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                    PLO əlavə et
                  </button>
                </div>
              </>
            ) : ploNoContent ? (
              <EmptyState
                message="Proqram Öyrənmə Məqsədləri tapılmadı"
                actionLabel="PLO əlavə et"
                onAction={() =>
                  navigate("/specialty-details/new-plo", { state: { specialtyCode, specialtyName } })
                }
              />
            ) : (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SLO TAB */}
        {activeTab === "slo" && (
          <div className="space-y-3">
            {slo.length > 0 ? (
              <>
                {slo.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.slo_content}
                    </p>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() =>
                      navigate("/specialty-details/new-slo", { state: { specialtyCode, specialtyName } })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                    SLO əlavə et
                  </button>
                </div>
              </>
            ) : sloNoContent ? (
              <EmptyState
                message="Tələbə Öyrənmə Nəticələri tapılmadı"
                actionLabel="SLO əlavə et"
                onAction={() =>
                  navigate("/specialty-details/new-slo", { state: { specialtyCode, specialtyName } })
                }
              />
            ) : (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* GCO TAB */}
        {activeTab === "gco" && (
          <div className="space-y-3">
            {gco.length > 0 ? (
              <>
                {gco.map((item, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                  >
                    <div className="border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                          {index + 1}
                        </span>
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                          {item.career_title}
                        </h5>
                      </div>
                    </div>
                    <p className="p-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                      {item.career_content}
                    </p>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() =>
                      navigate("/specialty-details/new-gco", { state: { specialtyCode, specialtyName } })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                    GCO əlavə et
                  </button>
                </div>
              </>
            ) : gcoNoContent ? (
              <EmptyState
                message="Məzun İş İmkanları tapılmadı"
                actionLabel="GCO əlavə et"
                onAction={() =>
                  navigate("/specialty-details/new-gco", { state: { specialtyCode, specialtyName } })
                }
              />
            ) : (
              <div className="space-y-3">
                {[0, 1].map((i) => (
                  <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPETENCY TAB */}
        {activeTab === "competency" && (
          <div className="space-y-3">
            {competency.length > 0 ? (
              <>
                {competency.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.competency_content}
                    </p>
                  </div>
                ))}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() =>
                      navigate("/specialty-details/new-competency", { state: { specialtyCode, specialtyName } })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                    Kompetensiya əlavə et
                  </button>
                </div>
              </>
            ) : compNoContent ? (
              <EmptyState
                message="Kompetensiyalar tapılmadı"
                actionLabel="Kompetensiya əlavə et"
                onAction={() =>
                  navigate("/specialty-details/new-competency", { state: { specialtyCode, specialtyName } })
                }
              />
            ) : (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                ))}
              </div>
            )}
          </div>
        )}

        {/* CURRICULUM TAB */}
        {activeTab === "curriculum" && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-brand-200 bg-brand-50/50 p-10 text-center dark:border-brand-500/30 dark:bg-brand-500/[0.05]">
            <SchoolIcon className="mb-3 text-brand-500" sx={{ fontSize: 52 }} />
            <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
              Kurikulum və Fənlər
            </h3>
            <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Bu proqramdakı bütün fənləri və kurikulumu idarə edin
            </p>
            <Link
              to="/specialty-details/subjects"
              state={{ specialtyCode, specialtyName }}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-600"
            >
              Kurikuluma keç
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
