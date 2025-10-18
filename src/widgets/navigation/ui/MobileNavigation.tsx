import { Link } from "react-router-dom";
import { MAIN_NAVIGATION } from "../../../shared/config/navigation";

interface MobileNavigationProps {
  isOpen: boolean;
  onItemClick: () => void;
}

export const MobileNavigation = ({
  isOpen,
  onItemClick,
}: MobileNavigationProps) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-gray-200 bg-white">
      <nav className="px-4 py-2 space-y-1">
        {MAIN_NAVIGATION.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            onClick={onItemClick}
            className="block text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-base font-medium transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};
