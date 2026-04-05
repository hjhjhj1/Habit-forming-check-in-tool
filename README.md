# Habit-forming-check-in-tool
做一个习惯养成打卡工具，可视化坚持记录。
功能：
习惯创建：名称、图标、颜色、每日目标次数、提醒时间
打卡记录：点击打卡，支持多次打卡，添加备注
统计视图：日历热力图、周/月完成率、连续打卡天数
数据导出：导出为 JSON/图片分享
前端： Vue 3 + TypeScript
后端 Node.js + Express + TypeScript，习惯配置存 JSON（habits/{user}.json），打卡记录存（records/{user}/{YYYY-MM}.json 按月分），不接数据库