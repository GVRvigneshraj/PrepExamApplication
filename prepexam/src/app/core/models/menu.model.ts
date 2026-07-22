export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  children?: MenuItem[];
  permission?: string;
  isHidden?: boolean;
  badge?: number;
}

export interface SidebarMenu {
  items: MenuItem[];
  role: string;
}
