import type { TaskComputedStatus } from "../model";

export interface TaskMarkerProps {
  id: string;
  x: number;
  y: number;
  title: string;
  status: TaskComputedStatus;
}

const getStatusClasses = (status: TaskMarkerProps["status"]) => {
  switch (status) {
    case "not_started":
      return { fill: "fill-neutral-500", stroke: "stroke-neutral-800" };
    case "in_progress":
      return { fill: "fill-indigo-600", stroke: "stroke-indigo-900" };
    case "completed":
      return { fill: "fill-emerald-600", stroke: "stroke-emerald-900" };
    case "blocked":
      return { fill: "fill-rose-600", stroke: "stroke-rose-900" };
    default:
      return { fill: "fill-neutral-500", stroke: "stroke-neutral-800" };
  }
};

export const TaskMarker = ({ id, x, y, title, status }: TaskMarkerProps) => {
  const markerText = title.slice(0, 2).toUpperCase();
  const statusClasses = getStatusClasses(status);

  return (
    <div
      data-task-id={id}
      // percentage positions due to responsive scaling
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      className={`absolute cursor-pointer w-14 h-14 -translate-x-7 -translate-y-14 p-2 flex items-center justify-center`}
    >
      <svg
        className="max-w-full h-auto pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 800 800"
      >
        <path
          className={`${statusClasses.stroke} ${statusClasses.fill} stroke-2`}
          d="M610.219 87.06C552.161 29.029 476.088 0 399.989 0c-76.075 0-152.173 29.028-210.23 87.06-92.53 92.531-116.626 233.693-56.397 341.993C202.478 553.295 399.989 800 399.989 800s197.534-246.705 266.65-370.947c60.228-108.301 36.131-249.462-56.42-341.992Zm-210.23 390.821c-99.708 0-180.567-80.859-180.567-180.542 0-99.78 80.859-180.639 180.567-180.639 99.731 0 180.591 80.859 180.591 180.639 0 99.683-80.86 180.542-180.591 180.542Z"
        />
        <circle cx="408" cy="298" r="185" fill="#D9D9D9" />
        <text>
          <tspan x="285" y="360" fontSize="190" fontWeight="bold" fill="#000">
            {markerText}
          </tspan>
        </text>
      </svg>
    </div>
  );
};
