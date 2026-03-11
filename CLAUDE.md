## 开发规范

### 文件命名规范

- 使用小写字母 + 下划线组合（如 `script_editor.tsx`、`variable_picker.tsx`）

### 导入规范

```typescript
// ✅ 正确：使用 @/ 路径别名引入其他模块的代码
import { GroovySyntaxConverter } from '@/components/design-editor/script/service/groovy-syntax-converter';
import { ScriptType } from '@/components/design-editor/typings/groovy-script';

// ✅ 正确：引入当前文件夹下的内容使用相对路径
import { LocalHelper } from './local-helper';
import { AnotherUtil } from './utils/another-util';

// ❌ 错误：避免跨目录使用相对路径
import { GroovySyntaxConverter } from '../../../src/components/...';
```

### 样式规范

- 组件样式使用 `.module.scss` 模块化方式引入
- 禁止在 TSX 文件中使用内联 `style` 对象定义样式

### 面向对象开发规范

TypeScript 代码根据类型和复杂度选择合适的开发风格：

- **Hooks**：使用函数式方式定义，遵循 React Hooks 规范
- **业务处理类**（Service、Context、Converter、Utils 等）：根据复杂度选择，复杂逻辑使用 class 便于扩展和维护，简单功能可用函数式
- **工具函数**：根据场景选择，复杂逻辑使用 class，简单工具可用函数式
