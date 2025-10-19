import { MainLayout } from "../../../app/layouts";
import { BlueprintCanvas } from "../../../entities/task/ui";
import { Typography } from "../../../shared/ui";

export function BlueprintPage() {
  return (
    <MainLayout>
      <Typography variant="h4" component="h1" className="mb-4">
        Place your tasks on the blueprint
      </Typography>
      <BlueprintCanvas />
    </MainLayout>
  );
}
