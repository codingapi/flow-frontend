import React from "react";
import { registerFormTypes } from "@/hooks/register-form-types";
import { registerFormView } from "@/hooks/register-form-view";
import { registerPluginView } from "@/hooks/register-plugin-view";

/**
 * 注册组件。
 *
 * 注意：@coding-form/form-engine 的 registerFormItems 内部调用了 React.useRef()，
 * 因此所有注册逻辑只能在组件渲染期执行，不能放在 useEffect 的异步回调里调用
 * （会抛 Invalid hook call 导致整个注册链中断）。
 *
 * 通过 React.lazy 动态加载本模块，注册相关依赖（antd Form、表单组件、flow-design 等）
 * 不会进入首屏 chunk。
 */
const Registrations: React.FC = () => {

    registerFormTypes();
    registerPluginView();
    registerFormView();

    React.useEffect(() => {
        console.log('register flow success.');
    }, []);

    return null;
};

export default Registrations;
