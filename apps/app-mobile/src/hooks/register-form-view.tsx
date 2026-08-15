import { ViewBindPlugin } from "@coding-flow/flow-core";
import { FlowView } from "@/components/flow-view";

class RegisterRef {

}

// 模块级单例标记：注册逻辑可能在异步上下文中调用，不能使用 React.useRef
let registerRef: RegisterRef | undefined;
export const registerFormView = () => {
    if (!registerRef) {
        registerRef = new RegisterRef();
        ViewBindPlugin.getInstance().register('default', FlowView);
    }
}