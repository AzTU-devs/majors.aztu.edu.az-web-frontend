import PageMeta from "../../components/common/PageMeta";
import NewSubject from "../../components/newSubject/NewSubject";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewSubjectPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Yeni fənn" />
            <div className="space-y-6">
                <ComponentCard title="Yeni fənn">
                    <NewSubject />
                </ComponentCard>
            </div>
        </>
    );
}
