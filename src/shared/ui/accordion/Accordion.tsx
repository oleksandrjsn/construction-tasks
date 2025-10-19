import { useRef } from "react";
import { ChevronDownIcon } from "../icons";
import { Typography } from "../typography";

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
  onItemToggle?: (itemId: string, isOpen: boolean) => void;
}

export interface AccordionItemProps {
  item: AccordionItemData;
  allowMultiple?: boolean;
  onToggle?: (itemId: string, isOpen: boolean) => void;
  className?: string;
}

export const AccordionItem = ({
  item,
  allowMultiple = true,
  onToggle,
  className = "",
}: AccordionItemProps) => {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const handleToggle = (event: React.SyntheticEvent<HTMLDetailsElement>) => {
    const target = event.target as HTMLDetailsElement;
    const isOpen = target.open;

    if (isOpen && !allowMultiple) {
      const allDetails = document.querySelectorAll(
        "details[data-accordion-item]"
      );
      allDetails.forEach((details) => {
        if (details !== event.target && details instanceof HTMLDetailsElement) {
          details.open = false;
        }
      });
    }

    onToggle?.(item.id, isOpen);
  };

  return (
    <details
      ref={detailsRef}
      data-accordion-item
      data-accordion-id={item.id}
      className={`group border border-gray-200 ${className}`}
      open={item.defaultOpen}
      onToggle={handleToggle}
    >
      <summary
        className={`
          flex items-center justify-between p-4 cursor-pointer
          hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset
          transition-colors duration-200 list-none
          ${
            item.disabled
              ? "opacity-50 cursor-not-allowed pointer-events-none"
              : ""
          }
          group-open:bg-gray-50 rounded-t-lg group-open:rounded-b-none
          [&::-webkit-details-marker]:hidden
        `}
      >
        <Typography variant="h3" component="span">
          {item.title}
        </Typography>
        <ChevronDownIcon
          size={20}
          className="text-gray-400 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <div className="border-t border-gray-200 bg-white rounded-b-lg">
        {item.content}
      </div>
    </details>
  );
};

export const Accordion = ({
  items,
  allowMultiple = false,
  className = "",
  onItemToggle,
}: AccordionProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          allowMultiple={allowMultiple}
          onToggle={onItemToggle}
        />
      ))}
    </div>
  );
};
