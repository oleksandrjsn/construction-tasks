import { useMemo } from "react";
import { MainLayout } from "../../../app/layouts";
import { useTasks } from "../../../entities/task";
import { useAuth } from "../../../entities/user/model/useAuth";
import { Chip, IconButton, Typography } from "../../../shared/ui";

type ChipVariant = "default" | "primary" | "success" | "warning" | "error";

// Helper function to get chip variant based on task status
const getStatusChipVariant = (status: string): ChipVariant => {
  switch (status) {
    case "completed":
    case "done":
      return "success";
    case "in_progress":
      return "primary";
    case "blocked":
      return "error";
    case "not_started":
      return "default";
    case "final_check":
      return "warning";
    default:
      return "default";
  }
};

// Helper function to format status text for display
const formatStatusText = (status: string): string => {
  return status.replace("_", " ").toUpperCase();
};

export function DashboardPage() {
  const { user } = useAuth();

  const { tasks } = useTasks(user?.id);

  const metrics = useMemo(() => {
    return tasks.reduce(
      (acc, task) => {
        if (task.status === "completed") {
          acc.completed += 1;
        } else if (task.status === "in_progress") {
          acc.active += 1;
        } else if (task.status === "not_started") {
          acc.notStarted += 1;
        } else if (task.status === "blocked") {
          acc.blocked += 1;
        }
        return acc;
      },
      { completed: 0, active: 0, notStarted: 0, blocked: 0 }
    );
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return tasks
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [tasks]);

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <Typography variant="h1" color="primary">
            Dashboard
          </Typography>
          <Typography variant="body1" color="muted" className="mt-2">
            Welcome to your construction tasks dashboard
          </Typography>
        </div>

        {/* Stats Cards */}
        <div className="flex gap-4">
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <Typography variant="h3" color="primary" className="mb-2">
              {metrics.active}
            </Typography>
            <Typography variant="body1" color="muted">
              Active Tasks
            </Typography>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <Typography variant="h3" color="success" className="mb-2">
              {metrics.completed}
            </Typography>
            <Typography variant="body1" color="muted">
              Completed Tasks
            </Typography>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <Typography variant="h3" color="warning" className="mb-2">
              {metrics.notStarted}
            </Typography>
            <Typography variant="body1" color="muted">
              Not Started
            </Typography>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-6">
            <Typography variant="h3" color="error" className="mb-2">
              {metrics.blocked}
            </Typography>
            <Typography variant="body1" color="muted">
              Blocked Tasks
            </Typography>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <Typography variant="h4" color="primary">
              Recent Tasks
            </Typography>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <Typography
                      variant="body1"
                      color="primary"
                      className="font-medium"
                    >
                      Task {index}: {task.title}
                    </Typography>
                    <Typography variant="body2" color="muted">
                      Last updated: {new Date(task.updatedAt).toLocaleString()}
                    </Typography>
                  </div>
                  <IconButton></IconButton>
                  <Chip variant={getStatusChipVariant(task.status)}>
                    {formatStatusText(task.status)}
                  </Chip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
