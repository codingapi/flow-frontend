import React from "react";
import {Drawer} from "@coding-flow/flow-pc-ui";
import {detail} from "@/api/record";
import {FlowContent} from "@coding-flow/flow-types";
import {ApprovalLayout} from "@/components/flow-approval/layout";
import {useMockContext} from "@coding-flow/flow-approval-presenter";
import {ApprovalPanelProps} from "@coding-flow/flow-approval-presenter";

export const ApprovalPanel: React.FC<ApprovalPanelProps> = (props) => {

    const [content, dispatch] = React.useState<FlowContent | undefined>(undefined);

    const mockKey = useMockContext();

    React.useEffect(() => {
        const id = props.recordId || props.workflowCode || '';
        detail(id,mockKey).then(res => {
            if (res.success) {
                dispatch(res.data);
            }
        });
    }, []);

    return (
        <div>
            {content &&
                (
                    <ApprovalLayout
                        className={props.className}
                        content={content}
                        onClose={props.onClose}
                        review={props.review}
                        initData={props.initData}
                    />
                )
            }
        </div>
    )
}

interface ApprovalPanelDrawerProps extends ApprovalPanelProps {
    // 是否打开抽屉
    open: boolean;
    // 抽屉关闭回调
    onClose: () => void;
    // 抽屉样式类对应
    drawerClassName?: string;
}

export const ApprovalPanelDrawer: React.FC<ApprovalPanelDrawerProps> = (props) => {

    return (
        <Drawer
            rootClassName={props.drawerClassName}
            open={props.open}
            mask={false}
            onClose={props.onClose}
            styles={{
                body: {
                    padding: 0,
                    margin: 0,
                }
            }}
        >
            <ApprovalPanel
                {...props}
            />
        </Drawer>
    )
}