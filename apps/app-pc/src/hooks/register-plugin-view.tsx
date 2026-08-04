import { ViewBindPlugin } from "@coding-flow/flow-core";
import { IMPORT_FORM_VIEW_KEY } from "@coding-flow/flow-design";
import { ImportFormView } from "@/components/import-form-view";

class RegisterRef {

}

// 模块级单例标记：注册逻辑可能在异步上下文中调用，不能使用 React.useRef
let registerRef: RegisterRef | undefined;

export const registerPluginView = () => {

    if (!registerRef) {
        registerRef = new RegisterRef();
        ViewBindPlugin.getInstance().register(IMPORT_FORM_VIEW_KEY, ImportFormView);
    }
}