import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import SignupChoice from "./pages/SignupChoice";
import FarmerSignup from "./pages/FarmerSignup";
import CompanySignup from "./pages/CompanySignup";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import FarmerDashboard from "./pages/FarmerDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import CreateListing from "./pages/CreateListing";
import ViewOffers from "./pages/ViewOffers";
import AdminDashboard from "./pages/AdminDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/signup",
    Component: SignupChoice,
  },
  {
    path: "/signup/farmer",
    Component: FarmerSignup,
  },
  {
    path: "/signup/company",
    Component: CompanySignup,
  },
  {
    path: "/forgot-password",
    Component: ForgotPassword,
  },
  {
    path: "/verify-otp",
    Component: OTPVerification,
  },
  {
    path: "/farmer/dashboard",
    element: (
      <ProtectedRoute allowedUserTypes={['farmer']}>
        <FarmerDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/farmer/create-listing",
    element: (
      <ProtectedRoute allowedUserTypes={['farmer']}>
        <CreateListing />
      </ProtectedRoute>
    ),
  },
  {
    path: "/farmer/offers/:listingId",
    element: (
      <ProtectedRoute allowedUserTypes={['farmer']}>
        <ViewOffers />
      </ProtectedRoute>
    ),
  },
  {
    path: "/company/dashboard",
    element: (
      <ProtectedRoute allowedUserTypes={['company']}>
        <CompanyDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute allowedUserTypes={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
]);