import React from "react";
import Navbar from "./components/components_lite/Navbar";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/components_lite/Home";
import PrivacyPolicy from "./components/components_lite/PrivacyPolicy.jsx";
import TermsofService from "./components/components_lite/TermsofService.jsx";
import Jobs from "./components/components_lite/Jobs.jsx";
import Browse from "./components/components_lite/Browse.jsx";
import Profile from "./components/components_lite/Profile.jsx";
import Description from "./components/components_lite/Description.jsx";
import StudentDashboard from "./components/components_lite/StudentDashboard.jsx";
import Companies from "./components/admincomponent/Companies";
import CompanyCreate from "./components/admincomponent/CompanyCreate";
import CompanySetup from "./components/admincomponent/CompanySetup";
import AdminJobs from "./components/admincomponent/AdminJobs.jsx";
import PostJob from "./components/admincomponent/PostJob";
import Applicants from "./components/admincomponent/Applicants";
import RecruiterDashboard from "./components/admincomponent/RecruiterDashboard.jsx";
import ProtectedRoute from "./components/admincomponent/ProtectedRoute";
import Creator from "./components/creator/Creator.jsx";
import NotFound from "./components/components_lite/NotFound.jsx";
import SavedJobs from "./components/components_lite/SavedJobs.jsx";
import ForgotPassword from "./components/components_lite/ForgotPassword.jsx";
import AdminPanel from "./components/admincomponent/AdminPanel.jsx";
import ChatPage from "./components/components_lite/ChatPage.jsx";
import InterviewScheduler from "./components/components_lite/InterviewScheduler.jsx";
import ResumeBuilder from "./components/components_lite/ResumeBuilder.jsx";
import ApplicationTimeline from "./components/components_lite/ApplicationTimeline.jsx";
import SalaryInsights from "./components/components_lite/SalaryInsights.jsx";
import CompanyReviews from "./components/components_lite/CompanyReviews.jsx";
import SkillAssessment from "./components/components_lite/SkillAssessment.jsx";
import ReferralSystem from "./components/components_lite/ReferralSystem.jsx";
import VideoIntro from "./components/components_lite/VideoIntro.jsx";
import JobRecommendations from "./components/components_lite/JobRecommendations.jsx";
import RecruiterVideoPosts from "./components/components_lite/RecruiterVideoPosts.jsx";

const appRouter = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/description/:id",
    element: <Description />,
  },
  {
    path: "/Profile",
    element: <Profile />,
  },
  {
    path: "/PrivacyPolicy",
    element: <PrivacyPolicy />,
  },
  {
    path: "/TermsofService",
    element: <TermsofService />,
  },
  {
    path: "/Jobs",
    element: <Jobs />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/Browse",
    element: <Browse />,
  },
  {
    path:"/Creator",
    element: <Creator/>
  },
  {
    path: "/dashboard",
    element: <StudentDashboard />,
  },
  {
    path: "/saved-jobs",
    element: <SavedJobs />,
  },

  // /admin
  {
    path: "/admin/companies",
    element: (
      <ProtectedRoute>
        <Companies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/create",
    element: (
      <ProtectedRoute>
        <CompanyCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/companies/:id",
    element: (
      <ProtectedRoute>
        <CompanySetup />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs",
    element: (
      <ProtectedRoute>
        <AdminJobs />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/create",
    element: (
      <ProtectedRoute>
        <PostJob />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: (
      <ProtectedRoute>
        <Applicants />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute>
        <RecruiterDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/panel",
    element: (
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    ),
  },
  {
    path: "/chat",
    element: <ChatPage />,
  },
  {
    path: "/interviews",
    element: <InterviewScheduler />,
  },
  
  // Phase 6 Next-Level Features
  {
    path: "/resume-builder",
    element: <ResumeBuilder />,
  },
  {
    path: "/timeline",
    element: <ApplicationTimeline />,
  },
  {
    path: "/salary-insights",
    element: <SalaryInsights />,
  },
  {
    path: "/company-reviews",
    element: <CompanyReviews />,
  },
  {
    path: "/skill-assessment",
    element: <SkillAssessment />,
  },
  {
    path: "/refer-and-earn",
    element: <ReferralSystem />,
  },
  {
    path: "/video-intro",
    element: <VideoIntro />,
  },
  {
    path: "/jobs-for-you",
    element: <JobRecommendations />,
  },
  {
    path: "/video-jobs",
    element: <RecruiterVideoPosts />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <div>
      <RouterProvider router={appRouter}></RouterProvider>
    </div>
  );
}

export default App;
