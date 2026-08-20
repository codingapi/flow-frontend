import {Alert, Descriptions, Form, message, Modal} from "antd";
import React from "react";
import {Upload} from "./upload";
import {importWorkflow, type WorkflowImportRequest, workflowCodeExists} from "@/api/workflow";
import {FlowMessageKey, FlowMessageRegistry} from "@coding-flow/flow-core";
import {
    readImportWorkflowInfo,
    validateResetImportCode,
    type WorkflowImportFileInfo
} from "./import-file";
import styles from "./design_import.module.scss";

export type WorkflowImportScene = 'MANAGEMENT' | 'RESET';

interface DesignImportProps{
    open: boolean;
    onClose: () => void;
    scene?: WorkflowImportScene;
    currentWorkflowCode?: string;
    onImported?: (workId: string) => void;
}

type ImportFormValues = Pick<WorkflowImportRequest, 'file'>;

export const DesignImport:React.FC<DesignImportProps> = (props) => {

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);
    const [fileInfo, setFileInfo] = React.useState<WorkflowImportFileInfo>();
    const resetImport = props.scene === 'RESET';

    React.useEffect(() => {
        if (!props.open) {
            form.resetFields();
            setFileInfo(undefined);
        }
    }, [form, props.open]);

    const executeImport = async (values: ImportFormValues) => {
        setSubmitting(true);
        try {
            const result = await importWorkflow({
                file: values.file,
                mode: resetImport ? 'REPLACE' : 'INCREMENTAL'
            });
            if (result.success) {
                message.success(
                    FlowMessageRegistry.getInstance().get(FlowMessageKey.DESIGN_IMPORT_SUCCESS)
                );
                props.onImported?.(result.data as string);
                props.onClose();
            }
        } finally {
            setSubmitting(false);
        }
    };

    const confirmImport = (values: ImportFormValues, info: WorkflowImportFileInfo) => {
        Modal.confirm({
            title: resetImport ? '确认重置导入' : '确认导入流程',
            content: resetImport
                ? `重置导入将使用“${info.title}（${info.code}）”完全覆盖当前流程的全部版本和配置。该操作不可撤销，确认继续吗？`
                : `流程编码“${info.code}”已存在，系统将自动生成新编码并创建一条独立流程。确认继续吗？`,
            okText: resetImport ? '确认重置' : '确认导入',
            cancelText: '取消',
            okButtonProps: resetImport ? {danger: true} : undefined,
            onOk: () => executeImport(values)
        });
    };

    const submitImport = async (values: ImportFormValues) => {
        let info: WorkflowImportFileInfo;
        try {
            info = readImportWorkflowInfo(values.file);
            if (resetImport) {
                validateResetImportCode(values.file, props.currentWorkflowCode || '');
            }
        } catch (error) {
            message.error(error instanceof Error ? error.message : '无法解析导入流程信息');
            return;
        }

        if (resetImport) {
            confirmImport(values, info);
            return;
        }

        setSubmitting(true);
        try {
            const existsResult = await workflowCodeExists(info.code);
            if (existsResult.data === true) {
                confirmImport(values, info);
                return;
            }
        } finally {
            setSubmitting(false);
        }
        await executeImport(values);
    };

    const handleFileChange = (changedValues: Partial<ImportFormValues>) => {
        if (changedValues.file === undefined) {
            return;
        }
        if (!changedValues.file) {
            setFileInfo(undefined);
            return;
        }
        try {
            setFileInfo(readImportWorkflowInfo(changedValues.file));
        } catch (error) {
            setFileInfo(undefined);
            message.error(error instanceof Error ? error.message : '无法解析导入流程信息');
        }
    };

    return (
        <Modal
            title={resetImport ? '重置导入' : '流程导入'}
            open={props.open}
            onCancel={props.onClose}
            destroyOnHidden={true}
            okText={resetImport ? '重置导入' : '导入'}
            confirmLoading={submitting}
            onOk={()=>{
                form.submit();
            }}
        >
            <Alert
                className={styles.notice}
                type={resetImport ? 'warning' : 'info'}
                showIcon={true}
                message={resetImport ? '重置导入说明' : '流程导入说明'}
                description={resetImport
                    ? '仅允许导入与当前流程编码一致的文件。确认后，当前流程的全部版本和配置将被导入数据覆盖。'
                    : '系统会检测导入流程的编码。编码未占用时保留原编码；编码已存在时自动生成新编码，并创建一条独立流程。'}
            />
            <Form
                form={form}
                layout="vertical"
                onFinish={submitImport}
                onValuesChange={handleFileChange}
            >
                <Form.Item
                    name="file"
                    label={"流程设计文件"}
                    help={"请选择导出的设计文件，文件格式为json格式"}
                    rules={[{required: true, message: '请选择流程设计文件'}]}
                >
                    <Upload/>
                </Form.Item>
                {fileInfo && (
                    <Descriptions
                        size="small"
                        bordered={true}
                        column={1}
                        items={[
                            {key: 'title', label: '流程名称', children: fileInfo.title},
                            {key: 'code', label: '流程编码', children: fileInfo.code}
                        ]}
                    />
                )}
            </Form>
        </Modal>
    )
}
