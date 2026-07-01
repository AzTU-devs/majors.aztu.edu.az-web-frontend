import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CloPloMatchingTable from "../../components/cloPloMatchingTable/CloPloMatchingTable";

export default function CloPloMatchingTablePage() {
    const location = useLocation();
    const { subjectName } = (location.state || {}) as { subjectName?: string };
    return (
        <>
            <PageMeta
                title="AzTU CLO-PLO uyğunluq cədvəli"
                description="Fənn təlim nəticələri (CLO) ilə proqram təlim nəticələrinin (PLO) uyğunluğu"
            />
            <PageBreadcrumb pageTitle="CLO-PLO uyğunluq cədvəli" />
            <div className="space-y-6">
                <ComponentCard
                    title={`CLO-PLO uyğunluq cədvəli${subjectName ? ` ( ${subjectName} )` : ""}`}
                >
                    <CloPloMatchingTable />
                </ComponentCard>
            </div>
        </>
    );
}
