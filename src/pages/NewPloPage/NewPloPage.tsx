import NewPlo from "../../components/newPlo/NewPlo";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewPloPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Proqram təlim məqsədləri" />
            <div className="space-y-6">
                <ComponentCard title="Proqram təlim məqsədləri">
                    <NewPlo />
                </ComponentCard>
            </div>
        </>
    );
}
