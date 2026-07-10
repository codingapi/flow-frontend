import { getScript, save } from "@/api/node-view";
import { JavaScriptCodeEditor } from "@/components/js-code";
import { Button, Drawer, message, Modal } from "antd";
import React from "react";
import { FlowMessageKey, FlowMessageRegistry } from "@coding-flow/flow-core";


interface ViewCodeDrawerProps {
    visible: boolean;
    onClose: () => void;
    code: string;
}


const JavaScriptCodeContent: React.FC<{ code: string }> = ({ code }) => {

    const [script, setScript] = React.useState<string>('');

    React.useEffect(() => {
        if (code) {
            getScript(code).then((res: any) => {
                setScript(res.data);
            });
        }

        return () => {
            setScript('');
        };

    }, [code]);

    const handleSave = () => {
        save({
            code,
            script: script,
        }).then((res: any) => {
            message.success(
                FlowMessageRegistry.getInstance().get(FlowMessageKey.DESIGN_VIEW_CODE_SAVE_SUCCESS)
            );
        });
    };

    return (
        <>
            <JavaScriptCodeEditor
                value={script}
                onChange={setScript}
                toolbar={[
                    {
                        key: 'save',
                        title: '保存',
                        label: '保存代码',
                        backgroundColor: '#1890ff',
                        hoverBackgroundColor: '#40a9ff',
                        textColor: '#fff',
                        borderColor: '#1890ff',
                        onClick: () => {
                            handleSave();
                        }
                    }
                ]}
            />
        </>
    );
}

export const ViewCodeDrawer: React.FC<ViewCodeDrawerProps> = (props) => {

    return (
        <Drawer
            closeIcon={false}
            title="视图代码"
            open={props.visible}
            onClose={props.onClose}
            destroyOnHidden={true}
            size={'100%'}
            extra={
                <Button onClick={props.onClose}>
                    关闭
                </Button>
            }
        >
            <JavaScriptCodeContent code={props.code} />
        </Drawer>
    );
}