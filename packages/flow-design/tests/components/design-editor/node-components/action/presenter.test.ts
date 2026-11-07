import {describe, expect, it} from '@rstest/core';
import {FlowAction} from '@coding-flow/flow-types';
import {FlowActionListPresenter} from '@/components/design-editor/node-components/action/presenter';

const buildAction = (): FlowAction => ({
    id: 'action-1',
    title: '通过',
    type: 'PASS',
    enable: true,
    display: {
        title: '通过',
        style: '',
        icon: '',
    },
});

describe('FlowActionListPresenter', () => {

    it('编辑图标后应写入 display.icon（issue #244）', () => {
        let result: FlowAction[] = [];
        const presenter = new FlowActionListPresenter([buildAction()], (data) => {
            result = data as FlowAction[];
        });

        presenter.update({
            id: 'action-1',
            title: '通过',
            icon: 'check-circle',
            display: {
                title: '通过',
                style: '',
                icon: '',
            },
        });

        expect(result).toHaveLength(1);
        expect(result[0].display.icon).toEqual('check-circle');
    });

    it('编辑名称后应同步 display.title，并保留样式与图标', () => {
        let result: FlowAction[] = [];
        const action = buildAction();
        action.display.icon = 'check-circle';
        action.display.style = '{"backgroundColor":"1677ff"}';

        const presenter = new FlowActionListPresenter([action], (data) => {
            result = data as FlowAction[];
        });

        presenter.update({
            id: 'action-1',
            title: '同意',
            display: {
                title: '通过',
                style: '{"backgroundColor":"1677ff"}',
                icon: 'check-circle',
            },
        });

        expect(result[0].title).toEqual('同意');
        expect(result[0].display.title).toEqual('同意');
        expect(result[0].display.icon).toEqual('check-circle');
        expect(result[0].display.style).toEqual('{"backgroundColor":"1677ff"}');
    });

    it('新增自定义按钮时应带上表单中编辑的 display 数据', () => {
        let result: FlowAction[] = [];
        const presenter = new FlowActionListPresenter([buildAction()], (data) => {
            result = data as FlowAction[];
        });

        presenter.update({
            id: 'action-2',
            title: '自定义',
            icon: 'check-circle',
            display: {
                title: '自定义',
                style: '{"borderRadius":"4"}',
                icon: '',
            },
        });

        expect(result).toHaveLength(2);
        expect(result[1].type).toEqual('CUSTOM');
        expect(result[1].display.icon).toEqual('check-circle');
        expect(result[1].display.style).toEqual('{"borderRadius":"4"}');
    });
});
