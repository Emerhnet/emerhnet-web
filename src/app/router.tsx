import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { SignInPage } from "@/features/auth/pages/SignInPage";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";
import { SetPasswordPage } from "@/features/auth/pages/SetPasswordPage";
import { AccountLockedPage } from "@/features/auth/pages/AccountLockedPage";
import { RegistrationLayout } from "@/features/registration/pages/RegistrationLayout";
import { HospitalDetailsStep } from "@/features/registration/pages/HospitalDetailsStep";
import { AddressLocationStep } from "@/features/registration/pages/AddressLocationStep";
import { AdminContactStep } from "@/features/registration/pages/AdminContactStep";
import { DocumentsStep } from "@/features/registration/pages/DocumentsStep";
import { ReviewStep } from "@/features/registration/pages/ReviewStep";
import { SubmittedStep } from "@/features/registration/pages/SubmittedStep";
import { AppShell } from "@/shared/layouts/AppShell";
import { RequireAuth } from "@/shared/components/RequireAuth";
import { RequireRole } from "@/shared/components/RequireRole";
import { DashboardPage } from "@/features/super-admin/dashboard/DashboardPage";
import { PendingRegistrationsPage } from "@/features/super-admin/pending/PendingRegistrationsPage";
import { ReviewPage } from "@/features/super-admin/pending/ReviewPage";
import { HospitalsListPage } from "@/features/super-admin/hospitals/HospitalsListPage";
import { HospitalDetailPage } from "@/features/super-admin/hospitals/HospitalDetailPage";
import { InvitationsPage } from "@/features/super-admin/invitations/InvitationsPage";
import { DashboardPage as HospitalDashboardPage } from "@/features/hospital-admin/dashboard/DashboardPage";
import { HospitalProfilePage } from "@/features/hospital-admin/profile/HospitalProfilePage";
import { DepartmentsPage } from "@/features/hospital-admin/departments/DepartmentsPage";
import { DoctorsListPage } from "@/features/hospital-admin/doctors/DoctorsListPage";
import { BedsPage } from "@/features/hospital-admin/beds/BedsPage";
import { AmbulancesPage } from "@/features/hospital-admin/ambulances/AmbulancesPage";
import { BloodBankPage } from "@/features/hospital-admin/bloodbank/BloodBankPage";

const HospitalAuditLogPage = lazy(
  () => import("@/features/hospital-admin/audit-log/AuditLogPage"),
);
const HospitalExportsPage = lazy(
  () => import("@/features/hospital-admin/exports/ExportsPage"),
);

const AuditLogPage = lazy(
  () => import("@/features/super-admin/audit-log/AuditLogPage"),
);
const ExportsPage = lazy(
  () => import("@/features/super-admin/exports/ExportsPage"),
);

function LazyFallback() {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <CircularProgress />
    </Box>
  );
}

export const router = createBrowserRouter([
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/forgot-password", element: <ForgotPasswordPage /> },
  { path: "/set-password/:token", element: <SetPasswordPage /> },
  { path: "/account-locked", element: <AccountLockedPage /> },
  {
    path: "/register-hospital",
    element: <RegistrationLayout />,
    children: [
      { index: true, element: <HospitalDetailsStep /> },
      { path: "address", element: <AddressLocationStep /> },
      { path: "admin", element: <AdminContactStep /> },
      { path: "documents", element: <DocumentsStep /> },
      { path: "review", element: <ReviewStep /> },
      { path: "submitted", element: <SubmittedStep /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAuth>
        <RequireRole role="superAdmin">
          <AppShell />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <DashboardPage /> },
      { path: "pending", element: <PendingRegistrationsPage /> },
      { path: "pending/:id", element: <ReviewPage /> },
      { path: "hospitals", element: <HospitalsListPage /> },
      { path: "hospitals/:id", element: <HospitalDetailPage /> },
      { path: "invitations", element: <InvitationsPage /> },
      {
        path: "audit-log",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <AuditLogPage />
          </Suspense>
        ),
      },
      {
        path: "exports",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <ExportsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/hospital",
    element: (
      <RequireAuth>
        <RequireRole role="hospitalAdmin">
          <AppShell />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <HospitalDashboardPage /> },
      { path: "profile", element: <HospitalProfilePage /> },
      { path: "departments", element: <DepartmentsPage /> },
      { path: "doctors", element: <DoctorsListPage /> },
      { path: "beds", element: <BedsPage /> },
      { path: "ambulances", element: <AmbulancesPage /> },
      { path: "bloodbank", element: <BloodBankPage /> },
      {
        path: "audit-log",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <HospitalAuditLogPage />
          </Suspense>
        ),
      },
      {
        path: "exports",
        element: (
          <Suspense fallback={<LazyFallback />}>
            <HospitalExportsPage />
          </Suspense>
        ),
      },
    ],
  },
  { path: "/", element: <Navigate to="/sign-in" replace /> },
  { path: "*", element: <Navigate to="/sign-in" replace /> },
]);
