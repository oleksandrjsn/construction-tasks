import { Typography } from "../../../shared/ui";

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

export const UserMenu = ({ user, isOpen, onLogout }: UserMenuProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
      <div className="py-1">
        <div className="px-4 py-2 border-b border-gray-100">
          <Typography variant="body2" color="primary" className="font-medium">
            {user.name}
          </Typography>
        </div>

        <div className="border-t border-gray-100">
          <button
            onClick={onLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};
