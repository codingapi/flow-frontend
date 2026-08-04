import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { hashRouters } from './config/routers';
import { ConfigProvider } from "antd";
import zhCN from 'antd/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import "./index.css";

dayjs.locale('zh');


// 注册逻辑动态加载：注册依赖（antd Form、表单组件、flow-design 等）不进入首屏 chunk
const Registrations = React.lazy(() => import('@/hooks/registrations'));

const App = () => {

    return (
        <React.StrictMode>
            <ConfigProvider locale={zhCN}>
                {/* 注册组件必须在渲染期执行（registerFormItems 内部调用了 hook），
                    不能放在 useEffect 异步回调里调用 */}
                <React.Suspense fallback={null}>
                    <Registrations />
                </React.Suspense>
                {/* 路由页面均为 React.lazy 动态加载，必须提供 Suspense 兜底 */}
                <React.Suspense fallback={null}>
                    <RouterProvider router={hashRouters} />
                </React.Suspense>
            </ConfigProvider>
        </React.StrictMode>
    )
}

const rootEl = document.getElementById('root');
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl);
    root.render(<App />);
}
