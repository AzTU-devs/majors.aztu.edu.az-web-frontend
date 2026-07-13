import PageMeta from "../../components/common/PageMeta";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import GeneralSubjects from "../../components/generalSubjects/GeneralSubjects";

export default function GeneralSubjectsPage() {
  return (
    <>
      <PageMeta title="AzTU Ümumi Fənlər" description="Ümumi fənlərin idarə edilməsi" />
      <PageBreadcrumb pageTitle="Ümumi Fənlər" />
      <div className="space-y-6">
        <ComponentCard
          title="Ümumi Fənlər"
          desc="Ümumi fənlər yaradın və başqa kafedraların ixtisaslarına təyin edin."
        >
          <GeneralSubjects />
        </ComponentCard>
      </div>
    </>
  );
}
