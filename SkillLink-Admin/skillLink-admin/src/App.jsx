import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category";
import Layout from "./components/Layout";
import AdminPrivateRoute from "./components/AdminPrivateRoute";
import UserDetail from "./pages/UserDetail";
import SubCategory from "./pages/SubCategory";
import Specialization from "./pages/Specialization";
function App() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      sessionStorage.setItem("token", token);

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
