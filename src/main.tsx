import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/index.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'jotai';
import ProtectedRoute from './ProtectedRoute';
import Login from './Login';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path='/login'
            element={<Login />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
