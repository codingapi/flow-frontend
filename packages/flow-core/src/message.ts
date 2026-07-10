/**
 * FlowMessageRegistry — 流程消息注册表（单例）
 *
 * 框架不预设消息内容，只提供键名和上下文数据。
 * 下游 App 通过 register/registerAll 覆盖默认消息，
 * 支持字符串模板 {placeholder} 和函数模板 (data) => string。
 *
 * 用法：
 *   const registry = FlowMessageRegistry.getInstance();
 *   // 注册自定义消息
 *   registry.register('approval.save', (data) =>
 *     data.isStartNode ? `流程 ${data.flowName} 已发起` : `流程 ${data.flowName} 已保存`
 *   );
 *   // 获取消息（组件内）
 *   message.success(registry.get('approval.save', presenter.buildActionContext()));
 */

// ---------------------------------------------------------------------------
// 消息键常量
// ---------------------------------------------------------------------------

export const FlowMessageKey = {
  // ---- HTTP 系统层 ----
  HTTP_TOKEN_EXPIRED: 'http.token.expired',
  HTTP_NO_PERMISSION: 'http.no_permission',

  // ---- 审批动作 ----
  APPROVAL_PASS: 'approval.pass',
  APPROVAL_REJECT: 'approval.reject',
  APPROVAL_DELEGATE: 'approval.delegate',
  APPROVAL_ADD_AUDIT: 'approval.add_audit',
  APPROVAL_TRANSFER: 'approval.transfer',
  APPROVAL_RETURN: 'approval.return',
  APPROVAL_REVOKE: 'approval.revoke',
  APPROVAL_URGE: 'approval.urge',
  APPROVAL_CUSTOM: 'approval.custom',
  /** 保存 — 上下文包含 isStartNode，下游可自行区分 */
  APPROVAL_SAVE: 'approval.save',
  /** 合并审批未选择流程 */
  APPROVAL_NO_SELECTED: 'approval.no_selected',

  // ---- 流程设计器 ----
  DESIGN_SAVE: 'design.save',
  DESIGN_VERSION_SAVED: 'design.version_saved',
  DESIGN_VERSION_DELETED: 'design.version_deleted',
  DESIGN_IMPORT_SUCCESS: 'design.import_success',
  DESIGN_DOWNLOAD_SUCCESS: 'design.download_success',
  DESIGN_SCRIPT_COMPILE_SUCCESS: 'design.script_compile_success',
  DESIGN_SCRIPT_COMPILE_FAILED: 'design.script_compile_failed',
  DESIGN_SCRIPT_COMPILE_ERROR: 'design.script_compile_error',
  DESIGN_VIEW_CODE_SAVE_SUCCESS: 'design.view_code_save_success',
  DESIGN_GROOVY_META_FAILED: 'design.groovy_meta_failed',

  // ---- App 层 ----
  APP_LOGIN_SUCCESS: 'app.login_success',
  APP_USER_DELETED: 'app.user_deleted',
  APP_USER_SAVED: 'app.user_saved',
  APP_WORKFLOW_STATUS_CHANGED: 'app.workflow.status_changed',
  APP_WORKFLOW_DELETED: 'app.workflow.deleted',
} as const;

export type FlowMessageKey = (typeof FlowMessageKey)[keyof typeof FlowMessageKey];

// ---------------------------------------------------------------------------
// 类型定义
// ---------------------------------------------------------------------------

/** 消息模板：字符串模板 或 函数模板 */
export type MessageTemplate = string | ((data: any) => string);

// ---------------------------------------------------------------------------
// FlowMessageRegistry 单例
// ---------------------------------------------------------------------------

export class FlowMessageRegistry {
  private static instance: FlowMessageRegistry;
  private messages: Record<string, MessageTemplate>;

  private constructor() {
    this.messages = { ...getDefaultMessages() };
  }

  static getInstance(): FlowMessageRegistry {
    if (!FlowMessageRegistry.instance) {
      FlowMessageRegistry.instance = new FlowMessageRegistry();
    }
    return FlowMessageRegistry.instance;
  }

