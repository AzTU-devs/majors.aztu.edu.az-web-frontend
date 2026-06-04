import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Users from "../../components/users/Users";

export default function UsersPage() {
  return (
    <>
      <PageMeta title="AzTU İstifadəçilər" description="İstifadəçilərin idarə edilməsi və təsdiqi" />
      <PageBreadcrumb pageTitle="İstifadəçilər" />
      <div className="space-y-6">
        <ComponentCard title="İstifadəçilər" desc="Qeydiyyatdan keçən istifadəçiləri təsdiqləyin və ya rədd edin.">
          <Users />
        </ComponentCard>
      </div>
    </>
  );
}
