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
