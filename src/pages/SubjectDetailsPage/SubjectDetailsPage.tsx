import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SubjectDeails from "../../components/subjectDetails/SubjectDetails";

export default function SubjectDetailsPage() {
    const location = useLocation();
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Fənn məlumatları " />
            <div className="space-y-6">
                <ComponentCard title={`Fənn məlumatları ( ${specialtyName}-${specialtyCode} )`} isNew={true} state={{ specialtyCode, specialtyName }} path="/specialty-details/subjects/new">
                    <SubjectDeails />
                </ComponentCard>
            </div>
        </>
    );
}