  /**
   * 注册或覆盖单个消息模板
   * @param key    消息键
   * @param template  字符串模板（`{placeholder}`）或函数 `(data) => string`
   */
  register(key: string, template: MessageTemplate): void {
    this.messages[key] = template;
  }

  /**
   * 批量注册或覆盖消息模板
   */
  registerAll(msgs: Record<string, MessageTemplate>): void {
    Object.assign(this.messages, msgs);
  }

  /**
   * 获取消息文本
   * @param key   消息键
   * @param data  上下文数据，用于字符串模板的 {placeholder} 替换或作为函数模板的参数
   * @returns     解析后的消息文本；未找到对应键则返回键名本身
   */
  get(key: string, data?: any): string {
    const tpl = this.messages[key];
    if (!tpl) return key;

    if (typeof tpl === 'function') {
      return tpl(data ?? {});
    }

    // 字符串模板：替换 {placeholder}
    return tpl.replace(/\{(\w+)\}/g, (_, k: string) => {
      const v = data?.[k];
      return v !== undefined && v !== null ? String(v) : '';
    });
  }
}

// ---------------------------------------------------------------------------
// 内置默认消息（对应改造前硬编码的内容）
// ---------------------------------------------------------------------------

function getDefaultMessages(): Record<string, MessageTemplate> {
  return {
    // HTTP 系统
    [FlowMessageKey.HTTP_TOKEN_EXPIRED]: '登录已过期，请退出再重新打开',
    [FlowMessageKey.HTTP_NO_PERMISSION]: '抱歉，该账户无权限访问',

    // 审批动作 — 保存（用函数模板，下游可区分开始/非开始节点）
    [FlowMessageKey.APPROVAL_SAVE]: (data: any) =>
      data?.isStartNode ? '流程数据已保存' : '流程数据已保存',

    [FlowMessageKey.APPROVAL_PASS]: '操作成功',
    [FlowMessageKey.APPROVAL_REJECT]: '操作成功',
    [FlowMessageKey.APPROVAL_DELEGATE]: '操作成功',
    [FlowMessageKey.APPROVAL_ADD_AUDIT]: '操作成功',
    [FlowMessageKey.APPROVAL_TRANSFER]: '操作成功',
    [FlowMessageKey.APPROVAL_RETURN]: '操作成功',
    [FlowMessageKey.APPROVAL_REVOKE]: '流程已撤回',
    [FlowMessageKey.APPROVAL_URGE]: '已发送催办提醒.',
    [FlowMessageKey.APPROVAL_CUSTOM]: '操作成功',
    [FlowMessageKey.APPROVAL_NO_SELECTED]: '请先选择审批流程.',

    // 流程设计器
    [FlowMessageKey.DESIGN_SAVE]: '流程已经保存.',
    [FlowMessageKey.DESIGN_VERSION_SAVED]: '版本已保存',
    [FlowMessageKey.DESIGN_VERSION_DELETED]: '版本已删除',
    [FlowMessageKey.DESIGN_IMPORT_SUCCESS]: '流程已导入成功',
    [FlowMessageKey.DESIGN_DOWNLOAD_SUCCESS]: '下载 {format} 成功',
    [FlowMessageKey.DESIGN_SCRIPT_COMPILE_SUCCESS]: '脚本编译成功',
    [FlowMessageKey.DESIGN_SCRIPT_COMPILE_FAILED]: (data: any) =>
      `脚本编译失败: ${data?.message ?? ''}`,
    [FlowMessageKey.DESIGN_SCRIPT_COMPILE_ERROR]: '脚本编译请求失败',
    [FlowMessageKey.DESIGN_VIEW_CODE_SAVE_SUCCESS]: '保存成功',
    [FlowMessageKey.DESIGN_GROOVY_META_FAILED]: '获取脚本元数据失败',

    // App 层
    [FlowMessageKey.APP_LOGIN_SUCCESS]: 'login success',
    [FlowMessageKey.APP_USER_DELETED]: '用户已删除',
    [FlowMessageKey.APP_USER_SAVED]: '用户已保存',
    [FlowMessageKey.APP_WORKFLOW_STATUS_CHANGED]: '状态已变更',
    [FlowMessageKey.APP_WORKFLOW_DELETED]: '流程已删除',
  };
}
