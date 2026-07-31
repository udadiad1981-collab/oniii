<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

## 📝 2026-07-31 更新记录

### 繁体中文转换完成
- **前台**: 所有翻译文件、分类名、产品名全部改为繁体中文
- **后台**: login/dashboard/products/orders 页面全部繁体化
- **SEO**: 元数据、标题、描述全部改为繁体中文

### 新增功能
- **第 8 分类**: 雪茄煙草 (cigars-tobacco)
- **默认语言**: 改为英文 (en)

### Git 提交记录
| Commit ID | 说明 |
|-----------|------|
| c527e49 | docs: 添加 2026-07-31 工作总结 |
| 7cb8f56 | feat: 后台管理界面转换为繁体中文 |
| 486192a | fix: 修复 SEO 和繁体中文问题 |

### 线上状态
- **网站**: https://oniii.com ✅ 已部署繁体中文版本
- **前台**: /zh 路径显示繁体中文
- **后台**: /admin 路径已改为繁体中文
