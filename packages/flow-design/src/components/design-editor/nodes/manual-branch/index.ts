import {FlowNodeRegistry} from '../../typings';
import {formMeta} from './form-meta';
import {nanoid} from "nanoid";

export const ManualBranchNodeRegistry: FlowNodeRegistry = {
    type: 'MANUAL_BRANCH',
    extend: 'block',
    meta: {
        copyDisable: true,
        addDisable: true,
        sidebarDisable:true,
    },
    info: {
        icon: 'MANUAL_BRANCH',
        description: '分支节点',
    },
    /**
     * Render node via formMeta
     */
    formMeta,
    onAdd(ctx, from) {
        return {
            id: `manual_branch_${nanoid(5)}`,
            type: 'MANUAL_BRANCH',
            data: {
                title: `条件分支节点`,
                value: 'manal Value'
            },
        };
    }
};
