/**
 * Music Creator Cloud - Main Application
 * Combines SillyTavernBook reader + ST_Music creator + Gemini AI
 */

// ===== Data Constants (from ST_Music) =====
const VOCAL_RANGES = [
    "女高音 (Soprano)", "女中音 (Mezzo-Soprano)", "女低音 (Contralto)",
    "男高音 (Tenor)", "男中音 (Baritone)", "男低音 (Bass)",
    "根据人设推断合适的人声音域"
];

// 韵脚方案数据 (from ST_Music)
const RHYME_SCHEMES = [
    { name: "不押韵", desc: "" },
    { name: "ABCB (二四押韵)", desc: "听感：自然、不刻意，给听众一种\"期待感\"并在偶数句得到释放。例子：周杰伦《晴天》" },
    { name: "AABB (双行押韵)", desc: "听感：节奏感强，朗朗上口，常用于副歌（Chorus）或儿歌、洗脑歌。例子：筷子兄弟《小苹果》" },
    { name: "ABAB (交叉押韵)", desc: "听感：更有韵律跳跃感。例子：邓丽君《月亮代表我的心》" },
    { name: "AAAA (全行押韵)", desc: "听感：极具冲击力，常用于说唱（Rap）或情感非常激烈的段落，但也容易显得单调。" }
];

// 声部音色数据 (from ST_Music)
const VOICE_TIMBRES = [
    "Auto (自动)",
    "Husky (烟嗓/沙哑)",
    "Clean (清澈/标准)",
    "Warm (温暖/磁性)",
    "Gritty (粗砺/颗粒感)",
    "Bright (明亮/尖细)",
    "Dark (暗淡/深沉)",
    "Soulful (深情/灵魂)"
];

