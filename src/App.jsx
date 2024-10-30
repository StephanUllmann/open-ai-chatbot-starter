import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ChatInterface from './pages/ChatInterface';
import Settings from './pages/Settings';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<MainLayout />}>
      <Route index element={<ChatInterface />} />
      <Route path='settings' element={<Settings />} />
    </Route>
  )
);

const App = () => <RouterProvider router={router} />;

export default App;
