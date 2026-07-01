import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Admins from "../../components/admins/Admins";

export default function AdminsPage() {
  return (
    <>
      <PageMeta title="AzTU Adminlər" description="Admin profillərinin idarə edilməsi" />
      <PageBreadcrumb pageTitle="Adminlər" />
      <div className="space-y-6">
        <ComponentCard title="Adminlər" desc="Admin profillərini idarə edin.">
          <Admins />
        </ComponentCard>
      </div>
    </>
  );
}
