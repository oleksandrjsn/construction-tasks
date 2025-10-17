import { MainLayout } from "../../../app/layouts";
import { Typography } from "../../../shared/ui";

export function BlueprintPage() {
  return (
    <MainLayout>
      <div>
        <Typography variant="h1" color="primary">
          Blueprint
        </Typography>
        <Typography variant="body1" color="muted" className="mt-2">
          Construction task management interface
        </Typography>
      </div>
    </MainLayout>
  );
}
