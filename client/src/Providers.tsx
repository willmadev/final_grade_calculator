import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ContextMenuProvider from "./Components/ContextMenu/ContextMenuProvider";
import { routeTree } from "./routeTree.gen";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const Providers = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ContextMenuProvider>
        <RouterProvider router={router} />
      </ContextMenuProvider>
    </QueryClientProvider>
  );
};

export default Providers;
