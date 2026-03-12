import {Button, Form, Input} from "antd-mobile";
import React from "react";
import {login} from "@/api/login.ts";
import { useNavigate } from "react-router";

const LoginPage: React.FC = () => {

    const [form] = Form.useForm();
    const navigate = useNavigate();

    return (
        <Form
            form={form}
            onFinish={(values)=>{
                login(values).then(res=>{
                    if(res.success){
                        const token = res.data.token;
                        localStorage.setItem('token', token);
                        navigate('/');
                    }
                });
            }}
        >
            <Form.Item
                name={"username"}
                label={"用户名"}
            >
                <Input/>
            </Form.Item>
            <Form.Item
                name={"password"}
                label={"密码"}
            >
                <Input/>
            </Form.Item>

            <Button
                block
                color={'primary'}
                onClick={()=>{
                    form.submit();
                }}
            >登陆</Button>
        </Form>
    )
}

export default LoginPage;