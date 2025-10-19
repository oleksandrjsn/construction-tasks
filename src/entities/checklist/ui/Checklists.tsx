import { Accordion } from "../../../shared/ui";
import { useAuth } from "../../user/model/useAuth";
import { useChecklists } from "../model/useChecklists";
import { ChecklistDetail } from "./ChecklistDetail";

interface ChecklistsProps {
  taskId: string;
}

export const Checklists = ({ taskId }: ChecklistsProps) => {
  const { user } = useAuth();

  const { checklists } = useChecklists(user?.id, taskId);

  const accordionContent = checklists.map((checklist) => {
    return {
      id: checklist.id,
      title: "Checklist",
      content: (
        <ChecklistDetail
          title={checklist.title || ""}
          checkListId={checklist.id}
          taskId={taskId}
          userId={user?.id}
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
