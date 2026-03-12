import {Empty, List, Tabs} from "antd-mobile";
import React from "react";
import {done, list, notify, todo} from "@/api/record.ts";
import dayjs from "dayjs";
import {TextIcon} from "@/components/text-icon.tsx";

interface TodoListProps {
    type: 'todo' | 'done' | 'notify' | 'list';   // 固定类型，用于区分不同列表
}

const TodoList: React.FC<TodoListProps> = ({ type }) => {
    const [records, setRecords] = React.useState<any[]>([]);

    // 获取数据
    const fetchData = React.useCallback(() => {
        const request = { current: 1, pageSize: 100 };
        const apiMap = { todo, done, notify, list };
        const api = apiMap[type];

        if (api) {
            api(request).then((res) => {
                if (res.success) {
                    setRecords(res.data);
                }
            });
        }
    }, [type]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    if(records.length === 0) {
        return (
            <Empty description={"暂无数据"}/>
        )
    }

    return (
        <List
            style={{ '--border-top': 'none'}}
        >
            {records.map((record) => (
                <List.Item
                    style={{
                        padding: 8,
                    }}
                    key={record.recordId}
                    prefix={(
                        <TextIcon text={record.workTitle}/>
                    )}
                    description={record.workTitle}
                    extra={
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                            <span>{dayjs(record.createTime).format("YYYY-MM-DD HH:mm")}</span>
                            <span style={{ marginTop: 4 }}>{record.currentOperatorName}</span>
                        </div>
                    }
                >
                    {record.title}
                </List.Item>
            ))}
        </List>
    );
};

const TodoPage: React.FC = () => {
    const [currentKey, setCurrentKey] = React.useState('todo');

    return (
        <Tabs activeKey={currentKey} onChange={setCurrentKey}>
            <Tabs.Tab title="待办" key="todo">
                <TodoList type="todo" />
            </Tabs.Tab>
            <Tabs.Tab title="已办" key="done">
                <TodoList type="done" />
            </Tabs.Tab>
            <Tabs.Tab title="抄送" key="notify">
                <TodoList type="notify" />
            </Tabs.Tab>
            <Tabs.Tab title="全部" key="list">
                <TodoList type="list" />
            </Tabs.Tab>
        </Tabs>
    );
};

export default TodoPage;