/**
 * Music Creator Cloud - Gemini API Integration
 * Generates complete music creation notes in ST_Music format
 */

const GeminiAPI = {
    apiKey: null,
    model: 'gemini-2.5-flash',

    /**
     * Initialize API from localStorage
     */
    init() {
        this.loadConfig();
    },

    /**
     * Load API configuration from localStorage
     */
    loadConfig() {
        this.apiKey = localStorage.getItem('mcc_gemini_api_key') || null;
        this.model = localStorage.getItem('mcc_gemini_model') || 'gemini-2.5-flash';
        this.updateStatusUI();
    },

    /**
     * Save API configuration
     */
    saveConfig() {
        const keyInput = document.getElementById('api-key-input');
        const modelInputs = document.querySelectorAll('input[name="api-model"]');

        if (keyInput && keyInput.value.trim()) {
            this.apiKey = keyInput.value.trim();
            localStorage.setItem('mcc_gemini_api_key', this.apiKey);
        }

        modelInputs.forEach(input => {
            if (input.checked) {
                this.model = input.value;
                localStorage.setItem('mcc_gemini_model', this.model);
            }
        });

        this.updateStatusUI();
        App.ui.showToast('API 配置已保存');
        App.ui.closePanel();
    },

    /**
     * Update API status display
     */
    updateStatusUI() {
        const statusEl = document.getElementById('api-status-text');
        const keyInput = document.getElementById('api-key-input');

        if (statusEl) {
            if (this.apiKey) {
                statusEl.textContent = `已配置 · ${this.model}`;
                statusEl.classList.add('configured');
            } else {
                statusEl.textContent = '未配置';
                statusEl.classList.remove('configured');
            }
        }

        // 回填 API Key (masked)
        if (keyInput && this.apiKey) {
            keyInput.value = this.apiKey;
        }

        // 回填 model 选择
        const modelInputs = document.querySelectorAll('input[name="api-model"]');
        modelInputs.forEach(input => {
            input.checked = (input.value === this.model);
        });
    },

    /**
     * Check if API is configured
     */
    isConfigured() {
        return !!this.apiKey;
    },

    /**
     * Generate complete music creation notes
     * @param {Object} params - Creation parameters
     * @returns {Promise<Object>} - Parsed music note with title, lyrics, style
     */
    async generateMusicNote(params) {
        if (!this.apiKey) {
            throw new Error('请先配置 Gemini API Key');
        }

        const {
            characterName,
            memoryText,
            backgroundInfo,
            vocalRange,
            gender,
            voiceTimbre,       // 新增：声部音色
            mainGenre,
            subGenre,
            instruments,
            bpm,
            lyricLanguage,     // 新增：歌词语言
            lyricMode,         // 新增：歌词模式
            customKeywords,
            rhymeScheme        // 新增：韵脚方案
        } = params;

        // Extract genre names (remove parentheses)
        const mainGenreName = mainGenre.split(' ')[0];
        const subGenreName = subGenre.split(' (')[0];
        const genderChar = gender || vocalRange.charAt(0);

        // 构建音色文本
        let timbreText = "";
        if (voiceTimbre) {
            timbreText = voiceTimbre.includes('Auto')
                ? " | 音色：根据角色人设推断合理的音色"
                : ` | 音色：${voiceTimbre}`;
        }

        // 构建语言文本
        let langText = lyricLanguage ? `；语言：${lyricLanguage}` : "";

        // 构建韵脚文本
        let rhymeText = "";
        if (rhymeScheme && rhymeScheme !== "不押韵") {
            rhymeText = `；韵脚方案：${rhymeScheme}`;
        }

        // 构建关键词文本
        let keywordText = "（无）";
        if (lyricMode === 'custom' && customKeywords) {
            keywordText = `（${customKeywords}）`;
        } else if (lyricMode === 'plot') {
            keywordText = "（根据已选择的记忆自动生成）";
        }

        const prompt = `你是一位专业的音乐制作人助手，同时也是一位有情感共鸣能力的创作者。

请以角色「${characterName}」的视角，基于以下对话记忆，创作一份完整的音乐创作笔记。

## 对话记忆（创作灵感来源）
${memoryText}
${backgroundInfo ? `
## 补充背景信息
${backgroundInfo}
` : ''}
## 用户指定的音乐风格参数
- 主流派：${mainGenre}
- 子流派：${subGenre}
- 主乐器：${instruments}
- BPM：${bpm}
- 人声：${genderChar} ${vocalRange}${timbreText}
${lyricLanguage ? `- 歌词语言：${lyricLanguage}` : ''}
${rhymeScheme && rhymeScheme !== '不押韵' ? `- 韵脚方案：${rhymeScheme}` : ''}
${customKeywords ? `- 额外关键词：${customKeywords}` : ''}

## 输出要求

请严格按照以下格式输出创作笔记，这将被直接用于 AI 音乐生成平台：

---

一、歌名
（请根据对话记忆的情感主题，创作一个简短有意境的歌名，2-6个字）

二、歌词结构：
[Verse]
（2-4行歌词，描述情境/铺垫情感）

[Pre-Chorus]
（2-4行歌词，情感递进）

[Chorus]
（2-4行歌词，核心情感爆发，副歌必须重复从记忆中提取的关键词）

[Verse]
（2-4行歌词，情感延续或转折）

[Chorus]
（重复副歌，可微调）

[Bridge]
（2-4行歌词，升华主题）

[Final Chorus]
（最终副歌，情感高潮）

要求：
每段2-4行；副歌一定要重复关键词；不要一整段长句；关键词${keywordText}${langText}${rhymeText}

三、风格
请按以下格式输出（方括号内的情绪词需要你根据对话记忆内容推断填写）：
1.公式：[${mainGenreName}] + [${subGenreName}] + [${instruments}] + [请从对话记忆中推断角色的情绪，如：温柔、思念、悲伤、欢快、深情等]
2.BPM: ${bpm}
3.人声指定：${genderChar} ${vocalRange}${timbreText}
不仅要列出乐器，还要描述它在"做什么"。句式：The instrumentation features [Instrument] playing [Action]...

---

请直接输出上述格式的内容，严格保留"一、歌名"、"二、歌词结构"、"三、风格"的标题格式，不要添加任何额外说明或markdown标记。`;

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: {
                            temperature: 1,
                            maxOutputTokens: 20000,
                            topP: 0.98
                        }
                    })
                }
            );

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || `API Error: ${response.status}`);
            }

            const data = await response.json();
            return this.parseMusicNote(data);

        } catch (error) {
            console.error('[GeminiAPI] Error:', error);
            throw error;
        }
    },

    /**
     * Parse Gemini response into structured music note
     */
    parseMusicNote(data) {
        try {
            console.log('[GeminiAPI] Full API response:', JSON.stringify(data, null, 2));

            // 防御性检查 API 响应结构
            if (!data) {
                console.error('[GeminiAPI] Empty response data');
                return { full: '错误: 未收到响应', title: '', lyrics: '', style: '' };
            }

            if (!data.candidates || data.candidates.length === 0) {
                console.error('[GeminiAPI] No candidates in response:', data);
                const errorMsg = data.error?.message || data.promptFeedback?.blockReason || '无有效响应';
                return { full: `错误: ${errorMsg}`, title: '', lyrics: '', style: '' };
            }

            const candidate = data.candidates[0];
            if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
                console.error('[GeminiAPI] Invalid candidate structure:', candidate);
                const finishReason = candidate.finishReason || '未知原因';
                return { full: `错误: 内容为空 (${finishReason})`, title: '', lyrics: '', style: '' };
            }

            const text = candidate.content.parts[0].text;
            console.log('[GeminiAPI] Raw text:', text);

            // 更健壮的正则匹配，处理不同的空白和换行格式
            // 匹配 "一、歌名" 后面到 "二、" 之前的内容
            const titleMatch = text.match(/一、\s*歌名[：:\s]*([\s\S]*?)(?=\s*二、|\s*$)/i);
            // 匹配 "二、歌词结构" 后面到 "三、" 之前的内容
            const lyricsMatch = text.match(/二、\s*歌词结构[：:\s]*([\s\S]*?)(?=\s*三、|\s*$)/i);
            // 匹配 "三、风格" 后面到结尾的内容
            const styleMatch = text.match(/三、\s*风格[：:\s]*([\s\S]*?)$/i);

            const result = {
                full: text.trim(),
                title: titleMatch ? titleMatch[1].trim() : '',
                lyrics: lyricsMatch ? lyricsMatch[1].trim() : '',
                style: styleMatch ? styleMatch[1].trim() : ''
            };

            console.log('[GeminiAPI] Parsed result:', result);
            return result;
        } catch (e) {
            console.error('[GeminiAPI] Parse error:', e);
            return { full: `解析错误: ${e.message}`, title: '', lyrics: '', style: '' };
        }
    }
};

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    GeminiAPI.init();
});
