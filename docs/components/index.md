# 组件索引

> 本文档由 `/rebuild-components-index` 自动生成。每次 `/write-components` 完成后应自动重建。
> 手动维护本文件会被下一次重建覆盖。

| 组件模块 | 组件名称 | 组件描述（应用场景） | 文档地址 |
|----------|----------|----------------------|----------|
| "@coding-flow/flow-icons" | Icon | 动态图标组件，根据传入的 type 字符串从 @ant-design/icons 按需加载对应图标，支持加载状态处理和图标不存在时的容错处理。 | [@coding-flow__flow-icons_Icon](./@coding-flow__flow-icons_Icon.md) |
| "@coding-flow/flow-mobile-approval" | ApprovalPanel | 移动端流程审批面板入口组件，根据流程记录 ID 或流程设计编码加载审批详情内容，并渲染完整的审批布局（头部、表单主体、操作按钮）。 | [@coding-flow__flow-mobile-approval_ApprovalPanel](./@coding-flow__flow-mobile-approval_ApprovalPanel.md) |
| "@coding-flow/flow-mobile-approval" | FlowApprovalActions | 移动端流程审批操作按钮区域组件，渲染审批动作按钮（通过、驳回、转办等），支持主操作按钮、自定义样式按钮以及"更多操作"弹出面板。 | [@coding-flow__flow-mobile-approval_FlowApprovalActions](./@coding-flow__flow-mobile-approval_FlowApprovalActions.md) |
| "@coding-flow/flow-pc-ui" | CardForm | 卡片表单组件，将 Ant Design Card 与 Form 组合封装，提供无边框卡片容器内的水平布局表单，支持表单实例控制、值变更监听和提交处理。 | [@coding-flow__flow-pc-ui_CardForm](./@coding-flow__flow-pc-ui_CardForm.md) |
| "@coding-flow/flow-pc-ui" | Drawer | 全屏抽屉组件，基于 Ant Design Drawer 封装，默认隐藏标题栏和关闭图标，关闭时自动销毁内容，适用于全屏编辑、详情展示等场景。 | [@coding-flow__flow-pc-ui_Drawer](./@coding-flow__flow-pc-ui_Drawer.md) |
| "@coding-flow/flow-pc-ui" | Panel | 居中内容面板组件，基于 Ant Design Flex 封装，提供左右各 10% 边距的垂直居中布局容器，适用于表单、详情页等内容区域的居中展示。 | [@coding-flow__flow-pc-ui_Panel](./@coding-flow__flow-pc-ui_Panel.md) |
| "@coding-flow/flow-pc-ui" | Table | 数据表格组件，基于 Ant Design Table 封装，内置分页、远程数据请求和工具栏渲染能力，适用于需要服务端分页的标准列表页面。 | [@coding-flow__flow-pc-ui_Table](./@coding-flow__flow-pc-ui_Table.md) |
| "@coding-flow/flow-pc-ui" | Text | 文本省略组件，基于 Ant Design Typography. | [@coding-flow__flow-pc-ui_Text](./@coding-flow__flow-pc-ui_Text.md) |
| @coding-flow/flow-design | DesignImport | 流程设计导入组件，以 Modal 弹窗形式提供流程设计 JSON 文件的上传与导入能力，支持将导出的流程配置文件重新导入系统。 | [@coding-flow__flow-design_DesignImport](./@coding-flow__flow-design_DesignImport.md) |
| @coding-flow/flow-design | DesignPanel | 流程设计属性面板组件，以全屏 Drawer 形式提供流程基本信息、表单设计、流程设计和更多参数四个标签页的编辑能力，内部采用 MVP + Redux 架构管理状态。 | [@coding-flow__flow-design_DesignPanel](./@coding-flow__flow-design_DesignPanel.md) |
| @coding-flow/flow-design | FlowEditor | 流程可视化画布编辑器组件，基于 @flowgram. | [@coding-flow__flow-design_FlowEditor](./@coding-flow__flow-design_FlowEditor.md) |
| @coding-flow/flow-mobile-form | FlowFormView | 移动端流程表单视图组件，根据 mergeable 属性自动切换为单表单渲染模式或合并表单列表模式，支持表单字段权限控制和预览模式。 | [@coding-flow__flow-mobile-form_FlowFormView](./@coding-flow__flow-mobile-form_FlowFormView.md) |
| @coding-flow/flow-mobile-form | FlowList | 移动端合并流程列表组件，支持批量审批（多选模式）和逐条审批（单选模式）两种模式切换，内部使用 ListFormPresenter 管理表单数据。 | [@coding-flow__flow-mobile-form_FlowList](./@coding-flow__flow-mobile-form_FlowList.md) |
| @coding-flow/flow-mobile-ui | Popconfirm | 移动端确认弹窗组件，基于 antd-mobile ActionSheet 实现，点击触发元素后弹出操作面板进行二次确认操作。 | [@coding-flow__flow-mobile-ui_Popconfirm](./@coding-flow__flow-mobile-ui_Popconfirm.md) |
| @coding-flow/flow-mobile-ui | PopupModal | 移动端底部弹出模态框组件，基于 antd-mobile Popup 实现，提供标题栏和取消/确定操作按钮，适用于筛选、选择等需要弹出面板的场景。 | [@coding-flow__flow-mobile-ui_PopupModal](./@coding-flow__flow-mobile-ui_PopupModal.md) |
| @coding-flow/flow-mobile-ui | TextIcon | 移动端文字图标组件，将文本前两个字符显示在圆形蓝色背景中，常用于头像、流程节点图标等场景。 | [@coding-flow__flow-mobile-ui_TextIcon](./@coding-flow__flow-mobile-ui_TextIcon.md) |
| @coding-flow/flow-pc-approval | ApprovalPanel | 流程审批面板组件，根据 recordId 或 workflowCode 从后端加载流程详情（FlowContent），并以全屏布局展示审批表单、流程历史、操作按钮等内容，内部集成 Redux 状态管理和 MVP 架构。 | [@coding-flow__flow-pc-approval_ApprovalPanel](./@coding-flow__flow-pc-approval_ApprovalPanel.md) |
| @coding-flow/flow-pc-approval | ApprovalPanelDrawer | 流程审批抽屉组件，以 Ant Design Drawer 形式包裹 ApprovalPanel，在侧边抽屉中展示流程审批详情，适用于列表页快速办理审批的场景。 | [@coding-flow__flow-pc-approval_ApprovalPanelDrawer](./@coding-flow__flow-pc-approval_ApprovalPanelDrawer.md) |
| @coding-flow/flow-pc-approval | FlowApprovalActions | 流程审批操作按钮组组件，根据当前流程状态动态渲染审批操作按钮（通过、驳回、转办等），并内置催办、撤回、关闭三个通用操作按钮，通过 ActionFactory 工厂模式映射操作类型到对应组件。 | [@coding-flow__flow-pc-approval_FlowApprovalActions](./@coding-flow__flow-pc-approval_FlowApprovalActions.md) |
| @coding-flow/flow-pc-approval | FlowMock | 流程模拟测试组件，提供完整的模拟审批测试环境，包含待办、已办、抄送、全部流程四个标签页，支持发起流程、办理审批、查看详情等操作，适用于开发调试和功能演示。 | [@coding-flow__flow-pc-approval_FlowMock](./@coding-flow__flow-pc-approval_FlowMock.md) |
| @coding-flow/flow-pc-approval | FlowTitle | 流程标题渲染组件，用于将后端返回的 HTML 格式流程标题安全地渲染为 DOM 内容，支持富文本标题展示。 | [@coding-flow__flow-pc-approval_FlowTitle](./@coding-flow__flow-pc-approval_FlowTitle.md) |
| @coding-flow/flow-pc-approval | WorkflowSelectModal | 流程选择弹窗组件，以 Modal 形式展示所有可用的流程定义列表，用户点击按钮选择要发起的流程，适用于发起流程时的流程类型选择场景。 | [@coding-flow__flow-pc-approval_WorkflowSelectModal](./@coding-flow__flow-pc-approval_WorkflowSelectModal.md) |
| @coding-flow/flow-pc-form | FlowFormView | 流程表单视图组件，根据是否可合并（mergeable）自动切换为单表单渲染或多条记录表格展示。 | [@coding-flow__flow-pc-form_FlowFormView](./@coding-flow__flow-pc-form_FlowFormView.md) |
| @coding-flow/flow-pc-form | FlowTable | 合并流程表格组件，以 Ant Design Table 形式展示多条待合并的流程记录，支持行选择、记录查看切换和表单详情展示。 | [@coding-flow__flow-pc-form_FlowTable](./@coding-flow__flow-pc-form_FlowTable.md) |
