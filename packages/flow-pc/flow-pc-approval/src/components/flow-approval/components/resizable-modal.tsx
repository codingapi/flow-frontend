import React from "react";
import { Modal, ModalProps } from "antd";

/**
 * 可调整大小的审批弹框。
 * <p>统一审批弹框宽度（默认 640px，比 antd 默认 520px 更宽），并支持用户在弹框
 * 右下角拖拽调整宽高，解决审批意见框与人员选择框大小不一致、无法调整的问题。
 * <p>resize 作用于最外层弹框元素（antd 6 中持有内联宽度的 .ant-modal），
 * 拖拽改变整体尺寸后保持原有居中定位，不产生偏移。
 * <p>注意：antd 的 height prop（原封透传给 rc-dialog）作用于 .ant-modal 根元素，
 * 该元素是透明定位容器，视觉盒是 .ant-modal-container（背景/阴影所在层），高度由内容
 * 决定，因此 height 在视觉上不生效。需要抬高弹框区分层级时（如顺序弹出审批意见框 →
 * 操作人选择框），可在 children 外层包裹 div 增加 padding 撑高内容，或使用 styles.body
 * 设置 minHeight —— 前者内容更紧凑，后者固定高度（内容不满时会有空白）。
 */
export const ResizableModal: React.FC<ModalProps> = (props) => {
    const { width = 640, style, ...rest } = props;
    return (
        <Modal
            {...rest}
            width={width}
            style={{
                // 保留调用方自定义样式，再叠加可调整尺寸能力
                ...style,
                resize: 'both',
                overflow: 'auto',
                minWidth: 480,
                minHeight: 320,
                maxWidth: 'calc(100vw - 48px)',
                maxHeight: 'calc(100vh - 48px)',
            }}
        />
    )
}