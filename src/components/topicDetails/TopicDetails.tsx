import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import Label from "../form/Label";
import Select from "../form/Select";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import TextArea from "../form/input/TextArea";
import { RootState } from "../../redux/store";
import { updateTopic } from "../../services/topic/topic";
import {
    Tlo,
    createTlo,
    updateTlo,
    deleteTlo,
    getTloByTopicCode,
} from "../../services/tlo/tloService";

const typeOptions = [
    { value: "1", label: "Mühazirə" },
    { value: "2", label: "Məşğələ" },
    { value: "3", label: "Laboratoriya" },
    { value: "4", label: "Sərbəst iş" },
];

export default function TopicDetails() {
    const location = useLocation();
    const token = useSelector((state: RootState) => state.auth.token) || "";
    const state = (location.state || {}) as {
        topicName?: string;
        topicUrl?: string;
        topicType?: number;
        topicDesc?: string;
        topicResult?: string;
        topicCode?: string;
    };
    const topicCode = state.topicCode || "";

    // Editable topic fields.
    const [topicName, setTopicName] = useState(state.topicName || "");
    const [topicType, setTopicType] = useState<number>(state.topicType || 1);
    const [topicDesc, setTopicDesc] = useState(state.topicDesc || "");
    const [topicUrl, setTopicUrl] = useState(state.topicUrl || "");
    const [topicResult, setTopicResult] = useState(state.topicResult || "");
    const [saving, setSaving] = useState(false);

    // TLOs (topic learning outcomes).
    const [tlos, setTlos] = useState<Tlo[]>([]);
    const [tlosLoading, setTlosLoading] = useState(false);
    const [newTlo, setNewTlo] = useState("");
    const [addingTlo, setAddingTlo] = useState(false);
    const [editingCode, setEditingCode] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState("");

    const refreshTlos = async () => {
        if (!topicCode) return;
        setTlosLoading(true);
        const list = await getTloByTopicCode(topicCode);
        setTlos(list);
        setTlosLoading(false);
    };

    useEffect(() => {
        refreshTlos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topicCode]);

    const handleSaveTopic = async () => {
        if (!topicCode) {
            Swal.fire("Xəta!", "Mövzu kodu tapılmadı.", "error");
            return;
        }
        if (!topicName.trim()) {
            Swal.fire("Xəta!", "Mövzu adı boş ola bilməz.", "warning");
            return;
        }
        setSaving(true);
        const result = await updateTopic(
            {
                topic_code: topicCode,
                topic_name: topicName.trim(),
                topic_desc: topicDesc,
                topic_result: topicResult,
                topic_url: topicUrl,
                topic_type: topicType,
            },
            token
        );
        setSaving(false);
        if (result === "SUCCESS") {
            Swal.fire({
                icon: "success",
                title: "Yadda saxlanıldı",
                text: "Mövzu məlumatları yeniləndi.",
                timer: 1600,
                showConfirmButton: false,
            });
        } else {
            Swal.fire("Xəta!", "Mövzu yenilənə bilmədi.", "error");
        }
    };

    const handleAddTlo = async () => {
        if (!newTlo.trim()) return;
        setAddingTlo(true);
        const result = await createTlo({ topic_code: topicCode, tlo_content: newTlo.trim() });
        setAddingTlo(false);
        if (result === "SUCCESS") {
            setNewTlo("");
            refreshTlos();
        } else {
            Swal.fire("Xəta!", "Təlim nəticəsi əlavə edilə bilmədi.", "error");
        }
    };

    const handleSaveTloEdit = async (tloCode: string) => {
        if (!editingContent.trim()) return;
        const result = await updateTlo({ tlo_code: tloCode, tlo_content: editingContent.trim() });
        if (result === "SUCCESS") {
            setEditingCode(null);
            setEditingContent("");
            refreshTlos();
        } else {
            Swal.fire("Xəta!", "Təlim nəticəsi yenilənə bilmədi.", "error");
        }
    };

    const handleDeleteTlo = async (tloCode: string) => {
        const confirm = await Swal.fire({
            icon: "warning",
            title: "Silinsin?",
            text: "Bu təlim nəticəsi silinəcək.",
            showCancelButton: true,
            confirmButtonText: "Bəli, sil",
            cancelButtonText: "Ləğv et",
            confirmButtonColor: "#dc2626",
        });
        if (!confirm.isConfirmed) return;
        const result = await deleteTlo(tloCode);
        if (result === "SUCCESS") {
            refreshTlos();
        } else {
            Swal.fire("Xəta!", "Təlim nəticəsi silinə bilmədi.", "error");
        }
    };

    return (
        <>
            <div className="flex justify-between items-start w-full gap-4">
                <div style={{ width: "calc((100% / 2) - 20px)" }}>
                    <Label>Mövzu adı</Label>
                    <Input value={topicName} onChange={(e) => setTopicName(e.target.value)} />
                </div>
                <div style={{ width: "calc((100% / 2) - 20px)" }}>
                    <Label>Mövzu tipi</Label>
                    <Select
                        options={typeOptions}
                        defaultValue={String(topicType)}
                        onChange={(value) => setTopicType(Number(value))}
                    />
                </div>
            </div>

            <div className="flex justify-between items-start w-full gap-4 mt-4">
                <div style={{ width: "calc((100% / 2) - 20px)" }}>
                    <Label>Mövzu deskripsiyası</Label>
                    <TextArea
                        placeholder="Mövzu deskripsiyası"
                        value={topicDesc}
                        onChange={(value) => setTopicDesc(value)}
                    />
                </div>
                <div style={{ width: "calc((100% / 2) - 20px)" }}>
                    <Label>Mövzu linki</Label>
                    <Input value={topicUrl} onChange={(e) => setTopicUrl(e.target.value)} />
                </div>
            </div>

            <div className="w-full mt-4">
                <Label>Mövzunun nəticəsi</Label>
                <TextArea
                    placeholder="Mövzunun nəticəsi"
                    value={topicResult}
                    onChange={(value) => setTopicResult(value)}
                />
            </div>

            <div className="flex justify-end items-center mt-4">
                <Button disabled={saving} onClick={handleSaveTopic}>
                    {saving ? "Yadda saxlanılır..." : "Yadda saxla"}
                </Button>
            </div>

            {/* TLO management */}
            <div className="mt-8 border-t border-gray-100 pt-6 dark:border-white/5">
                <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
                    Mövzunun təlim nəticələri
                </h3>

                {tlosLoading ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Yüklənir...</p>
                ) : tlos.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hələ təlim nəticəsi əlavə edilməyib.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {tlos.map((tlo) => (
                            <li
                                key={tlo.tlo_code}
                                className="rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-gray-900"
                            >
                                {editingCode === tlo.tlo_code ? (
                                    <div className="space-y-2">
                                        <TextArea
                                            value={editingContent}
                                            onChange={(value) => setEditingContent(value)}
                                        />
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingCode(null);
                                                    setEditingContent("");
                                                }}
                                            >
                                                Ləğv et
                                            </Button>
                                            <Button size="sm" onClick={() => handleSaveTloEdit(tlo.tlo_code)}>
                                                Yadda saxla
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between gap-3">
                                        <p className="flex-1 text-sm text-gray-800 dark:text-gray-200">
                                            {tlo.tlo_content}
                                        </p>
                                        <div className="flex flex-shrink-0 gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setEditingCode(tlo.tlo_code);
                                                    setEditingContent(tlo.tlo_content || "");
                                                }}
                                            >
                                                Düzəliş et
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDeleteTlo(tlo.tlo_code)}
                                            >
                                                Sil
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Add new TLO */}
                <div className="mt-4">
                    <Label>Yeni təlim nəticəsi</Label>
                    <TextArea
                        placeholder="Təlim nəticəsi"
                        value={newTlo}
                        onChange={(value) => setNewTlo(value.charAt(0).toUpperCase() + value.slice(1))}
                    />
                    <div className="mt-2 flex justify-end">
                        <Button disabled={addingTlo || !newTlo.trim()} onClick={handleAddTlo}>
                            {addingTlo ? "Əlavə edilir..." : "Əlavə et"}
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
