import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import NewSpecialty from "../../components/newSpecialty/NewSpecialty";

export default function NewSpecialtyPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Yeni ixtisas" />
            <div className="space-y-6">
                <ComponentCard title="Yeni ixtisas">
                    <NewSpecialty />
                </ComponentCard>
            </div>
        </>
    );
}
