import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Specialties from "../../components/specialties/Specialties";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function SpecialtiesPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Major" />
            <div className="space-y-6">
                <ComponentCard title="Major">
                    <Specialties />
                </ComponentCard>
            </div>
        </>
    );
}