const GENRE_DATA = {
    "流行音乐 (Pop)": {
        desc: "具有极强的包容性，常与其他流派融合，主要以商业成功和大众审美为导向。",
        bpms: "110-130 (Upbeat)",
        instruments: ["合成器 (Synthesizer)", "吉他 (Guitar)", "鼓机 (Drum Machine)", "钢琴 (Piano)", "贝斯 (Bass)"],
        sub: [
            { name: "Synth-Pop", Cname: "合成器流行", desc: "80年代兴起，以电子合成器为主导乐器（如 Depeche Mode）。" },
            { name: "Indie Pop", Cname: "独立流行", desc: "保留流行的旋律，但制作更DIY，听感更粗糙或文艺（如 Lana Del Rey）。" },
            { name: "Dream Pop", Cname: "梦幻流行", desc: "强调迷幻的质感、混响人声和朦胧的氛围。" },
            { name: "Art Pop", Cname: "艺术流行", desc: "尝试前卫艺术形式，结构不循规蹈矩（如 Lady Gaga, Björk）。" },
            { name: "K-Pop", Cname: "韩国流行", desc: "已发展为独特体系，融合嘻哈、电子、舞曲，强调视觉与表演。" },
            { name: "Latin Pop", Cname: "拉丁流行", desc: "融合拉丁节奏（如莎莎、巴恰塔）的流行乐（如 Shakira）。" },
            { name: "Dance-Pop", Cname: "舞曲流行", desc: "专为夜店和电台设计，节奏强劲，结构简单。" },
            { name: "Bubblegum Pop", Cname: "泡泡糖流行", desc: "面向青少年，旋律极度甜美、歌词单纯。" },
            { name: "Electropop", Cname: "电子流行", desc: "侧重电子音色，通常比 Synth-pop 更现代、更重节奏。" },
            { name: "Chamber Pop", Cname: "室内流行", desc: "在流行乐中加入弦乐、管乐等管弦乐编制，气质优雅。" }
        ]
    },
    "摇滚乐 (Rock)": {
        desc: "以吉他、贝斯、鼓为三大件，精神内核从叛逆到内省无所不包。",
        bpms: "120-150 (Fast/Driving)",
        instruments: ["电吉他 (Electric Guitar)", "电贝斯 (Electric Bass)", "架子鼓 (Drum Kit)", "键盘/风琴 (Keyboards/Organ)"],
        sub: [
            { name: "Alternative Rock", Cname: "另类摇滚", desc: "80-90年代兴起，区别于主流商业摇滚的统称。" },
            { name: "Punk Rock", Cname: "朋克摇滚", desc: "快节奏、三和弦、反建制，强调宣泄（如 The Ramones）。" },
            { name: "Heavy Metal", Cname: "重金属", desc: "失真吉他、密集鼓点、嘶吼唱腔，极具侵略性。" },
            { name: "Psychedelic Rock", Cname: "迷幻摇滚", desc: "试图模拟致幻体验，使用大量效果器和长篇独奏（如 Pink Floyd）。" },
            { name: "Progressive Rock", Cname: "前卫摇滚", desc: "结构复杂，融合古典与爵士技巧，强调演奏技术。" },
            { name: "Indie Rock", Cname: "独立摇滚", desc: "强调独立厂牌发行，风格多样，通常也是车库摇滚的延伸。" },
            { name: "Grunge", Cname: "垃圾摇滚", desc: "源于西雅图，融合了朋克和重金属，充满颓废与愤怒（如 Nirvana）。" },
            { name: "Post-Rock", Cname: "后摇滚", desc: "主要为器乐，使用摇滚乐器创造氛围和纹理，而非传统歌曲结构。" },
            { name: "Glam Rock", Cname: "华丽摇滚", desc: "70年代风格，强调夸张的服饰、妆容和戏剧性（如 David Bowie）。" },
            { name: "Hard Rock", Cname: "硬摇滚", desc: "比传统摇滚更重，但比金属乐更有布鲁斯根源（如 AC/DC）。" }
        ]
    },
    "民谣 (Folk)": {
        desc: "注重叙事与原声乐器，强调音乐的根源性和人文色彩。",
        bpms: "70-100 (Relaxed)",
        instruments: ["原声吉他 (Acoustic Guitar)", "口琴 (Harmonica)", "班卓琴 (Banjo)", "小提琴 (Fiddle)", "曼陀林 (Mandolin)"],
        sub: [
            { name: "Traditional Folk", Cname: "传统民谣", desc: "口耳相传的古老歌曲，通常无明确作者。" },
            { name: "Folk Rock", Cname: "民谣摇滚", desc: "使用电吉他和摇滚节奏演绎民谣（如 Bob Dylan 转型期）。" },
            { name: "Indie Folk", Cname: "独立民谣", desc: "现代民谣，通常带有原声吉他，但编曲更现代、文艺。" },
            { name: "Americana", Cname: "美式根源音乐", desc: "美国民谣、乡村、蓝调的综合体。" },
            { name: "Celtic Folk", Cname: "凯尔特民谣", desc: "源自爱尔兰、苏格兰，使用风笛、竖琴等乐器。" },
            { name: "Anti-Folk", Cname: "反民谣", desc: "起源于纽约，以此反讽传统民谣的严肃性。" },
            { name: "Freak Folk", Cname: "怪异民谣", desc: "加入迷幻元素，结构怪诞。" },
            { name: "Neofolk", Cname: "新民谣", desc: "通常带有欧洲黑暗、神秘主义色彩。" },
            { name: "Singer-Songwriter", Cname: "唱作人", desc: "一把吉他/钢琴自弹自唱的风格。" },
            { name: "Contemporary Folk", Cname: "当代民谣", desc: "在这个时代创作的，反映当下生活的民谣音乐。" }
        ]
    },
    "嘻哈 (Hip-Hop)": {
        desc: "不仅仅是音乐，更是一种文化，核心是 Beat（节拍）和 Flow（说唱技巧）。",
        bpms: "80-100 (Groovy/Bounce)",
        instruments: ["人声 (Vocals/Rap)", "鼓机/808 (Drum Machine)", "唱机 (Turntables)", "MPC (采样打击垫)"],
        sub: [
            { name: "Old School Hip-Hop", Cname: "老派嘻哈", desc: "70-80年代早期风格，节奏简单，注重派对氛围。" },
            { name: "Gangsta Rap", Cname: "帮匪说唱", desc: "90年代西海岸盛行，歌词描绘街头暴力与犯罪生活。" },
            { name: "Trap", Cname: "陷阱音乐", desc: "滚奏的 Hi-hats、重低音 808 鼓机。" },
            { name: "Jazz Rap", Cname: "爵士说唱", desc: "采样爵士乐片段，歌词通常更有诗意和内涵（如 Nujabes）。" },
            { name: "Conscious Hip-Hop", Cname: "意识说唱", desc: "关注政治、社会问题、种族平权等深刻议题。" },
            { name: "Lo-Fi Hip-Hop", Cname: "低保真嘻哈", desc: "强调粗糙的音质、底噪，常作为学习/放松背景音乐。" },
            { name: "Drill", Cname: "钻头音乐", desc: "歌词黑暗，节奏阴冷、滑动贝斯是特色。" },
            { name: "Grime", Cname: "污垢音乐", desc: "源于英国，速度快（140 BPM），受电子舞曲影响。" },
            { name: "Cloud Rap", Cname: "云端说唱", desc: "伴奏空灵、梦幻，人声通常含糊不清。" },
            { name: "Alternative Hip-Hop", Cname: "另类嘻哈", desc: "不遵循传统商业嘻哈框架，风格实验性强。" }
        ]
    },
    "电子音乐 (Electronic)": {
        desc: "完全依赖电子乐器制作，是现代舞曲文化的基础。",
        bpms: "120-140 (Dance)",
        instruments: ["合成器 (Synthesizer)", "鼓机 (Drum Machine)", "采样器 (Sampler)", "DAW (数字音频工作站)", "MIDI 控制器"],
        sub: [
            { name: "House", Cname: "浩室", desc: "4/4拍，重低音，源于芝加哥，俱乐部音乐基石。" },
            { name: "Techno", Cname: "科技舞曲", desc: "机械感强，重复性高，氛围冰冷。" },
            { name: "Trance", Cname: "恍惚", desc: "注重旋律推进和情绪铺垫，BPM 较快。" },
            { name: "Dubstep", Cname: "回响贝斯", desc: "沉重的低音（Wobble Bass）和切分节奏。" },
            { name: "Drum and Bass", Cname: "鼓打贝斯", desc: "极快碎拍（160-180 BPM）配合重低音。" },
            { name: "Ambient", Cname: "氛围音乐", desc: "无明显节奏，强调空间感和环境声。" },
            { name: "IDM", Cname: "智能舞曲", desc: "不适合跳舞，更适合聆听，结构复杂实验性强。" },
            { name: "Synthwave", Cname: "合成器波", desc: "复古未来主义，致敬80年代风格。" },
            { name: "UK Garage", Cname: "英式车库", desc: "切分节奏明显，人声采样多。" },
            { name: "Hardstyle", Cname: "硬派风格", desc: "极硬的底鼓（Kick）和失真音色，节奏极快。" }
        ]
    },
    "古典音乐 (Classical)": {
        desc: "历史悠久，结构严谨，强调器乐编制与演奏技巧。",
        bpms: "Variable (Largo to Presto)",
        instruments: ["弦乐组 (Strings)", "木管组 (Woodwinds)", "铜管组 (Brass)", "定音鼓 (Timpani)", "钢琴 (Piano)"],
        sub: [
            { name: "Baroque", Cname: "巴洛克", desc: "华丽、繁复，代表人物：巴赫、维瓦尔第。" },
            { name: "Classical Period", Cname: "古典主义", desc: "结构严谨、平衡，代表人物：莫扎特、海顿。" },
            { name: "Romantic", Cname: "浪漫主义", desc: "强调情感表达、宏大叙事。" },
            { name: "Impressionist", Cname: "印象派", desc: "强调音色和氛围，朦胧感。" },
            { name: "Minimalism", Cname: "极简主义", desc: "重复简短的乐句，缓慢变化。" },
            { name: "Opera", Cname: "歌剧", desc: "结合戏剧、声乐和管弦乐的综合艺术形式。" },
            { name: "Chamber Music", Cname: "室内乐", desc: "小型编制，如弦乐四重奏。" },
            { name: "Symphony", Cname: "交响乐", desc: "由大型管弦乐队演奏的宏大乐章。" },
            { name: "Gregorian Chant", Cname: "圣咏", desc: "中世纪单声部宗教歌曲，纯人声。" },
            { name: "Avant-Garde", Cname: "先锋派", desc: "探索无调性、十二音列等实验音乐。" }
        ]
    },
    "爵士乐 (Jazz)": {
        desc: "强调即兴演奏（Improvisation）和复杂的和声。",
        bpms: "80-140 (Swing)",
        instruments: ["萨克斯风 (Saxophone)", "小号 (Trumpet)", "低音提琴 (Double Bass)", "钢琴 (Piano)", "爵士鼓 (Jazz Drums)", "空心电吉他"],
        sub: [
            { name: "Swing", Cname: "摇摆乐", desc: "30-40年代大乐队时期，适合跳舞，节奏摇摆感强。" },
            { name: "Bebop", Cname: "比波普", desc: "速度快、和声复杂，转向艺术聆听。" },
            { name: "Cool Jazz", Cname: "酷派爵士", desc: "情绪内敛、柔和、理性。" },
            { name: "Hard Bop", Cname: "硬波普", desc: "融入 R&B 和福音元素，节奏更强烈。" },
            { name: "Free Jazz", Cname: "自由爵士", desc: "打破和声与节奏规则，极度即兴。" },
            { name: "Jazz Fusion", Cname: "爵士融合", desc: "爵士与摇滚、放克的结合，使用电声乐器。" },
            { name: "Latin Jazz", Cname: "拉丁爵士", desc: "融合古巴或巴西节奏。" },
            { name: "Modal Jazz", Cname: "调式爵士", desc: "基于调式而非和弦进行即兴。" },
            { name: "Smooth Jazz", Cname: "平滑爵士", desc: "商业化、流行化的爵士。" },
            { name: "Acid Jazz", Cname: "酸性爵士", desc: "融合了爵士、灵魂乐、放克和嘻哈律动。" }
        ]
    },
    "节奏布鲁斯 (R&B)": {
        desc: "从早期的跳舞音乐演变为强调人声技巧和情感的都市音乐。",
        bpms: "60-100 (Soulful)",
        instruments: ["电钢琴 (Electric Piano)", "贝斯 (Bass)", "铜管组 (Horn Section)", "哈蒙德风琴 (Organ)"],
        sub: [
            { name: "Soul", Cname: "灵魂乐", desc: "50-60年代，深受福音音乐影响，情感浓烈。" },
            { name: "Motown", Cname: "摩城之声", desc: "60年代底特律的流行化 Soul，制作精良。" },
            { name: "Funk", Cname: "放克", desc: "强调贝斯线条和切分节奏（Groove）。" },
            { name: "Disco", Cname: "迪斯科", desc: "四四拍，舞厅专用。" },
            { name: "Neo-Soul", Cname: "新灵魂乐", desc: "回归 70 年代 Soul 的根源，融合爵士和嘻哈。" },
            { name: "Contemporary R&B", Cname: "当代节奏布鲁斯", desc: "80年代后加入电子制作，更流行化。" },
            { name: "New Jack Swing", Cname: "新杰克摇摆", desc: "融合嘻哈节奏和 R&B 旋律。" },
            { name: "Doo-Wop", Cname: "嘟喔普", desc: "强调多声部和声重唱。" },
            { name: "Alternative R&B", Cname: "另类节奏布鲁斯", desc: "风格阴暗、迷幻、前卫。" },
            { name: "Gospel", Cname: "福音音乐", desc: "教会音乐，强调合唱与赞美。" }
        ]
    },
    "世界音乐 (World Music)": {
        desc: "指非英美主流流行音乐体系之外的各民族传统或融合音乐。",
        bpms: "Variable",
        instruments: ["康加鼓 (Congas)", "风笛 (Bagpipes)", "西塔琴 (Sitar)", "古筝/琵琶", "吉他 (Guitar)"],
        sub: [
            { name: "Reggae", Cname: "雷鬼", desc: "源于牙买加，反拍节奏明显，慵懒放松。" },
            { name: "Afrobeat", Cname: "非洲节拍", desc: "源于尼日利亚，融合爵士、放克和传统节奏。" },
            { name: "Flamenco", Cname: "弗拉门戈", desc: "源于西班牙，吉他、拍手和激情歌唱。" },
            { name: "Bossa Nova", Cname: "波萨诺瓦", desc: "源于巴西，桑巴与爵士的结合，慵懒优雅。" },
            { name: "Salsa", Cname: "莎莎", desc: "源于古巴/波多黎各，节奏复杂热烈。" },
            { name: "Celtic", Cname: "凯尔特音乐", desc: "爱尔兰、苏格兰传统音乐。" },
            { name: "Tango", Cname: "探戈", desc: "源于阿根廷，手风琴是灵魂。" },
            { name: "Indian Classical", Cname: "印度古典", desc: "分为北印度和南印度，使用西塔琴等。" },
            { name: "Klezmer", Cname: "克莱兹默", desc: "东欧犹太世俗音乐，模拟人声哭泣笑闹。" },
            { name: "Andean Music", Cname: "安第斯音乐", desc: "南美安第斯山脉音乐，排箫是标志。" }
        ]
    }
};

