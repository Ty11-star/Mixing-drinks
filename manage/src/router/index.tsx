import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import CocktailList from '../pages/Cocktail/List';
import CocktailForm from '../pages/Cocktail/Form';
import IngredientList from '../pages/Ingredient/List';
import CategoryList from '../pages/Category/List';
import UserList from '../pages/User/List';

// 路由配置
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'cocktails',
        children: [
          {
            index: true,
            element: <CocktailList />,
          },
          {
            path: 'create',
            element: <CocktailForm />,
          },
          {
            path: 'edit/:id',
            element: <CocktailForm />,
          },
        ],
      },
      {
        path: 'ingredients',
        element: <IngredientList />,
      },
      {
        path: 'categories',
        element: <CategoryList />,
      },
      {
        path: 'users',
        element: <UserList />,
      },
    ],
  },
]);

export default router;
