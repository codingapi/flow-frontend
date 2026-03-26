import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { hashRouters } from './config/routers';
import {registerFormTypes} from "@/hooks/register-form-types.tsx";

const App = () => {
    registerFormTypes();
    return (
        <React.StrictMode>
            <RouterProvider router={hashRouters}/>
        </React.StrictMode>
    )
}

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<App/>);
}
