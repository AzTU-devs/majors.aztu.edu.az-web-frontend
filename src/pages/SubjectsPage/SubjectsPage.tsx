import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import Subjects from "../../components/subjects/Subjects";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function SubjectsPage() {
    const location = useLocation();
    const { specialtyCode } = location.state as { specialtyCode: string };
    const { specialtyName } = location.state as { specialtyName: string };
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Subject information of the specialty " />
            <div className="space-y-6">
                <ComponentCard title={`Subject information of the specialty ( ${specialtyName}-${specialtyCode} )`} isNew={true} state={{ specialtyCode, specialtyName }} path="/specialty-details/subjects/new">
                    <Subjects />
                </ComponentCard>
            </div>
        </>
    );
}
