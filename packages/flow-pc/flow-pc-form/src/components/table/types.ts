import {FormData, FieldPermission, FlowForm} from "@coding-flow/flow-types";


export interface FlowTableProps {
    formList: FormData[];
    /** 初始化数据 **/
    initData?:any;
    /** 表单数据更新事件 */
    onValuesChange?: (values: any) => void;
    /** 表单元数据对象 */
    meta: FlowForm;
    /** 表单字段权限,为空时全部可写*/
    fieldPermissions: FieldPermission[];
    /** 是否预览模式 */
    review: boolean;
    /** 当合并流程选中了流程记录的回掉 **/
    onMergeRecordIdsSelected?: (recordIds: number[]) => void;
    /** 合并审批中查看单条流程记录（recordId 为空表示返回合并列表） **/
    onMergeRecordView?: (recordId?: number) => void;
}