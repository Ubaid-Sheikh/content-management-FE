import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ArticleList from './pages/ArticleList';
import ArticleDetail from './pages/ArticleDetail';
import ArticleForm from './pages/ArticleForm';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<ArticleList />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/articles/create"
            element={
              <PrivateRoute allowedRoles={['ADMIN', 'EDITOR']}>
                <ArticleForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/articles/edit/:id"
            element={
              <PrivateRoute allowedRoles={['ADMIN', 'EDITOR']}>
                <ArticleForm />
              </PrivateRoute>
            }
          />
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </div>
    </Router>
  );
}

export default App;
