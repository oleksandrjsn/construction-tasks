import { useRef } from "react";
import { TaskMarker, type TaskMarkerProps } from "./TaskMarker";

interface TaskLayerProps {
  markers: TaskMarkerProps[];
  onSelectTask: (taskId: string) => void;
  onCreateTask: (x: number, y: number) => void;
}

export const TaskLayer = ({
  markers,
  onSelectTask,
  onCreateTask,
}: TaskLayerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleLayerClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const target = event.target as HTMLElement;
    const currentTarget = event.currentTarget;
    const markerElement = target.closest("[data-task-id]") as HTMLElement;

    if (markerElement) {
      const taskId = markerElement.getAttribute("data-task-id");
      if (taskId) {
        onSelectTask(taskId);
        return;
      }
    }

    const rect = currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    onCreateTask(x, y);
  };

  return (
    <div
      ref={ref}
      data-task-layer
      className="w-full h-full relative"
      onClick={handleLayerClick}
    >
      {markers.map((marker) => (
        <TaskMarker key={marker.id} {...marker} />
      ))}
    </div>
  );
};
