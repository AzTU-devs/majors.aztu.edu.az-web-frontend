import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import TopicDetails from "../../components/topicDetails/TopicDetails";

export default function TopicDetailsPage() {
    const location = useLocation();
    const { topicName } = location.state as { topicName: string };
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Mövzu məlumatları" />
            <div className="space-y-6">
                <ComponentCard title={`Mövzu məlumatları ( ${topicName} )`}>
                    <TopicDetails />
                </ComponentCard>
            </div>
        </>
    );
}
