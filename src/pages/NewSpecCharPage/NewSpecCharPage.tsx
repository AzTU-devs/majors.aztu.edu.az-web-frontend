import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import NewSpecChar from "../../components/newSpecChar/NewSpecChar";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewSpecCharPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Yeni ixtisas xarakteristikası" />
            <div className="space-y-6">
                <ComponentCard title="Yeni ixtisas xarakteristikası">
                    <NewSpecChar />
                </ComponentCard>
            </div>
        </>
    );
}
