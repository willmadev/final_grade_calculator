import { createFileRoute } from "@tanstack/react-router";
import Auth from "../../Components/Auth";

export const Route = createFileRoute("/auth/login")({
  component: () => <Auth page="login" />,
});
