import { createHashRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { I18nProvider } from "./i18n/index";
import "./index.css";
import App from "./App";
import Home from "./pages/Home";
import ClipPath from "./pages/ClipPath";
import Gradient from "./pages/Gradient";
import Shadow from "./pages/Shadow";
import BorderRadius from "./pages/BorderRadius";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "clip-path", element: <ClipPath /> },
      { path: "gradient", element: <Gradient /> },
      { path: "shadow", element: <Shadow /> },
      { path: "border-radius", element: <BorderRadius /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <I18nProvider><RouterProvider router={router} /></I18nProvider>
);
