import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Layout from "./components/Layout";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import UserDetail from "./pages/UserDetail";
import SubCategory from "./pages/SubCategory";
import Specialization from "./pages/Specialization";
import Forbidden from "./pages/Forbidden";
import Unauthorized from "./pages/Unauthorized";
import Users from "./pages/Users";
import LogPage from "./pages/Log";
import Login from './pages/Login';
import Report from "./pages/Report";
import PostDetail from "./pages/PostDetail";
(function saveTokenFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  if (token) {
    sessionStorage.setItem("token", token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }
})();
function App() {


  return (
    <Router>
      <Routes>
        <Route
          path="/Forbidden"
          element={<Forbidden />}
        />
        <Route
          path="/Unauthorized"
          element={<Unauthorized />}
        />
        <Route
          path="/Login"
          element={<Login />}
        />

        <Route
          path="/"
          element={
            <AdminPrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/Report"
          element={
            <AdminPrivateRoute>
              <Layout>
                <Report />
              </Layout>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/category"
          element={
            <AdminPrivateRoute>
              <Layout>
                <Category />
              </Layout>
            </AdminPrivateRoute>
          }
        />
           <Route
          path="/PostDetail/:id"
          element={
            <AdminPrivateRoute>
              <Layout>
                <PostDetail />
              </Layout>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/userDetail/:id"
          element={
            <AdminPrivateRoute>
              <Layout>
                <UserDetail />
              </Layout>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/SubCategory"
          element={
            <AdminPrivateRoute>
              <Layout>
                <SubCategory />
              </Layout>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/Specialization"
          element={
            <AdminPrivateRoute>
              <Layout>
                <Specialization />
              </Layout>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/Users"
          element={
            <AdminPrivateRoute>
              <Layout>
                <Users />
              </Layout>
            </AdminPrivateRoute>
          }
        />
        <Route
          path="/Log"
          element={
            <AdminPrivateRoute>
              <Layout>
                <LogPage />
              </Layout>
            </AdminPrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
