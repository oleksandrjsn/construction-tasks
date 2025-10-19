import { useAppStore } from "../../../app/store";
import { useTasks } from "../model";
import blueprintImage from "../assets/blueprint.png";
import { TaskLayer } from "./TaskLayer";
import type { TaskMarkerProps } from "./TaskMarker";
import { TaskDialog } from "./TaskDialog";
import { useState } from "react";
import { Button, Dialog, Input } from "../../../shared/ui";
import { globalErrorHandler } from "../../../shared/lib/errors/GlobalErrorHandler";

interface NewTaskDialogState {
  isOpen: boolean;
  coordinates: {
    x: number;
    y: number;
  };
  title: string;
}

interface TaskDialogState {
  isOpen: boolean;
  taskId: string | null;
}

const defaultNewTaskDialogState: NewTaskDialogState = {
  isOpen: false,
  coordinates: { x: 0, y: 0 },
  title: "",
};

const defaultTaskDialogState: TaskDialogState = {
  isOpen: false,
  taskId: null,
};

export const BlueprintCanvas = () => {
  const [newTaskDialogState, setNewTaskDialogState] =
    useState<NewTaskDialogState>(defaultNewTaskDialogState);
  const [taskDialogState, setTaskDialogState] = useState<TaskDialogState>(
    defaultTaskDialogState
  );
  const { currentUser } = useAppStore((state) => state);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormTouched, setIsFormTouched] = useState(false);
  const [isModifyingTask, setIsModifyingTask] = useState(false);

  const { tasks, createTask, updateTask, deleteTask } = useTasks(
    currentUser?.id
  );

  const taskMarkers = tasks.map(
    (task): TaskMarkerProps => ({
      id: task.id,
      title: task.title,
      x: task.position.x,
      y: task.position.y,
      status: task.status,
    })
  );

  // Find selected task for dialog
  const selectedTask = tasks.find((task) => task.id === taskDialogState.taskId);

  const handleInitTaskCreation = (x: number, y: number) => {
    setNewTaskDialogState((current) => ({
      ...current,
      isOpen: true,
      coordinates: { x, y },
    }));
  };

  const handleChangeNewTaskForm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value, name } = event.target;
    setNewTaskDialogState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSelectTask = (taskId: string) => {
    setTaskDialogState({
      isOpen: true,
      taskId: taskId,
    });
  };

  const handleDeleteTask = async () => {
    const userId = currentUser?.id;
    const taskId = taskDialogState.taskId;
    if (!userId || !taskId) return;
    setIsModifyingTask(true);
    try {
      await deleteTask(userId, taskId);
      handleCloseTaskDialog();
    } catch (error) {
      globalErrorHandler.handleError(error);
    } finally {
      setIsModifyingTask(false);
    }
  };

  const handleCloseNewTaskDialog = () => {
    setNewTaskDialogState(defaultNewTaskDialogState);
  };

  const handleCloseTaskDialog = () => {
    setTaskDialogState(defaultTaskDialogState);
  };

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFormTouched(true);

    if (!newTaskDialogState.title.trim()) {
      return;
    }

    if (!currentUser) {
      return;
    }

    setIsLoading(true);
    try {
      await createTask({
        title: newTaskDialogState.title,
        userId: currentUser.id,
        position: {
          x: newTaskDialogState.coordinates.x,
          y: newTaskDialogState.coordinates.y,
        },
      });
      handleCloseNewTaskDialog();
    } catch (error) {
      globalErrorHandler.handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: string, title: string) => {
    const userId = currentUser?.id;
    if (!userId) return;

    setIsModifyingTask(true);

    try {
      await updateTask({
        userId,
        id: taskId,
        title: title,
      });
    } catch (error) {
      globalErrorHandler.handleError(error);
    } finally {
      setIsModifyingTask(false);
    }
  };

  return (
    <>
      <div className="relative flex">
        <img
          src={blueprintImage}
          width={3167}
          height={1840}
          alt="Construction plan"
          className="block max-w-full h-auto"
        />
        <div className="absolute inset-0">
          <TaskLayer
            markers={taskMarkers}
            onCreateTask={handleInitTaskCreation}
            onSelectTask={handleSelectTask}
          />
        </div>
      </div>
      <Dialog
        isOpen={newTaskDialogState.isOpen}
        onClose={handleCloseNewTaskDialog}
        title="Create New Task"
        size="md"
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Enter task title"
            value={newTaskDialogState.title}
            onBlur={() => setIsFormTouched(true)}
            name="title"
            onChange={handleChangeNewTaskForm}
            fullWidth
            disabled={isLoading}
            autoComplete="username"
            error={
              isFormTouched && !newTaskDialogState.title.trim()
                ? "Title is required"
                : undefined
            }
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            disabled={!newTaskDialogState.title.trim()}
            fullWidth
          >
            Create Task
          </Button>
        </form>
      </Dialog>

      {/* Task Details Dialog */}
      {selectedTask && (
        <TaskDialog
          isOpen={taskDialogState.isOpen}
          onClose={handleCloseTaskDialog}
          onDelete={handleDeleteTask}
          onEdit={handleUpdateTask}
          isLoading={isModifyingTask}
          taskId={selectedTask.id}
          title={selectedTask.title}
          status={selectedTask.status}
        />
      )}
    </>
  );
};
