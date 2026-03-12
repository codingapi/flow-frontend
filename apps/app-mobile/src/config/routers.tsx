import {createHashRouter} from "react-router";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import TodoPage from "@/pages/todo.tsx";
import ApprovalPage from "@/pages/approval.tsx";


export const routers:any[] = [
    {
        path:'/login',
        element:<LoginPage/>,
        name: '登陆界面'
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
    },
    {
        path:'/approval',
        element:<ApprovalPage/>,
        name: '审批界面',
        hidden:true
    }
]


export const hashRouters = createHashRouter(routers);