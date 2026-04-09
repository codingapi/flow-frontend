import {FlowNodeRegistry} from '../../typings';
import {formMeta} from './form-meta';

export const InclusiveElseBranchNodeRegistry: FlowNodeRegistry = {
    type: 'INCLUSIVE_ELSE_BRANCH',
    extend: 'block',
    meta: {
        copyDisable: true,
        addDisable: true,
        sidebarDisable:true,
        deleteDisable: true,
        style:{
            width: '100%',
        }
    },
    info: {
        icon: 'INCLUSIVE_ELSE_BRANCH',
        description: '包容else分支',
    },
    /**
     * Render node via formMeta
     */
    formMeta,
};
