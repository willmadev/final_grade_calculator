import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import React from "react";
import styled from "styled-components";
import CalculatorMenu from "../../Components/CalculatorMenu/CalculatorMenu";
import { fetchApi } from "../../utils/fetchApi";

const StyledCalculatorLayout = styled.div`
  width: 800px;
  height: 100%;
  max-width: 80vw;
  display: grid;
  grid-template-columns: 1fr 3fr;
  background-color: #f5faff;
  border-radius: 20px;
  box-shadow: 4px 4px 15px rgba(80, 80, 80, 0.15);
`;

export const Route = createFileRoute("/course/_layout")({
  component: () => (
    <StyledCalculatorLayout>
      <CalculatorMenu />
      <Outlet />
    </StyledCalculatorLayout>
  ),
  beforeLoad: async () => {
    try {
      const userInfo = await fetchApi("/auth/user-info", "GET");
    } catch (err) {
      throw redirect({ to: "/auth/register" });
    }
  },
});
