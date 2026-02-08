import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Auth from "../pages/Auth";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import AsteroidDetails from "../pages/AsteroidDetails";
import AsteroidExplorer from "../pages/AsteroidExplorer";
import OTPVerification from "../pages/OTPVerification";
import PrivateRoute from "../components/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/explore",
        element: <AsteroidExplorer />,
      },
      {
        path: "/asteroid/:id",
        element: <AsteroidDetails />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/dashboard",
            element: <Dashboard />
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ]
      }
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    element: <ResetPassword />,
  },
  {
    path: "/verify-email",
    element: <OTPVerification />,
  },
]);

export default router;
