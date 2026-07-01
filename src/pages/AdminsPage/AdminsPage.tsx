import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Admins from "../../components/admins/Admins";
import Faculties from "../../components/faculties/Faculties";
import Cafedras from "../../components/cafedras/Cafedras";

export default function AdminsPage() {
  return (
    <>
      <PageMeta title="AzTU Adminlər" description="Admin profillərinin idarə edilməsi" />
      <PageBreadcrumb pageTitle="Adminlər" />
      <div className="space-y-6">
        <ComponentCard title="Adminlər" desc="Admin profillərini idarə edin.">
          <Admins />
        </ComponentCard>

        <ComponentCard title="Fakültələr" desc="Fakültə əlavə edin və mövcud fakültələrə baxın.">
          <Faculties />
        </ComponentCard>

        <ComponentCard title="Kafedralar" desc="Fakültəyə bağlı kafedra əlavə edin və mövcud kafedralara baxın.">
          <Cafedras />
        </ComponentCard>
      </div>
    </>
  );
}
