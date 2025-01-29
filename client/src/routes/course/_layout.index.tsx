import {
  Outlet,
  createFileRoute,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import styled from "styled-components";

import { fetchApi } from "../../utils/fetchApi";
import React from "react";

const DefaultPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 30px 25px;
  text-align: center;
`;

const IndexRoute = () => {
  const location = useLocation();
  return (
    <DefaultPage>
      <h2>Final Grade Calculator</h2>
      <p>To begin, create or select a course from the side menu.</p>
    </DefaultPage>
  );
};

export const Route = createFileRoute("/course/_layout/")({
  component: IndexRoute,
});
