import { Typography } from "../../../shared/ui";

interface User {
  id: string;
  name: string;
}

interface UserProfileProps {
  user: User;
  onClick: () => void;
}

export const UserProfile = ({ user, onClick }: UserProfileProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
    >
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <Typography variant="caption" className="text-white font-medium">
          {user.name.charAt(0).toUpperCase()}
        </Typography>
      </div>
      <div className="hidden sm:block">
        <Typography variant="body2" color="primary" className="font-medium">
          {user.name}
        </Typography>
      </div>
      <svg
        className="h-4 w-4 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};
