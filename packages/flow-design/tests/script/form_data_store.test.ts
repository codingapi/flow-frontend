import {describe, expect, it} from '@rstest/core';
import {createFormDataStore, updateState} from '@/script-components/components/form-data/store';

describe('createFormDataStore', () => {
    it('各实例 store 状态应相互隔离（issue #183：避免多子流程项表单数据互相覆盖）', () => {
        const storeA = createFormDataStore();
        const storeB = createFormDataStore();

        storeA.dispatch(updateState({
            formData: {dataBody: {formCode: 'form-a', data: {name: 'a'}}},
        }));

        // 根状态的 formData 为 slice 挂载键，slice 状态内的 formData 才是表单数据
        expect(storeA.getState().formData.formData?.dataBody.formCode).toBe('form-a');
        expect(storeB.getState().formData.formData).toBeUndefined();

        storeB.dispatch(updateState({
            formData: {dataBody: {formCode: 'form-b', data: {name: 'b'}}},
        }));

        expect(storeA.getState().formData.formData?.dataBody.formCode).toBe('form-a');
        expect(storeB.getState().formData.formData?.dataBody.formCode).toBe('form-b');
    });
});
