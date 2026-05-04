import PageMeta from "../../components/common/PageMeta";
import NewTopic from "../../components/newTopic/NewTopic";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewTopicPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Yeni mövzu" />
            <div className="space-y-6">
                <ComponentCard title="Yeni mövzu">
                    <NewTopic />
                </ComponentCard>
            </div>
        </>
    );
}
