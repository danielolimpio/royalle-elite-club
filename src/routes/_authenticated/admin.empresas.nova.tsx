import { createFileRoute } from "@tanstack/react-router";
import { CompanyForm } from "@/components/admin/CompanyForm";

export const Route = createFileRoute("/_authenticated/admin/empresas/nova")({
  component: () => <CompanyForm />,
});
