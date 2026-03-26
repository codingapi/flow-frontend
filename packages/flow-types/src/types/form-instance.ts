export type NamePath = string | string[];

/**
 *  表单实例对象能力
 */
export interface FormInstance {
    /** 获取表某个单值 **/
    getFieldValue: (name: NamePath) => any;
    /** 获取表所有值 **/
    getFieldsValue: () => any;
    /** 重置表单值 **/
    resetFields: (fields?: NamePath[]) => void;
    /** 设置表单所有值 **/
    setFieldsValue: (values: any) => void;
    /** 设置表单值 **/
    setFieldValue: (name: NamePath, value: any) => void;
    /** 表单提交 **/
    submit: () => void;
}
