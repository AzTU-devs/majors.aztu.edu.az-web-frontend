import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import SubjectsSillabus from "../../components/subjectSillabus/SubjectsSillabus";

export default function SubjectsSillabusPage() {
    const location = useLocation();
    const { subjectCode } = location.state as { subjectCode: string };
    const { subjectName } = location.state as { subjectName: string };
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Fənn sillabusu " />
            <div className="space-y-6">
                <ComponentCard title={`Fənn sillabusu ( ${subjectName}-${subjectCode} )`} isNew={true} topicState={{ subjectCode, subjectName }} path="/specialty-details/subjects/new">
                    <SubjectsSillabus />
                </ComponentCard>
            </div>
        </>
    );
}
