import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import NewCompetency from "../../components/newCompetency/NewCompetency";

export default function NewCompetencyPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Məzunların Karyera İmkanları" />
            <div className="space-y-6">
                <ComponentCard title="Məzunların Karyera İmkanları">
                    <NewCompetency />
                </ComponentCard>
            </div>
        </>
    );
}
