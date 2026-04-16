import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router';
import {hashRouters} from './config/routers';
import {ConfigProvider} from "antd";
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import "./index.css";
import {registerFormTypes} from "@/hooks/register-form-types.tsx";
import {registerImportFormView} from "@/hooks/register-import-form-view.tsx";

dayjs.locale('zh');

const App = () => {
    registerFormTypes();
    registerImportFormView();
    return (
        <React.StrictMode>
            <ConfigProvider locale={zhCN}>
                <RouterProvider router={hashRouters}/>
            </ConfigProvider>
        </React.StrictMode>
    )
}

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(<App/>);
}
