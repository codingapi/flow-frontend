import {createHashRouter} from "react-router";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import TodoPage from "@/pages/todo.tsx";


export const routers:any[] = [
    {
        path:'/login',
        element:<LoginPage/>,
        name: '用户管理'
    },
    {
        path:'/todo',
        element:<TodoPage/>,
        name: '待办中心'
    },
    {
        path:'/',
        element:<HomePage/>,
        name: '系统主页'
    }
]


export const hashRouters = createHashRouter(routers);