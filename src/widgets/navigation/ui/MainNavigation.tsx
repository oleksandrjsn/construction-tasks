import { Link } from "react-router-dom";
import { MAIN_NAVIGATION } from "../../../shared/config/navigation";

interface MainNavigationProps {
  className?: string;
  onItemClick?: () => void;
}

export const MainNavigation = ({
  className = "",
  onItemClick,
}: MainNavigationProps) => {
  return (
    <nav className={className}>
      {MAIN_NAVIGATION.map((item) => (
        <Link
          key={item.id}
          to={item.href}
          onClick={onItemClick}
          className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
