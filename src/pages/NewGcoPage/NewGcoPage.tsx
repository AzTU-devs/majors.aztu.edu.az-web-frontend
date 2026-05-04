import NewGco from "../../components/newGco/NewGco";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewGcoPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Məzunların Karyera İmkanları" />
            <div className="space-y-6">
                <ComponentCard title="Məzunların Karyera İmkanları">
                    <NewGco />
                </ComponentCard>
            </div>
        </>
    );
}
