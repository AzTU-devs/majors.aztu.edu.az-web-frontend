import NewSlo from "../../components/newSlo/NewSlo";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function NewSloPage() {
    return (
        <>
            <PageMeta
                title="AzTU İxtisaslar"
                description="AzTU İxtisaslar"
            />
            <PageBreadcrumb pageTitle="Tələbələrin Təlim Nəticələri" />
            <div className="space-y-6">
                <ComponentCard title="Tələbələrin Təlim Nəticələri">
                    <NewSlo />
                </ComponentCard>
            </div>
        </>
    );
}
