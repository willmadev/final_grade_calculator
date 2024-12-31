import React, { FC } from "react";
import styled from "styled-components";
import { Menu, MenuState, Position } from "../../types/Menu";

const MenuItem = styled.a`
  padding: 2px 4px;
  border-radius: 2px;
  &:hover {
    cursor: pointer;
    background-color: #bdc4ca;
  }
`;

interface StyledMenuProps {
  pos: Position;
}
const StyledMenu = styled.nav<StyledMenuProps>`
  background-color: white;
  padding: 8px;
  border-radius: 5px;
  position: absolute;
  top: ${(props) => `${props.pos.y + 5}px`};
  left: ${(props) => `${props.pos.x + 5}px`};
  box-shadow: 2px 2px 15px rgba(80, 80, 80, 0.15);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

interface ContextMenuProps {
  menu: Menu;
  setMenuState: (value: React.SetStateAction<MenuState>) => void;
  ref:
    | ((instance: HTMLElement | null) => void)
    | React.RefObject<HTMLElement>
    | null
    | undefined;
}

const ContextMenu: FC<ContextMenuProps> = React.forwardRef(
  ({ menu, setMenuState }, ref) => {
    return (
      <StyledMenu pos={menu.position} ref={ref}>
        {menu.menuItems.map((menuItem, i) => {
          return (
            <MenuItem
              onClick={() => {
                setMenuState({ isOpen: false });
                menuItem.onClick();
              }}
              key={i}
            >
              {menuItem.text}
            </MenuItem>
          );
        })}
      </StyledMenu>
    );
  }
);

export default ContextMenu;
