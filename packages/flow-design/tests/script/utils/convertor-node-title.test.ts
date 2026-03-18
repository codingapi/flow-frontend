import {describe, expect, it} from '@rstest/core';
import {FlowForm} from "@coding-flow/flow-types";
import {NodeTitleScriptUtils} from "@/script-components/services/node-title";
import {GroovyVariableUtil} from "@/script-components/utils/varibale";
import {GroovyScriptConvertorUtil} from "@coding-flow/flow-core";

describe('NodeTitleScriptUtils', () => {

    const form: FlowForm = {
        name: '请假单',
        code: 'leave',
        fields: [
            {
                id: '1',
                name: '天数',
                code: 'days',
                type: 'number',
                required: true,
                defaultValue: '',
                dateType:'INTEGER',
                hidden:false,
            },
            {
                id: '2',
                name: '理由',
                code: 'desc',
                type: 'string',
                required: true,
                defaultValue: '',
                dateType:'STRING',
                hidden:false,
            },
        ],
        subForms: []
    }

    const variables = GroovyVariableUtil.getVariables(form);

    describe('updateExpression', () => {
        it('node title script reset expression', () => {
            const script = `
// @CUSTOM_SCRIPT 
def run(request){
    return "你有一条" + request.getCurrentOperatorName() + "的" + request.getWorkflowTitle() + "待办消息 【" + request.getNodeName() + "】"
}
`;
            const result = NodeTitleScriptUtils.updateExpression(script, '你有一条${当前审批人}的${流程标题}待办消息 【${当前节点}】', variables)
            const title = GroovyScriptConvertorUtil.getScriptTitle(result);
            expect(title).toEqual("你有一条${当前审批人}的${流程标题}待办消息 【${当前节点}】");
        });
    });


    describe('addVariable', () => {
        it('node title script reset expression', () => {
            const script = `
// @CUSTOM_SCRIPT 
def run(request){
    return "你有一条" + request.getCurrentOperatorName() + "的" + request.getWorkflowTitle() + "待办消息 【" + request.getNodeName() + "】"
}
`;
            const variable = variables[0];
            const result = NodeTitleScriptUtils.addVariable(script, variable, variables)
            const title = GroovyScriptConvertorUtil.getScriptTitle(result);
            expect(title).toEqual("你有一条${当前审批人}的${流程标题}待办消息 【${当前节点}】${当前审批人}");
        });
    });
});