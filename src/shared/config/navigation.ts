// Navigation constants for the application

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    id: "blueprint",
    label: "Blueprint",
    href: "/blueprint",
  },
];

export const USER_MENU_ITEMS: NavigationItem[] = [
  {
    id: "profile",
    label: "Profile Settings",
    href: "/profile",
  },
  {
    id: "preferences",
    label: "Preferences",
    href: "/preferences",
  },
];
