# Music Creator Cloud 🎵

> **让角色成为你的音乐制作人 — 云端版**  
> *AI-powered music creation from your roleplay memories*

Music Creator Cloud 是一个云端 Web 应用，将 SillyTavern 聊天记录转化为 AI 音乐创作灵感。导入对话、标记记忆、生成专属歌曲创作笔记，直接用于 Suno / Udio 等 AI 音乐平台。

🔗 **在线访问**: [https://jlyang1900.github.io/SillyTavernBook/](https://jlyang1900.github.io/SillyTavernBook/)

## ✨ 功能特色

| 模块 | 功能 |
|------|------|
| 📚 **聊天阅读器** | 导入 `.json`/`.jsonl` 聊天记录，分页浏览，本地持久化存储 |
| ⭐ **记忆书签** | 点击消息旁的 ★ 标记为创作灵感，支持跨消息组合 |
| 🎨 **AI 创作面板** | 设置角色名、音域、流派、乐器、歌词语言/模式/韵脚，一键生成 |
| 📝 **创作笔记输出** | 歌名 + 歌词结构 + 风格公式，专为 Suno/Udio 格式优化 |
| 📻 **音频播放器** | Braun SK4 复古风格，支持添加链接和本地试听 |
| 📋 **补充背景信息** | 添加角色设定/世界观等额外创作素材，可选择性加入创作 |
| 🌓 **深色模式** | 支持日间/夜间主题切换 |

## 🚀 快速开始

### 1. 获取 API Key
前往 [Google AI Studio](https://aistudio.google.com/app/apikey) 获取 Gemini API Key

### 2. 配置 API
点击侧边栏 🔑 按钮，输入 API Key 并选择模型

### 3. 开始创作
```
导入聊天 → 标记记忆 ★ → 切换到创作 Tab → 设置参数 → 点击生成 → 复制到 Suno
```

## ⚙️ API 配置

| 模型 | 特点 | 推荐场景 |
|------|------|----------|
| Gemini 2.5 Flash | 速度快、免费额度高 | 日常使用 |
| Gemini 2.5 Pro | 创意更强、输出质量高 | 追求质量 |

## 🎨 创作参数

### 人声设置
- **音域**: 男低音 ~ 女高音，或根据人设推断
- **音色**: 磁性、清亮、沙哑、空灵等 8 种选项

### 音乐风格
- **主流派**: 10 种（流行、摇滚、电子、R&B、嘻哈...）
- **子流派**: 每个主流派下多种细分风格
- **乐器**: 预设 + 自定义，描述乐器的演奏方式

### 歌词设置
- **语言**: 中文 / 英文 / 自定义
- **模式**: 自定义关键词 / 根据剧情回忆创作
- **韵脚**: 无 / AABB / ABAB / ABBA / 自由

## 📱 移动端支持

- ✅ 响应式布局，适配手机、平板
- ✅ 触控优化（44px 最小触控区域）
- ✅ iOS 安全区域适配（刘海屏）
- ✅ 小屏幕自动隐藏侧边栏

## 📝 输出格式示例

```
一、歌名
《星空下的约定》

二、歌词结构：
[Verse]
夜风轻轻吹过发梢
你的笑容在记忆里闪耀

[Chorus]
星空下的约定 永远铭记
你的眼眸是我唯一的方向
...

三、风格
1.公式：[流行音乐] + [Dream Pop] + [钢琴 + 合成器] + [温柔怀念]
2.BPM: 110-130 (Upbeat)
3.人声指定：女 女高音 (Soprano) | 音色：空灵、略带气声
The instrumentation features Piano playing gentle, flowing arpeggios...
```

## 🎵 设计风格

采用 **Braun SK4** "Snow White's Coffin" 设计语言：
- 极简、复古、温暖的配色
- 扬声器网格纹理背景
- 圆角按钮与卡片式布局

## 🔗 相关链接

- [ST_Music](https://github.com/JLYANG1900/ST_Music) - SillyTavern 插件版本
- [SillyTavern](https://github.com/SillyTavern/SillyTavern) - AI 角色扮演平台
- [Google AI Studio](https://aistudio.google.com/) - 获取 Gemini API

---

*Music Creator Cloud - Based on ST_Music by JLYANG1900*
