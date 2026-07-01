import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import {
  Faculty,
  FacultyPayload,
  addFaculty,
  getFaculties,
  updateFaculty,
  deleteFaculty,
} from "../../services/faculty/facultyService";

export default function Faculties() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const list = await getFaculties();
    setFaculties(list);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) {
      Swal.fire("Xəta!", "Hər iki xananı doldurun.", "warning");
      return;
    }
    setSubmitting(true);
    const payload: FacultyPayload = {
      faculty_code: code.trim(),
      faculty_name: name.trim(),
    };
    const result = await addFaculty(payload);
    if (result === "SUCCESS") {
      Swal.fire({
        icon: "success",
        title: "Əlavə edildi",
        text: `Fakültə "${name}" əlavə edildi.`,
      });
      setCode("");
      setName("");
      refresh();
    } else if (result === "CONFLICT") {
      Swal.fire("Xəta!", "Bu kod və ya ad artıq mövcuddur.", "error");
    } else {
      Swal.fire("Xəta!", "Fakültə əlavə edilə bilmədi.", "error");
    }
    setSubmitting(false);
  };

  const handleEdit = async (f: Faculty) => {
    const { value: newName } = await Swal.fire({
      title: "Fakültəni redaktə et",
      input: "text",
      inputValue: f.faculty_name,
      inputLabel: "Fakültənin adı",
      showCancelButton: true,
      confirmButtonText: "Yadda saxla",
      cancelButtonText: "Ləğv et",
      inputValidator: (v) => (!v.trim() ? "Ad boş ola bilməz" : undefined),
    });
    if (!newName || newName.trim() === f.faculty_name) return;
    const result = await updateFaculty(f.faculty_code, newName.trim());
    if (result.status === "SUCCESS") {
      Swal.fire("Yeniləndi", "Fakültə yeniləndi.", "success");
      refresh();
    } else if (result.status === "CONFLICT") {
      Swal.fire("Xəta!", result.message || "Bu ad artıq mövcuddur.", "error");
    } else {
      Swal.fire("Xəta!", result.message || "Fakültə yenilənə bilmədi.", "error");
    }
  };

  const handleDelete = async (f: Faculty) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Silinsin?",
      text: `"${f.faculty_name}" (${f.faculty_code}) silinəcək.`,
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;
    const result = await deleteFaculty(f.faculty_code);
    if (result.status === "SUCCESS") {
      Swal.fire("Silindi", "Fakültə silindi.", "success");
      refresh();
    } else if (result.status === "CONFLICT") {
      Swal.fire("Xəta!", result.message || "Bu fakültənin kafedraları var.", "error");
    } else {
      Swal.fire("Xəta!", result.message || "Fakültə silinə bilmədi.", "error");
    }
  };

  const filtered = faculties.filter(
    (f) =>
      f.faculty_name.toLowerCase().includes(search.toLowerCase()) ||
      f.faculty_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label>Fakültənin kodu</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="ITF"
          />
        </div>
        <div>
          <Label>Fakültənin adı</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="İnformasiya Texnologiyaları Fakültəsi"
          />
        </div>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Əlavə edilir..." : "Fakültə əlavə et"}
          </Button>
        </div>
      </form>

      <div className="border-t border-gray-100 pt-6 dark:border-white/5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Mövcud fakültələr
          </h3>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Axtar..."
            className="h-9 w-56 rounded-xl border border-gray-200 bg-white/80 px-3 text-sm focus:outline-none focus:shadow-focus-ring dark:border-white/10 dark:bg-gray-900/70 dark:text-white/90"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="surface-card flex flex-col gap-2 p-5"
              >
                <Skeleton variant="rounded" width={64} height={24} />
                <Skeleton variant="text" width="80%" height={24} />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Fakültə tapılmadı.
            </p>
          ) : (
            filtered.map((f) => (
              <div key={f.faculty_code} className="surface-card flex flex-col gap-2 p-5">
                <span className="inline-flex w-fit items-center rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
                  {f.faculty_code}
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {f.faculty_name}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(f)}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                  >
                    Redaktə et
                  </button>
                  <button
                    onClick={() => handleDelete(f)}
                    className="rounded-lg border border-error-200 px-3 py-1 text-xs font-medium text-error-600 transition hover:bg-error-50 dark:border-error-500/30 dark:hover:bg-error-500/10"
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
