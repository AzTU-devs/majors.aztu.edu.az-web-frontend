import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Label from "../form/Label";
import Select from "../form/Select";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { Faculty, getFaculties } from "../../services/faculty/facultyService";
import {
  Cafedra,
  CafedraPayload,
  addCafedra,
  getCafedras,
  updateCafedra,
  deleteCafedra,
} from "../../services/cafedra/cafedraService";

export default function Cafedras() {
  const [cafedras, setCafedras] = useState<Cafedra[]>([]);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [facultyCode, setFacultyCode] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const result = await getCafedras();
    if (Array.isArray(result)) {
      setCafedras(result);
    } else {
      setCafedras([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      const list = await getFaculties();
      setFaculties(list);
    })();
    refresh();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyCode || !code.trim() || !name.trim()) {
      Swal.fire("Xəta!", "Fakültəni seçin və bütün xanaları doldurun.", "warning");
      return;
    }
    setSubmitting(true);
    const payload: CafedraPayload = {
      faculty_code: facultyCode,
      cafedra_code: code.trim(),
      cafedra_name: name.trim(),
    };
    const result = await addCafedra(payload);
    if (result === "SUCCESS") {
      Swal.fire({
        icon: "success",
        title: "Əlavə edildi",
        text: `Kafedra "${name}" əlavə edildi.`,
      });
      setFacultyCode("");
      setCode("");
      setName("");
      refresh();
    } else if (result === "CONFLICT") {
      Swal.fire("Xəta!", "Bu kafedra kodu artıq mövcuddur.", "error");
    } else if (result === "FACULTY_NOT_FOUND") {
      Swal.fire("Xəta!", "Seçilən fakültə tapılmadı.", "error");
    } else {
      Swal.fire("Xəta!", "Kafedra əlavə edilə bilmədi.", "error");
    }
    setSubmitting(false);
  };

  const handleEdit = async (c: Cafedra) => {
    const { value: newName } = await Swal.fire({
      title: "Kafedranı redaktə et",
      input: "text",
      inputValue: c.cafedra_name,
      inputLabel: "Kafedranın adı",
      showCancelButton: true,
      confirmButtonText: "Yadda saxla",
      cancelButtonText: "Ləğv et",
      inputValidator: (v) => (!v.trim() ? "Ad boş ola bilməz" : undefined),
    });
    if (!newName || newName.trim() === c.cafedra_name) return;
    const result = await updateCafedra(c.cafedra_code, { cafedra_name: newName.trim() });
    if (result.status === "SUCCESS") {
      Swal.fire("Yeniləndi", "Kafedra yeniləndi.", "success");
      refresh();
    } else if (result.status === "CONFLICT") {
      Swal.fire("Xəta!", result.message || "Bu ad artıq mövcuddur.", "error");
    } else {
      Swal.fire("Xəta!", result.message || "Kafedra yenilənə bilmədi.", "error");
    }
  };

  const handleDelete = async (c: Cafedra) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Silinsin?",
      text: `"${c.cafedra_name}" (${c.cafedra_code}) silinəcək.`,
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;
    const result = await deleteCafedra(c.cafedra_code);
    if (result.status === "SUCCESS") {
      Swal.fire("Silindi", "Kafedra silindi.", "success");
      refresh();
    } else if (result.status === "CONFLICT") {
      Swal.fire("Xəta!", result.message || "Bu kafedra istifadədədir.", "error");
    } else {
      Swal.fire("Xəta!", result.message || "Kafedra silinə bilmədi.", "error");
    }
  };

  const filtered = cafedras.filter(
    (c) =>
      c.cafedra_name.toLowerCase().includes(search.toLowerCase()) ||
      c.cafedra_code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <Label>Fakültə</Label>
          <Select
            placeholder="Fakültə seçin"
            defaultValue={facultyCode}
            onChange={(value) => setFacultyCode(value)}
            options={faculties.map((f) => ({
              value: f.faculty_code,
              label: `${f.faculty_code} — ${f.faculty_name}`,
            }))}
          />
        </div>
        <div>
          <Label>Kafedranın kodu</Label>
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="KMK"
          />
        </div>
        <div>
          <Label>Kafedranın adı</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Kompüter Mühəndisliyi Kafedrası"
          />
        </div>
        <div className="md:col-span-3 flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Əlavə edilir..." : "Kafedra əlavə et"}
          </Button>
        </div>
      </form>

      <div className="border-t border-gray-100 pt-6 dark:border-white/5">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Mövcud kafedralar
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
              <div key={i} className="surface-card flex flex-col gap-2 p-5">
                <Skeleton variant="rounded" width={64} height={24} />
                <Skeleton variant="text" width="80%" height={24} />
              </div>
            ))
          ) : filtered.length === 0 ? (
            <p className="col-span-full py-8 text-center text-sm text-gray-500 dark:text-gray-400">
              Kafedra tapılmadı.
            </p>
          ) : (
            filtered.map((c) => (
              <div
                key={c.cafedra_code}
                className="surface-card flex flex-col gap-2 p-5"
              >
                <span className="inline-flex w-fit items-center rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs font-medium text-gray-600 dark:bg-white/5 dark:text-gray-300">
                  {c.cafedra_code}
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {c.cafedra_name}
                </p>
                {c.faculty_code && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Fakültə: {c.faculty_code}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-200 dark:hover:bg-white/5"
                  >
                    Redaktə et
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
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
