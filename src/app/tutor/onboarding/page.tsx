import RoleGuard from "@components/RoleGuard";
import ShowcaseExpertisePage from "@pages/Tutor/ShowcaseExpertisePage";

export default function Page() {
  return (
    <RoleGuard allowedRoles={["instructor"]}>
      <ShowcaseExpertisePage />
    </RoleGuard>
  );
}
