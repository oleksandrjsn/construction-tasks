import { Link } from "react-router-dom";
import { Typography } from "../../../shared/ui";
import { USER_MENU_ITEMS } from "../../../shared/config/navigation";

interface User {
  id: string;
  name: string;
}

interface UserMenuProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const UserMenu = ({
  user,
  isOpen,
  onClose,
  onLogout,
}: UserMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-100">
          <Typography variant="body2" color="primary" className="font-medium">
            {user.name}
          </Typography>
          <Typography variant="caption" color="muted">
            ID: {user.id}
          </Typography>
        </div>

        {USER_MENU_ITEMS.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            onClick={onClose}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {item.label}
          </Link>
        ))}

        <div className="border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
