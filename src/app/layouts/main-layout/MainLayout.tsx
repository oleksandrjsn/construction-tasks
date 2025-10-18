import { useState } from "react";
import { Typography } from "../../../shared/ui";
import { useAppStore } from "../../store";
import { useAuth } from "../../../entities/user/model/useAuth";
import {
  MainNavigation,
  MobileNavigation,
  MobileMenuButton,
} from "../../../widgets/navigation";
import { UserMenu, UserProfile } from "../../../widgets/user-menu";

export interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const { currentUser, clearState } = useAppStore();
  const { logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    clearState();
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Typography variant="h5" color="primary" className="font-bold">
                Construction Tasks
              </Typography>
            </div>

            <MainNavigation className="hidden md:flex space-x-8" />

            <div className="flex items-center space-x-4">
              <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={toggleMobileMenu}
              />

              {currentUser && (
                <div className="relative">
                  <UserProfile user={currentUser} onClick={toggleUserMenu} />

                  <UserMenu
                    user={currentUser}
                    isOpen={isUserMenuOpen}
                    onClose={() => setIsUserMenuOpen(false)}
                    onLogout={handleLogout}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <MobileNavigation
          isOpen={isMobileMenuOpen}
          onItemClick={() => setIsMobileMenuOpen(false)}
        />
      </header>

      {(isUserMenuOpen || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-2 bg-black bg-opacity-25 md:hidden"
          onClick={() => {
            setIsUserMenuOpen(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
