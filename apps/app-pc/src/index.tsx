import React from 'react';
import ReactDOM from 'react-dom/client';
import {RouterProvider} from 'react-router';
import {hashRouters} from './config/routers';
import {registerFormTypes} from "@coding-flow/flow-pc-form";
import {ConfigProvider} from "antd";
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import "./index.css";

dayjs.locale('zh');

const App = () => {
    registerFormTypes();
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
