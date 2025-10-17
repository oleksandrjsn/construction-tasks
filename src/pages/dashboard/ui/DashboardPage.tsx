import { MainLayout } from "../../../app/layouts";
import { Typography } from "../../../shared/ui";

export function DashboardPage() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <Typography variant="h3" color="primary" className="mb-2">
              12
            </Typography>
            <Typography variant="body1" color="muted">
              Active Tasks
            </Typography>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Typography variant="h3" color="success" className="mb-2">
              8
            </Typography>
            <Typography variant="body1" color="muted">
              Completed Tasks
            </Typography>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <Typography variant="h3" color="warning" className="mb-2">
              3
            </Typography>
            <Typography variant="body1" color="muted">
              Pending Review
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
              {[1, 2, 3].map((task) => (
                <div
                  key={task}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <Typography
                      variant="body1"
                      color="primary"
                      className="font-medium"
                    >
                      Task {task}: Foundation Inspection
                    </Typography>
                    <Typography variant="body2" color="muted">
                      Due: Tomorrow
                    </Typography>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    In Progress
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
