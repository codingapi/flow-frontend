import React from "react";
import {FlowListProps} from "@/components/list/types";
import {Checkbox, CheckList, Space} from "antd-mobile";
import {CheckCircleFilled, CheckCircleTwoTone} from "@ant-design/icons";
import {useListFormPresenter} from "@/components/list/hooks/use-list-form-presenter";
import dayjs from "dayjs";

interface RightProps {
    active: boolean;
}

const Right: React.FC<RightProps> = (props) => {
    if (props.active) {
        return (
            <CheckCircleFilled/>
        )
    } else {
        return (
            <CheckCircleTwoTone/>
        )
    }
}

interface FlowMultipleListProps extends FlowListProps {
    onChangeMode?: () => void;
    onSelect?: (recordIds: number[]) => void;
}


export const FlowMultipleList: React.FC<FlowMultipleListProps> = (props) => {

    const presenter = useListFormPresenter(props);
    const [keys, setKeys] = React.useState<number[]>([]);

    React.useEffect(() => {
        props.onSelect?.(keys);
    }, [keys]);

    return (
        <>
            <div
                style={{
                    padding: 10,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <a
                        onClick={() => {
                            props.onChangeMode?.();
                        }}
                    >逐条审批</a>
                    <Checkbox
                        onChange={(value) => {
                            if (value) {
                                const list = presenter.getDatasource();
                                setKeys(list.map(item => {
                                    return item.recordId as any;
                                }));
                            } else {
                                setKeys([]);
                            }
                        }}
                    >全选</Checkbox>
                </div>
            </div>
            <CheckList
                extra={active =>
                    <Right active={active}/>
                }
                multiple={true}
                value={keys}
                onChange={(value) => {
                    setKeys(value
                        .filter(key => key)
                        .map(item => {
                            return item as any
                        }));
                }}
            >
                {presenter.getDatasource().map(item => {
                    return (
                        <CheckList.Item
                            value={item.recordId}
                            description={(
                                <Space>
                                    <span>发起人: {item.submitOperatorName}</span>
                                    <span>提交人: {item.createdOperatorName}</span>
                                    <span>时间: {dayjs(item.createTime).format('YYYY-DD-MM HH:mm:ss')}</span>
                                </Space>
                            )}
                        >
                            {item.title}
                        </CheckList.Item>
                    )
                })}
            </CheckList>
        </>
    )
}