import { BulkUploadZone } from "@/features/registration/components/BulkUploadZone";

const RegistrationPage = () => {
  return (
    <div className="container py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Beneficiary Registration</h1>
        <p className="text-muted-foreground mt-2">
          Upload spreadsheets (CSV or Excel) to bulk register new beneficiaries.
        </p>
      </div>

      <BulkUploadZone />
    </div>
  );
};

export default RegistrationPage;
