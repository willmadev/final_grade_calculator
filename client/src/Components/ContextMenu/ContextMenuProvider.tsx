import React, {
  createContext,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { MenuItem, MenuState } from "../../types/Menu";
import ContextMenu from "./ContextMenu";

interface ContextMenuContextType {
  setContextMenu: (e: React.MouseEvent<any>, menuItems: MenuItem[]) => void;
}
export const ContextMenuContext = createContext<ContextMenuContextType>({
  setContextMenu: () => {},
});

interface ContextMenuProviderProps {
  children: React.ReactNode;
}
const ContextMenuProvider: FC<ContextMenuProviderProps> = ({ children }) => {
  const [menuState, setMenuState] = useState<MenuState>({
    isOpen: false,
  });
  const setContextMenu = useCallback(
    (e: React.MouseEvent, menuItems: MenuItem[]) => {
      e.preventDefault();
      setMenuState({
        isOpen: true,
        menu: { menuItems, position: { x: e.clientX, y: e.clientY } },
      });
    },
    []
  );

  const menuRef = useRef<HTMLElement>(null);

  // handle click
  const handleClickEvent = useCallback(
    (e: MouseEvent) => {
      if (
        menuState.isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as HTMLElement)
      ) {
        setMenuState({ isOpen: false });
      }
    },
    [menuState]
  );

  // handle context menu change
  useEffect(() => {
    document.addEventListener("click", handleClickEvent);
    return () => {
      document.removeEventListener("click", handleClickEvent);
    };
  }, [handleClickEvent]);

  return (
    <ContextMenuContext.Provider value={{ setContextMenu }}>
      {children}
      {menuState.isOpen ? (
        <ContextMenu
          menu={menuState.menu}
          setMenuState={setMenuState}
          ref={menuRef}
        />
      ) : null}
    </ContextMenuContext.Provider>
  );
};

export default ContextMenuProvider;
