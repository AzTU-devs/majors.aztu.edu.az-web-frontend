import { useLocation } from "react-router";
import Topics from "../../components/topics/Topics";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function TopicsPage() {
    const location = useLocation();
    const { subjectCode } = location.state as { subjectCode: string };
    const { subjectName } = location.state as { subjectName: string };
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Subject topics" />
            <div className="space-y-6">
                <ComponentCard title={`Subject topics ( ${subjectName}-${subjectCode} )`} buttonTitle="Yeni mövzu" isNew={true} topicState={{ subjectCode, subjectName }} path="/specialty-details/subjects/topics/new">
                    <Topics />
                </ComponentCard>
            </div>
        </>
    );
}
