---
module: "@coding-flow/flow-pc-ui"
name: CardForm
description: 卡片表单组件，将 Ant Design Card 与 Form 组合封装，提供无边框卡片容器内的水平布局表单，支持表单实例控制、值变更监听和提交处理。
---

# CardForm

- **来源**: 自有
- **所属 module**: @coding-flow/flow-pc-ui

## 何时使用

需要将表单放置在带标题的卡片容器中时使用。该组件将 Ant Design 的 Card 和 Form 组合封装，提供无边框卡片样式的水平布局表单，适合用于审批页面、详情编辑页面等需要分区域展示多个表单的场景。支持通过 `CardForm.Item` 声明表单项，通过 `CardForm.useForm()` 获取表单实例。

## 如何引用

```ts
import { CardForm } from '@coding-flow/flow-pc-ui';
```

## API 说明

### CardForm Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `form` | `FormInstance` | - | Ant Design 表单实例，通过 `CardForm.useForm()` 获取 |
| `title` | `string` | - | **必填**，卡片标题 |
| `children` | `React.ReactNode` | - | 表单内容，通常包含 `CardForm.Item` 组件 |
| `onChange` | `(value: any) => void` | - | 表单任意字段值发生变化时触发（对应 Form 的 `onValuesChange`） |
| `onFinish` | `(value: any) => void` | - | 表单提交成功时触发（对应 Form 的 `onFinish`） |
| `initialValue` | `any` | - | 表单初始值（对应 Form 的 `initialValues`） |

### CardForm.Item Props

继承 Ant Design `FormItemProps`，以下为组件内预设的固定行为：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `labelCol` | `{ style: { width: number } }` | `{ style: { width: 200 } }` | 标签列宽度固定为 200px，可通过 `{...props}` 覆盖 |
| `children` | `React.ReactNode` | - | 表单项内容（输入框、选择器等） |

其他属性（`name`、`label`、`rules`、`valuePropName` 等）均继承自 Ant Design `Form.Item`。详见 [Ant Design Form.Item API](https://ant.design/components/form#formitem)。

### 静态方法

| 方法 | 类型 | 说明 |
|------|------|------|
| `CardForm.useForm` | `() => [FormInstance]` | 创建表单实例，内部代理 Ant Design `Form.useForm()` |
| `CardForm.Item` | `React.FC<FormItemProps>` | 表单项组件，预设标签列宽度为 200px |

### Events / Callbacks

| 事件 | 类型 | 说明 |
|------|------|------|
| `onChange` | `(value: any) => void` | 表单值变化回调（对应 Form 的 `onValuesChange`） |
| `onFinish` | `(value: any) => void` | 表单提交回调 |

### Slots / Children

| 插槽 | 说明 |
|------|------|
| `children` | CardForm 的子元素，通常为 `CardForm.Item` 列表 |
| `CardForm.Item` 的 `children` | 表单项控件（如 Input、Select 等） |

## 核心行为

### 组件结构

`CardForm` 采用复合组件模式（类似 Ant Design `Form.FormItem`）：

- **CardFormComponent**：主组件，渲染 Card + Form 容器
- **CardForm.Item**：表单项组件，预设 `labelCol` 宽度为 200px
- **CardForm.useForm**：表单实例创建方法

### Card 容器配置

- 样式变体：无边框（`variant="borderless"`）
- 宽度：100%（`width: '100%'`）
- 外边距：5px（`margin: 5`）

### Form 配置

- 布局方式：水平布局（`layout="horizontal"`）
- 初始值：通过 `initialValue` 属性传入
- 值变更监听：通过 `onChange` 属性回调
- 提交处理：通过 `onFinish` 属性回调

## 使用示例

```tsx
// 基础用法：带卡片标题的表单
import { CardForm } from '@coding-flow/flow-pc-ui';
import { Input, Button } from 'antd';

const UserInfoForm = () => {
    const [form] = CardForm.useForm();

    const handleFinish = (values: any) => {
        console.log('提交数据:', values);
    };

    return (
        <CardForm
            form={form}
            title="用户信息"
            onFinish={handleFinish}
            initialValue={{ name: '张三', age: 25 }}
        >
            <CardForm.Item label="姓名" name="name">
                <Input placeholder="请输入姓名" />
            </CardForm.Item>
            <CardForm.Item label="年龄" name="age">
                <Input placeholder="请输入年龄" />
            </CardForm.Item>
            <CardForm.Item>
                <Button type="primary" htmlType="submit">提交</Button>
            </CardForm.Item>
        </CardForm>
    );
};
```

```tsx
// 监听表单值变化
import { CardForm } from '@coding-flow/flow-pc-ui';
import { Input } from 'antd';

const DynamicForm = () => {
    return (
        <CardForm
            title="动态表单"
            onChange={(changedValues) => {
                console.log('字段变化:', changedValues);
            }}
        >
            <CardForm.Item label="关键字" name="keyword">
                <Input placeholder="输入关键字" />
            </CardForm.Item>
        </CardForm>
    );
};
```

## 注意事项

- `title` 为必填属性，卡片必须提供标题
- `CardForm.Item` 的标签列宽度默认固定为 200px，如需调整可在 Item 上传入 `labelCol` 覆盖
- `onChange` 对应的是 Ant Design Form 的 `onValuesChange`，回调参数 `value` 为变化的字段值对象（非全量表单值）
- 表单布局固定为 `horizontal`（水平布局），不支持通过 Props 修改
- `CardForm.useForm()` 返回的是数组 `[FormInstance]`（注意不是 Ant Design 原生的 `[FormInstance]` 返回方式完全一致，只是返回类型声明上少了第二个元组元素）
