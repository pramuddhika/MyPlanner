import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login.tsx';
import Register from '../pages/Register.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
]);