// ===== Main Application Object =====
const App = {
    // Current state
    currentTab: 'player',
    currentChatId: null,
    allMessages: [],
    currentPage: 1,
    pageSize: 15,

    // ===== Initialization =====
    init() {
        console.log('🎵 Music Creator Cloud initializing...');
        this.ui.init();
        this.chat.init();
        this.memory.init();
        this.bookmark.init();
        this.creator.init();
        this.player.init();
        this.bgInfo.init();
        this.story.init();
        this.api = GeminiAPI;
        console.log('🎵 Music Creator Cloud ready!');
    },

    ui: {
        lastTapTime: 0,

        init() {
            this.bindTabEvents();
            this.bindSidebarEvents();
            this.loadTheme();
            this.initMobileSidebar();
            this.initScrollToTop();
        },

        // Click header to scroll to top
        initScrollToTop() {
            const header = document.querySelector('.app-header');
            if (header) {
                header.addEventListener('click', (e) => {
                    // Prevent scrolling if clicking a button or interactable element
                    if (e.target.closest('button') || e.target.closest('input') || e.target.closest('.tab-btn')) {
                        return;
                    }
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                });
            }
        },

        // Initialize mobile sidebar with double-tap gesture
        initMobileSidebar() {
            // Only on mobile
            if (window.innerWidth > 768) return;

            // Show hint briefly on first load
            const hint = document.getElementById('mobile-sidebar-hint');
            if (hint && !localStorage.getItem('mcc_sidebar_hint_shown')) {
                setTimeout(() => {
                    hint.classList.add('visible');
                    setTimeout(() => {
                        hint.classList.remove('visible');
                        localStorage.setItem('mcc_sidebar_hint_shown', 'true');
                    }, 3000);
                }, 1000);
            }

            // Double-tap listener on content area
            const contentArea = document.querySelector('.content-area');
            if (contentArea) {
                contentArea.addEventListener('touchend', (e) => {
                    const now = Date.now();
                    const timeDiff = now - this.lastTapTime;

                    if (timeDiff < 300 && timeDiff > 0) {
                        // Double tap detected
                        e.preventDefault();
                        this.toggleMobileSidebar();
                    }
                    this.lastTapTime = now;
                }, { passive: false });
            }
        },

        toggleMobileSidebar() {
            const sidebar = document.getElementById('main-sidebar');
            const backdrop = document.getElementById('sidebar-backdrop');

            if (sidebar.classList.contains('mobile-visible')) {
                this.hideMobileSidebar();
            } else {
                sidebar.classList.add('mobile-visible');
                backdrop.classList.add('active');
            }
        },

        hideMobileSidebar() {
            const sidebar = document.getElementById('main-sidebar');
            const backdrop = document.getElementById('sidebar-backdrop');
            sidebar.classList.remove('mobile-visible');
            backdrop.classList.remove('active');
        },

        bindTabEvents() {
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.onclick = () => {
                    const tab = btn.dataset.tab;
                    this.switchTab(tab);
                };
            });
        },

        switchTab(tabName) {
            App.currentTab = tabName;

            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabName);
            });

            // Update tab content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.toggle('active', content.id === `tab-${tabName}`);
            });

            // Special actions
            if (tabName === 'creator') {
                App.memory.renderPreview();
            }
        },

        bindSidebarEvents() {
            document.getElementById('btn-import').onclick = () => {
                document.getElementById('file-input-chat').click();
            };
            document.getElementById('btn-chat-list').onclick = () => this.togglePanel('panel-chat-list');
            document.getElementById('btn-memories').onclick = () => {
                App.memory.renderFullList();
                this.togglePanel('panel-memories');
            };
            document.getElementById('btn-bookmarks').onclick = () => {
                App.bookmark.renderList();
                this.togglePanel('panel-bookmarks');
            };
            document.getElementById('btn-api').onclick = () => {
                GeminiAPI.updateStatusUI();
                this.togglePanel('panel-api');
            };
            // Sidebar theme toggle button
            document.getElementById('btn-sidebar-theme').onclick = () => this.toggleTheme();
        },

        togglePanel(panelId) {
            const panel = document.getElementById(panelId);
            const isActive = panel.classList.contains('active');

            // Close all panels first
            document.querySelectorAll('.overlay-panel').forEach(p => p.classList.remove('active'));

            // Toggle target panel
            if (!isActive) {
                panel.classList.add('active');
                if (panelId === 'panel-chat-list') App.chat.renderChatList();
                if (panelId === 'panel-memories') App.memory.renderFullList();
            }
        },

        closePanel() {
            document.querySelectorAll('.overlay-panel').forEach(p => p.classList.remove('active'));
        },

        toggleTheme() {
            document.body.classList.toggle('dark-mode');
            const isDark = document.body.classList.contains('dark-mode');
            localStorage.setItem('mcc_theme', isDark ? 'dark' : 'light');

            // Update sidebar theme toggle button icon
            const sidebarIcon = document.querySelector('#btn-sidebar-theme i');
            const iconClass = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            if (sidebarIcon) sidebarIcon.className = iconClass;
        },

        loadTheme() {
            const theme = localStorage.getItem('mcc_theme');
            // Default to light mode (day theme)
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
                const sidebarBtn = document.getElementById('btn-sidebar-theme');
                if (sidebarBtn) sidebarBtn.querySelector('i').className = 'fa-solid fa-sun';
            }
        },

        showLoading(show) {
            document.getElementById('loading-overlay').style.display = show ? 'flex' : 'none';
        },

        showToast(message) {
            // Simple toast notification
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                background: #333; color: #fff; padding: 12px 24px; border-radius: 8px;
                font-size: 14px; z-index: 9999; animation: fadeIn 0.3s;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2500);
        },

        // Toggle collapsible panels (story, memory, bg-info)
        toggleCollapsiblePanel(panelId) {
            const content = document.getElementById(`${panelId}-content`);
            const panel = content?.closest('.collapsible-panel');
            const icon = panel?.querySelector('.panel-toggle-icon');

            if (content) {
                content.classList.toggle('collapsed');
            }
            if (icon) {
                icon.classList.toggle('rotated');
            }
        }
    },

    // ===== Chat Module =====
    chat: {
        db: null,
        dbName: 'MusicCreatorCloudDB',
        storeName: 'chats',

        init() {
            this.openDB();
            this.bindFileInput();
        },

        async openDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open(this.dbName, 1);
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName, { keyPath: 'id' });
                    }
                };
                request.onsuccess = (e) => {
                    this.db = e.target.result;
                    resolve();
                    this.loadLastChat();
                };
                request.onerror = reject;
            });
        },

        bindFileInput() {
            document.getElementById('file-input-chat').onchange = (e) => this.handleImport(e);
        },

        async handleImport(e) {
            const files = Array.from(e.target.files);
            if (!files.length) return;

            let imported = 0;
            for (const file of files) {
                const text = await file.text();
                const messages = this.parseContent(text);

                if (messages.length > 0) {
                    const chatId = 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    const fileName = file.name.replace(/\.(jsonl|txt|json)$/i, '');
                    const charName = messages.find(m => !m.is_user && m.name)?.name || '未知角色';

                    await this.saveChat({
                        id: chatId,
                        name: `${charName} - ${fileName}`,
                        characterName: charName,
                        messages: messages,
                        timestamp: Date.now()
                    });
                    imported++;
                }
            }

            if (imported > 0) {
                App.ui.showToast(`成功导入 ${imported} 份档案`);
                const chats = await this.getAllChats();
                if (chats.length > 0) {
                    this.switchChat(chats.sort((a, b) => b.timestamp - a.timestamp)[0].id);
                }
            }

            e.target.value = '';
        },

        parseContent(content) {
            const msgs = [];
            content.split('\n').forEach(line => {
                if (!line.trim()) return;
                try {
                    const data = JSON.parse(line);
                    if (data.name || data.mes) msgs.push(data);
                } catch (e) { }
            });
            return msgs;
        },

        async saveChat(chatData) {
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(this.storeName, 'readwrite');
                tx.objectStore(this.storeName).put(chatData);
                tx.oncomplete = resolve;
                tx.onerror = reject;
            });
        },

        async getAllChats() {
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(this.storeName, 'readonly');
                const request = tx.objectStore(this.storeName).getAll();
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = reject;
            });
        },

        async deleteChat(id) {
            return new Promise((resolve, reject) => {
                const tx = this.db.transaction(this.storeName, 'readwrite');
                tx.objectStore(this.storeName).delete(id);
                tx.oncomplete = resolve;
                tx.onerror = reject;
            });
        },

        async loadLastChat() {
            const chats = await this.getAllChats();
            if (chats.length > 0) {
                const latest = chats.sort((a, b) => b.timestamp - a.timestamp)[0];
                this.switchChat(latest.id);
            }
        },

        async switchChat(id) {
            const chats = await this.getAllChats();
            const target = chats.find(c => c.id === id);
            if (!target) return;

            App.currentChatId = target.id;
            App.allMessages = target.messages;
            App.currentPage = 1;

            document.getElementById('current-chat-title').textContent = target.name;
            this.renderMessages();
            App.ui.closePanel();
        },

        renderMessages() {
            const container = document.getElementById('chat-container');
            container.innerHTML = '';

            if (App.allMessages.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-book-open"></i>
                        <p>请导入聊天记录或在目录中选择</p>
                    </div>`;
                return;
            }

            const start = (App.currentPage - 1) * App.pageSize;
            const end = Math.min(start + App.pageSize, App.allMessages.length);
            const pageMessages = App.allMessages.slice(start, end);

            pageMessages.forEach((msg, i) => {
                const globalIndex = start + i;
                const isMemory = App.memory.isSelected(globalIndex);
                const isBookmark = App.bookmark.isBookmarked(globalIndex);

                const row = document.createElement('div');
                row.className = `message-row ${msg.is_user ? 'user' : ''}`;
                row.setAttribute('data-msg-index', globalIndex);
                row.innerHTML = `
                    <div class="char-name-tag">
                        <button class="memory-btn ${isMemory ? 'active' : ''}" 
                                onclick="App.memory.toggle(${globalIndex})" title="添加到记忆">
                            <i class="fa-solid fa-music"></i>
                        </button>
                        <button class="bookmark-btn ${isBookmark ? 'active' : ''}" 
                                onclick="App.bookmark.toggle(${globalIndex})" title="添加书签">
                            <i class="fa-solid fa-bookmark"></i>
                        </button>
                        ${msg.name || '???'}
                    </div>
                    <div class="bubble">${this.formatMessage(msg.mes || '')}</div>
                `;
                container.appendChild(row);
            });

            // Update page info
            const totalPages = Math.ceil(App.allMessages.length / App.pageSize);
            document.getElementById('page-info').textContent = `P. ${App.currentPage} / ${totalPages}`;
        },

        formatMessage(text) {
            // Clean and format message text
            // Remove thinking, style, script tags
            text = text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '');
            text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
            text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            // Remove disclaimer and finish tags (from regex-ST_Music_不发送创作笔记.json)
            text = text.replace(/<disclaimer>[\s\S]*?<\/disclaimer>/gi, '');
            text = text.replace(/<finish>[\s\S]*?<\/finish>/gi, '');
            return marked.parse(text);
        },

        changePage(delta) {
            const totalPages = Math.ceil(App.allMessages.length / App.pageSize);
            const newPage = App.currentPage + delta;
            if (newPage >= 1 && newPage <= totalPages) {
                App.currentPage = newPage;
                this.renderMessages();
                document.getElementById('chat-container').scrollTop = 0;
            }
        },

        promptJumpToPage() {
            const totalPages = Math.ceil(App.allMessages.length / App.pageSize);
            if (totalPages === 0) {
                App.ui.showToast('请先加载对话');
                return;
            }

            // Update label with current range
            const label = document.getElementById('page-jump-label');
            const input = document.getElementById('page-jump-input');
            label.textContent = `跳转到 (1 - ${totalPages}):`;
            input.value = App.currentPage;
            input.max = totalPages;

            // Show modal
            document.getElementById('modal-page-jump').style.display = 'flex';
            input.focus();
            input.select();
        },

        closePageJumpModal() {
            document.getElementById('modal-page-jump').style.display = 'none';
        },

        confirmPageJump() {
            const totalPages = Math.ceil(App.allMessages.length / App.pageSize);
            const input = document.getElementById('page-jump-input');
            const page = parseInt(input.value, 10);

            if (isNaN(page) || page < 1 || page > totalPages) {
                App.ui.showToast(`请输入有效页码 (1 - ${totalPages})`);
                return;
            }

            App.currentPage = page;
            this.renderMessages();
            document.getElementById('chat-container').scrollTop = 0;
            this.closePageJumpModal();
        },

        async renderChatList() {
            const container = document.getElementById('chat-list-content');
            const chats = await this.getAllChats();
            chats.sort((a, b) => b.timestamp - a.timestamp);

            if (chats.length === 0) {
                container.innerHTML = '<div style="text-align:center;color:#999;padding:20px">暂无档案</div>';
                return;
            }

            container.innerHTML = chats.map(chat => `
                <div class="list-item ${App.currentChatId === chat.id ? 'active' : ''}" 
                     onclick="App.chat.switchChat('${chat.id}')">
                    <div>
                        <div style="font-weight:600">${chat.characterName}</div>
                        <div style="font-size:12px;color:#666">${chat.name}</div>
                    </div>
                    <div style="font-size:11px;color:#999">
                        ${new Date(chat.timestamp).toLocaleDateString()}
                    </div>
                </div>
            `).join('');
        }
    },

    // ===== Memory Module =====
    memory: {
        selected: [],

        init() {
            this.load();
        },

        load() {
            const stored = localStorage.getItem('mcc_memories');
            this.selected = stored ? JSON.parse(stored) : [];
        },

        save() {
            localStorage.setItem('mcc_memories', JSON.stringify(this.selected));
        },

        // 获取当前故事的记忆（核心过滤逻辑）
        getFilteredMemories() {
            const storyId = App.story.currentStoryId;
            return this.selected.filter(m => {
                // 必须匹配当前对话
                if (m.chatId !== App.currentChatId) return false;
                // 如果没有选择故事，显示无 storyId 的记忆
                if (!storyId) return !m.storyId;
                // 否则匹配 storyId 或无 storyId（通用）
                return m.storyId === storyId || !m.storyId;
            });
        },

        isSelected(index) {
            const storyId = App.story.currentStoryId;
            return this.selected.some(m =>
                m.chatId === App.currentChatId &&
                m.index === index &&
                (m.storyId === storyId || (!storyId && !m.storyId))
            );
        },

        toggle(index) {
            const storyId = App.story.currentStoryId;
            const existing = this.selected.findIndex(
                m => m.chatId === App.currentChatId &&
                    m.index === index &&
                    m.storyId === storyId
            );

            if (existing !== -1) {
                this.selected.splice(existing, 1);
            } else {
                const msg = App.allMessages[index];
                this.selected.push({
                    chatId: App.currentChatId,
                    index: index,
                    name: msg.name || '???',
                    text: (msg.mes || '').substring(0, 200),
                    storyId: storyId || null  // 关联当前故事
                });
            }

            this.save();
            App.chat.renderMessages();
            this.updateCount();
            this.renderPreview();
        },

        clearAll() {
            const storyId = App.story.currentStoryId;
            // 仅清除当前故事的记忆
            this.selected = this.selected.filter(m => {
                if (m.chatId !== App.currentChatId) return true;
                if (!storyId) return m.storyId != null;
                return m.storyId !== storyId;
            });
            this.save();
            App.chat.renderMessages();
            this.renderFullList();
            this.renderPreview();
            this.updateCount();
        },

        updateCount() {
            const count = this.getFilteredMemories().length;
            document.getElementById('memory-count').textContent = count;
        },

        // 跳转到阅读器中的指定消息
        jumpToMessage(index) {
            // 切换到阅读器标签页
            App.ui.switchTab('reader');

            // 计算目标页码
            const targetPage = Math.floor(index / App.pageSize) + 1;

            // 如果不在目标页，先跳转
            if (App.currentPage !== targetPage) {
                App.currentPage = targetPage;
                App.chat.renderMessages();
            }

            // 延迟滚动以确保渲染完成
            setTimeout(() => {
                const messageEl = document.querySelector(`[data-msg-index="${index}"]`);
                if (messageEl) {
                    messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // 添加高亮效果
                    messageEl.classList.add('highlight-flash');
                    setTimeout(() => messageEl.classList.remove('highlight-flash'), 2000);
                }
            }, 100);
        },

        getMemoryText() {
            return this.getFilteredMemories()
                .map(m => `${m.name}: ${m.text}`)
                .join('\n\n');
        },

        renderPreview() {
            const list = document.getElementById('memory-preview-list');
            const hint = document.getElementById('no-memory-hint');
            const memories = this.getFilteredMemories();

            this.updateCount();

            if (memories.length === 0) {
                list.style.display = 'none';
                hint.style.display = 'flex';
                return;
            }

            list.style.display = 'block';
            hint.style.display = 'none';

            list.innerHTML = memories.map((m, i) => `
                <div class="memory-mini-card" onclick="App.memory.jumpToMessage(${m.index})">
                    <span class="char">${m.name}:</span>
                    <span class="text">${m.text.substring(0, 60)}...</span>
                    <button class="remove-btn" onclick="event.stopPropagation(); App.memory.toggle(${m.index})">×</button>
                </div>
            `).join('');
        },

        renderFullList() {
            const container = document.getElementById('memories-list-content');
            if (!container) return;

            const memories = this.getFilteredMemories();

            if (memories.length === 0) {
                container.innerHTML = '<div style="text-align:center;color:#999;padding:20px">暂无记忆</div>';
                return;
            }

            container.innerHTML = memories.map(m => `
                <div class="list-item">
                    <div>
                        <span style="color:var(--accent);font-weight:600">${m.name}</span>
                        <div style="font-size:12px;color:#666;margin-top:4px">${m.text.substring(0, 80)}...</div>
                    </div>
                </div>
            `).join('');
        }
    },

    // ===== Creator Module =====
    creator: {
        state: {
            charName: '', vocalRange: '', gender: '',
            voiceTimbre: '',  // 新增：声部音色
            mainGenre: '', subGenre: '', subGenreDesc: '',
            instruments: [], customInstrument: '', bpm: '',
            lyricMode: 'custom',  // 新增：歌词模式 (custom/plot)
            lyricKeywords: '',    // 新增：歌词关键词
            lyricLanguage: '',    // 新增：歌词语言
            customLang: '',       // 新增：自定义语言
            rhymeScheme: ''       // 新增：韵脚方案
        },

        init() {
            this.renderVocalButtons();
            this.renderVoiceTimbreButtons();  // 新增
            this.renderGenreButtons();
            this.renderLyricsLanguageButtons();   // 新增
            this.renderLyricModeButtons();        // 新增
            this.renderRhymeSchemeButtons();      // 新增
            this.bindEvents();
        },

        bindEvents() {
            document.getElementById('char-name').oninput = (e) => {
                this.state.charName = e.target.value;
            };

            document.querySelectorAll('.gender-btn').forEach(btn => {
                btn.onclick = () => {
                    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.state.gender = btn.dataset.gender;
                };
            });

            // 自定义语言输入
            const langCustomInput = document.getElementById('lang-custom');
            if (langCustomInput) {
                langCustomInput.oninput = (e) => {
                    this.state.customLang = e.target.value;
                    if (e.target.value) {
                        this.state.lyricLanguage = "";
                        document.querySelectorAll('#lang-btns .toggle-btn').forEach(b => b.classList.remove('active'));
                    }
                };
                langCustomInput.onclick = () => {
                    this.state.lyricLanguage = "";
                    document.querySelectorAll('#lang-btns .toggle-btn').forEach(b => b.classList.remove('active'));
                };
            }

            // 歌词关键词输入
            const lyricKeywordsInput = document.getElementById('lyric-keywords');
            if (lyricKeywordsInput) {
                lyricKeywordsInput.oninput = (e) => {
                    this.state.lyricKeywords = e.target.value;
                };
            }

            document.getElementById('btn-generate').onclick = () => this.generate();
            document.getElementById('btn-copy-all').onclick = () => this.copyAll();
            document.getElementById('btn-copy-title').onclick = () => this.copySection('title');
            document.getElementById('btn-copy-lyrics').onclick = () => this.copySection('lyrics');
            document.getElementById('btn-copy-style').onclick = () => this.copySection('style');
            document.getElementById('btn-copy-raw').onclick = () => this.copyRaw();
        },

        renderVocalButtons() {
            const container = document.getElementById('vocal-btns');
            container.innerHTML = VOCAL_RANGES.map(range => `
                <button class="toggle-btn ${range.includes('根据人设') ? 'full-width' : ''}"
                        onclick="App.creator.selectVocal('${range}', this)">
                    ${range.split(' ')[0]}
                </button>
            `).join('');
        },

        selectVocal(range, btn) {
            document.querySelectorAll('#vocal-btns .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.state.vocalRange = range;

            const genderSelector = document.getElementById('gender-selector');
            genderSelector.style.display = range.includes('根据人设') ? 'flex' : 'none';
            if (!range.includes('根据人设')) this.state.gender = '';
        },

        // 渲染声部音色按钮
        renderVoiceTimbreButtons() {
            const container = document.getElementById('timbre-btns');
            if (!container) return;

            container.innerHTML = VOICE_TIMBRES.map(timbre => `
                <button class="toggle-btn"
                        onclick="App.creator.selectVoiceTimbre('${timbre}', this)">
                    ${timbre}
                </button>
            `).join('');
        },

        selectVoiceTimbre(timbre, btn) {
            document.querySelectorAll('#timbre-btns .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.state.voiceTimbre = timbre;
        },

        // 渲染歌词语言按钮
        renderLyricsLanguageButtons() {
            const container = document.getElementById('lang-btns');
            if (!container) return;

            const languages = ["中文", "英文"];
            container.innerHTML = languages.map(lang => `
                <button class="toggle-btn" onclick="App.creator.selectLyricsLanguage('${lang}', this)">
                    ${lang}
                </button>
            `).join('');
        },

        selectLyricsLanguage(lang, btn) {
            document.querySelectorAll('#lang-btns .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.state.lyricLanguage = lang;
            this.state.customLang = "";
            const customInput = document.getElementById('lang-custom');
            if (customInput) customInput.value = "";
        },

        // 渲染歌词创作模式按钮
        renderLyricModeButtons() {
            const container = document.getElementById('lyric-mode-btns');
            if (!container) return;

            const modes = [
                { value: "custom", label: "自定义关键词" },
                { value: "plot", label: "根据记忆创作" }
            ];
            container.innerHTML = modes.map(mode => `
                <button class="toggle-btn ${mode.value === 'custom' ? 'active' : ''}"
                        data-mode="${mode.value}"
                        onclick="App.creator.selectLyricMode('${mode.value}', this)">
                    ${mode.label}
                </button>
            `).join('');
        },

        selectLyricMode(mode, btn) {
            document.querySelectorAll('#lyric-mode-btns .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.state.lyricMode = mode;

            const keywordsInput = document.getElementById('lyric-keywords');
            if (keywordsInput) {
                keywordsInput.style.display = mode === 'custom' ? 'block' : 'none';
            }
        },

        // 渲染韵脚方案按钮
        renderRhymeSchemeButtons() {
            const container = document.getElementById('rhyme-btns');
            if (!container) return;

            container.innerHTML = RHYME_SCHEMES.map(scheme => {
                const escapedDesc = scheme.desc.replace(/'/g, "\\'").replace(/"/g, "&quot;");
                return `
                    <div class="rhyme-wrapper">
                        <button class="toggle-btn" onclick="App.creator.selectRhymeScheme('${scheme.name}', '${escapedDesc}', this)">
                            ${scheme.name}
                        </button>
                    </div>
                `;
            }).join('');
        },

        selectRhymeScheme(name, desc, btn) {
            // 移除所有选中状态和描述
            document.querySelectorAll('#rhyme-btns .toggle-btn').forEach(b => {
                b.classList.remove('active');
                const descEl = b.parentElement.querySelector('.toggle-desc');
                if (descEl) descEl.remove();
            });

            btn.classList.add('active');
            this.state.rhymeScheme = name;

            // 如果有描述则显示
            if (desc) {
                const descEl = document.createElement('p');
                descEl.className = 'toggle-desc';
                descEl.textContent = desc;
                btn.parentElement.appendChild(descEl);
            }
        },

        renderGenreButtons() {
            const container = document.getElementById('genre-btns');
            container.innerHTML = Object.keys(GENRE_DATA).map(genre => `
                <button class="toggle-btn" onclick="App.creator.selectGenre('${genre}', this)">
                    ${genre.split(' ')[0]}
                </button>
            `).join('');
        },

        selectGenre(genre, btn) {
            document.querySelectorAll('#genre-btns .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            this.state.mainGenre = genre;
            this.state.subGenre = '';
            this.state.instruments = [];

            const data = GENRE_DATA[genre];
            this.state.bpm = data.bpms;

            this.renderSubGenres(genre);
            this.renderInstruments(genre);
        },

        renderSubGenres(genre) {
            const panel = document.getElementById('subgenre-panel');
            const container = document.getElementById('subgenre-btns');
            const data = GENRE_DATA[genre];

            panel.style.display = 'block';
            document.getElementById('genre-desc').textContent = data.desc;

            // Display English + Chinese names, but store only English name for AI
            container.innerHTML = data.sub.map(sub => {
                const displayName = sub.Cname ? `${sub.name} (${sub.Cname})` : sub.name;
                // Escape quotes in desc for onclick attribute
                const escapedDesc = sub.desc.replace(/'/g, "\\'");
                return `
                <div class="subgenre-wrapper">
                    <button class="toggle-btn" onclick="App.creator.selectSubGenre('${sub.name}', '${escapedDesc}', this)">
                        ${displayName}
                    </button>
                </div>
            `}).join('');
        },

        selectSubGenre(name, desc, btn) {
            document.querySelectorAll('#subgenre-btns .toggle-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Store only English name for AI prompt
            this.state.subGenre = name;
            this.state.subGenreDesc = desc;

            // Display sub-genre description
            const descEl = document.getElementById('subgenre-desc');
            if (descEl) {
                descEl.textContent = desc;
                descEl.style.display = 'block';
            }
        },

        renderInstruments(genre) {
            const group = document.getElementById('instrument-group');
            const container = document.getElementById('instrument-btns');
            const data = GENRE_DATA[genre];

            group.style.display = 'block';

            let html = data.instruments.map(inst => `
                <button class="instrument-btn" onclick="App.creator.toggleInstrument('${inst}', this)">
                    ${inst}
                </button>
            `).join('');

            html += `<button class="instrument-btn recommend" onclick="App.creator.toggleInstrument('AI推荐', this)">
                <i class="fa-solid fa-rotate"></i> AI推荐
            </button>`;

            html += `<input type="text" class="instrument-input" placeholder="自定义..."
                        oninput="App.creator.state.customInstrument = this.value">`;

            container.innerHTML = html;
        },

        toggleInstrument(inst, btn) {
            if (inst === 'AI推荐') {
                document.querySelectorAll('#instrument-btns .instrument-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.state.instruments = ['AI推荐'];
            } else {
                document.querySelector('#instrument-btns .recommend')?.classList.remove('active');
                this.state.instruments = this.state.instruments.filter(i => i !== 'AI推荐');

                if (btn.classList.contains('active')) {
                    btn.classList.remove('active');
                    this.state.instruments = this.state.instruments.filter(i => i !== inst);
                } else {
                    btn.classList.add('active');
                    this.state.instruments.push(inst);
                }
            }
        },

        async generate() {
            // Validation
            if (!this.state.charName) {
                App.ui.showToast('请输入角色名称');
                return;
            }
            if (!this.state.mainGenre || !this.state.subGenre) {
                App.ui.showToast('请选择音乐流派');
                return;
            }

            const memoryText = App.memory.getMemoryText();
            if (!memoryText) {
                App.ui.showToast('请先选择一些记忆');
                return;
            }

            if (!GeminiAPI.isConfigured()) {
                App.ui.showToast('请先配置 Gemini API');
                App.ui.togglePanel('panel-api');
                return;
            }

            // Build instruments text
            let instruments = this.state.instruments.length > 0
                ? this.state.instruments.join(' + ')
                : (this.state.customInstrument || 'AI推荐');

            App.ui.showLoading(true);

            try {
                const result = await GeminiAPI.generateMusicNote({
                    characterName: this.state.charName,
                    memoryText: memoryText,
                    backgroundInfo: App.bgInfo.getText(),
                    vocalRange: this.state.vocalRange || '根据人设推断',
                    gender: this.state.gender,
                    voiceTimbre: this.state.voiceTimbre,            // 新增
                    mainGenre: this.state.mainGenre,
                    subGenre: this.state.subGenre,
                    instruments: instruments,
                    bpm: this.state.bpm,
                    lyricLanguage: this.state.customLang || this.state.lyricLanguage,  // 新增
                    lyricMode: this.state.lyricMode,                // 新增
                    customKeywords: this.state.lyricKeywords,       // 更新: 使用 state
                    rhymeScheme: this.state.rhymeScheme             // 新增
                });

                this.displayResults(result);
                App.ui.showToast('创作完成！');

            } catch (error) {
                App.ui.showToast('生成失败: ' + error.message);
            } finally {
                App.ui.showLoading(false);
            }
        },

        currentResult: null,

        displayResults(result) {
            console.log('[Creator] displayResults called with:', result);
            this.currentResult = result;

            // Switch to Works tab
            App.ui.switchTab('works');

            // Hide empty state, show works layout
            const emptyState = document.getElementById('works-empty');
            const worksLayout = document.getElementById('works-layout');

            console.log('[Creator] Elements found:', {
                emptyState: !!emptyState,
                worksLayout: !!worksLayout
            });

            if (emptyState) emptyState.style.display = 'none';
            if (worksLayout) worksLayout.style.display = 'flex';

            // Parsed content
            const titleEl = document.getElementById('result-title');
            const lyricsEl = document.getElementById('result-lyrics');
            const styleEl = document.getElementById('result-style');
            const rawEl = document.getElementById('result-raw');

            console.log('[Creator] Content elements found:', {
                title: !!titleEl,
                lyrics: !!lyricsEl,
                style: !!styleEl,
                raw: !!rawEl
            });

            if (titleEl) titleEl.textContent = result.title || '（无）';
            if (lyricsEl) lyricsEl.textContent = result.lyrics || '（无）';
            if (styleEl) styleEl.textContent = result.style || '（无）';

            // Raw output as fallback
            if (rawEl) rawEl.textContent = result.full || '（无输出）';

            console.log('[Creator] Display complete');
        },

        copySection(section) {
            if (!this.currentResult) return;
            const text = this.currentResult[section];
            navigator.clipboard.writeText(text).then(() => {
                App.ui.showToast('已复制到剪贴板');
            });
        },

        copyAll() {
            if (!this.currentResult) return;
            navigator.clipboard.writeText(this.currentResult.full).then(() => {
                App.ui.showToast('已复制完整创作笔记');
            });
        },

        copyRaw() {
            if (!this.currentResult) return;
            navigator.clipboard.writeText(this.currentResult.full).then(() => {
                App.ui.showToast('已复制原始输出');
            });
        },

        toggleRawOutput() {
            const content = document.getElementById('result-raw');
            const icon = document.querySelector('.raw-toggle-icon');
            if (content && icon) {
                content.classList.toggle('collapsed');
                icon.classList.toggle('rotated');
            }
        }
    },

    // ===== Player Module =====
    player: {
        playlist: [],
        currentIndex: null,
        isPlaying: false,

        init() {
            this.loadPlaylist();
            this.bindEvents();
        },

        bindEvents() {
            document.getElementById('btn-upload').onclick = () => {
                document.getElementById('file-input-audio').click();
            };
            document.getElementById('file-input-audio').onchange = (e) => this.handleUpload(e);
            document.getElementById('btn-link').onclick = () => this.openLinkModal();
            document.getElementById('btn-play').onclick = () => this.togglePlay();
            document.getElementById('btn-prev').onclick = () => this.prevTrack();
            document.getElementById('btn-next').onclick = () => this.nextTrack();

            const audio = document.getElementById('audio-player');
            audio.onended = () => this.nextTrack();
            audio.onplay = () => this.updatePlayIcon(true);
            audio.onpause = () => this.updatePlayIcon(false);
        },

        loadPlaylist() {
            const stored = localStorage.getItem('mcc_playlist');
            if (stored) {
                this.playlist = JSON.parse(stored);
            }
            this.render();
        },

        savePlaylist() {
            const toSave = this.playlist.filter(t => t.type === 'link');
            localStorage.setItem('mcc_playlist', JSON.stringify(toSave));
        },

        handleUpload(e) {
            const file = e.target.files[0];
            if (!file) return;

            this.playlist.push({
                name: file.name.replace(/\.[^/.]+$/, ''),
                url: URL.createObjectURL(file),
                type: 'local'
            });
            this.render();
            App.ui.showToast('本地音频已添加（刷新后会丢失）');
            e.target.value = '';
        },

        openLinkModal() {
            document.getElementById('link-url').value = '';
            document.getElementById('link-name').value = '';
            document.getElementById('modal-link').style.display = 'flex';
        },

        closeLinkModal() {
            document.getElementById('modal-link').style.display = 'none';
        },

        confirmAddLink() {
            const url = document.getElementById('link-url').value.trim();
            let name = document.getElementById('link-name').value.trim();

            if (!url || !url.startsWith('http')) {
                App.ui.showToast('请输入有效的 URL');
                return;
            }

            if (!name) {
                try {
                    name = decodeURIComponent(url.split('/').pop()) || 'Unknown';
                } catch (e) {
                    name = 'Unknown';
                }
            }

            this.playlist.push({ name, url, type: 'link' });
            this.savePlaylist();
            this.render();
            this.closeLinkModal();
            App.ui.showToast('歌曲已添加');
        },

        render() {
            const container = document.getElementById('playlist-container');

            if (this.playlist.length === 0) {
                container.innerHTML = `
                    <div class="playlist-empty">
                        <span class="music-icon"><i class="fa-solid fa-music"></i></span>
                        <span class="empty-text">No Tape Loaded</span>
                    </div>`;
                return;
            }

            container.innerHTML = this.playlist.map((track, i) => `
                <div class="track-item ${i === this.currentIndex ? 'active' : ''}" 
                     onclick="App.player.play(${i})">
                    <div class="track-info">
                        <span class="track-num">${String(i + 1).padStart(2, '0')}</span>
                        <span class="track-name">${track.name}</span>
                    </div>
                    <button class="track-delete" onclick="event.stopPropagation();App.player.remove(${i})">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `).join('');
        },

        play(index) {
            if (index < 0 || index >= this.playlist.length) return;

            this.currentIndex = index;
            const audio = document.getElementById('audio-player');
            audio.src = this.playlist[index].url;
            audio.play().catch(e => App.ui.showToast('播放失败: ' + e.message));
            this.render();
        },

        togglePlay() {
            const audio = document.getElementById('audio-player');
            if (this.playlist.length === 0) return;

            if (audio.paused) {
                if (this.currentIndex === null) this.play(0);
                else audio.play();
            } else {
                audio.pause();
            }
        },

        prevTrack() {
            if (this.playlist.length === 0) return;
            const newIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
            this.play(newIndex);
        },

        nextTrack() {
            if (this.playlist.length === 0) return;
            const newIndex = (this.currentIndex + 1) % this.playlist.length;
            this.play(newIndex);
        },

        remove(index) {
            this.playlist.splice(index, 1);
            if (index === this.currentIndex) {
                document.getElementById('audio-player').pause();
                this.currentIndex = null;
            } else if (index < this.currentIndex) {
                this.currentIndex--;
            }
            this.savePlaylist();
            this.render();
        },

        updatePlayIcon(playing) {
            const icon = document.getElementById('play-icon');
            icon.className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';

            const disc = document.querySelector('.disc-icon');
            disc.classList.toggle('spinning', playing);
        }
    },

    // ===== Background Info Module =====
    bgInfo: {
        items: [],
        selectedIds: new Set(),  // 选中的条目ID集合
        editingId: null,  // 当前正在编辑的条目ID

        init() {
            this.load();
            this.loadSelection();
            this.render();
        },

        load() {
            const stored = localStorage.getItem('mcc_bg_info');
            this.items = stored ? JSON.parse(stored) : [];
        },

        save() {
            localStorage.setItem('mcc_bg_info', JSON.stringify(this.items));
        },

        loadSelection() {
            const stored = localStorage.getItem('mcc_bg_info_selected');
            if (stored) {
                this.selectedIds = new Set(JSON.parse(stored));
            }
        },

        saveSelection() {
            localStorage.setItem('mcc_bg_info_selected', JSON.stringify([...this.selectedIds]));
        },

        // 获取当前故事的背景信息（核心过滤逻辑）
        getFilteredItems() {
            const storyId = App.story.currentStoryId;
            return this.items.filter(item => {
                if (!storyId) return !item.storyId;
                return item.storyId === storyId || !item.storyId;
            });
        },

        // 切换选中状态
        toggleSelect(id) {
            if (this.selectedIds.has(id)) {
                this.selectedIds.delete(id);
            } else {
                this.selectedIds.add(id);
            }
            this.saveSelection();
            this.render();
        },

        // 检查是否选中
        isSelected(id) {
            return this.selectedIds.has(id);
        },

        openModal(editId = null) {
            this.editingId = editId;
            const modal = document.getElementById('modal-bg-info');
            const titleInput = document.getElementById('bg-info-title');
            const contentInput = document.getElementById('bg-info-content');
            const modalTitle = modal.querySelector('.modal-header h3');
            const submitBtn = modal.querySelector('.modal-footer .btn-primary');

            if (editId) {
                // 编辑模式
                const item = this.items.find(i => i.id === editId);
                if (item) {
                    titleInput.value = item.title;
                    contentInput.value = item.content;
                    modalTitle.textContent = '编辑背景信息';
                    submitBtn.textContent = '保存';
                }
            } else {
                // 新增模式
                titleInput.value = '';
                contentInput.value = '';
                modalTitle.textContent = '添加背景信息';
                submitBtn.textContent = '添加';
            }

            modal.style.display = 'flex';
            titleInput.focus();
        },

        closeModal() {
            document.getElementById('modal-bg-info').style.display = 'none';
            this.editingId = null;
        },

        addInfo() {
            const title = document.getElementById('bg-info-title').value.trim();
            const content = document.getElementById('bg-info-content').value.trim();

            if (!title || !content) {
                App.ui.showToast('请填写标题和内容');
                return;
            }

            if (this.editingId) {
                // 更新现有条目
                const item = this.items.find(i => i.id === this.editingId);
                if (item) {
                    item.title = title;
                    item.content = content;
                }
                App.ui.showToast('背景信息已更新');
            } else {
                // 添加新条目
                const storyId = App.story.currentStoryId;
                this.items.push({
                    id: Date.now(),
                    title: title,
                    content: content,
                    storyId: storyId || null
                });
                App.ui.showToast('背景信息已添加');
            }

            this.save();
            this.render();
            this.closeModal();
        },

        edit(id) {
            this.openModal(id);
        },

        remove(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.save();
            this.render();
        },

        render() {
            const list = document.getElementById('bg-info-list');
            const hint = document.getElementById('no-bg-info-hint');
            const count = document.getElementById('bg-info-count');

            if (!list || !hint || !count) return;

            const filteredItems = this.getFilteredItems();
            count.textContent = filteredItems.length;

            if (filteredItems.length === 0) {
                list.style.display = 'none';
                hint.style.display = 'flex';
                return;
            }

            list.style.display = 'block';
            hint.style.display = 'none';

            list.innerHTML = filteredItems.map(item => {
                const isSelected = this.isSelected(item.id);
                return `
                <div class="bg-info-card ${isSelected ? 'selected' : ''}" onclick="App.bgInfo.toggleSelect(${item.id})">
                    <div class="bg-info-title">${item.title}</div>
                    <div class="bg-info-text">${item.content.substring(0, 80)}${item.content.length > 80 ? '...' : ''}</div>
                    <div class="bg-info-actions">
                        <button class="edit-btn" onclick="event.stopPropagation(); App.bgInfo.edit(${item.id})" title="编辑">
                            <i class="fa-solid fa-wrench"></i>
                        </button>
                        <button class="remove-btn" onclick="event.stopPropagation(); App.bgInfo.remove(${item.id})" title="删除">×</button>
                    </div>
                </div>
            `}).join('');
        },

        getText() {
            // 只返回选中的条目
            const filteredItems = this.getFilteredItems();
            const selectedItems = filteredItems.filter(item => this.isSelected(item.id));

            // 如果没有选中任何条目，返回空字符串
            if (selectedItems.length === 0) return '';

            return selectedItems.map(item => `【${item.title}】\n${item.content}`).join('\n\n');
        }
    },

    // ===== Story Module =====
    story: {
        stories: [],
        currentStoryId: null,

        init() {
            this.load();
            this.render();
        },

        load() {
            const stored = localStorage.getItem('mcc_stories');
            this.stories = stored ? JSON.parse(stored) : [];

            // Load current story selection
            const currentId = localStorage.getItem('mcc_current_story');
            if (currentId) {
                this.currentStoryId = parseInt(currentId, 10);
            }
        },

        save() {
            localStorage.setItem('mcc_stories', JSON.stringify(this.stories));
            if (this.currentStoryId) {
                localStorage.setItem('mcc_current_story', String(this.currentStoryId));
            } else {
                localStorage.removeItem('mcc_current_story');
            }
        },

        openModal() {
            document.getElementById('modal-story').style.display = 'flex';
            document.getElementById('story-title').value = '';
            document.getElementById('story-title').focus();
        },

        closeModal() {
            document.getElementById('modal-story').style.display = 'none';
        },

        addStory() {
            const title = document.getElementById('story-title').value.trim();

            if (!title) {
                App.ui.showToast('请输入故事标题');
                return;
            }

            const newStory = {
                id: Date.now(),
                title: title,
                memories: [],
                bgInfo: []
            };

            this.stories.push(newStory);
            this.currentStoryId = newStory.id;
            this.save();
            this.render();
            this.closeModal();
            this.updateMemoryAndBgInfoDisplay();
            App.ui.showToast('故事已添加');
        },

        selectStory(id) {
            this.currentStoryId = id;
            this.save();
            this.render();
            this.updateMemoryAndBgInfoDisplay();
        },

        removeStory(id) {
            if (!confirm('确定要删除这个故事吗？其中的记忆和背景信息将不会被删除。')) return;

            this.stories = this.stories.filter(s => s.id !== id);
            if (this.currentStoryId === id) {
                this.currentStoryId = this.stories.length > 0 ? this.stories[0].id : null;
            }
            this.save();
            this.render();
            this.updateMemoryAndBgInfoDisplay();
        },

        getCurrentStory() {
            return this.stories.find(s => s.id === this.currentStoryId) || null;
        },

        render() {
            const list = document.getElementById('story-list');
            const hint = document.getElementById('no-story-hint');

            if (!list || !hint) return;

            if (this.stories.length === 0) {
                list.style.display = 'none';
                hint.style.display = 'flex';
                return;
            }

            list.style.display = 'block';
            hint.style.display = 'none';

            list.innerHTML = this.stories.map(story => `
                <div class="story-item ${story.id === this.currentStoryId ? 'active' : ''}"
                     onclick="App.story.selectStory(${story.id})">
                    <div class="story-info">
                        <i class="fa-solid fa-book-open"></i>
                        <span class="story-title">${story.title}</span>
                    </div>
                    <button class="remove-btn" onclick="event.stopPropagation(); App.story.removeStory(${story.id})">×</button>
                </div>
            `).join('');
        },

        updateMemoryAndBgInfoDisplay() {
            // When switching stories, re-render memory and bgInfo panels
            // For now, these modules use global storage, but this hook allows future per-story filtering
            App.memory.renderPreview();
            App.bgInfo.render();
        }
    },

    // ===== Bookmark Module =====
    bookmark: {
        items: [],

        init() {
            this.load();
        },

        load() {
            const stored = localStorage.getItem('mcc_bookmarks');
            this.items = stored ? JSON.parse(stored) : [];
        },

        save() {
            localStorage.setItem('mcc_bookmarks', JSON.stringify(this.items));
        },

        isBookmarked(index) {
            if (!App.currentChatId) return false;
            return this.items.some(
                b => b.chatId === App.currentChatId && b.index === index
            );
        },

        toggle(index) {
            if (!App.currentChatId || !App.allMessages[index]) return;

            const existingIdx = this.items.findIndex(
                b => b.chatId === App.currentChatId && b.index === index
            );

            if (existingIdx !== -1) {
                // Remove bookmark
                this.items.splice(existingIdx, 1);
            } else {
                // Add bookmark
                const msg = App.allMessages[index];
                const preview = (msg.mes || '').replace(/<[^>]+>/g, '').substring(0, 50);
                this.items.push({
                    chatId: App.currentChatId,
                    index: index,
                    charName: msg.name || '???',
                    preview: preview + (preview.length >= 50 ? '...' : ''),
                    page: Math.floor(index / App.pageSize) + 1,
                    timestamp: Date.now()
                });
                // Sort by index
                this.items.sort((a, b) => {
                    if (a.chatId !== b.chatId) return a.chatId.localeCompare(b.chatId);
                    return a.index - b.index;
                });
            }

            this.save();
            App.chat.renderMessages();
        },

        getBookmarks() {
            if (!App.currentChatId) return [];
            return this.items.filter(b => b.chatId === App.currentChatId);
        },

        clearAll() {
            if (!App.currentChatId) return;
            if (!confirm('确定清空当前对话的所有书签？')) return;
            this.items = this.items.filter(b => b.chatId !== App.currentChatId);
            this.save();
            App.chat.renderMessages();
            this.renderList();
        },

        jumpToBookmark(index) {
            // Calculate page and jump
            const page = Math.floor(index / App.pageSize) + 1;
            App.currentPage = page;
            App.chat.renderMessages();

            // Scroll to message with highlight
            setTimeout(() => {
                const row = document.querySelector(`[data-msg-index="${index}"]`);
                if (row) {
                    row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    row.classList.add('highlight-flash');
                    setTimeout(() => row.classList.remove('highlight-flash'), 2000);
                }
            }, 100);

            // Close panel and switch to reader tab
            App.ui.closePanel();
            App.ui.switchTab('reader');
        },

        renderList() {
            const container = document.getElementById('bookmarks-list-content');
            if (!container) return;

            const bookmarks = this.getBookmarks();

            if (bookmarks.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-bookmark"></i>
                        <p>暂无书签</p>
                        <p class="hint">在阅读器中点击消息旁的书签按钮添加书签</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = bookmarks.map(b => `
                <div class="bookmark-card" onclick="App.bookmark.jumpToBookmark(${b.index})">
                    <div class="bookmark-header">
                        <span class="bookmark-char">${b.charName}</span>
                        <span class="bookmark-page">P.${b.page} #${b.index + 1}</span>
                    </div>
                    <div class="bookmark-preview">${b.preview}</div>
                </div>
            `).join('');
        }
    }
};

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => App.init());

