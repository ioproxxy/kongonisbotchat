export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MenuItem {
  category: string;
  item: string;
  description?: string;
  price: string;
}

export interface MenuData {
  [category: string]: MenuItem[];
}