import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Authentication from './pages/Authentication';
import Home from './pages/Home';
import Notifications from './pages/Notifications';
import Discover from './pages/Discover';
import Messages from './pages/Messages';
import MainLayout from './layout/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import PostDetail from './pages/PostDetail';
import UserDetail from './pages/UserDetail';
import CreatePost from './pages/CreatePost';
import EmailConfirm from './pages/EmailConfirm';
import Settings from './pages/Settings';



function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Authentication />} />
        <Route path="/confirm-email" element={<EmailConfirm />} />
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
          <Route path="discover" element={<Discover/>} />
          <Route path="messages" element={<Messages />} />
          <Route path="postdetail/:id" element={<PostDetail />} />
          <Route path="userdetail/:id" element={<UserDetail />} />
          <Route path="settings" element={<Settings />} />
          <Route path="/create" element={<CreatePost />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;