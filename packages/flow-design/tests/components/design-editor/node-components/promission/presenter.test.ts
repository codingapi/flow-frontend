import {describe, expect, it} from '@rstest/core';
import {FieldPermission, FlowForm} from '@coding-flow/flow-types';
import {PromissionPresenter} from '@/components/design-editor/node-components/promission/presenter';

const form: FlowForm = {
    name: '请假单',
    code: 'leave',
    fields: [
        {
            id: 'field-1',
            name: '请假说明',
            code: 'description',
            type: 'string',
            dataType: 'STRING',
            hidden: false,
            required: false,
        },
    ],
    subForms: [],
};

describe('PromissionPresenter', () => {
    it('应清理已改名字段的历史权限，并允许调整新字段权限', () => {
        const changes: FieldPermission[][] = [];
        const presenter = new PromissionPresenter(form, [
            {formCode: 'leave', fieldCode: 'desc', type: 'READ'},
        ], (value) => changes.push(value));

        presenter.initFormPromission();

        expect(changes).toEqual([
            [{formCode: 'leave', fieldCode: 'description', type: 'WRITE'}],
        ]);

        presenter.changeReadable('leave', 'description', true);

        expect(changes.at(-1)).toEqual([
            {formCode: 'leave', fieldCode: 'description', type: 'READ'},
        ]);
    });

    it('应保留仍存在字段已经配置的权限类型', () => {
        const changes: FieldPermission[][] = [];
        const presenter = new PromissionPresenter(form, [
            {formCode: 'leave', fieldCode: 'description', type: 'HIDDEN'},
        ], (value) => changes.push(value));

        presenter.initFormPromission();

        expect(changes).toEqual([]);
        expect(presenter.getDatasource('leave')).toEqual([
            expect.objectContaining({fieldCode: 'description', type: 'HIDDEN'}),
        ]);
    });
});
