# 习惯养成打卡工具

一个美观的习惯养成打卡应用，帮助你记录和追踪日常习惯，可视化你的坚持历程。

## ✨ 功能特性

### 📝 习惯管理
- 创建习惯：自定义名称、图标、颜色、每日目标次数、提醒时间
- 编辑习惯：随时修改习惯设置
- 删除习惯：移除不需要的习惯

### ✅ 打卡记录
- 快速打卡：一键完成打卡
- 多次打卡：支持每日多次打卡
- 添加备注：记录打卡时的感受

### 📊 统计数据
- 连续打卡：查看每个习惯的连续打卡天数
- 日历热力图：可视化每日打卡强度
- 完成率统计：查看月度完成率

### 📤 数据导出
- JSON导出：导出所有数据为JSON格式
- 图片导出：导出统计图表（需额外库支持）

## 🛠️ 技术栈

### 前端
- Vue 3 + TypeScript
- Vite
- Vue Router
- Axios
- Day.js

### 后端
- Node.js + Express + TypeScript
- 文件存储（JSON）

## 🚀 快速开始

### 安装依赖
```bash
# 安装所有依赖（前后端）
npm run install-all
```

### 开发模式
```bash
# 同时启动前后端开发服务器
npm run dev
```

### 单独启动
```bash
# 启动后端（端口3001）
npm run dev:backend

# 启动前端（端口3000）
npm run dev:frontend
```

### 生产构建
```bash
# 构建前后端
npm run build

# 启动后端
npm start
```

## 📁 项目结构

```
Habit-forming-check-in-tool/
├── backend/                 # 后端项目
│   ├── src/
│   │   ├── types.ts        # 类型定义
│   │   ├── dataStore.ts    # 数据存储
│   │   ├── routes/         # API路由
│   │   └── index.ts        # 入口文件
│   ├── data/               # 数据目录（运行时生成）
│   │   ├── habits/         # 习惯配置
│   │   └── records/        # 打卡记录
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # 前端项目
│   ├── src/
│   │   ├── components/     # 组件
│   │   ├── views/          # 页面
│   │   ├── types.ts        # 类型定义
│   │   ├── api.ts          # API调用
│   │   └── main.ts         # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## 📊 数据存储

- **习惯配置**: `backend/data/habits/{userId}.json`
- **打卡记录**: `backend/data/records/{userId}/{YYYY-MM}.json`

## 🔌 API接口

### 习惯管理
- `GET /api/habits/:userId` - 获取所有习惯
- `POST /api/habits/:userId` - 创建习惯
- `PUT /api/habits/:userId/:habitId` - 更新习惯
- `DELETE /api/habits/:userId/:habitId` - 删除习惯

### 打卡记录
- `GET /api/records/:userId?yearMonth=YYYY-MM` - 获取月度记录
- `POST /api/records/:userId` - 打卡
- `DELETE /api/records/:userId/:recordId?yearMonth=YYYY-MM` - 删除记录

### 统计数据
- `GET /api/stats/:userId?yearMonth=YYYY-MM` - 获取月度统计

## 🎨 界面预览

- 首页：习惯列表和打卡功能
- 统计页：热力图、连续打卡、完成率

## 📝 使用说明

1. 访问 http://localhost:3000
2. 点击"添加习惯"创建你的第一个习惯
3. 每天打卡记录你的坚持
4. 在统计页查看你的进度和成就

## 📄 许可证

MIT License