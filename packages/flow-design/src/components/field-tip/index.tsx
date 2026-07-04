import React from "react";
import {Popover} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";
import styles from "./field-tip.module.scss";

/**
 * 要点项
 */
export interface FieldTipItem {
    /** 要点标题 */
    label: string;
    /** 要点说明 */
    detail: string;
}

export interface FieldTipProps {
    /** 字段名称（显示为 label 文本，同时作为弹层标题） */
    label: string;
    /** 说明正文 */
    description?: string;
    /** 要点列表（用于枚举型字段的各选项说明） */
    items?: FieldTipItem[];
}

/**
 * 字段说明组件
 * 在字段 label 右侧显示问号图标，hover 时弹出结构化说明（正文 + 要点列表）。
 * 作为 Form.Item 的 label 使用，简单字段只传 description，复杂字段再传 items。
 */
export const FieldTip: React.FC<FieldTipProps> = ({label, description, items}) => {

    const hasContent = Boolean(description) || (items && items.length > 0);

    const content = (
        <div className={styles.content}>
            {description && <p className={styles.description}>{description}</p>}
            {items && items.length > 0 && (
                <ul className={styles.items}>
                    {items.map((item) => (
                        <li key={item.label} className={styles.item}>
                            <span className={styles.itemLabel}>{item.label}</span>
                            <span className={styles.itemDetail}>{item.detail}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <span className={styles.wrapper}>
            <span className={styles.label}>{label}</span>
            {hasContent && (
                <Popover
                    content={content}
                    title={label}
                    trigger="hover"
                    placement="topLeft"
                    overlayClassName={styles.popover}
                >
                    <QuestionCircleOutlined className={styles.icon}/>
                </Popover>
            )}
        </span>
    );
};
