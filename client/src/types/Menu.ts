export interface Position {
  x: number;
  y: number;
}

export interface MenuItem {
  text: string;
  onClick: () => void;
}

export interface Menu {
  menuItems: MenuItem[];
  position: Position;
}

export type MenuState =
  | {
      isOpen: false;
    }
  | { isOpen: true; menu: Menu };
