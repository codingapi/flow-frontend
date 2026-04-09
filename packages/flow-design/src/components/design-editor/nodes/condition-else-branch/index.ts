import {FlowNodeRegistry} from '../../typings';
import {formMeta} from './form-meta';
import {nanoid} from "nanoid";

export const ConditionElseBranchNodeRegistry: FlowNodeRegistry = {
    type: 'CONDITION_ELSE_BRANCH',
    extend: 'block',
    meta: {
        copyDisable: true,
        addDisable: true,
        deleteDisable: true,
        sidebarDisable:true,
        style:{
            width: '100%',
        }
    },
    info: {
        icon: 'CONDITION_ELSE_BRANCH',
        description: '分支else节点',
    },
    /**
     * Render node via formMeta
     */
    formMeta,
    onAdd(ctx, from) {
        return {
            id: `condition_branch_${nanoid(5)}`,
            type: 'CONDITION_ELSE_BRANCH',
            data: {
                title: `条件else分支节点`,
                value: 'branch Value'
            },
        };
    }
};
