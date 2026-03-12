import {createHashRouter} from "react-router";
import LoginPage from "@/pages/login";
import HomePage from "@/pages/home";
import DesignPage from "@/pages/desgin";
import TodoPage from "@/pages/todo";
import UserPage from "@/pages/user";
import MockPage from "@/pages/mock";


export const routers = [
    {
        path:'/login',
        element:<LoginPage/>,
        name:'登陆界面',
    },
    {
        path:'/user',
        element:<UserPage/>,
        name: '用户管理'
    },
    {
        path:'/design',
        element:<DesignPage/>,
        name: '流程设计'
    },
    {
        path:'/todo',
        element:<TodoPage/>,
        name: '待办中心'
    },
    {
        path:'/mock',
        element:<MockPage/>,
        name: '流程模拟',
        hidden:true
    },
    {
        path:'/',
        element:<HomePage/>,
        name: '系统主页'
    }
]


export const hashRouters = createHashRouter(routers);