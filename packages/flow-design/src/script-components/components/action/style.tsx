import { Button, Col, ColorPicker, Input, Row, Space } from "antd";
import React from "react";
import { GroovyScriptLoader, GroovyScriptLoaderContent } from "../groovy-script-loader";
import { AdvancedScriptEditor } from "../advanced-script-editor";
import { ScriptType } from "@/script-components/typings";
import { GroovyScriptConvertorUtil } from "@coding-script/script-engine";
import { GroovyScriptModal, GroovyScriptContent } from "../groovy-script-modal";
import { EditOutlined } from "@ant-design/icons";
import { DisplayStyle } from "@coding-flow/flow-types";


/**
 * 按钮展示数据（对应后端 ActionDisplay），样式保存在 style 的 JSON 字符串中
 */
export interface ActionDisplayValue {
    // 标题
    title?: string;
    // 样式（DisplayStyle 的 JSON 字符串）
    style?: string;
    // 图标
    icon?: string;
    // 显示条件脚本key
    script?: string;
    // 兼容历史数据：样式字段曾经直接挂在 display 上
    backgroundColor?: string;
    // 兼容历史数据：样式字段曾经直接挂在 display 上
    borderColor?: string;
    // 兼容历史数据：样式字段曾经直接挂在 display 上
    borderRadius?: string;
    // 兼容历史数据：样式字段曾经直接挂在 display 上
    borderSize?: string;
}

interface ActionStyleProps {
    value?: ActionDisplayValue;
    onChange?: (value: ActionDisplayValue) => void;
}

/**
 * 样式数据中的颜色统一不带 # 保存（审批端渲染时补全），此处用于兼容历史数据中的 # 前缀
 */
const toStoreColor = (color?: string): string | undefined => {
    if (!color) {
        return undefined;
    }
    return color.startsWith('#') ? color.slice(1) : color;
};

/**
 * 颜色选择器回显的颜色值需要带 #
 */
const toPickerColor = (color?: string): string | undefined => {
    if (!color) {
        return undefined;
    }
    return color.startsWith('#') ? color : `#${color}`;
};

/**
 * 解析动作按钮样式。
 * <p>
 * 样式统一保存在 display.style 的 JSON 字符串中（后端 ActionDisplay.style），
 * 同时兼容历史上把样式字段直接挂在 display 上的数据。
 */
export const parseActionDisplayStyle = (display?: ActionDisplayValue): DisplayStyle => {
    if (!display) {
        return {};
    }
    if (typeof display.style === 'string' && display.style) {
        try {
            const data = JSON.parse(display.style);
            if (data && typeof data === 'object') {
                return {
                    ...data,
                    backgroundColor: toStoreColor(data.backgroundColor),
                    borderColor: toStoreColor(data.borderColor),
                } as DisplayStyle;
            }
        } catch (e) {
            // 非 JSON 样式数据，继续按扁平字段解析
        }
    }
    return {
        backgroundColor: toStoreColor(display.backgroundColor),
        borderColor: toStoreColor(display.borderColor),
        borderRadius: display.borderRadius,
        borderSize: display.borderSize,
    };
};


const ActionScriptContent: React.FC<GroovyScriptContent> = (props) => {
    return (
        <AdvancedScriptEditor
            {...props}
        />
    )
}

const ActionScript: React.FC<GroovyScriptLoaderContent> = (props) => {

    const [visible, setVisible] = React.useState(false);

    return (
        <>
            <Space.Compact>
                <Space.Addon
                    style={{
                        width: '150px',
                    }}
                >
                    <span>显示条件</span>
                </Space.Addon>
                <Input
                    readOnly
                    style={{
                        width: '150px',
                    }}
                    value={GroovyScriptConvertorUtil.getScriptTitle(props.value || '')}
                />
                <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                        setVisible(true);
                    }}
                >
                    修改
                </Button>

            </Space.Compact>

            <GroovyScriptModal
                type={ScriptType.ACTION_DISPLAY}
                variables={[]}
                scriptKey={props.scriptKey}
                script={props.value || ''}
                open={visible}
                onCancel={() => {
                    setVisible(false);
                }}
                onConfirm={(value) => {
                    props.onChange?.(value);
                    setVisible(false);
                }}
                content={ActionScriptContent}
            />

        </>
    )
}


export const ActionStyle: React.FC<ActionStyleProps> = (props) => {

    const [display, setDisplay] = React.useState<ActionDisplayValue>(props.value || {});

    const style = React.useMemo(() => parseActionDisplayStyle(display), [display]);

    const emit = (next: ActionDisplayValue) => {
        setDisplay(next);
        props.onChange?.(next);
    }

    const updateStyle = (patch: Partial<DisplayStyle>) => {
        emit({
            ...display,
            style: JSON.stringify({
                ...style,
                ...patch,
            }),
        });
    }

    return (
        <div>
            <Row gutter={[8, 8]}>
                <Col span={12}>
                    <Space.Compact>
                        <Space.Addon
                            style={{
                                width: '150px',
                            }}
                        >
                            <span>背景颜色</span>
                        </Space.Addon>
                        <ColorPicker
                            value={toPickerColor(style.backgroundColor)}
                            onChange={(value) => {
                                updateStyle({
                                    backgroundColor: toStoreColor(value.toHex())
                                });
                            }}
                        />
                    </Space.Compact>
                </Col>
                <Col span={12}>
                    <Space.Compact>
                        <Space.Addon
                            style={{
                                width: '150px',
                            }}
                        >
                            <span>边框颜色</span>
                        </Space.Addon>
                        <ColorPicker
                            value={toPickerColor(style.borderColor)}
                            onChange={(value) => {
                                updateStyle({
                                    borderColor: toStoreColor(value.toHex())
                                });
                            }}
                        />
                    </Space.Compact>
                </Col>
                <Col span={12}>
                    <Space.Compact>
                        <Space.Addon
                            style={{
                                width: '150px',
                            }}
                        >
                            <span>边框圆角</span>
                        </Space.Addon>
                        <Input
                            type={"number"}
                            style={{
                                width: '150px',
                            }}
                            placeholder={"请输入边框圆角"}
                            value={style.borderRadius}
                            onChange={(event) => {
                                updateStyle({
                                    borderRadius: event.target.value
                                });
                            }}
                        />
                    </Space.Compact>
                </Col>
                <Col span={12}>
                    <Space.Compact>
                        <Space.Addon
                            style={{
                                width: '150px',
                            }}
                        >
                            <span>边框大小</span>
                        </Space.Addon>
                        <Input
                            style={{
                                width: '150px',
                            }}
                            type={"number"}
                            placeholder={"请输入边框大小"}
                            value={style.borderSize}
                            onChange={(event) => {
                                updateStyle({
                                    borderSize: event.target.value
                                });
                            }}
                        />
                    </Space.Compact>
                </Col>
                <Col span={24}>
                    <GroovyScriptLoader
                        content={ActionScript}
                        value={display?.script}
                        onChange={(scriptKey) => {
                            emit({
                                ...display,
                                script: scriptKey,
                            });
                        }}
                    />
                </Col>
            </Row>

        </div>
    )
}
