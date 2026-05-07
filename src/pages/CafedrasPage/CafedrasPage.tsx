import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Cafedras from "../../components/cafedras/Cafedras";

export default function CafedrasPage() {
  return (
    <>
      <PageMeta title="AzTU Kafedralar" description="AzTU Kafedralar" />
      <PageBreadcrumb pageTitle="Kafedralar" />
      <div className="space-y-6">
        <ComponentCard title="Kafedralar">
          <Cafedras />
        </ComponentCard>
      </div>
    </>
  );
}
