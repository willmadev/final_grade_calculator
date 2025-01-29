import {
  Outlet,
  createRootRoute,
  useLocation,
  useNavigate,
} from "@tanstack/react-router";
import { AuthObject, useAuth } from "../Components/Auth/AuthProvider";
import { FaCog } from "react-icons/fa";
import styled from "styled-components";

const SettingsButton = styled(FaCog)`
  position: absolute;
  top: 30px;
  right: 30px;
  font-size: 40px;

  &:hover {
    color: #888;
    cursor: pointer;
  }
`;

const Root = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSettingsClicked = (e: React.MouseEvent) => {
    navigate({ to: "/settings" });
  };

  return (
    <div className="main-container">
      <header>
        <h1>Final Grade Calculator</h1>
        {auth.isAuthenticated && location.pathname !== "/settings" && (
          <SettingsButton onClick={handleSettingsClicked} />
        )}
      </header>
      <div className="calculator-container">
        <Outlet />
      </div>
      <footer>
        <div>
          <p>
            Made By{" "}
            <a href="https://willma.me" target={"_blank"} rel={"noreferrer"}>
              Willma
            </a>
          </p>
        </div>
        <div>
          <p className="copyright">
            Copyright © {new Date().getFullYear()} Willma. All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
};

export const Route = createRootRoute({
  component: Root,
});
