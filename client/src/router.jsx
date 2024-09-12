import { lazy, Suspense } from "react";
import Loader from "./components/loader";
import { createBrowserRouter, Navigate } from "react-router-dom";

const App = lazy(() => import("./App"));
const Courses = lazy(() => import("./pages/courses"));
const LoginPage = lazy(() => import("./pages/loginPage"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const CourseView = lazy(() => import("./pages/courseView"));
const CourseEditor = lazy(() => import("./pages/courseEditor"));
const RegisterPage = lazy(() => import("./pages/registerPage"));
const GuestLayout = lazy(() => import("./pages/layout/GuestLayout"));
const DefaultLayout = lazy(() => import("./pages/layout/DefaultLayout"));

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: (
//       <Suspense fallback={<Loader />}>
//         <DefaultLayout />
//       </Suspense>
//     ),
//     children: [
//       {
//         path: "/app",
//         element: <App />,
//       },
//       {
//         path: "/dashboard",
//         element: <Dashboard />,
//       },
//       {
//         path: "/courses",
//         element: <Courses />,
//       },
//       {
//         path: "/courses/create",
//         element: <CourseEditor />,
//       }
//     ],
//   },
//   {
//     path: "/",
//     element: (
//       <Suspense fallback={<Loader />}>
//         <GuestLayout />
//       </Suspense>
//     ),
//     children: [
//       {
//         path: "/login",
//         element: <LoginPage />,
//       },
//       {
//         path: "/register",
//         element: <RegisterPage />,
//       },
//     ],
//   },
// ]);

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <DefaultLayout />
      </Suspense>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Navigate to="/" replace />,
      },
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/course/:id",
        element: <CourseEditor />,
      },
      {
        path: "/course/create",
        element: <CourseEditor />,
      },
      {
        path: "/course/view/:slug",
        element: <CourseView />,
      },
      // {
      //   path: "/home",
      //   element: <Home />,
      // },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <GuestLayout>
          <LoginPage />
        </GuestLayout>
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loader />}>
        <GuestLayout>
          <RegisterPage />
        </GuestLayout>
      </Suspense>
    ),
  },
]);
