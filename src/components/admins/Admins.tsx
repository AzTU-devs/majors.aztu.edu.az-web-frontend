import Swal from "sweetalert2";
import { useEffect, useState, useCallback } from "react";
import { Skeleton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { Modal } from "../ui/modal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../ui/table";
import {
  ManagedAdmin,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
} from "../../services/admin/adminService";

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("az-AZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

interface FormState {
  name: string;
  surname: string;
  email: string;
  fin_kod: string;
  password: string;
}

const emptyForm: FormState = {
  name: "",
  surname: "",
  email: "",
  fin_kod: "",
  password: "",
};

export default function Admins() {
  const [admins, setAdmins] = useState<ManagedAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<FormState>(emptyForm);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedAdmin | null>(null);
  const [editForm, setEditForm] = useState<FormState>(emptyForm);

  const refresh = useCallback(async () => {
    setLoading(true);
    const list = await getAdmins();
    setAdmins(list);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const openCreate = () => {
    setCreateForm(emptyForm);
    setCreateOpen(true);
  };

  const handleCreate = async () => {
    const { name, surname, email, fin_kod, password } = createForm;
    if (!name.trim() || !surname.trim() || !email.trim() || !fin_kod.trim() || !password) {
      Swal.fire("Xəta!", "Bütün xanaları doldurun.", "warning");
      return;
    }

    setSubmitting(true);
    const result = await createAdmin({
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      fin_kod: fin_kod.trim(),
      password,
    });
    setSubmitting(false);

    if (result.status === "SUCCESS") {
      setCreateOpen(false);
      setCreateForm(emptyForm);
      Swal.fire({
        icon: "success",
        title: "Admin yaradıldı",
        text: `${name} ${surname}`,
        timer: 1600,
        showConfirmButton: false,
      });
      refresh();
    } else if (result.status === "CONFLICT" || result.status === "VALIDATION") {
      Swal.fire("Xəta!", result.message || "Əməliyyat yerinə yetirilə bilmədi.", "error");
    } else {
      Swal.fire("Xəta!", result.message || "Admin yaradıla bilmədi.", "error");
    }
  };

  const openEdit = (admin: ManagedAdmin) => {
    setEditing(admin);
    setEditForm({
      name: admin.name,
      surname: admin.surname,
      email: admin.email,
      fin_kod: admin.fin_kod,
      password: "",
    });
    setEditOpen(true);
  };

  const handleEdit = async () => {
    if (!editing) return;
    const { name, surname, email, password } = editForm;
    if (!name.trim() || !surname.trim() || !email.trim()) {
      Swal.fire("Xəta!", "Ad, soyad və email boş ola bilməz.", "warning");
      return;
    }

    setSubmitting(true);
    const result = await updateAdmin(editing.fin_kod, {
      name: name.trim(),
      surname: surname.trim(),
      email: email.trim(),
      ...(password ? { password } : {}),
    });
    setSubmitting(false);

    if (result === "SUCCESS") {
      setEditOpen(false);
      setEditing(null);
      Swal.fire({
        icon: "success",
        title: "Yeniləndi",
        text: `${name} ${surname}`,
        timer: 1500,
        showConfirmButton: false,
      });
      refresh();
    } else {
      Swal.fire("Xəta!", "Admin yenilənə bilmədi.", "error");
    }
  };

  const handleDelete = async (admin: ManagedAdmin) => {
    const confirm = await Swal.fire({
      icon: "warning",
      title: "Silinsin?",
      text: `${admin.name} ${admin.surname} (${admin.fin_kod}) silinəcək.`,
      showCancelButton: true,
      confirmButtonText: "Bəli, sil",
      cancelButtonText: "Ləğv et",
      confirmButtonColor: "#dc2626",
    });
    if (!confirm.isConfirmed) return;

    setBusy(admin.fin_kod);
    const result = await deleteAdmin(admin.fin_kod);
    setBusy(null);

    if (result.status === "SUCCESS") {
      Swal.fire({
        icon: "success",
        title: "Silindi",
        timer: 1400,
        showConfirmButton: false,
      });
      refresh();
    } else if (result.status === "FORBIDDEN") {
      Swal.fire("Xəta!", result.message || "Öz hesabınızı silə bilməzsiniz.", "error");
    } else {
      Swal.fire("Xəta!", result.message || "Admin silinə bilmədi.", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {loading ? "" : `Cəmi ${admins.length} admin`}
        </p>
        <Button size="sm" startIcon={<AddIcon fontSize="small" />} onClick={openCreate}>
          Yeni admin
        </Button>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="rounded" height={56} />
          ))}
        </div>
      ) : admins.length === 0 ? (
        <p className="py-12 text-center text-sm text-gray-500 dark:text-gray-400">
          Admin tapılmadı.
        </p>
      ) : (
        <div className="surface-card overflow-x-auto p-0">
          <Table className="text-left">
            <TableHeader>
              <TableRow className="border-b border-gray-200 dark:border-white/10">
                <TableCell isHeader className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ad
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Soyad
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Email
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  FIN
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Yaradılma tarixi
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Əməliyyatlar
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow
                  key={admin.fin_kod}
                  className="border-b border-gray-100 last:border-0 dark:border-white/5"
                >
                  <TableCell className="px-5 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {admin.name}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {admin.surname}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {admin.email}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm font-mono text-gray-600 dark:text-gray-400">
                    {admin.fin_kod}
                  </TableCell>
                  <TableCell className="px-5 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(admin.created_at)}
                  </TableCell>
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={busy === admin.fin_kod}
                        startIcon={<EditIcon fontSize="small" />}
                        onClick={() => openEdit(admin)}
                      >
                        Redaktə et
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={busy === admin.fin_kod}
                        startIcon={<DeleteOutlineIcon fontSize="small" />}
                        onClick={() => handleDelete(admin)}
                      >
                        Sil
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Create modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => !submitting && setCreateOpen(false)}
        className="max-w-xl m-4 p-6 sm:p-8"
      >
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Yeni admin
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="admin-name">Ad</Label>
            <Input
              id="admin-name"
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="admin-surname">Soyad</Label>
            <Input
              id="admin-surname"
              type="text"
              value={createForm.surname}
              onChange={(e) => setCreateForm({ ...createForm, surname: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="admin-email">Email</Label>
            <Input
              id="admin-email"
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="admin-fin">FIN kod</Label>
            <Input
              id="admin-fin"
              type="text"
              maxLength={7}
              value={createForm.fin_kod}
              onChange={(e) =>
                setCreateForm({
                  ...createForm,
                  fin_kod: e.target.value.toUpperCase().slice(0, 7),
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="admin-password">Şifrə</Label>
            <Input
              id="admin-password"
              type="password"
              value={createForm.password}
              onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            disabled={submitting}
            onClick={() => setCreateOpen(false)}
          >
            Ləğv et
          </Button>
          <Button disabled={submitting} onClick={handleCreate}>
            {submitting ? "Yaradılır..." : "Yarat"}
          </Button>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={editOpen}
        onClose={() => !submitting && setEditOpen(false)}
        className="max-w-xl m-4 p-6 sm:p-8"
      >
        <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
          Admini redaktə et
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="edit-name">Ad</Label>
            <Input
              id="edit-name"
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-surname">Soyad</Label>
            <Input
              id="edit-surname"
              type="text"
              value={editForm.surname}
              onChange={(e) => setEditForm({ ...editForm, surname: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="edit-fin">FIN kod</Label>
            <Input id="edit-fin" type="text" value={editForm.fin_kod} disabled />
          </div>
          <div>
            <Label htmlFor="edit-password">Yeni şifrə</Label>
            <Input
              id="edit-password"
              type="password"
              placeholder="Dəyişməmək üçün boş buraxın"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-8 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            disabled={submitting}
            onClick={() => setEditOpen(false)}
          >
            Ləğv et
          </Button>
          <Button disabled={submitting} onClick={handleEdit}>
            {submitting ? "Yadda saxlanılır..." : "Yadda saxla"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
