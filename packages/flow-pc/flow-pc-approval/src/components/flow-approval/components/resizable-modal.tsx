import React from "react";
import {Modal, ModalProps} from "antd";

/**
 * 可调整大小的审批弹框。
 * <p>统一审批弹框宽度（默认 640px，比 antd 默认 520px 更宽），并支持用户在弹框
 * 右下角拖拽调整宽高，解决审批意见框与人员选择框大小不一致、无法调整的问题。
 * <p>resize 作用于最外层弹框元素（antd 6 中持有内联宽度的 .ant-modal），
 * 拖拽改变整体尺寸后保持原有居中定位，不产生偏移。
 */
export const ResizableModal: React.FC<ModalProps> = (props) => {
    const {width = 640, style, ...rest} = props;
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