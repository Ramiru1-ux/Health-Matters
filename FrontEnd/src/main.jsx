import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import "./index.css";

/* Layouts */
import RootLayout from "./layout/root-layout.jsx";
import MainLayout from "./layout/main-layout.jsx";
import { ProtectedLayout } from "./layout/ProtectedLayout.jsx";

/* Landing */
import { LandingPage } from "./pages/Landing-page/LandingPage";

/* Login */
import SignInPage from "./pages/Login/sign-in.jsx";
import SignUpPage from "./pages/Login/sign-up.jsx";

/* Redux */
import { Provider } from "react-redux";
import { store } from "./store";

/* Clerk */
import { ClerkProvider } from "@clerk/clerk-react";

import ManagerOverview from "./pages/DashBoards/ManagerDashboard/test-overview.jsx";
import ManagerReferralSubmission from "./pages/DashBoards/ManagerDashboard/ManagerReferralSubmission.jsx";

/* ---------------- ADMIN DASHBOARD ---------------- */

import AdminDashboardLayout from "./pages/DashBoards/AdminDashboard/admin-dashboard-layout.jsx";
import { TestOverview } from "./pages/DashBoards/AdminDashboard/test-overview.jsx";
import { TestAnalytics } from "./pages/DashBoards/AdminDashboard/test-analytics.jsx";
import { TestServices } from "./pages/DashBoards/AdminDashboard/test-services.jsx";
import { TestFeature } from "./pages/DashBoards/AdminDashboard/test.jsx";
import { DebugAPI } from "./pages/DashBoards/AdminDashboard/debug-api.jsx";
import TestDiary from "./pages/DashBoards/AdminDashboard/test-diary.jsx";
import { TestUsers } from "./pages/DashBoards/AdminDashboard/test-users.jsx";
import { TestSettings } from "./pages/DashBoards/AdminDashboard/test-settings.jsx";

/* ---------------- EMPLOYEE DASHBOARD ---------------- */

import EmployeeDashboardLayout from "./pages/DashBoards/EmployeeDashboard/employee-dashboard-layout.jsx";
import { EmployeeTestOverview } from "./pages/DashBoards/EmployeeDashboard/test-overview.jsx";
import { EmployeeTestTasks } from "./pages/DashBoards/EmployeeDashboard/test-tasks.jsx";
import { EmployeeTestReports } from "./pages/DashBoards/EmployeeDashboard/test-reports.jsx";
import { EmployeeTestSchedule } from "./pages/DashBoards/EmployeeDashboard/test-schedule.jsx";
import { EmployeeTestProfile } from "./pages/DashBoards/EmployeeDashboard/test-profile.jsx";

/* ---------------- PRACTITIONER DASHBOARD ---------------- */

import PractitionerDashboardLayout from "./pages/DashBoards/PractitionerDashboard/practitioner-dashboard-layout.jsx";
import { PractitionerTestOverview } from "./pages/DashBoards/PractitionerDashboard/test-overview.jsx";
import { PractitionerTestPatients } from "./pages/DashBoards/PractitionerDashboard/test-patients.jsx";
import { PractitionerTestReviews } from "./pages/DashBoards/PractitionerDashboard/test-reviews.jsx";
import { PractitionerTestAppointments } from "./pages/DashBoards/PractitionerDashboard/test-appointments.jsx";
import { PractitionerTestProfile } from "./pages/DashBoards/PractitionerDashboard/test-profile.jsx";

/* ---------------- MANAGER DASHBOARD ---------------- */

import ManagerDashboardLayout from "./pages/DashBoards/ManagerDashboard/manager-dashboard-layout.jsx";
import ManagerTestTeam from "./pages/DashBoards/ManagerDashboard/test-team.jsx";
import ManagerTestInsights from "./pages/DashBoards/ManagerDashboard/test-insights.jsx";
import ManagerTestProfile from "./pages/DashBoards/ManagerDashboard/test-profile.jsx";
import ManagerTestBudget from "./pages/DashBoards/ManagerDashboard/test-budget.jsx";

/* ---------------- CLERK CONFIG ---------------- */

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk publishable key");
}

/* ---------------- CLERK + ROUTER WRAPPER ---------------- */

const ClerkWithRoutes = () => {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      signInForceRedirectUrl="/"
      signUpForceRedirectUrl="/"
    >
      <Routes>

        <Route element={<RootLayout />}>

          {/* AUTH */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />

          {/* LANDING */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          {/* PROTECTED ROUTES */}
          <Route element={<ProtectedLayout />}>

            {/* ---------------- ADMIN ---------------- */}
            <Route path="/admin/dashboard" element={<AdminDashboardLayout />}>

              <Route index element={<TestOverview />} />
              <Route path="analytics" element={<TestAnalytics />} />
              <Route path="services" element={<TestServices />} />
              <Route path="referrals" element={<TestFeature />} />
              <Route path="debug" element={<DebugAPI />} />
              <Route path="diary" element={<TestDiary />} />
              <Route path="users" element={<TestUsers />} />
              <Route path="settings" element={<TestSettings />} />

            </Route>

            {/* ---------------- EMPLOYEE ---------------- */}
            <Route path="/employee/dashboard" element={<EmployeeDashboardLayout />}>

              <Route index element={<EmployeeTestOverview />} />
              <Route path="tasks" element={<EmployeeTestTasks />} />
              <Route path="reports" element={<EmployeeTestReports />} />
              <Route path="schedule" element={<EmployeeTestSchedule />} />
              <Route path="profile" element={<EmployeeTestProfile />} />

            </Route>

            {/* ---------------- PRACTITIONER ---------------- */}
            <Route path="/practitioner/dashboard" element={<PractitionerDashboardLayout />}>

              <Route index element={<PractitionerTestOverview />} />
              <Route path="patients" element={<PractitionerTestPatients />} />
              <Route path="reviews" element={<PractitionerTestReviews />} />
              <Route path="appointments" element={<PractitionerTestAppointments />} />
              <Route path="profile" element={<PractitionerTestProfile />} />

            </Route>

            {/* ---------------- MANAGER ---------------- */}
            <Route path="/manager/dashboard" element={<ManagerDashboardLayout />}>

              <Route index element={<ManagerOverview />} />
              <Route path="team" element={<ManagerTestTeam />} />
              <Route path="referral" element={<ManagerReferralSubmission />} />
              <Route path="insights" element={<ManagerTestInsights />} />
              <Route path="budget" element={<ManagerTestBudget />} />
              <Route path="profile" element={<ManagerTestProfile />} />

            </Route>

          </Route>

        </Route>

      </Routes>
    </ClerkProvider>
  );
};

/* ---------------- APP RENDER ---------------- */

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ClerkWithRoutes />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);