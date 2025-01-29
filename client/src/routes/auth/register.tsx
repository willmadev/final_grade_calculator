import { createFileRoute } from "@tanstack/react-router";
import Auth from "../../Components/Auth";

export const Route = createFileRoute("/auth/register")({
  component: () => <Auth page="register" />,
});
