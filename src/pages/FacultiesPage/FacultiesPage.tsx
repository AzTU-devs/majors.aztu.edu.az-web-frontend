import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Faculties from "../../components/faculties/Faculties";

export default function FacultiesPage() {
  return (
    <>
      <PageMeta title="AzTU Fakültələr" description="AzTU Fakültələr" />
      <PageBreadcrumb pageTitle="Fakültələr" />
      <div className="space-y-6">
        <ComponentCard title="Fakültələr">
          <Faculties />
        </ComponentCard>
      </div>
    </>
  );
}
