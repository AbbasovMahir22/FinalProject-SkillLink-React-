import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Explore from './pages/Explore';
import Messages from './pages/Messages';
import MainLayout from './layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import PostDetail from './pages/PostDetail';
import UserDetail from './pages/UserDetail';
import EmailConfirm from './pages/EmailConfirm';
import Settings from './pages/Settings';
import MyProfile from './pages/MyProfile';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ResetPassword from './pages/ResetPassword';




function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route path="/confirm-email" element={<EmailConfirm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="Explore" element={<Explore />} />
          <Route path="messages" element={<Messages />} />
          <Route path="postdetail/:id" element={<PostDetail />} />
          <Route path="userdetail/:id" element={<UserDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="myProfile" element={<MyProfile />} />
          <Route path="terms" element={<Terms />} />
          <Route path="privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;