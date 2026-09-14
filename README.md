<!-- ZH-CN -->

# SillyTavern Music Book

> 让角色成为你的音乐制作人。

SillyTavern Music Book 是一个云端 Web 应用，用来把 SillyTavern 聊天记录、角色记忆和补充设定整理成 AI 音乐创作笔记。你可以导入聊天、分页阅读、标记创作灵感、配置音乐参数，然后生成可直接复制到 Suno / Udio 等 AI 音乐平台的歌名、歌词结构和风格描述。

在线访问：[https://jlyang1900.github.io/SillyTavernMusicBook/](https://jlyang1900.github.io/SillyTavernMusicBook/)

## 功能概览

| 模块 | 功能 |
| --- | --- |
| 聊天阅读器 | 导入 `.json` / `.jsonl` / `.txt` 聊天记录，分页浏览，本地 IndexedDB 持久化存储 |
| 阅读体验 | 支持深色模式、页码跳转、书签定位、阅读器文本字号调节 |
| 记忆选择 | 在消息旁标记创作记忆，按当前对话和故事过滤灵感素材 |
| 书签列表 | 收藏重点消息，并从书签面板快速跳回原文位置 |
| 故事分组 | 创建故事主题，为不同创作线索整理对应记忆 |
| 补充背景 | 添加角色设定、世界观、剧情补充等额外信息，并选择性加入生成 |
| AI 创作 | 配置角色名、人声音域、音色、主流派、子流派、乐器、歌词语言、歌词模式和韵脚方案 |
| 作品面板 | 左右等宽展示结构化创作笔记和完整 Output Content，长内容在面板内滚动 |
| 音频播放器 | Braun SK4 风格播放器，支持上传本地音频或添加外链试听 |
| 移动端 | 响应式布局、触控优化、移动侧边栏、自然滚动和安全区域适配 |

## 快速开始

1. 打开在线应用。
2. 在侧边栏点击「API」，选择模型并填写对应服务商的 API Key。
3. 导入 SillyTavern 聊天记录。
4. 在阅读器中标记适合作为歌词灵感的记忆，可按需添加书签、故事和背景信息。
5. 切换到「创作」，设置角色和音乐参数。
6. 点击「AI 创作」，在「作品」面板复制结构化结果或完整输出。

## API 与模型

应用现在支持 Gemini 与 DeepSeek 两类模型。不同服务商的 Key 会分别保存，切换模型时 API 面板会自动切换 Key 标签、占位符和获取链接。

### Gemini

获取 Key：[Google AI Studio](https://aistudio.google.com/app/apikey)

| 模型 | 说明 |
| --- | --- |
| `gemini-2.5-flash` | 默认模型，适合日常快速生成 |
| `gemini-2.5-pro` | 适合更重质量和创意的生成 |
| `gemini-3.7-flash` | 新增 Flash 模型 |
| `gemini-3.6-flash` | 新增 Flash 模型 |
| `gemini-3.5-flash` | 新增 Flash 模型 |
| `gemini-3.5-flash-lite` | 新增轻量模型 |
| `gemini-3.1-flash-lite` | 新增轻量模型 |

Gemini 模型通过 Google `generateContent` 接口调用。

### DeepSeek

获取 Key：[DeepSeek API Keys](https://platform.deepseek.com/api_keys)

| 模型 | 说明 |
| --- | --- |
| `deepseek-v4-flash` | 新增 DeepSeek Flash 模型 |

DeepSeek 模型通过 OpenAI-compatible `chat/completions` 接口调用。

## 创作参数

### 人声

- 音域：女高音、女中音、女低音、男高音、男中音、男低音，或根据人设推断。
- 音色：Auto、烟嗓、清澈、温暖、粗砺、明亮、暗淡、深情等选项。

### 音乐风格

- 主流派：流行、摇滚、民谣、嘻哈、电子、古典、爵士、R&B、世界音乐等。
- 子流派：每个主流派下有细分风格，并带说明文本辅助选择。
- 乐器：可选择推荐乐器，也可以手动输入自定义乐器。

### 歌词

- 语言：中文、英文、日文、韩文、粤语、自定义等。
- 内容模式：根据剧情回忆创作，或输入自定义关键词。
- 韵脚方案：不押韵、ABCB、AABB、ABAB、AAAA。

## 阅读器更新

阅读器新增了文本字号控制：

- 阅读器标题栏提供缩小 / 放大按钮。
- 设置面板中也可以调整字号。
- 字号范围为 `11px` 到 `31px`，每次调整 `2px`。
- 当前字号会保存到本地，下次打开自动恢复。

## 作品面板更新

「作品」面板已重新整理布局：

- 左侧显示歌名、歌词结构、风格三个结构化区块。
- 右侧显示完整 `Output Content`。
- 桌面端左右两栏等宽分布。
- 长内容在各自面板内部滚动，避免 Output 面板被挤出画面。
- 平板和手机端自动改为上下堆叠布局。

## 输出格式示例

```text
一、歌名
星空下的约定

二、歌词结构：
[Verse]
夜风轻轻吹过发梢
你的笑容在记忆里闪耀

[Chorus]
星空下的约定 永远铭记
你的眼眸是我唯一的方向

三、风格
1.公式：[流行音乐] + [Dream Pop] + [钢琴 + 合成器] + [温柔怀念]
2.BPM: 110-130 (Upbeat)
3.人声指定：女 女高音 (Soprano) | 音色：空灵、略带气声
The instrumentation features Piano playing gentle, flowing arpeggios...
```

## 本地运行

这是一个静态 Web 应用，直接打开 `index.html` 即可使用。也可以在项目目录启动一个本地静态服务器：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 数据与隐私

- 导入的聊天记录存储在浏览器本地 IndexedDB。
- API Key 存储在浏览器 localStorage。
- 创作请求只会在点击「AI 创作」时发送给当前选择模型对应的服务商。

## 相关链接

- [ST_Music](https://github.com/JLYANG1900/ST_Music)
- [SillyTavern](https://github.com/SillyTavern/SillyTavern)
- [Google AI Studio](https://aistudio.google.com/)
- [DeepSeek Platform](https://platform.deepseek.com/)

---

SillyTavern Music Book - Based on ST_Music by JLYANG1900

<!-- EN-US -->

# SillyTavern Music Book

> Turn your character into your music producer.

SillyTavern Music Book is a cloud web app that turns SillyTavern chat logs, character memories, and supplemental lore into AI music creation notes. You can import chats, read them page by page, mark memories as creative material, configure musical parameters, and generate titles, lyric structures, and style prompts that can be copied directly into AI music tools such as Suno or Udio.

Live app: [https://jlyang1900.github.io/SillyTavernMusicBook/](https://jlyang1900.github.io/SillyTavernMusicBook/)

## Feature Overview

| Module | Features |
| --- | --- |
| Chat Reader | Imports `.json`, `.jsonl`, and `.txt` chat logs, supports paged reading, and persists data locally with IndexedDB |
| Reading Experience | Supports dark mode, page jumping, bookmark navigation, and adjustable reader text size |
| Memory Selection | Marks messages as creative memories and filters source material by the current chat and story |
| Bookmark List | Saves important messages and jumps back to the original message from the bookmark panel |
| Story Groups | Creates story topics to organize memories for different creative threads |
| Background Notes | Adds character profiles, worldbuilding, plot context, and other optional generation material |
| AI Creation | Configures character name, vocal range, timbre, genre, subgenre, instruments, lyric language, lyric mode, and rhyme scheme |
| Works Panel | Shows structured creation notes and full Output Content in equal-width columns, with long content scrolling inside each panel |
| Audio Player | Braun SK4-inspired player with local audio upload and external audio links |
| Mobile Support | Responsive layout, touch-friendly controls, mobile sidebar, natural scrolling, and safe-area handling |

## Quick Start

1. Open the live app.
2. Click "API" in the sidebar, choose a model, and enter the API Key for the selected provider.
3. Import a SillyTavern chat log.
4. In the reader, mark memories that can inspire lyrics. Add bookmarks, stories, and background notes when needed.
5. Switch to "Creator" and configure the character and music parameters.
6. Click "AI Create", then copy the structured result or full output from the "Works" panel.

## API and Models

The app now supports both Gemini and DeepSeek models. Keys are stored separately per provider. When you switch models, the API panel automatically updates the key label, placeholder, and provider link.

### Gemini

Get a key: [Google AI Studio](https://aistudio.google.com/app/apikey)

| Model | Notes |
| --- | --- |
| `gemini-2.5-flash` | Default model for fast everyday generation |
| `gemini-2.5-pro` | Better suited for higher-quality or more creative generation |
| `gemini-3.7-flash` | Added Flash model |
| `gemini-3.6-flash` | Added Flash model |
| `gemini-3.5-flash` | Added Flash model |
| `gemini-3.5-flash-lite` | Added lightweight model |
| `gemini-3.1-flash-lite` | Added lightweight model |

Gemini models use Google's `generateContent` endpoint.

### DeepSeek

Get a key: [DeepSeek API Keys](https://platform.deepseek.com/api_keys)

| Model | Notes |
| --- | --- |
| `deepseek-v4-flash` | Added DeepSeek Flash model |

DeepSeek models use the OpenAI-compatible `chat/completions` endpoint.

## Creation Parameters

### Vocal Settings

- Vocal range: soprano, mezzo-soprano, contralto, tenor, baritone, bass, or inferred from the character profile.
- Timbre: Auto, husky, clean, warm, gritty, bright, dark, soulful, and more.

### Musical Style

- Main genres: pop, rock, folk, hip-hop, electronic, classical, jazz, R&B, world music, and more.
- Subgenres: each main genre includes detailed subgenre options with descriptions.
- Instruments: choose suggested instruments or enter a custom instrument manually.

### Lyrics

- Language: Chinese, English, Japanese, Korean, Cantonese, custom, and more.
- Content mode: generate from plot memories or provide custom keywords.
- Rhyme schemes: none, ABCB, AABB, ABAB, AAAA.

## Reader Updates

The reader now supports text-size controls:

- The reader header includes smaller / larger buttons.
- The settings panel also includes the same font-size controls.
- Font size ranges from `11px` to `31px`, changing by `2px` each step.
- The selected size is saved locally and restored next time.

## Works Panel Updates

The "Works" panel layout has been rebuilt:

- The left column shows title, lyric structure, and style sections.
- The right column shows the full `Output Content`.
- Desktop layout uses equal-width columns.
- Long content scrolls inside its own panel, preventing the Output panel from being pushed off screen.
- Tablet and mobile layouts automatically stack the panels vertically.

## Output Example

```text
一、歌名
星空下的约定

二、歌词结构：
[Verse]
夜风轻轻吹过发梢
你的笑容在记忆里闪耀

[Chorus]
星空下的约定 永远铭记
你的眼眸是我唯一的方向

三、风格
1.公式：[流行音乐] + [Dream Pop] + [钢琴 + 合成器] + [温柔怀念]
2.BPM: 110-130 (Upbeat)
3.人声指定：女 女高音 (Soprano) | 音色：空灵、略带气声
The instrumentation features Piano playing gentle, flowing arpeggios...
```

## Local Development

This is a static web app. You can open `index.html` directly, or start a local static server from the project directory:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Data and Privacy

- Imported chat logs are stored locally in browser IndexedDB.
- API keys are stored in browser localStorage.
- Generation requests are sent only when you click "AI Create", and only to the provider for the currently selected model.

## Related Links

- [ST_Music](https://github.com/JLYANG1900/ST_Music)
- [SillyTavern](https://github.com/SillyTavern/SillyTavern)
- [Google AI Studio](https://aistudio.google.com/)
- [DeepSeek Platform](https://platform.deepseek.com/)

---

SillyTavern Music Book - Based on ST_Music by JLYANG1900
