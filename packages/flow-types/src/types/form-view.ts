import {FormInstance} from "./form-instance";
import {FieldPermission, FlowForm, FlowTodo} from "@/types/flow-approval";

/**
 *  合并表单操作数据
 */
export interface FormData {
    /** 表单操控对象 */
    form: FormInstance;
    /** 待办数据 */
    data: FlowTodo;
}

/**
 *  流程表单视图属性
 */
export interface FormViewProps {
    /** 流程合并 */
    mergeable: boolean;
    /** 合并表单操控对象 */
    formList?: FormData[];
    /** 表单操控对象 */
    form?: FormInstance;
    /** 待办数据 */
    data?: FlowTodo;
    /** 初始化数据 **/
    initData?: any;
    /** 表单数据更新事件 */
    onValuesChange?: (values: any) => void;
    /** 当合并流程选中了流程记录的回掉 **/
    onMergeRecordIdsSelected?: (recordIds: number[]) => void;
    /** 表单元数据对象 */
    meta: FlowForm;
    /** 表单字段权限,为空时全部可写*/
    fieldPermissions: FieldPermission[];
    /** 是否预览模式 */
    review: boolean;
}
