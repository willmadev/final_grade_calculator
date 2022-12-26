import React, { FC } from "react";
import styled from "styled-components";
import { Menu, Position } from "../../types/Menu";

const MenuItem = styled.a`
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
  padding: 5px;
  border-radius: 5px;
  position: absolute;
  top: ${(props) => `${props.pos.y + 5}px`};
  left: ${(props) => `${props.pos.x + 5}px`};
  z-index: 999;
`;

interface ContextMenuProps {
  menu: Menu;
  ref:
    | ((instance: HTMLElement | null) => void)
    | React.RefObject<HTMLElement>
    | null
    | undefined;
}

const ContextMenu: FC<ContextMenuProps> = React.forwardRef(({ menu }, ref) => {
  return (
    <StyledMenu pos={menu.position} ref={ref}>
      {menu.menuItems.map((menuItem, i) => {
        return (
          <MenuItem onClick={menuItem.onClick} key={i}>
            {menuItem.text}
          </MenuItem>
        );
      })}
    </StyledMenu>
  );
});

export default ContextMenu;
