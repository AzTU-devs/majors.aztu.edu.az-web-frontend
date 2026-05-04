import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import Literatures from "../../components/literatures/Literatures";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function LiteraturesPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Ədəbiyyatlar" />
            <div className="space-y-6">
                <ComponentCard title="Ədəbiyyatlar">
                    <Literatures />
                </ComponentCard>
            </div>
        </>
    );
}
