import { useAppStore } from "../../../app/store";
import { Accordion } from "../../../shared/ui";
import { useChecklists } from "../model/useChecklists";
import { ChecklistDetail } from "./ChecklistDetail";

interface ChecklistsProps {
  taskId: string;
}

export const Checklists = ({ taskId }: ChecklistsProps) => {
  const { currentUser } = useAppStore((state) => state);

  const { checklists } = useChecklists(currentUser?.id, taskId);

  const accordionContent = checklists.map((checklist) => {
    return {
      id: checklist.id,
      title: "Checklist",
      content: (
        <ChecklistDetail
          title={checklist.title || ""}
          checkListId={checklist.id}
          taskId={taskId}
          userId={currentUser?.id}
        />
      ),
      defaultOpen: true,
    };
  });

  return (
    <div>
      <Accordion items={accordionContent}></Accordion>
    </div>
  );
};
