import React from "react";
import { useNavigate } from "react-router";
import { Button, Flex, Space } from "antd";
import {routers} from "@/config/routers.tsx";
import {FormTypeContext} from "@coding-flow/flow-types";

const HomePage: React.FC = () => {

    const navigate = useNavigate();

    const routerButtons = routers.filter(item=>item.path!=='/' && !item.hidden);

    return (
        <div>
            <Flex justify="center"><h1>Flow-Engine Home Page</h1></Flex>
            <Space>
                {routerButtons.map((item)=>{
                    return (
                        <Button
                            onClick={() => {
                                navigate(item.path)
                            }}>
                            {item.name}
                        </Button>
                    )
                })}
            </Space>
            <Button
                onClick={()=>{
                    const formType = FormTypeContext.getInstance().getType('string');
                    console.log(formType);
                }}
            >get string from type</Button>
        </div>
    )
}

export default HomePage;