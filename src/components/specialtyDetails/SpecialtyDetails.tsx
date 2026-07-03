import Swal from "sweetalert2";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SchoolIcon from "@mui/icons-material/School";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ListAltIcon from "@mui/icons-material/ListAlt";
import TableChartIcon from "@mui/icons-material/TableChart";
import { RootState } from "../../redux/store";
import { useLocation, useNavigate } from "react-router";
import { getPloBySpecailty, deletePlo, updatePlo, Plo } from "../../services/plo/ploService";
// SLO removed from the platform.
import { Gco, getGcosBySpecailty, deleteGco, updateGco } from "../../services/gco/gcoService";
import { Competency, getCompetencyBySpecialty, deleteCompetency, updateCompetency } from "../../services/competency/competencyService";
import { getSpecialtyChar, deleteSpecialtyChar, updateSpecialtyChar, SpecialtyChar } from "../../services/specialtCharacteristics/specialtyChar";
import { Subject, getCurriculaBySpecialtyCode, deleteCurricula } from "../../services/curricula/curricula";
import SectionTabStrip from "../common/SectionTabStrip";
import EmptyState from "../common/EmptyState";

const confirmDelete = async (label: string) =>
  (
    await Swal.fire({
      title: "Silmək istədiyinizə əminsiniz?",
      text: `"${label}" silinəcək.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Sil",
      cancelButtonText: "Ləğv et",
    })
  ).isConfirmed;

// Escape user text before injecting into SweetAlert `html` dialogs.
const esc = (s: string) =>
  (s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const handleAfterDelete = async (
  result: string,
  successMsg: string,
  onSuccess: () => void
) => {
  if (result === "SUCCESS") {
    onSuccess();
    Swal.fire("Silindi", successMsg, "success");
  } else if (result === "NOT FOUND") {
    onSuccess();
    Swal.fire("Tapılmadı", "Element artıq mövcud deyil.", "info");
  } else {
    Swal.fire("Xəta!", "Silinə bilmədi.", "error");
  }
};

type TabKey = "overview" | "plo" | "gco" | "competency" | "curriculum";

const TABS = [
  { key: "overview", label: "Ümumi məlumat" },
  { key: "plo", label: "PLO" },
  { key: "gco", label: "Məzun İmkanları" },
  { key: "competency", label: "Kompetensiyalar" },
  { key: "curriculum", label: "Kurrikulum" },
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

  // SLO removed from the platform.

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

  // Curriculum / Subjects
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  const [subjectsNoContent, setSubjectsNoContent] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setSubjectsLoading(true);
        const result = await getCurriculaBySpecialtyCode(specialtyCode, 0, 100);
        if (typeof result === "object" && result.subjects) {
          if (result.subjects.length === 0) {
            setSubjectsNoContent(true);
          } else {
            setSubjects(result.subjects);
          }
        } else if (result === "NOT FOUND") {
          setSubjectsNoContent(true);
        } else {
          setSubjectsNoContent(true);
        }
      } catch (e) {
        setSubjectsNoContent(true);
      } finally {
        setSubjectsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleDeleteSubject = async (code: string, name: string) => {
    if (!(await confirmDelete(name))) return;
    const res = await deleteCurricula(code, token ? token : "");
    handleAfterDelete(res ?? "ERROR", "Fənn silindi.", () => {
      setSubjects((prev) => {
        const next = prev.filter((s) => s.subject_code !== code);
        if (next.length === 0) setSubjectsNoContent(true);
        return next;
      });
    });
  };

  // ---- In-place edit handlers ---------------------------------------------
  const handleEditPlo = async (item: Plo) => {
    const { value } = await Swal.fire({
      title: "PLO redaktə et",
      input: "textarea",
      inputValue: item.plo_content,
      inputLabel: "PLO məzmunu",
      showCancelButton: true,
      confirmButtonText: "Yadda saxla",
      cancelButtonText: "Ləğv et",
      inputValidator: (v) => (!v.trim() ? "Boş ola bilməz" : undefined),
    });
    if (!value || value.trim() === item.plo_content) return;
    const res = await updatePlo(item.plo_code, value.trim());
    if (res === "SUCCESS") {
      setPlo((prev) =>
        prev.map((p) => (p.plo_code === item.plo_code ? { ...p, plo_content: value.trim() } : p))
      );
      Swal.fire("Yeniləndi", "PLO yeniləndi.", "success");
    } else {
      Swal.fire("Xəta!", "PLO yenilənə bilmədi.", "error");
    }
  };

  const handleEditGco = async (item: Gco) => {
    const { value } = await Swal.fire({
      title: "Məzun imkanı redaktə et",
      html:
        `<input id="swal-gco-title" class="swal2-input" placeholder="Başlıq" value="${esc(item.career_title)}">` +
        `<textarea id="swal-gco-content" class="swal2-textarea" placeholder="Məzmun">${esc(item.career_content)}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Yadda saxla",
      cancelButtonText: "Ləğv et",
      preConfirm: () => {
        const title = (document.getElementById("swal-gco-title") as HTMLInputElement).value.trim();
        const content = (document.getElementById("swal-gco-content") as HTMLTextAreaElement).value.trim();
        if (!title || !content) {
          Swal.showValidationMessage("Başlıq və məzmun boş ola bilməz");
          return;
        }
        return { title, content };
      },
    });
    if (!value) return;
    const res = await updateGco(item.career_code, {
      career_title: value.title,
      career_content: value.content,
    });
    if (res === "SUCCESS") {
      setGco((prev) =>
        prev.map((g) =>
          g.career_code === item.career_code
            ? { ...g, career_title: value.title, career_content: value.content }
            : g
        )
      );
      Swal.fire("Yeniləndi", "Məzun imkanı yeniləndi.", "success");
    } else {
      Swal.fire("Xəta!", "Yenilənə bilmədi.", "error");
    }
  };

  const handleEditCompetency = async (item: Competency) => {
    const { value } = await Swal.fire({
      title: "Kompetensiya redaktə et",
      html:
        `<select id="swal-comp-type" class="swal2-select">` +
        `<option value="1" ${item.competency_type === 1 ? "selected" : ""}>Peşə Səriştələri</option>` +
        `<option value="2" ${item.competency_type === 2 ? "selected" : ""}>Ümumi Səriştələr</option>` +
        `</select>` +
        `<textarea id="swal-comp-content" class="swal2-textarea" placeholder="Məzmun">${esc(item.competency_content)}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Yadda saxla",
      cancelButtonText: "Ləğv et",
      preConfirm: () => {
        const type = Number((document.getElementById("swal-comp-type") as HTMLSelectElement).value);
        const content = (document.getElementById("swal-comp-content") as HTMLTextAreaElement).value.trim();
        if (!content) {
          Swal.showValidationMessage("Məzmun boş ola bilməz");
          return;
        }
        return { type, content };
      },
    });
    if (!value) return;
    const res = await updateCompetency(item.competency_code, {
      competency_content: value.content,
      competency_type: value.type,
    });
    if (res === "SUCCESS") {
      setCompetency((prev) =>
        prev.map((c) =>
          c.competency_code === item.competency_code
            ? { ...c, competency_content: value.content, competency_type: value.type }
            : c
        )
      );
      Swal.fire("Yeniləndi", "Kompetensiya yeniləndi.", "success");
    } else {
      Swal.fire("Xəta!", "Yenilənə bilmədi.", "error");
    }
  };

  const handleEditOverview = async () => {
    if (!specialtyChar) return;
    const reqStr = Array.isArray(specialtyChar.degree_requirements)
      ? specialtyChar.degree_requirements.join("\n")
      : specialtyChar.degree_requirements || "";
    const { value } = await Swal.fire({
      title: "Ümumi məlumatı redaktə et",
      width: 640,
      html:
        `<label class="swal2-input-label" style="text-align:left">Proqramın Təsviri</label>` +
        `<textarea id="swal-ov-desc" class="swal2-textarea">${esc(specialtyChar.program_desc || "")}</textarea>` +
        `<label class="swal2-input-label" style="text-align:left">Proqramın Tələbləri</label>` +
        `<textarea id="swal-ov-req" class="swal2-textarea">${esc(reqStr)}</textarea>`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Yadda saxla",
      cancelButtonText: "Ləğv et",
      preConfirm: () => {
        const program_desc = (document.getElementById("swal-ov-desc") as HTMLTextAreaElement).value.trim();
        const degree_requirements = (document.getElementById("swal-ov-req") as HTMLTextAreaElement).value.trim();
        if (!program_desc || !degree_requirements) {
          Swal.showValidationMessage("Sahələr boş ola bilməz");
          return;
        }
        return { program_desc, degree_requirements };
      },
    });
    if (!value) return;
    const res = await updateSpecialtyChar(specialtyCode, value);
    if (res === "SUCCESS") {
      setSpecilatyChar({
        ...specialtyChar,
        program_desc: value.program_desc,
        degree_requirements: value.degree_requirements,
      });
      Swal.fire("Yeniləndi", "Ümumi məlumat yeniləndi.", "success");
    } else {
      Swal.fire("Xəta!", "Yenilənə bilmədi.", "error");
    }
  };

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
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={handleEditOverview}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <EditOutlinedIcon sx={{ fontSize: 18 }} />
                    Redaktə et
                  </button>
                  <button
                    onClick={async () => {
                      if (!(await confirmDelete("Ümumi məlumat"))) return;
                      const res = await deleteSpecialtyChar(specialtyCode);
                      handleAfterDelete(res, "Ümumi məlumat silindi.", () => {
                        setSpecilatyChar(undefined);
                        setCharNoContent(true);
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-error-200 bg-white px-4 py-2 text-sm font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/30 dark:bg-transparent dark:hover:bg-error-500/10"
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    Sil
                  </button>
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
                    className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {index + 1}
                    </span>
                    <p className="flex-1 pt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                      {item.plo_content}
                    </p>
                    <button
                      onClick={() => handleEditPlo(item)}
                      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                      aria-label="Redaktə et"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!(await confirmDelete(item.plo_code))) return;
                        const res = await deletePlo(item.plo_code);
                        handleAfterDelete(res, "PLO silindi.", () => {
                          setPlo((prev) => prev.filter((p) => p.plo_code !== item.plo_code));
                        });
                      }}
                      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                      aria-label="Sil"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
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

        {/* SLO TAB removed from the platform. */}

        {/* GCO TAB */}
        {activeTab === "gco" && (
          <div className="space-y-3">
            {gco.length > 0 ? (
              <>
                {gco.map((item, index) => (
                  <div
                    key={index}
                    className="group overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                          {index + 1}
                        </span>
                        <h5 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                          {item.career_title}
                        </h5>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditGco(item)}
                          className="grid h-7 w-7 place-items-center rounded-lg text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                          aria-label="Redaktə et"
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!(await confirmDelete(item.career_title))) return;
                            const res = await deleteGco(item.career_code);
                            handleAfterDelete(res, "Məzun imkanı silindi.", () => {
                              setGco((prev) => prev.filter((p) => p.career_code !== item.career_code));
                            });
                          }}
                          className="grid h-7 w-7 place-items-center rounded-lg text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                          aria-label="Sil"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </button>
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
                <div className="flex justify-end">
                  <Link
                    to="/specialty-details/competency-matching-table"
                    state={{ specialtyCode, specialtyName }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <TableChartIcon sx={{ fontSize: 16 }} />
                    Səriştə uyğunluq cədvəli
                  </Link>
                </div>
                {competency.map((item, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                  >
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
                      {index + 1}
                    </span>
                    <div className="flex-1 pt-1">
                      <span
                        className={`mb-1 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${
                          item.competency_type === 1
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                        }`}
                      >
                        {item.competency_type === 1 ? "Peşə Səriştələri" : "Ümumi Səriştələr"}
                      </span>
                      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {item.competency_content}
                      </p>
                    </div>
                    <button
                      onClick={() => handleEditCompetency(item)}
                      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                      aria-label="Redaktə et"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!(await confirmDelete(item.competency_code))) return;
                        const res = await deleteCompetency(item.competency_code);
                        handleAfterDelete(res, "Kompetensiya silindi.", () => {
                          setCompetency((prev) =>
                            prev.filter((p) => p.competency_code !== item.competency_code)
                          );
                        });
                      }}
                      className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg text-gray-400 opacity-0 transition group-hover:opacity-100 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                      aria-label="Sil"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </button>
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
          <div className="space-y-3">
            {subjectsLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
                ))}
              </div>
            ) : subjects.length > 0 ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    Kurrikulum və Fənlər
                  </h4>
                  <Link
                    to="/specialty-details/subjects/subject-matching-table"
                    state={{ specialtyCode }}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-transparent dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <TableChartIcon sx={{ fontSize: 16 }} />
                    Fənn uyğunluq cədvəli
                  </Link>
                </div>

                {subjects.map((subject) => (
                  <div
                    key={subject.subject_code}
                    className="group flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/30"
                  >
                    <span className="inline-flex items-center rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      {subject.subject_code}
                    </span>
                    <p className="flex-1 text-sm font-medium text-gray-800 dark:text-white/90">
                      {subject.subject_name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      {subject.semester != null && <span>Semestr {subject.semester}</span>}
                      {subject.credit != null && <span>{subject.credit} kredit</span>}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Link
                        to="/specialty-details/subjects/subject-details"
                        state={{ subjectCode: subject.subject_code, specialtyCode, specialtyName }}
                        className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                        aria-label="Detallar"
                        title="Detallar"
                      >
                        <VisibilityIcon fontSize="small" />
                      </Link>
                      <Link
                        to="/specialty-details/subjects/topics"
                        state={{ subjectCode: subject.subject_code, subjectName: subject.subject_name }}
                        className="grid h-8 w-8 place-items-center rounded-lg transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10"
                        aria-label="Mövzular"
                        title="Mövzular"
                      >
                        <ListAltIcon fontSize="small" />
                      </Link>
                      <button
                        onClick={() => handleDeleteSubject(subject.subject_code, subject.subject_name)}
                        className="grid h-8 w-8 place-items-center rounded-lg opacity-0 transition group-hover:opacity-100 hover:bg-error-50 hover:text-error-600 dark:hover:bg-error-500/10"
                        aria-label="Sil"
                        title="Sil"
                      >
                        <DeleteOutlineIcon fontSize="small" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() =>
                      navigate("/specialty-details/subjects/new", {
                        state: { specialtyCode, specialtyName },
                      })
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                    Fənn əlavə et
                  </button>
                </div>
              </>
            ) : subjectsNoContent ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-10 text-center dark:border-brand-500/30 dark:bg-brand-500/[0.05]">
                <SchoolIcon className="mb-3 text-brand-500" sx={{ fontSize: 52 }} />
                <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
                  Kurrikulum və Fənlər
                </h3>
                <p className="mb-6 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                  Bu proqramda hələ fənn yoxdur. İlk fənni əlavə edərək kurrikulumu qurun.
                </p>
                <button
                  onClick={() =>
                    navigate("/specialty-details/subjects/new", {
                      state: { specialtyCode, specialtyName },
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-500 px-6 py-3 font-medium text-white transition-colors hover:bg-brand-600"
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                  Fənn əlavə et
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
