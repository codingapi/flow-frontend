import {Button, Space } from "antd-mobile";
import React from "react";
import { useNavigate } from "react-router";
import {routers} from "@/config/routers.tsx";


const HomePage:React.FC = ()=>{

    const navigate = useNavigate();

    return (
        <div>
            <div style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems:'center'
            }}><h1>Flow-Engine Home Page</h1></div>
            <Space>
                {routers.filter(item=>item.path!=='/').map(item => {
                    return (
                        <Button
                            onClick={()=>navigate(item.path)}
                        >{item.name}
                        </Button>
                    )
                })}
            </Space>
        </div>
    )
}

export default HomePage;