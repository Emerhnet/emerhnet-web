import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { AuthBootstrap } from "./features/auth/components/AuthBootstrap";

function App() {
  return (
    <AuthBootstrap>
      <RouterProvider router={router} />
    </AuthBootstrap>
  );
}

export default App;
