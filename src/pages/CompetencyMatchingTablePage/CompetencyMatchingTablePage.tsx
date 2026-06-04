import { useLocation } from "react-router";
import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import CompetencyMatchingTable from "../../components/competencyMatchingTable/CompetencyMatchingTable";

export default function CompetencyMatchingTablePage() {
    const location = useLocation();
    const { specialtyCode, specialtyName } = (location.state || {}) as {
        specialtyCode?: string;
        specialtyName?: string;
    };
    return (
        <>
            <PageMeta title="AzTU İxtisaslar" description="Səriştə uyğunluq cədvəli" />
            <PageBreadcrumb pageTitle="Səriştə uyğunluq cədvəli" />
            <div className="space-y-6">
                <ComponentCard title={`Səriştə uyğunluq cədvəli ( ${specialtyName ?? ""}-${specialtyCode ?? ""} )`}>
                    <CompetencyMatchingTable />
                </ComponentCard>
            </div>
        </>
    );
}
