import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SubjectMatchingTable from "../../components/subjectMathingTable/SubjectMatchingTable";

export default function SubjectMatchingTablePage() {
    const location = useLocation();
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Subject correspondence table " />
            <div className="space-y-6">
                <ComponentCard title={`Subject correspondence table ( ${specialtyName}-${specialtyCode} )`} isNew={true} state={{ specialtyCode, specialtyName }} path="/specialty-details/subjects/new">
                    <SubjectMatchingTable />
                </ComponentCard>
            </div>
        </>
    );
}
