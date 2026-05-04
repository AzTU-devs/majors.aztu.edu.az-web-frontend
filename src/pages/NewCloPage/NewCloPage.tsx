import NewClo from "../../components/newClo/NewClo";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewCloPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Yeni fənn təlim nəticəsi" />
            <div className="space-y-6">
                <ComponentCard title="Yeni fənn təlim nəticəsi">
                    <NewClo />
                </ComponentCard>
            </div>
        </>
    );
}
