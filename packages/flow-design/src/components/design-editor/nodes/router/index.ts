import {FlowNodeRegistry} from '../../typings';
import {formMeta} from './form-meta';

export const RouterNodeRegistry: FlowNodeRegistry = {
    type: 'ROUTER',
    extend: 'end',
    meta:{
        copyDisable: true,
        addDisable: false,
        expandable: false, // disable expanded
    },
    info: {
        icon: 'ROUTER',
        description: '路由节点',
    },
    // 路由节点不限制摆放位置（issue #230）：可添加在主流程、条件分支等任意可添加节点处。
    // canAdd 缺省即为允许，因此不再实现该方法。
    /**
     * Render node via formMeta
     */
    formMeta
};
