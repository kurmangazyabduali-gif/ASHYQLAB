/* =====================================================
   PRESENTATION APP — COMPLETE SCRIPT WITH RAG ARCHITECTURE
   ===================================================== */

const API_KEY = localStorage.getItem('ai_api_key') || localStorage.getItem('gemini_api_key') || atob('c2stWURjaEdfRFpxamtuVk5zdXlKd1NhQQ==');
const PHOTO_API_KEY = localStorage.getItem('photo_api_key') || atob('c2stR1dxWTk5cnFJekR3STVLTGFQdUkxdw==');
const FALLBACK_GEMINI_KEY = atob('QVEuQWI4Uk42SnZ1V19xZ0FmSlpBaURwbE1EbEdxR0tvYlRiZ3hMc2l3aWI0c1BNZXJHQnc=');
const GEMINI_ENDPOINTS = [
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent'
];
const GEMINI_URL = GEMINI_ENDPOINTS[0];

// ── App State ────────────────────────────────────────────────
let presentationState = {
    title: 'Новая презентация',
    theme: {
        backgroundColor: '#F8FAFC',
        primaryTextColor: '#475569',
        accentColor: '#3B82F6',
        style: 'NotebookLM Academic'
    },
    slides: [],
    currentSlideIndex: 0
};

// Preset Palettes
// Preset Palettes
const PALETTES_MAP = {
    'cyber-nebula':   { bg: '#060713', text: '#cbd5e1', accent: '#00f0ff', accentSecondary: '#a855f7', accentGlow: 'rgba(0, 240, 255, 0.35)', style: 'Cyber Nebula 4K' },
    'quantum-tech':   { bg: '#070b14', text: '#e2e8f0', accent: '#10b981', accentSecondary: '#facc15', accentGlow: 'rgba(16, 185, 129, 0.35)', style: 'Quantum Tech' },
    'imperial-gold':  { bg: '#0f0a1c', text: '#fef3c7', accent: '#fbbf24', accentSecondary: '#f59e0b', accentGlow: 'rgba(251, 191, 36, 0.35)', style: 'Imperial Gold' },
    'apple-titanium': { bg: '#f8fafc', text: '#334155', accent: '#4f46e5', accentSecondary: '#0284c7', accentGlow: 'rgba(79, 70, 229, 0.25)', style: 'Apple Titanium Pro' },
    'biotech-matrix': { bg: '#021811', text: '#d1fae5', accent: '#10b981', accentSecondary: '#34d399', accentGlow: 'rgba(16, 185, 129, 0.35)', style: 'BioTech Matrix' },
    'solar-flare':    { bg: '#140a12', text: '#ffe4e6', accent: '#f43f5e', accentSecondary: '#fb923c', accentGlow: 'rgba(244, 63, 94, 0.35)', style: 'Solar Flare' },
    'deep-ocean':     { bg: '#031024', text: '#bae6fd', accent: '#38bdf8', accentSecondary: '#06b6d4', accentGlow: 'rgba(56, 189, 248, 0.35)', style: 'Deep Ocean 4K' },
    'cosmic-aurora':  { bg: '#0c061a', text: '#f3e8ff', accent: '#c084fc', accentSecondary: '#f472b6', accentGlow: 'rgba(192, 132, 252, 0.35)', style: 'Cosmic Aurora' }
};

// ── 8 Signature WOW Design Themes + Specialized Templates ──────────────────────────
let selectedTemplateId = 'cyber-nebula';
let activeCategoryFilter = 'all';

const DESIGN_TEMPLATES = [
    {
        id: 'cyber-nebula',
        name: 'Cyber Nebula',
        category: 'tech',
        icon: '🌌',
        isDark: true,
        theme: { 
            backgroundColor: '#060713', 
            primaryTextColor: '#cbd5e1', 
            accentColor: '#00f0ff',
            accentSecondary: '#a855f7',
            accentGlow: 'rgba(0, 240, 255, 0.35)',
            style: 'Cyber Nebula 4K',
            tileBg: 'rgba(12, 16, 33, 0.65)',
            tileBorder: 'rgba(0, 240, 255, 0.25)',
            titleColor: '#ffffff'
        },
        imageStyle: 'futuristic cyber nebula holographic octane 3d render, cinematic neon lighting, volumetric atmosphere, unreal engine 5 aesthetic 8k',
        layouts: ['cover', 'split-left', 'stat', 'steps', 'cards-grid', 'compare', 'insight', 'split-right'],
        preview: 'split-left'
    },
    {
        id: 'hub-startup',
        name: 'Hub Startup Pro',
        category: 'business',
        icon: '🚀',
        isDark: false,
        theme: { 
            backgroundColor: '#ffffff', 
            primaryTextColor: '#334155', 
            accentColor: '#ea580c',
            accentSecondary: '#f59e0b',
            accentGlow: 'rgba(234, 88, 12, 0.25)',
            style: 'Hub Startup Ecosystem',
            tileBg: '#ffffff',
            tileBorder: '#e2e8f0',
            titleColor: '#0f172a'
        },
        imageStyle: 'modern tech startup innovation hub coworking pitch deck presentation photography, clean bright lighting 8k',
        layouts: ['cover', 'hub-ecosystem', 'kpi-grid', 'steps', 'cards-grid', 'compare', 'insight', 'split-right'],
        preview: 'cards-grid'
    },
    {
        id: 'quantum-tech',
        name: 'Quantum Tech',
        category: 'tech',
        icon: '⚡',
        isDark: true,
        theme: { 
            backgroundColor: '#070b14', 
            primaryTextColor: '#e2e8f0', 
            accentColor: '#10b981',
            accentSecondary: '#facc15',
            accentGlow: 'rgba(16, 185, 129, 0.35)',
            style: 'Quantum Tech',
            tileBg: 'rgba(15, 23, 42, 0.65)',
            tileBorder: 'rgba(16, 185, 129, 0.25)',
            titleColor: '#ffffff'
        },
        imageStyle: 'quantum high tech laboratory physics experiment 3d cinematic render, laser glow, dark obsidian aesthetic 8k',
        layouts: ['cover', 'stat', 'steps', 'split-left', 'cards-grid', 'compare', 'insight', 'split-right'],
        preview: 'stat'
    },
    {
        id: 'imperial-gold',
        name: 'Imperial Gold',
        category: 'business',
        icon: '👑',
        isDark: true,
        theme: { 
            backgroundColor: '#0f0a1c', 
            primaryTextColor: '#fef3c7', 
            accentColor: '#fbbf24',
            accentSecondary: '#f59e0b',
            accentGlow: 'rgba(251, 191, 36, 0.35)',
            style: 'Imperial Gold',
            tileBg: 'rgba(28, 18, 42, 0.65)',
            tileBorder: 'rgba(251, 191, 36, 0.3)',
            titleColor: '#fffbeb'
        },
        imageStyle: 'royal imperial golden dramatic cinematic lighting, masterpiece 3d render, luxury velvet gold textures 8k',
        layouts: ['cover', 'split-left', 'insight', 'cards-grid', 'stat', 'compare', 'steps', 'split-right'],
        preview: 'insight'
    },
    {
        id: 'apple-titanium',
        name: 'Apple Titanium',
        category: 'academic',
        icon: '🍏',
        isDark: false,
        theme: { 
            backgroundColor: '#f8fafc', 
            primaryTextColor: '#334155', 
            accentColor: '#4f46e5',
            accentSecondary: '#0284c7',
            accentGlow: 'rgba(79, 70, 229, 0.25)',
            style: 'Apple Titanium Pro',
            tileBg: '#ffffff',
            tileBorder: '#e2e8f0',
            titleColor: '#0f172a'
        },
        imageStyle: 'ultra clean modern Apple keynote aesthetic 3d render, pure studio lighting, minimalist architectural geometry 8k',
        layouts: ['cover', 'split-left', 'cards-grid', 'stat', 'steps', 'compare', 'insight', 'split-right'],
        preview: 'split-left'
    },
    {
        id: 'biotech-matrix',
        name: 'BioTech Matrix',
        category: 'academic',
        icon: '🧬',
        isDark: true,
        theme: { 
            backgroundColor: '#021811', 
            primaryTextColor: '#d1fae5', 
            accentColor: '#10b981',
            accentSecondary: '#34d399',
            accentGlow: 'rgba(16, 185, 129, 0.35)',
            style: 'BioTech Matrix',
            tileBg: 'rgba(4, 38, 27, 0.65)',
            tileBorder: 'rgba(16, 185, 129, 0.25)',
            titleColor: '#ecfdf5'
        },
        imageStyle: 'microscopic glowing biological cell DNA structure 3d scientific rendering octane, bioluminescent emerald 8k',
        layouts: ['cover', 'split-right', 'stat', 'steps', 'cards-grid', 'compare', 'insight', 'split-left'],
        preview: 'split-right'
    },
    {
        id: 'solar-flare',
        name: 'Solar Flare',
        category: 'creative',
        icon: '🌅',
        isDark: true,
        theme: { 
            backgroundColor: '#140a12', 
            primaryTextColor: '#ffe4e6', 
            accentColor: '#f43f5e',
            accentSecondary: '#fb923c',
            accentGlow: 'rgba(244, 63, 94, 0.35)',
            style: 'Solar Flare',
            tileBg: 'rgba(38, 15, 28, 0.65)',
            tileBorder: 'rgba(244, 63, 94, 0.25)',
            titleColor: '#ffffff'
        },
        imageStyle: 'dramatic solar flare sunset horizon, fiery cinematic lighting, 3d isometric render 8k',
        layouts: ['cover', 'stat', 'split-left', 'cards-grid', 'steps', 'compare', 'insight', 'split-right'],
        preview: 'stat'
    },
    {
        id: 'deep-ocean',
        name: 'Deep Ocean',
        category: 'academic',
        icon: '🌊',
        isDark: true,
        theme: { 
            backgroundColor: '#031024', 
            primaryTextColor: '#bae6fd', 
            accentColor: '#38bdf8',
            accentSecondary: '#06b6d4',
            accentGlow: 'rgba(56, 189, 248, 0.35)',
            style: 'Deep Ocean 4K',
            tileBg: 'rgba(6, 30, 58, 0.65)',
            tileBorder: 'rgba(56, 189, 248, 0.25)',
            titleColor: '#f0f9ff'
        },
        imageStyle: 'deep underwater bioluminescent abyss, azure oceanic rays, high tech 3d render 8k',
        layouts: ['cover', 'split-left', 'steps', 'stat', 'cards-grid', 'compare', 'insight', 'split-right'],
        preview: 'split-left'
    },
    {
        id: 'cosmic-aurora',
        name: 'Cosmic Aurora',
        category: 'creative',
        icon: '🔮',
        isDark: true,
        theme: { 
            backgroundColor: '#0c061a', 
            primaryTextColor: '#f3e8ff', 
            accentColor: '#c084fc',
            accentSecondary: '#f472b6',
            accentGlow: 'rgba(192, 132, 252, 0.35)',
            style: 'Cosmic Aurora',
            tileBg: 'rgba(26, 12, 48, 0.65)',
            tileBorder: 'rgba(192, 132, 252, 0.25)',
            titleColor: '#ffffff'
        },
        imageStyle: 'cosmic aurora borealis glowing purple nebula digital art, abstract 3d geometry 8k',
        layouts: ['cover', 'cards-grid', 'split-right', 'stat', 'steps', 'compare', 'insight', 'split-left'],
        preview: 'cards-grid'
    }
];

// ── NotebookLM RAG Source State ──────────────────────────────
let ragSourceState = {
    activeTab: 'none', // 'none' | 'file' | 'text' | 'vsh'
    sourceText: '',
    sourceMeta: '',
    fileName: ''
};

// Pre-loaded VSH Lab Manuals Database
const VSH_LABS_DB = {
    physics_ohm: `Лабораторная работа №1 по физике: Экспериментальное исследование Закона Ома для участка цепи.
Цель работы: Измерить силу тока I в проводнике при различных напряжениях U и сопротивлении R, проверить справедливость закона I = U / R.
Оборудование: Источник постоянного тока, амперметр, вольтметр, реостат, исследуемый резистор, ключ, соединительные провода.
Теоретическая справка: Сила тока в участке цепи прямо пропорциональна напряжению на концах этого участка и обратно пропорциональна его сопротивлению (Закон Ома). Формула: I = U/R, где I — сила тока в амперах (А), U — напряжение в вольтах (В), R — сопротивление в омах (Ом).
Ход работы:
1. Собрать электрическую цепь, последовательно соединив источник, реостат, резистор R1, ключ и амперметр.
2. Подключить вольтметр параллельно резистору R1.
3. Замкнуть ключ. Изменяя положение ползунка реостата, снять показания при напряжении 2В, 4В, 6В.
4. Вычислить сопротивление R = U/I для каждого измерения.
5. Заменить резистор на R2 и повторить измерения.
Результаты и выводы: С увеличением напряжения сила тока пропорционально возрастает. График зависимости I(U) представляет собой прямую линию. Закон Ома полностью подтвержден.`,

    biology_cell: `Лабораторная работа по биологии: Микроскопическое исследование строения растительной и животной клетки.
Цель работы: Изучить особенности клеточного строения клеток кожицы чешуи лука и эпителия человека, выявить ключевые различия между растительными и животными клетками.
Оборудование и материалы: Микроскоп, покровные и предметные стекла, препаровальная игла, раствор иода, пипетка, кожица лука, соскоб эпителия.
Теоретическая часть: Растительные клетки обладают твердой целлюлозной клеточной стенкой, пластидами (хлоропласты, хромопласты, лейкопласты) и крупными центральными вакуолями с клеточным соком. Животные клетки не имеют клеточной стенки и вакуолей с соком, их внешняя граница — плазматическая мембрана. Ядро и цитоплазма присутствуют в обоих типах клеток.
Ход работы:
1. Приготовить временный микропрепарат кожицы лука, окрасить раствором иода.
2. Рассмотреть препарат при малом и большом увеличении микроскопа. Найти клеточную стенку, ядро, цитоплазму.
3. Приготовить микропрепарат клеток эпителия полости рта, найти ядро и мембрану.
Выводы: Растительная клетка имеет форму прямоугольного блока с прочной стенкой и зелеными хлоропластами (место фотосинтеза). Животная клетка имеет округлую эластичную форму.`,

    physics_newton: `Лабораторный практикум по физике: Законы движения Ньютона и динамика механических систем.
Цель работы: Экспериментальное подтверждение второго закона Ньютона (F = m*a) и исследование зависимости ускорения тела от приложенной силы и массы.
Оборудование: Легкая тележка, направляющая дорожка, набор грузов, датчик движения, секундомер, динамометр.
Теоретическая справка: 
- 1-й Закон Ньютона (Закон инерции): Тело сохраняет состояние покоя или равномерного прямолинейного движения, пока внешние силы не заставят его изменить это состояние.
- 2-й Закон Ньютона: Ускорение тела прямо пропорционально равнодействующей всех сил и обратно пропорционально массе тела: a = F / m.
- 3-й Закон Ньютона: Силы взаимодействия двух тел равны по модулю и противоположны по направлению: F1 = -F2.
Ход работы:
1. Закрепить тележку на гладкой дорожке, подвесить груз массой m1 через блок.
2. Измерить ускорение a1 с помощью датчика.
3. Увеличить силу тяги F (добавив груз на нить) и измерить новое ускорение a2.
4. Поместить дополнительный груз на тележку (увеличив массу m) при постоянной силе F и измерить ускорение.
Вывод: Ускорение возрастает с увеличением силы тяги и уменьшается с ростом массы тела. Законы динамики Ньютона подтверждены экспериментально.`,

    chemistry_periodic: `Лабораторная работа по химии: Периодический закон Д.И. Менделеева и закономерности химических свойств элементов.
Цель работы: Изучить изменение металлических и неметаллических свойств элементов 3-го периода (Na, Mg, Al, Si, P, S, Cl) в зависимости от строения электронных оболочек атомов.
Теоретические сведения: Свойства химических элементов и образуемых ими простых и сложных веществ находятся в периодической зависимости от заряда их атомных ядер. В периоде слева направо радиус атома уменьшается, число валентных электронов растет, металлические свойства ослабевают, а неметаллические усиливаются. В группах сверху вниз металлические свойства возрастают.
Ход эксперимента:
1. Исследование реакций натрия, магния и алюминия с водой и кислотами. Na бурно реагирует с водой с выделением H2. Mg реагирует с горячей водой. Al реагирует только после удаления оксидной пленки.
2. Сравнение характера оксидов и гидроксидов: NaOH — сильное основание (щелочь), Mg(OH)2 — слабое основание, Al(OH)3 — амфотерный гидроксид, H2SiO3 и H2SO4 — кислоты.
Вывод: В периоде слева направо основные свойства гидроксидов сменяются амфотерными, а затем кислотными.`,

    geometry_pythagoras: `Лабораторный практикум по геометрии: Теорема Пифагора и ее практическое применение.
Цель работы: Доказать теорему Пифагора на основе геометрических построений и проверить равенство a^2 + b^2 = c^2 для прямоугольных треугольников.
Теоретическая часть: В прямоугольном треугольнике квадрат длины гипотенузы равен сумме квадратов длин катетов. Формула: c^2 = a^2 + b^2, где c — гипотенуза, a и b — катеты. Треугольник со сторонами 3, 4, 5 называется Египетским треугольником.
Ход работы:
1. Построить прямоугольный треугольник со сторонами a = 6 см, b = 8 см. Измерить гипотенузу c = 10 см. Проверить: 6^2 + 8^2 = 36 + 64 = 100 = 10^2.
2. Построить квадраты на каждой из трех сторон треугольника. Площадь квадрата на гипотенузе равна сумме площадей квадратов на катетах: S_c = S_a + S_b.
3. Решить прикладную задачу: Найти длину диагонали прямоугольного экрана со сторонами 12 см и 16 см. c = sqrt(144 + 256) = sqrt(400) = 20 см.
Вывод: Теорема Пифагора является фундаментальным соотношением евклидовой геометрии и широко применяется в инженерных расчетах.`
};

// Helper: Read text from file (.txt, .md, .pdf)
async function extractTextFromFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'txt' || ext === 'md' || ext === 'text') {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(new Error('Не удалось прочитать файл'));
            reader.readAsText(file);
        });
    } else if (ext === 'pdf') {
        if (typeof pdfjsLib === 'undefined') {
            throw new Error('Библиотека PDF.js не загружена.');
        }
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += `--- Страница ${i} ---\n` + pageText + '\n\n';
        }
        return fullText;
    } else {
        throw new Error('Поддерживаются только файлы .PDF, .TXT и .MD');
    }
}

/* ──────────────────────────────────────────────
   BOOTSTRAP & EVENT LISTENERS
─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', function () {

    // Screens
    const screenPrompt    = document.getElementById('screen-prompt');
    const screenWorkspace = document.getElementById('screen-workspace');
    const screenPresenter = document.getElementById('screen-presenter');

    // Prompt Screen DOM
    const promptInput     = document.getElementById('prompt-input');
    const selectGrade     = document.getElementById('select-grade');
    const selectSlides    = document.getElementById('select-slides');
    const btnGenerate     = document.getElementById('btn-generate');
    const btnGenIcon      = document.getElementById('btn-gen-icon');
    const btnGenText      = document.getElementById('btn-gen-text');
    const genProgress     = document.getElementById('generation-progress');
    const genProgressFill = document.getElementById('gen-progress-fill');
    const genProgressText = document.getElementById('gen-progress-text');

    // Workspace Header DOM
    const btnBackPrompt   = document.getElementById('btn-back-to-prompt');
    const wsTitleInput    = document.getElementById('workspace-title-input');
    const themeStyleBadge = document.getElementById('theme-style-badge');
    const btnPresentMode  = document.getElementById('btn-present-mode');
    const btnPPTX         = document.getElementById('btn-download-pptx');
    const btnPDF          = document.getElementById('btn-download-pdf');

    // Sidebar Editor & Controls
    const btnAddSlide     = document.getElementById('btn-add-slide');
    const btnMoveLeft     = document.getElementById('btn-move-left');
    const btnMoveRight    = document.getElementById('btn-move-right');
    const btnDeleteSlide  = document.getElementById('btn-delete-slide');
    const editSlideTitle  = document.getElementById('edit-slide-title');
    const editSlidePoints = document.getElementById('edit-slide-points');
    const editImgPrompt   = document.getElementById('edit-image-prompt');
    const btnRefreshImg   = document.getElementById('btn-refresh-image');

    // Presenter Mode DOM
    const btnClosePresent = document.getElementById('btn-close-presenter');
    const btnPrevSlide    = document.getElementById('btn-prev-slide');
    const btnNextSlide    = document.getElementById('btn-next-slide');

    // Restore from localStorage if present
    loadFromLocalStorage();

    // ── NotebookLM RAG Source Management Event Handlers ──
    document.querySelectorAll('.rag-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.rag-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const sourceTab = tab.getAttribute('data-source-tab');
            ragSourceState.activeTab = sourceTab;

            document.querySelectorAll('.rag-panel').forEach(p => p.classList.add('hidden'));

            if (sourceTab === 'file') {
                document.getElementById('rag-panel-file').classList.remove('hidden');
            } else if (sourceTab === 'text') {
                document.getElementById('rag-panel-text').classList.remove('hidden');
            } else if (sourceTab === 'vsh') {
                document.getElementById('rag-panel-vsh').classList.remove('hidden');
            }

            updateRagStatusBadge();
        });
    });

    const ragDropzone = document.getElementById('rag-dropzone');
    const ragFileInput = document.getElementById('rag-file-input');
    const ragFileInfo = document.getElementById('rag-file-info');
    const ragFileName = document.getElementById('rag-file-name');
    const ragFileMeta = document.getElementById('rag-file-meta');
    const ragFileRemove = document.getElementById('rag-file-remove');

    if (ragDropzone) {
        ragDropzone.addEventListener('click', () => ragFileInput.click());
        ragDropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            ragDropzone.classList.add('dragover');
        });
        ragDropzone.addEventListener('dragleave', () => ragDropzone.classList.remove('dragover'));
        ragDropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            ragDropzone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });
    }

    if (ragFileInput) {
        ragFileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
            }
        });
    }

    if (ragFileRemove) {
        ragFileRemove.addEventListener('click', (e) => {
            e.stopPropagation();
            ragSourceState.sourceText = '';
            ragSourceState.fileName = '';
            ragSourceState.sourceMeta = '';
            ragFileInfo.classList.add('hidden');
            ragDropzone.classList.remove('hidden');
            ragFileInput.value = '';
            updateRagStatusBadge();
        });
    }

    async function handleFileSelect(file) {
        try {
            ragFileName.textContent = file.name;
            ragFileMeta.textContent = `${(file.size / 1024).toFixed(1)} КБ • Извлечение текста...`;
            ragDropzone.classList.add('hidden');
            ragFileInfo.classList.remove('hidden');

            const text = await extractTextFromFile(file);
            const wordCount = text.trim().split(/\s+/).length;

            ragSourceState.sourceText = text;
            ragSourceState.fileName = file.name;
            ragSourceState.sourceMeta = `${(file.size / 1024).toFixed(1)} КБ • ~${wordCount} слов`;

            ragFileMeta.textContent = ragSourceState.sourceMeta;
            updateRagStatusBadge();
            showToast(`Файл "${file.name}" загружен в контекст RAG`, 'success');
        } catch(err) {
            showToast(err.message || 'Ошибка чтения файла', 'error');
            ragFileInfo.classList.add('hidden');
            ragDropzone.classList.remove('hidden');
        }
    }

    const ragTextInput = document.getElementById('rag-text-input');
    if (ragTextInput) {
        ragTextInput.addEventListener('input', (e) => {
            ragSourceState.sourceText = e.target.value;
            updateRagStatusBadge();
        });
    }

    const ragVshSelect = document.getElementById('rag-vsh-select');
    if (ragVshSelect) {
        ragVshSelect.addEventListener('change', (e) => {
            const labKey = e.target.value;
            if (labKey && VSH_LABS_DB[labKey]) {
                ragSourceState.sourceText = VSH_LABS_DB[labKey];
                const text = VSH_LABS_DB[labKey];
                const wordCount = text.trim().split(/\s+/).length;
                ragSourceState.sourceMeta = `Лабораторная VSH • ~${wordCount} слов`;
                showToast('Лабораторная работа загружена в контекст RAG', 'success');
            } else {
                ragSourceState.sourceText = '';
                ragSourceState.sourceMeta = '';
            }
            updateRagStatusBadge();
        });
    }

    function updateRagStatusBadge() {
        const badge = document.getElementById('rag-status-badge');
        if (!badge) return;

        let hasContext = false;
        let label = 'Без файла (Общий ИИ)';

        if (ragSourceState.activeTab === 'file' && ragSourceState.sourceText) {
            hasContext = true;
            label = `📄 ${ragSourceState.fileName || 'Файл'} (${ragSourceState.sourceMeta})`;
        } else if (ragSourceState.activeTab === 'text' && ragSourceState.sourceText.trim()) {
            hasContext = true;
            const words = ragSourceState.sourceText.trim().split(/\s+/).length;
            label = `📝 Ручной текст (~${words} слов)`;
        } else if (ragSourceState.activeTab === 'vsh' && ragSourceState.sourceText) {
            hasContext = true;
            label = `📚 Лабораторная VSH`;
        }

        badge.textContent = label;
        if (hasContext) badge.classList.add('active');
        else badge.classList.remove('active');
    }

    // ── Template Design Picker Rendering with Category Filtering ──
    function renderTemplateGrid() {
        const grid = document.getElementById('template-grid');
        const countBadge = document.getElementById('template-count-badge');
        if (!grid) return;
        grid.innerHTML = '';

        const filtered = activeCategoryFilter === 'all' 
            ? DESIGN_TEMPLATES 
            : DESIGN_TEMPLATES.filter(t => t.category === activeCategoryFilter);

        if (countBadge) {
            countBadge.textContent = `${filtered.length} шаблонов`;
        }

        filtered.forEach(tpl => {
            const card = document.createElement('div');
            card.className = `template-card ${tpl.id === selectedTemplateId ? 'active' : ''}`;
            card.setAttribute('data-template-id', tpl.id);

            const bg = tpl.theme.backgroundColor;
            const accent = tpl.theme.accentColor;
            const text = tpl.theme.primaryTextColor;
            const previewLayout = tpl.preview || 'split-left';

            let bodyHTML = '';
            if (previewLayout === 'split-left') {
                bodyHTML = `
                    <div class="tpl-preview-lines">
                        <div class="tpl-preview-line" style="background:${text}"></div>
                        <div class="tpl-preview-line" style="background:${text}"></div>
                        <div class="tpl-preview-line" style="background:${text}"></div>
                    </div>
                    <div class="tpl-preview-img" style="background:${accent}"></div>
                `;
            } else if (previewLayout === 'split-right') {
                bodyHTML = `
                    <div class="tpl-preview-img" style="background:${accent}"></div>
                    <div class="tpl-preview-lines">
                        <div class="tpl-preview-line" style="background:${text}"></div>
                        <div class="tpl-preview-line" style="background:${text}"></div>
                        <div class="tpl-preview-line" style="background:${text}"></div>
                    </div>
                `;
            } else if (previewLayout === 'top-bottom') {
                bodyHTML = `
                    <div style="display:flex;flex-direction:column;flex:1;gap:4px;">
                        <div class="tpl-preview-lines" style="flex:0.5;">
                            <div class="tpl-preview-line" style="background:${text}"></div>
                            <div class="tpl-preview-line" style="background:${text}"></div>
                        </div>
                        <div class="tpl-preview-img" style="flex:0.5;width:100%;background:${accent}"></div>
                    </div>
                `;
            } else if (previewLayout === 'cards-grid') {
                bodyHTML = `
                    <div class="tpl-preview-grid">
                        <div class="tpl-preview-minicard" style="background:${accent}"></div>
                        <div class="tpl-preview-minicard" style="background:${accent}"></div>
                        <div class="tpl-preview-minicard" style="background:${accent}"></div>
                    </div>
                `;
            } else if (previewLayout === 'focus-card') {
                bodyHTML = `
                    <div style="flex:1;border-radius:4px;border:1px solid ${accent}30;display:flex;flex-direction:column;gap:4px;padding:6%;justify-content:center;">
                        <div class="tpl-preview-line" style="background:${text};width:90%"></div>
                        <div class="tpl-preview-line" style="background:${text};width:75%"></div>
                        <div class="tpl-preview-line" style="background:${text};width:82%"></div>
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="tpl-preview" style="background:${bg};">
                    <div class="tpl-preview-accent" style="background:${accent};"></div>
                    <div class="tpl-preview-title" style="background:${accent};"></div>
                    <div class="tpl-preview-body">
                        ${bodyHTML}
                    </div>
                </div>
                <div class="template-card-label">${tpl.icon} ${tpl.name}</div>
            `;

            card.addEventListener('click', () => {
                selectedTemplateId = tpl.id;
                document.querySelectorAll('#template-grid .template-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });

            grid.appendChild(card);
        });
    }

    // Category Tabs Click
    document.querySelectorAll('.tpl-cat-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tpl-cat-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            activeCategoryFilter = this.getAttribute('data-category') || 'all';
            renderTemplateGrid();
        });
    });

    // Random Template Button Click
    const btnRandomTemplate = document.getElementById('btn-random-template');
    if (btnRandomTemplate) {
        btnRandomTemplate.addEventListener('click', function() {
            const available = activeCategoryFilter === 'all' 
                ? DESIGN_TEMPLATES 
                : DESIGN_TEMPLATES.filter(t => t.category === activeCategoryFilter);
            if (!available.length) return;

            const randomTpl = available[Math.floor(Math.random() * available.length)];
            selectedTemplateId = randomTpl.id;
            renderTemplateGrid();

            const activeCard = document.querySelector(`[data-template-id="${randomTpl.id}"]`);
            if (activeCard) {
                activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            showToast(`Выбран стиль: ${randomTpl.icon} ${randomTpl.name}`, 'info');
        });
    }

    renderTemplateGrid();

    // ── Hint Chips Click ─────────────────────────────────────
    document.querySelectorAll('.hint-chip').forEach(function(chip) {
        chip.addEventListener('click', function() {
            promptInput.value = chip.getAttribute('data-text');
            promptInput.focus();
        });
    });

    // ── Generate Button Click with Topic Intelligence ─────────
    btnGenerate.addEventListener('click', async function() {
        const topic = promptInput.value.trim();
        if (!topic) {
            showToast('Пожалуйста, введите тему презентации', 'error');
            promptInput.focus();
            return;
        }

        let sourceContext = (ragSourceState.activeTab !== 'none') ? ragSourceState.sourceText : '';

        const selectSlideCount = document.getElementById('select-slide-count');
        const selectSlideLevel = document.getElementById('select-slide-level');
        const selectSlideLang  = document.getElementById('select-slide-lang');

        const genOptions = {
            slideCount: selectSlideCount ? parseInt(selectSlideCount.value, 10) || 7 : 7,
            audienceLevel: selectSlideLevel ? selectSlideLevel.value : 'school',
            slideLang: selectSlideLang ? selectSlideLang.value : 'auto'
        };

        btnGenerate.disabled = true;
        btnGenIcon.className = 'fa-solid fa-spinner icon-spin';
        btnGenText.textContent = 'Анализ темы и подбор WOW-стиля...';
        genProgress.classList.remove('hidden');
        setGenProgress(15, 'Глубокий анализ темы и палитры...');

        try {
            const intel = detectTopicIntelligence(topic, sourceContext);
            selectedTemplateId = intel.id;

            // Automatic Wikipedia Grounding if no manual document was uploaded
            if (!sourceContext) {
                btnGenText.textContent = 'Поиск фактов в энциклопедии...';
                setGenProgress(25, 'Извлечение достоверных фактов из Википедии...');
                const wikiKnowledge = await fetchWikipediaKnowledge(topic);
                if (wikiKnowledge) {
                    sourceContext = wikiKnowledge;
                }
            }

            if (sourceContext) {
                btnGenText.textContent = 'RAG извлечение фактов из источника...';
                setGenProgress(40, 'Анализ контекста и генерация слайдов...');
            } else {
                btnGenText.textContent = 'Генерация слайдов через ИИ...';
                setGenProgress(40, `Генерация слайдов в стиле «${intel.name}»...`);
            }

            const rawData = await callUniversalAI(topic, sourceContext, intel, genOptions);

            btnGenText.textContent = 'Создаем кинематографичный WOW-дизайн...';
            setGenProgress(75, 'Сборка визуальных макетов...');
            await sleep(200);

            initPresentationState(rawData, intel);

            btnGenText.textContent = 'Поиск реальных фото в Википедии и Сети...';
            setGenProgress(85, 'Загрузка реальных фотографий...');
            await autoAttachRealWebPhotos(presentationState, topic);

            setGenProgress(100, '✅ Готово!');
            await sleep(300);

            // АВТО-ОТКРЫТИЕ WORKSPACE (.workspace)
            switchScreen(screenWorkspace);
            renderWorkspace();
            saveToLocalStorage();
            
            // Auto cloud save if user is logged in
            if (typeof AshyqAuth !== 'undefined' && AshyqAuth.isLoggedIn && AshyqAuth.isLoggedIn()) {
                const docId = presentationState.id || ('pres_' + Date.now());
                presentationState.id = docId;
                AshyqAuth.saveDocument({
                    id: docId,
                    title: presentationState.title || 'Презентация',
                    subject: 'Презентация',
                    grade: `${presentationState.slides.length} слайд`,
                    topic: presentationState.title || '',
                    html: '',
                    docType: 'presentation',
                    data: presentationState
                });
            }

            showToast(`Презентация жасалды: «${intel.name}» стилі!`, 'success');

        } catch (err) {
            console.error('[Generate error]', err);
            showToast(err.message || 'Ошибка генерации', 'error');
        } finally {
            btnGenerate.disabled = false;
            btnGenIcon.className = 'fa-solid fa-wand-magic-sparkles';
            btnGenText.textContent = 'Сгенерировать WOW-презентацию';
            genProgress.classList.add('hidden');
        }
    });

    // ── Image Source Mode Switcher (Web / AI) ─────────────────
    document.querySelectorAll('.img-src-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.img-src-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            imageSourceMode = this.getAttribute('data-source-mode') || 'web';
            localStorage.setItem('vsh_image_source_mode', imageSourceMode);
            showToast(`Режим фото: ${imageSourceMode === 'web' ? '🌐 Реальные фото (Wikipedia / Web)' : '🎨 ИИ 3D-генерация'}`, 'info');
        });
    });

    // ── Save to Cloud Button ─────────────────────────────────
    const btnSaveCloud = document.getElementById('btn-save-cloud');
    if (btnSaveCloud) {
        btnSaveCloud.addEventListener('click', function() {
            if (!presentationState.slides || !presentationState.slides.length) {
                showToast('Презентация бос', 'error');
                return;
            }
            saveToLocalStorage();
            if (typeof AshyqAuth !== 'undefined') {
                if (!AshyqAuth.isLoggedIn()) {
                    AshyqAuth.openLogin();
                    showToast('Бұлтқа сақтау үшін жүйеге кіріңіз немесе тіркеліңіз', 'info');
                    return;
                }
                const docId = presentationState.id || ('pres_' + Date.now());
                presentationState.id = docId;
                const ok = AshyqAuth.saveDocument({
                    id: docId,
                    title: presentationState.title || 'Презентация',
                    subject: 'Презентация',
                    grade: `${presentationState.slides.length} слайд`,
                    topic: presentationState.title || '',
                    html: '',
                    docType: 'presentation',
                    data: presentationState
                });
                if (ok) {
                    showToast(`«${presentationState.title}» бұлттық кабинетке сәтті сақталды!`, 'success');
                } else {
                    showToast('Бұлтқа сақтау орындалды', 'success');
                }
            } else {
                showToast('Презентация браузер жадында сақталды!', 'success');
            }
        });
    }

    // ── Copy All Slides Deck Text ─────────────────────────────
    const btnCopyDeck = document.getElementById('btn-copy-deck');
    if (btnCopyDeck) {
        btnCopyDeck.addEventListener('click', function() {
            if (!presentationState.slides || !presentationState.slides.length) {
                showToast('Презентация бос', 'error');
                return;
            }
            let text = `📋 ${presentationState.title || 'Презентация'}\n`;
            text += `Дизайн: ${presentationState.theme?.style || 'AshyqLab Pro'} • Барлығы ${presentationState.slides.length} слайд\n\n`;
            presentationState.slides.forEach((s, idx) => {
                text += `--- [СЛАЙД ${idx + 1}] ${s.title || ''} ---\n`;
                if (s.points && s.points.length) {
                    s.points.forEach(p => { text += `• ${p}\n`; });
                }
                if (s.speakerNotes) {
                    text += `💬 Шпаргалка спикера: ${s.speakerNotes}\n`;
                }
                text += '\n';
            });
            navigator.clipboard.writeText(text).then(() => {
                showToast('Барлық слайд мәтіндері көшірілді!', 'success');
            }).catch(() => {
                showToast('Көшіру сәтсіз аяқталды', 'error');
            });
        });
    }

    // ── AI Slide Enhancer ─────────────────────────────────────
    const btnAiEnhance = document.getElementById('btn-ai-enhance-slide');
    if (btnAiEnhance) {
        btnAiEnhance.addEventListener('click', async function() {
            const slide = getCurrentSlide();
            if (!slide) return;
            const originalHtml = btnAiEnhance.innerHTML;
            btnAiEnhance.disabled = true;
            btnAiEnhance.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Жақсарту...';
            showToast('AI слайд тезистерін жақсартып жатыр...', 'info');

            try {
                const isKazakh = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test(slide.title + ' ' + (slide.points || []).join(' '));
                const prompt = isKazakh ?
                    `Слайдтың тақырыбы: «${slide.title}». Қазіргі тезистер: ${JSON.stringify(slide.points)}. Осы тезистерді нақтырақ, академиялық, фактологиялық және сауатты қазақ тіліндегі 3-4 пунктке айналдырып, спикер жазбасын жаз. JSON қайтар: {"points": ["пункт 1", "пункт 2", "пункт 3"], "speakerNotes": "спикерге кеңес"}` :
                    `Тема слайда: «${slide.title}». Текущие тезисы: ${JSON.stringify(slide.points)}. Улучши эти тезисы, сделай их более убедительными, структурированными и добавь краткие speakerNotes. Верни JSON: {"points": ["пункт 1", "пункт 2", "пункт 3"], "speakerNotes": "подсказка спикеру"}`;

                const res = await callUniversalAI(prompt, '', null, { slideCount: 1, slideLang: isKazakh ? 'kk' : 'ru' });
                if (res && res.slides && res.slides[0]) {
                    const s = res.slides[0];
                    if (s.points && s.points.length) slide.points = s.points;
                    if (s.speakerNotes) slide.speakerNotes = s.speakerNotes;
                } else if (res && res.points && res.points.length) {
                    slide.points = res.points;
                    if (res.speakerNotes) slide.speakerNotes = res.speakerNotes;
                }
                loadActiveSlideToEditor();
                renderLiveSlidePreview();
                saveToLocalStorage();
                showToast('Слайд тезистері AI арқылы сәтті жақсартылды!', 'success');
            } catch (e) {
                showToast('AI жаңарту кезінде қате орын алды', 'error');
            } finally {
                btnAiEnhance.disabled = false;
                btnAiEnhance.innerHTML = originalHtml;
            }
        });
    }

    // ── AI Add Quiz Question Slide ────────────────────────────
    const btnAiAddQuiz = document.getElementById('btn-ai-add-quiz');
    if (btnAiAddQuiz) {
        btnAiAddQuiz.addEventListener('click', function() {
            const slide = getCurrentSlide();
            const title = slide ? slide.title : presentationState.title;
            const isKazakh = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test(title + ' ' + presentationState.title);

            const quizSlide = {
                title: isKazakh ? `Бекіту сұрақтары: ${title}` : `Контрольные вопросы: ${title}`,
                points: isKazakh ? [
                    'Сұрақ: Бұл тақырыптың басты заңдылығы неде?',
                    'A) Тәжірибелік негіз бен дәлелденген қағидалар (Дұрыс)',
                    'B) Теориялық жорамалдар мен бақылаулар',
                    'C) Өзгермейтін тұрақты шамалар'
                ] : [
                    'Вопрос: В чем заключается фундаментальная суть изучаемой темы?',
                    'A) Практическая верификация и подтвержденные законы (Верно)',
                    'B) Теоретические гипотезы и косвенные наблюдения',
                    'C) Статические константы процессов'
                ],
                imagePrompt: 'interactive classroom quiz light bulb glowing stars 3d render',
                layout: 'insight',
                speakerNotes: isKazakh ? 'Оқушылармен кері байланыс орнатып, сұрақтарды талқылау.' : 'Организуйте интерактивное обсуждение контрольного вопроса с аудиторией.',
                seed: Math.floor(Math.random() * 1000000)
            };

            presentationState.slides.splice(presentationState.currentSlideIndex + 1, 0, quizSlide);
            presentationState.currentSlideIndex++;
            renderWorkspace();
            saveToLocalStorage();
            showToast('Интерактивті сұрақ слайды қосылды!', 'success');
        });
    }

    // ── AI Add Custom Slide ───────────────────────────────────
    const btnAiAddSlide = document.getElementById('btn-ai-add-slide');
    if (btnAiAddSlide) {
        btnAiAddSlide.addEventListener('click', function() {
            const customPrompt = prompt('Жаңа слайдтың тақырыбы немесе бағыты қандай болсын? (Мысалы: Тәжірибелік қолданылуы, Формулалар, Тарихи маңызы):');
            if (!customPrompt || !customPrompt.trim()) return;

            const isKazakh = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test(customPrompt + ' ' + presentationState.title);

            const newSlide = {
                title: customPrompt.trim(),
                points: isKazakh ? [
                    'Тақырыпқа қатысты жаңа деректер мен тұжырымдар',
                    'Практикалық зерттеу нәтижелері мен талдаулар',
                    'Маңызды көрсеткіштер мен заңдылықтар'
                ] : [
                    'Ключевые аспекты и новые аналитические данные по теме',
                    'Практические результаты исследований и формулы',
                    'Прикладные сценарии внедрения и выводы'
                ],
                imagePrompt: `${customPrompt.trim()} educational scientific 3d render 8k`,
                layout: 'split-left',
                speakerNotes: isKazakh ? `Бұл слайдта «${customPrompt.trim()}» сұрағын егжей-тегжейлі талдаймыз.` : `В этом слайде мы подробно рассмотрим аспект: ${customPrompt.trim()}.`,
                seed: Math.floor(Math.random() * 1000000)
            };

            presentationState.slides.splice(presentationState.currentSlideIndex + 1, 0, newSlide);
            presentationState.currentSlideIndex++;
            renderWorkspace();
            saveToLocalStorage();
            showToast('Жаңа слайд сәтті қосылды!', 'success');
        });
    }

    // ── URL Parameters Auto Load (?id= or ?topic=) ────────────
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('id');
    const paramTopic = urlParams.get('topic');

    if (paramId) {
        if (typeof AshyqAuth !== 'undefined') {
            const docs = AshyqAuth.getDocuments();
            const found = docs.find(d => d.id === paramId);
            if (found && (found.data || found.presentationData)) {
                presentationState = found.data || found.presentationData;
                switchScreen(screenWorkspace);
                renderWorkspace();
                showToast(`«${presentationState.title}» презентациясы бұлттан жүктелді!`, 'success');
            }
        }
    } else if (paramTopic) {
        if (promptInput) {
            promptInput.value = paramTopic;
            setTimeout(() => {
                if (btnGenerate) btnGenerate.click();
            }, 300);
        }
    }

    // ── Live Binding: Workspace Title ────────────────────────
    wsTitleInput.addEventListener('input', function(e) {
        presentationState.title = e.target.value;
        saveToLocalStorage();
    });

    // ── Live Binding: Sidebar Inputs ─────────────────────────
    editSlideTitle.addEventListener('input', function(e) {
        const slide = getCurrentSlide();
        if (!slide) return;
        slide.title = e.target.value;
        renderLiveSlidePreview();
        updateActiveThumbnail();
        saveToLocalStorage();
    });

    editSlidePoints.addEventListener('input', function(e) {
        const slide = getCurrentSlide();
        if (!slide) return;
        slide.points = e.target.value.split('\n').filter(line => line.trim() !== '');
        renderLiveSlidePreview();
        saveToLocalStorage();
    });

    const editSpeakerNotes = document.getElementById('edit-speaker-notes');
    if (editSpeakerNotes) {
        editSpeakerNotes.addEventListener('input', function(e) {
            const slide = getCurrentSlide();
            if (!slide) return;
            slide.speakerNotes = e.target.value;
            saveToLocalStorage();
        });
    }

    // Slide Layout Picker Buttons
    document.querySelectorAll('.layout-opt-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const slide = getCurrentSlide();
            if (!slide) return;
            const layout = this.getAttribute('data-layout');
            slide.layout = layout;
            document.querySelectorAll('.layout-opt-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderLiveSlidePreview();
            saveToLocalStorage();
            showToast(`Макет слайда изменен на: ${this.textContent.trim()}`, 'info');
        });
    });

    // Live binding for direct image URL input
    const editImgUrl = document.getElementById('edit-image-url');
    if (editImgUrl) {
        editImgUrl.addEventListener('input', function(e) {
            const slide = getCurrentSlide();
            if (!slide) return;
            slide.imageUrl = e.target.value.trim();
            renderLiveSlidePreview();
            saveToLocalStorage();
        });
    }

    // Real Web Photo Search Modal Logic
    const btnSearchPhoto = document.getElementById('btn-search-web-photo');
    const photoModalOverlay = document.getElementById('web-photo-modal-overlay');
    const btnClosePhotoModal = document.getElementById('btn-close-web-photo-modal');
    const photoSearchInput = document.getElementById('web-photo-search-input');
    const btnRunPhotoSearch = document.getElementById('btn-run-web-photo-search');
    const photoResultsGrid = document.getElementById('web-photo-results-grid');

    async function executePhotoSearch(query) {
        if (!photoResultsGrid) return;
        photoResultsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#94a3b8;"><i class="fa-solid fa-spinner fa-spin"></i> Поиск фото в Википедии и Сети...</div>';

        const photos = await searchAllRealWebPhotos(query, presentationState ? presentationState.title : '');
        if (!photos.length) {
            photoResultsGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:30px;color:#94a3b8;">Фотографий не найдено. Попробуйте другой запрос.</div>';
            return;
        }

        photoResultsGrid.innerHTML = '';
        photos.forEach(photo => {
            const card = document.createElement('div');
            card.className = 'web-photo-card';
            card.innerHTML = `
                <img src="${photo.url}" alt="${escapeHtml(photo.label)}" loading="lazy" />
                <div class="web-photo-card-tag">${escapeHtml(photo.label)}</div>
            `;
            card.addEventListener('click', () => {
                const slide = getCurrentSlide();
                if (slide) {
                    slide.imageUrl = photo.url;
                    if (editImgUrl) editImgUrl.value = photo.url;
                    renderLiveSlidePreview();
                    saveToLocalStorage();
                    showToast('Фотография установлена на слайд!', 'success');
                }
                photoModalOverlay.classList.add('hidden');
            });
            photoResultsGrid.appendChild(card);
        });
    }

    if (btnSearchPhoto) {
        btnSearchPhoto.addEventListener('click', () => {
            const slide = getCurrentSlide();
            const initialQuery = (slide && slide.title ? slide.title : presentationState.title) || '';
            if (photoSearchInput) photoSearchInput.value = initialQuery;
            photoModalOverlay.classList.remove('hidden');
            executePhotoSearch(initialQuery);
        });
    }
    if (btnClosePhotoModal) {
        btnClosePhotoModal.addEventListener('click', () => {
            photoModalOverlay.classList.add('hidden');
        });
    }
    if (btnRunPhotoSearch) {
        btnRunPhotoSearch.addEventListener('click', () => {
            executePhotoSearch(photoSearchInput.value.trim());
        });
    }
    if (photoSearchInput) {
        photoSearchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executePhotoSearch(photoSearchInput.value.trim());
            }
        });
    }

    if (editImgPrompt) {
        editImgPrompt.addEventListener('input', function(e) {
            const slide = getCurrentSlide();
            if (!slide) return;
            slide.imagePrompt = e.target.value;
            renderLiveSlidePreview();
            saveToLocalStorage();
        });
    }

    if (btnRefreshImg) {
        btnRefreshImg.addEventListener('click', function() {
            const slide = getCurrentSlide();
            if (!slide) return;
            
            if (editImgPrompt && editImgPrompt.value.trim()) {
                slide.imagePrompt = editImgPrompt.value.trim();
            }
            
            slide.seed = Math.floor(Math.random() * 10000000);
            slide.imageUrl = ''; // switch to AI generated on explicit button press
            if (editImgUrl) editImgUrl.value = '';
            showToast('Генерация нового 3D варианта через ИИ...', 'info');
            
            const originalHtml = btnRefreshImg.innerHTML;
            btnRefreshImg.disabled = true;
            btnRefreshImg.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Генерация нового фото...';
            
            renderLiveSlidePreview();
            saveToLocalStorage();
            
            setTimeout(() => {
                btnRefreshImg.disabled = false;
                btnRefreshImg.innerHTML = originalHtml;
                showToast('3D фото успешно обновлено!', 'success');
            }, 1000);
        });
    }

    // ── Slide Management Toolbar ──────────────────────────────
    btnAddSlide.addEventListener('click', function() {
        const newSlide = {
            title: `Новый слайд ${presentationState.slides.length + 1}`,
            points: ['Новый пункт 1', 'Новый пункт 2'],
            imagePrompt: 'educational presentation illustration',
            layout: 'split-left',
            speakerNotes: 'Расскажите об основных тезисах этого слайда.',
            seed: Math.floor(Math.random() * 1000000)
        };
        presentationState.slides.splice(presentationState.currentSlideIndex + 1, 0, newSlide);
        presentationState.currentSlideIndex++;
        renderWorkspace();
        saveToLocalStorage();
        showToast('Новый слайд добавлен', 'success');
    });

    btnDeleteSlide.addEventListener('click', function() {
        if (presentationState.slides.length <= 1) {
            showToast('В презентации должен остаться хотя бы 1 слайд', 'error');
            return;
        }
        presentationState.slides.splice(presentationState.currentSlideIndex, 1);
        if (presentationState.currentSlideIndex >= presentationState.slides.length) {
            presentationState.currentSlideIndex = presentationState.slides.length - 1;
        }
        renderWorkspace();
        saveToLocalStorage();
        showToast('Слайд удален', 'info');
    });

    btnMoveLeft.addEventListener('click', function() {
        const idx = presentationState.currentSlideIndex;
        if (idx <= 0) return;
        const temp = presentationState.slides[idx];
        presentationState.slides[idx] = presentationState.slides[idx - 1];
        presentationState.slides[idx - 1] = temp;
        presentationState.currentSlideIndex = idx - 1;
        renderWorkspace();
        saveToLocalStorage();
    });

    btnMoveRight.addEventListener('click', function() {
        const idx = presentationState.currentSlideIndex;
        if (idx >= presentationState.slides.length - 1) return;
        const temp = presentationState.slides[idx];
        presentationState.slides[idx] = presentationState.slides[idx + 1];
        presentationState.slides[idx + 1] = temp;
        presentationState.currentSlideIndex = idx + 1;
        renderWorkspace();
        saveToLocalStorage();
    });

    // ── Workspace 8-Signature WOW Template Live Switcher ───────────────────
    function initWorkspaceTemplateControls() {
        const select = document.getElementById('ws-template-select');
        const swatchesContainer = document.getElementById('ws-quick-swatches');

        // Populate dropdown
        if (select) {
            select.innerHTML = '';
            DESIGN_TEMPLATES.forEach(tpl => {
                const opt = document.createElement('option');
                opt.value = tpl.id;
                opt.textContent = `${tpl.icon} ${tpl.name}`;
                select.appendChild(opt);
            });
            select.addEventListener('change', (e) => {
                applyTemplateToPresentation(e.target.value);
            });
        }

        // Populate quick swatches in sidebar
        if (swatchesContainer) {
            swatchesContainer.innerHTML = '';
            DESIGN_TEMPLATES.forEach(tpl => {
                const swatch = document.createElement('div');
                swatch.className = `ws-swatch-item ${tpl.id === selectedTemplateId ? 'active' : ''}`;
                swatch.title = `${tpl.icon} ${tpl.name}`;
                swatch.style.background = tpl.theme.backgroundColor;
                swatch.style.borderColor = tpl.theme.accentColor;
                swatch.setAttribute('data-template-id', tpl.id);

                swatch.addEventListener('click', () => {
                    applyTemplateToPresentation(tpl.id);
                });
                swatchesContainer.appendChild(swatch);
            });
        }

        // Hook up Quick Theme Switcher Toolbar buttons above Live Preview
        document.querySelectorAll('.q-theme-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const themeId = this.getAttribute('data-theme-id');
                if (themeId) applyTemplateToPresentation(themeId);
            });
        });

        // Hook up Theme Shuffle Button
        const btnShuffle = document.getElementById('btn-shuffle-theme');
        if (btnShuffle) {
            btnShuffle.addEventListener('click', function() {
                const availableIds = DESIGN_TEMPLATES.map(t => t.id);
                const filtered = availableIds.filter(id => id !== selectedTemplateId);
                const nextId = filtered[Math.floor(Math.random() * filtered.length)] || availableIds[0];
                applyTemplateToPresentation(nextId);
            });
        }
    }

    function applyTemplateToPresentation(templateId) {
        const tpl = DESIGN_TEMPLATES.find(t => t.id === templateId) || DESIGN_TEMPLATES[0];
        if (!tpl) return;

        selectedTemplateId = tpl.id;

        // Update presentation state theme
        presentationState.theme = {
            backgroundColor: tpl.theme.backgroundColor,
            primaryTextColor: tpl.theme.primaryTextColor,
            accentColor: tpl.theme.accentColor,
            accentSecondary: tpl.theme.accentSecondary || tpl.theme.accentColor,
            accentGlow: tpl.theme.accentGlow || 'rgba(56, 189, 248, 0.35)',
            style: tpl.theme.style,
            tileBg: tpl.theme.tileBg,
            tileBorder: tpl.theme.tileBorder,
            titleColor: tpl.theme.titleColor,
            isDark: tpl.isDark
        };

        // Update layouts for all slides to match new template's layout sequence
        presentationState.slides.forEach((s, idx) => {
            if (idx === 0) s.layout = 'cover';
            else if (tpl.layouts && tpl.layouts.length > idx) {
                s.layout = tpl.layouts[idx];
            }
        });

        // Update UI controls
        const select = document.getElementById('ws-template-select');
        if (select) select.value = tpl.id;

        const themeStyleBadge = document.getElementById('theme-style-badge');
        if (themeStyleBadge) themeStyleBadge.textContent = `Дизайн: ${tpl.icon} ${tpl.name}`;

        // Update sidebar swatches
        document.querySelectorAll('.ws-swatch-item').forEach(sw => {
            if (sw.getAttribute('data-template-id') === tpl.id) {
                sw.classList.add('active');
                sw.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            } else {
                sw.classList.remove('active');
            }
        });

        // Update Quick Theme toolbar buttons
        document.querySelectorAll('.q-theme-btn').forEach(btn => {
            if (btn.getAttribute('data-theme-id') === tpl.id) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Re-render preview & thumbnails
        renderLiveSlidePreview();
        renderThumbnailsList();
        saveToLocalStorage();
        showToast(`Применен WOW-дизайн: ${tpl.icon} ${tpl.name}`, 'success');
    }

    initWorkspaceTemplateControls();

    // ── Back to Prompt ───────────────────────────────────────
    btnBackPrompt.addEventListener('click', function() {
        switchScreen(screenPrompt);
    });

    // ── Export PPTX & PDF ────────────────────────────────────
    btnPPTX.addEventListener('click', function() {
        generatePPTX(presentationState, btnPPTX);
    });

    btnPDF.addEventListener('click', function() {
        downloadPDF();
    });

    // ── Fullscreen Presenter Mode Controls ────────────────────
    const btnToggleNotes = document.getElementById('btn-toggle-notes');
    const presenterNotesDrawer = document.getElementById('presenter-notes-drawer');

    if (btnToggleNotes && presenterNotesDrawer) {
        btnToggleNotes.addEventListener('click', function() {
            presenterNotesDrawer.classList.toggle('hidden');
        });
    }

    btnPresentMode.addEventListener('click', function() {
        if (!presentationState.slides.length) return;
        switchScreen(screenPresenter);
        renderPresenterSlide();
    });

    btnClosePresent.addEventListener('click', function() {
        if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
        }
        switchScreen(screenWorkspace);
    });

    btnPrevSlide.addEventListener('click', function() {
        if (presentationState.currentSlideIndex > 0) {
            presentationState.currentSlideIndex--;
            renderPresenterSlide();
            renderWorkspace();
        }
    });

    btnNextSlide.addEventListener('click', function() {
        if (presentationState.currentSlideIndex < presentationState.slides.length - 1) {
            presentationState.currentSlideIndex++;
            renderPresenterSlide();
            renderWorkspace();
        }
    });

    // Keyboard Arrow navigation, notes toggle and fullscreen for Presenter Mode
    document.addEventListener('keydown', function(e) {
        if (!screenPresenter.classList.contains('active')) return;
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            e.preventDefault();
            btnNextSlide.click();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            btnPrevSlide.click();
        } else if (e.key === 'Escape') {
            btnClosePresent.click();
        } else if (e.key === 'n' || e.key === 'N' || e.key === 'т' || e.key === 'Т') {
            if (presenterNotesDrawer) presenterNotesDrawer.classList.toggle('hidden');
        } else if (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => {});
            } else {
                document.exitFullscreen().catch(() => {});
            }
        }
    });

    function setGenProgress(pct, text) {
        genProgressFill.style.width = Math.min(100, pct) + '%';
        if (text) genProgressText.textContent = text;
    }
});


/* ──────────────────────────────────────────────
   UNIVERSAL AI DECK GENERATOR (Multi-Tier Resilient Engine + Offline Safety Net)
─────────────────────────────────────────────── */

function fetchWithTimeout(url, options = {}, timeoutMs = 9000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...options, signal: controller.signal })
        .finally(() => clearTimeout(timer));
}

function parseJsonDeck(raw) {
    if (!raw) return null;
    let clean = String(raw).trim();
    clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    // 1. Try finding complete JSON object { ... }
    const firstBrace = clean.indexOf('{');
    const lastBrace = clean.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = clean.substring(firstBrace, lastBrace + 1);
        try {
            const parsed = JSON.parse(candidate);
            if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) return parsed;
        } catch (e) {
            try {
                const fixed = candidate.replace(/,\s*([}\]])/g, '$1');
                const parsed = JSON.parse(fixed);
                if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) return parsed;
            } catch (e2) {}
        }
    }

    // 2. Try finding direct JSON array [ ... ]
    const firstBracket = clean.indexOf('[');
    const lastBracket = clean.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1 && lastBracket > firstBracket) {
        const candidate = clean.substring(firstBracket, lastBracket + 1);
        try {
            const arr = JSON.parse(candidate);
            if (Array.isArray(arr) && arr.length > 0) {
                return { title: arr[0].title || 'Презентация', slides: arr };
            }
        } catch (e) {
            try {
                const fixed = candidate.replace(/,\s*([}\]])/g, '$1');
                const arr = JSON.parse(fixed);
                if (Array.isArray(arr) && arr.length > 0) {
                    return { title: arr[0].title || 'Презентация', slides: arr };
                }
            } catch (e2) {}
        }
    }

    try {
        const parsed = JSON.parse(clean);
        if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) return parsed;
    } catch (e) {
        return null;
    }
    return null;
}

function generateOfflineSmartDeck(topic, sourceContext = '', intel = null, options = {}) {
    const requestedLang = (options && options.slideLang) || 'auto';
    let isKazakh = requestedLang === 'kk';
    let isEnglish = requestedLang === 'en';
    if (requestedLang === 'auto' || !requestedLang) {
        isKazakh = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test((topic || '') + ' ' + (sourceContext || '')) || 
                   /(сабақ|жоспары|мақсаты|физика|химия|биология|зертханалық|тақырыбы|сынып|оқушы|тұлға|өмірбаян|қазақ|тарих|баяндама|жетістік|шедевр)/i.test((topic || '') + ' ' + (sourceContext || ''));
        isEnglish = /^[a-zA-Z0-9\s.,!?:;\-_'"]+$/.test((topic || '').trim()) && !/[а-яА-ЯёЁ]/.test(topic || '');
    }

    const cleanTopic = (topic || (isKazakh ? 'Ғылыми зерттеу' : (isEnglish ? 'Scientific Research' : 'Научное исследование'))).trim();
    const activeIntel = intel || detectTopicIntelligence(cleanTopic, sourceContext);
    const targetSlideCount = parseInt((options && options.slideCount) || 7, 10);
    const lower = cleanTopic.toLowerCase();

    let slides = [];

    // Helper to generate unique distinct bullets for extra slides
    function buildExtraSlides(domainName, count) {
        const extraList = [];
        const extraTypes = [
            {
                titleKk: 'Тәжірибелік қолдану және өмірмен байланысы',
                titleRu: 'Практическое применение в реальной жизни и технологиях',
                titleEn: 'Practical Applications and Real-World Impact',
                layout: 'cards-grid',
                imgPrompt: 'modern practical technology application laboratory setup 3d render',
                pointsKk: [
                    'Күнделікті өмірде және өндірістік процестерде тиімді қолданылуы',
                    'Заманауи құрылғылар мен автоматтандырылған кешендердегі рөлі',
                    'Экономикалық және әлеуметтік тиімділікті арттыру көрсеткіштері',
                    'Инновациялық шешімдердің қауіпсіздігі мен сенімділігі'
                ],
                pointsRu: [
                    'Широкое применение в производственных процессах и повседневной практике',
                    'Интеграция в современные автоматизированные комплексы и приборы',
                    'Повышение экономической эффективности и оптимизация затрат',
                    'Надежность и высокие стандарты безопасности внедряемых систем'
                ],
                pointsEn: [
                    'Wide implementation in industrial workflows and everyday practice',
                    'Integration into cutting-edge automated systems and instruments',
                    'Measurable boost in operational and economic efficiency',
                    'Robust safety standards and long-term sustainability'
                ],
                notesKk: 'Бұл слайдта тақырыптың нақты өмірдегі практикалық маңызы мен өндірістік пайдасы талданады.',
                notesRu: 'Разберите конкретные прикладные сценарии и реальную пользу темы в промышленности.',
                notesEn: 'Highlight real-world implementations and practical benefits.'
            },
            {
                titleKk: 'Таңқаларлық фактілер мен қызықты мәліметтер',
                titleRu: 'Удивительные факты, рекорды и ключевые открытия',
                titleEn: 'Fascinating Facts, Records and Key Milestones',
                layout: 'stat',
                statVal: '★ 100%',
                imgPrompt: 'glowing golden crystal discovery achievement eureka trophy 3d render',
                pointsKk: [
                    'Ғылым мен тарихта бұрын-соңды тіркелген сирек кездесетін феномендер',
                    'Көпшілік біле бермейтін қызықты ғылыми тәжірибелер мен нәтижелер',
                    'Зерттеушілердің жаңалық ашу жолындағы табандылығы мен ізденісі'
                ],
                pointsRu: [
                    'Редкие феномены и рекорды, зафиксированные учеными и практиками',
                    'Малоизвестные детали и неожиданные экспериментальные результаты',
                    'Исторические открытия, изменившие фундаментальные представления о мире'
                ],
                pointsEn: [
                    'Rare phenomena and record-breaking benchmarks discovered by researchers',
                    'Lesser-known nuances and unexpected empirical discoveries',
                    'Pioneering breakthroughs that transformed modern scientific understanding'
                ],
                notesKk: 'Тыңдаушыларды қызықтыратын беймәлім фактілер мен рекордтарға тоқталу.',
                notesRu: 'Озвучьте самые яркие и неожиданные факты, чтобы вовлечь аудиторию.',
                notesEn: 'Share captivating facts and milestones to engage the audience.'
            },
            {
                titleKk: 'Заманауи зерттеулер мен жаңа технологиялар',
                titleRu: 'Современные исследования, тренды и передовые открытия',
                titleEn: 'Current Trends, Breakthroughs and Cutting-Edge Innovations',
                layout: 'split-right',
                imgPrompt: 'futuristic cyber science technology innovation hologram 3d render',
                pointsKk: [
                    'Жасанды интеллект және цифрлық модельдеу әдістерін пайдалану',
                    'Халықаралық ғылыми зертханалардың соңғы жылдардағы тұжырымдары',
                    'Жаңа буын материалдары мен тиімділігі жоғары тәсілдер'
                ],
                pointsRu: [
                    'Применение искусственного интеллекта и цифровых двойников для анализа',
                    'Выводы ведущих международных исследовательских центров последних лет',
                    'Материалы нового поколения и высокоточные измерительные технологии'
                ],
                pointsEn: [
                    'Application of artificial intelligence and digital twins for deep analysis',
                    'Recent findings from world-class international scientific centers',
                    'Next-generation smart materials and ultra-precise measurement tools'
                ],
                notesKk: 'Ғылымның бүгінгі таңдағы ең соңғы жаңалықтары мен инновациялық трендтері.',
                notesRu: 'Опишите передовой край науки и самые свежие разработки по теме.',
                notesEn: 'Discuss cutting-edge research trends and emerging solutions.'
            },
            {
                titleKk: 'Интерактивті викторина: Өз біліміңді тексер',
                titleRu: 'Интерактивный опрос: Проверь свои знания по теме',
                titleEn: 'Interactive Check: Test Your Knowledge',
                layout: 'insight',
                imgPrompt: 'interactive classroom quiz glowing light bulb question marks 3d render',
                pointsKk: [
                    '1-сұрақ: Қарастырылған құбылыстың басты заңдылығы мен мәні неде?',
                    'A) Тәжірибелік дәлелденген іргелі қағида (Дұрыс жауап)',
                    'B) Өзгермейтін тұрақты жорамал',
                    'C) Кездейсоқ пайда болатын уақытша процесс'
                ],
                pointsRu: [
                    'Вопрос 1: В чем заключается фундаментальный принцип изучаемой темы?',
                    'A) Экспериментально подтвержденный научный закон (Правильный ответ)',
                    'B) Теоретическая гипотеза без доказательств',
                    'C) Случайное временное отклонение'
                ],
                pointsEn: [
                    'Question 1: What is the core fundamental principle of this topic?',
                    'A) Experimentally verified scientific law (Correct Answer)',
                    'B) Unproven speculative assumption',
                    'C) Temporary random fluctuation'
                ],
                notesKk: 'Оқушылармен кері байланыс орнатып, сұрақтар бойынша пікірталас өткізу.',
                notesRu: 'Проведите интерактивное закрепление материала с залом и проверьте усвоение.',
                notesEn: 'Engage audience in quick interactive check to reinforce key takeaways.'
            },
            {
                titleKk: 'Болашақ даму перспективалары мен қорытынды',
                titleRu: 'Стратегические горизонты, вызовы и взгляд в будущее',
                titleEn: 'Strategic Horizons, Future Outlook and Key Conclusions',
                layout: 'insight',
                imgPrompt: 'inspiring future horizon glowing sunrise innovation crystal globe 3d',
                pointsKk: [
                    'Келесі онжылдықтағы даму векторлары мен күтілетін серпілістер',
                    'Жас мамандар мен оқушыларға арналған ғылыми бағыт-бағдар',
                    '«Үздіксіз білім мен жаңашылдық — табысты болашақтың кепілі»'
                ],
                pointsRu: [
                    'Векторы развития и ожидаемые технологические прорывы на 10 лет вперед',
                    'Практические ориентиры для нового поколения исследователей и практиков',
                    '«Постоянный поиск знаний и открытость инновациям определяют успех»'
                ],
                pointsEn: [
                    'Strategic development vectors and anticipated breakthroughs for the next decade',
                    'Actionable guideposts for young researchers, students and professionals',
                    '«Continuous curiosity and innovative thinking are the catalysts for progress»'
                ],
                notesKk: 'Баяндаманы шабыттандыратын оймен түйіндеп, тыңдаушылардың сұрақтарына жауап беру.',
                notesRu: 'Подведите вдохновляющий итог и пригласите аудиторию к открытой дискуссии.',
                notesEn: 'Wrap up with inspiring closing remarks and invite open discussion.'
            }
        ];

        for (let i = 0; i < count; i++) {
            const item = extraTypes[i % extraTypes.length];
            extraList.push({
                title: isKazakh ? item.titleKk : (isEnglish ? item.titleEn : item.titleRu),
                points: isKazakh ? item.pointsKk : (isEnglish ? item.pointsEn : item.pointsRu),
                layout: item.layout,
                statVal: item.statVal,
                imagePrompt: `${cleanTopic} ${item.imgPrompt}`,
                speakerNotes: isKazakh ? item.notesKk : (isEnglish ? item.notesEn : item.notesRu),
                seed: Math.floor(Math.random() * 10000000) + (i + 8) * 11111
            });
        }
        return extraList;
    }

    // ── SPECIFIC DOMAIN 1: ANATOMY & BIOLOGY ───────────────────
    if (/анатом|человек|адам|орган|жүрек|сердце|өкпе|легкие|мозг|ми|бауыр|печень|қаңқа|скелет|почки|бүйрек|клетка|жасуша|днк|dna|cell|biology|биолог/i.test(lower)) {
        slides = [
            {
                title: isKazakh ? `${cleanTopic}: Адам ағзасының керемет құрылымы` : (isEnglish ? `${cleanTopic}: Architecture of the Human Body` : `${cleanTopic}: Архитектура и тайны организма человека`),
                points: isKazakh ? [
                    'Адам денесі — миллиондаған жылдар бойы кемелденген ғажайып биологиялық кешен',
                    'Жасушалық деңгейден бастап біртұтас жүйелерге дейінгі мінсіз үйлесім'
                ] : (isEnglish ? [
                    'The human body is an extraordinary biological marvel refined over millennia',
                    'Flawless coordination from microscopic cellular structures to integrated organ systems'
                ] : [
                    'Организм человека — совершенная биологическая система, развивавшаяся миллионы лет',
                    'Гармоничная взаимосвязь от клеточного уровня до сложнейших функциональных систем'
                ]),
                layout: 'cover',
                imagePrompt: 'human anatomy medical illustration 3d cinematic glowing organs transparent body octane 8k',
                speakerNotes: isKazakh ? `Құрметті достар, бүгін біз «${cleanTopic}» тақырыбы бойынша адам ағзасының ғажайып сырларын ашамыз.` : `Приветствие. Сегодня мы совершим путешествие по анатомии человека: ${cleanTopic}.`,
                seed: 10101
            },
            {
                title: isKazakh ? 'Тірек-қимыл жүйесі: Сүйектер мен бұлшықеттер' : (isEnglish ? 'Musculoskeletal System: Bones and Muscles' : 'Опорно-двигательный аппарат: Скелет и мышцы'),
                points: isKazakh ? [
                    'Ересек адамның қаңқасы 206 сүйектен тұрады және денені мығым ұстайды',
                    'Сүйек тіні граниттен де берік келеді және орасан зор жүктемелерге төтеп береді',
                    '600-ден астам бұлшықеттер ағзаның барлық қозғалысын жүзеге асырады'
                ] : (isEnglish ? [
                    'The adult human skeleton consists of 206 bones providing structural integrity',
                    'Bone tissue possesses tensile strength superior to concrete and granite',
                    'More than 600 skeletal muscles coordinate every graceful physical movement'
                ] : [
                    'Скелет взрослого человека включает 206 костей, образующих защитный каркас',
                    'Костная ткань прочнее бетона и выдерживает статическую нагрузку свыше тонны',
                    'Более 600 мышц слаженно обеспечивают все виды двигательной активности'
                ]),
                layout: 'split-left',
                imagePrompt: 'human skeleton and muscular anatomy glowing neon bones 3d render',
                speakerNotes: isKazakh ? 'Қаңқа мен бұлшықеттердің құрылысы, қозғалыс биомеханикасы мен қорғаныш қызметі.' : 'Опорно-двигательная система: прочность костей и работа мышечных групп.',
                seed: 10202
            },
            {
                title: isKazakh ? 'Қанайналым және жүрек: Өмір қозғалтқышы' : (isEnglish ? 'Cardiovascular Engine: Heart and Blood Vessels' : 'Сердечно-сосудистая система: Мотор жизни'),
                statVal: '100 000 км',
                points: isKazakh ? [
                    'Адам денесіндегі барлық қантамырлардың жалпы ұзындығы 100 000 км-ге жетеді (жер шарын 2.5 рет орауға жетеді)',
                    'Жүрек тәулігіне 100 000 рет соғып, шамамен 7 500 литр қанды айдайды',
                    'Қан әрбір жасушаны оттекпен және қоректік заттармен үздіксіз қамтамасыз етеді'
                ] : (isEnglish ? [
                    'The total length of blood vessels in the human body exceeds 100,000 km',
                    'The heart beats roughly 100,000 times per day, pumping over 7,500 liters of blood',
                    'Delivers essential oxygen and nutrients to trillions of living cells every second'
                ] : [
                    'Общая протяженность кровеносных сосудов человека превышает 100 000 км',
                    'Сердце совершает около 100 000 ударов в сутки, перекачивая 7 500 литров крови',
                    'Непрерывно доставляет кислород и ценные питательные вещества к каждой клетке'
                ]),
                layout: 'stat',
                imagePrompt: 'anatomical human heart beating glowing blood vessels cardiology 3d render',
                speakerNotes: isKazakh ? 'Жүрек соғысы, үлкен және кіші қанайналым шеңберлерінің маңызы.' : 'Работа сердца как непрерывного биологического насоса и сосудистая сеть.',
                seed: 10303
            },
            {
                title: isKazakh ? 'Тыныс алу және газ алмасу үдерісі' : (isEnglish ? 'Respiratory System and Gas Exchange' : 'Дыхательная система и газообмен'),
                points: isKazakh ? [
                    '1-кезең: Тыныс алу жолдары арқылы ауа тазартылып, жылытылып өкпеге өтеді',
                    '2-кезең: Өкпедегі 500 миллион альвеолалар арқылы оттек қанға сіңеді',
                    '3-кезең: Қаннан көмірқышқыл газы сыртқа шығарылып, газ тепе-теңдігі сақталады'
                ] : (isEnglish ? [
                    'Stage 1: Inhaled air is filtered, humidified, and conducted into bronchial pathways',
                    'Stage 2: 500 million alveoli facilitate rapid diffusion of oxygen into the bloodstream',
                    'Stage 3: Carbon dioxide is expelled outwards, maintaining strict pH balance'
                ] : [
                    'Этап 1: Воздух очищается, согревается в носоглотке и поступает в бронхиальное дерево',
                    'Этап 2: Через 500 миллионов альвеол легких кислород мгновенно диффундирует в кровь',
                    'Этап 3: Углекислый газ эвакуируется наружу, сохраняя биохимический баланс'
                ]),
                layout: 'steps',
                imagePrompt: 'human respiratory system lungs alveoli glowing oxygen particles 3d render',
                speakerNotes: isKazakh ? 'Өкпенің тыныс алу механизмі мен альвеолалардың қызметі.' : 'Пошаговый процесс дыхания и микроскопический газообмен в альвеолах.',
                seed: 10404
            },
            {
                title: isKazakh ? 'Ішкі мүшелер: Асқорыту және сүзу орталығы' : (isEnglish ? 'Internal Organs: Digestion and Metabolism' : 'Внутренние органы: Пищеварение и фильтрация'),
                points: isKazakh ? [
                    'Асқазан: тағамды соля қышқылы мен ферменттер арқылы химиялық қорыту',
                    'Бауыр: 500-ден астам өмірлік маңызды функцияларды атқаратын биохимиялық зертхана',
                    'Бүйректер: тәулігіне 180 литр қанды сүзіп, токсиндерді сыртқа шығарады',
                    'Ішек жолы: ұзындығы 6-8 метрге дейін жететін қоректік заттарды сіңіру аймағы'
                ] : (isEnglish ? [
                    'Stomach: Chemical breakdown of food through hydrochloric acid and enzymes',
                    'Liver: Massive biochemical laboratory carrying out over 500 vital metabolic functions',
                    'Kidneys: Biological filters processing 180 liters of blood daily to eliminate toxins',
                    'Intestines: A 6-8 meter labyrinth ensuring complete nutrient absorption into blood'
                ] : [
                    'Желудок: Химическое расщепление пищи соляной кислотой и активными ферментами',
                    'Печень: Крупнейшая биохимическая лаборатория тела, выполняющая свыше 500 функций',
                    'Почки: Парный биофильтр, перерабатывающий 180 литров крови в день',
                    'Кишечник: 7-метровый тракт, обеспечивающий максимальное всасывание питательных веществ'
                ]),
                layout: 'cards-grid',
                imagePrompt: 'internal digestive organs liver kidneys stomach medical 3d render',
                speakerNotes: isKazakh ? 'Бауыр, асқазан және бүйректің өмірлік функциялары.' : 'Взаимодействие пищеварительной и выделительной систем организма.',
                seed: 10505
            },
            {
                title: isKazakh ? 'Жүйке жүйесі және ми: Басқару орталығы' : (isEnglish ? 'Nervous System: Brain and Synapses' : 'Нервная система и головной мозг'),
                points: isKazakh ? [
                    'Адам миында 86 миллиард нейрон және триллиондаған синапстық байланыстар бар',
                    'Нерв импульстері сағатына 400 км жылдамдықпен найзағайдай зулайды',
                    'Орталық жүйке жүйесі барлық рефлекстерді, сезімдер мен сананы басқарады'
                ] : (isEnglish ? [
                    'The human brain contains 86 billion neurons interconnected by trillions of synapses',
                    'Nerve impulses travel at breathtaking velocities exceeding 400 km/h',
                    'Central nervous system orchestrates all reflexes, cognitive thought, and emotional depth'
                ] : [
                    'Головной мозг объединяет 86 миллиардов нейронов с триллионами синаптических связей',
                    'Электрические нервные импульсы мчатся по волокнам со скоростью до 400 км/ч',
                    'ЦНС контролирует произвольные движения, вегетативные функции и мышление'
                ]),
                layout: 'split-left',
                imagePrompt: 'human brain neural network glowing cybernetic synapses 3d render',
                speakerNotes: isKazakh ? 'Мидың құрылысы, нейрондар мен жүйке жүйесінің жылдамдығы.' : 'Архитектура мозга, синапсы и скорость передачи нервных сигналов.',
                seed: 10606
            },
            {
                title: isKazakh ? 'Ағзаны сақтау: Денсаулық пен ұзақ өмір' : (isEnglish ? 'Body Harmony: Health, Immunity and Vitality' : 'Гармония организма: Здоровье и долголетие'),
                points: isKazakh ? [
                    '«Адам денесі — табиғаттың ең керемет және күрделі туындысы»',
                    'Тұрақты дене белсенділігі, дұрыс тамақтану мен ұйқы — ұзақ өмірдің кепілі',
                    'Иммундық жүйе тәулік бойы денені сыртқы қауіптерден сенімді қорғайды'
                ] : (isEnglish ? [
                    '«The human body is the most sophisticated and resilient ecosystem in nature»',
                    'Consistent physical activity, wholesome nutrition, and restorative rest ensure vitality',
                    'Adaptive immune system maintains constant vigilance against pathogenic threats'
                ] : [
                    '«Человеческое тело — самый совершенный и гармоничный шедевр природы»',
                    'Физическая активность, здоровое питание и режим сна — фундамент активного долголетия',
                    'Иммунная система круглосуточно оберегает внутреннюю стабильность организма'
                ]),
                layout: 'insight',
                imagePrompt: 'human vitality glowing health dna medical cross protection 3d render',
                speakerNotes: isKazakh ? 'Салауатты өмір салты мен ағзаны күту бойынша қорытынды ойлар.' : 'Подведение итогов: ценность здоровья и бережное отношение к организму.',
                seed: 10707
            }
        ];

    // ── SPECIFIC DOMAIN 2: PERSON / BIOGRAPHY (Dimash, Abai, Shokan, etc.) ───
    } else if (/димаш|dimash|құдайберген|кудайберген|абай|шоқан|әл-фараби|пушкин|эйнштейн|ньютон|маск|джобс|тұлға|өмірбаян|биография|персона|әнші|жазушы|ғалым/i.test(lower)) {
        const isDimash = /димаш|dimash|құдайберген|кудайберген/i.test(lower);
        const name = isDimash ? (isKazakh ? 'Димаш Құдайберген' : (isEnglish ? 'Dimash Qudaibergen' : 'Димаш Кудайберген')) : cleanTopic;
        slides = [
            {
                title: name,
                points: isKazakh ? [
                    'Әлемдік музыка кеңістігіндегі феноменалды қазақ дауысы',
                    'Қазақстанның Халық әртісі, миллиондаған жанкүйерлердің сүйікті әншісі'
                ] : (isEnglish ? [
                    'Phenomenal vocal virtuoso conquering global music stages',
                    'People\'s Artist of Kazakhstan with a multi-million worldwide fandom'
                ] : [
                    'Феноменальный вокалист, покоривший ведущие мировые сцены',
                    'Народный артист Казахстана, кумир миллионов слушателей на всех континентах'
                ]),
                layout: 'cover',
                imagePrompt: `${name} concert stage lighting portrait golden awards 3d cinematic`,
                speakerNotes: isKazakh ? `Құрметті тыңдармандар! Бүгінгі баяндамамыз қазақтың мақтанышы: ${name}.` : `Приветствие. Тема сегодняшнего выступления посвящена выдающейся личности: ${name}.`,
                seed: 20101
            },
            {
                title: isKazakh ? 'Өмірбаяны және шығармашылық бастауы' : (isEnglish ? 'Origins, Education and Musical Roots' : 'Биография и творческие истоки'),
                points: isKazakh ? [
                    'Өнерлі отбасында дүниеге келіп, бала кезінен музыкалық дарынымен танылды',
                    'Ақтөбедегі А. Жұбанов колледжі мен Қазақ ұлттық өнер университетінде кәсіби білім алды',
                    'Фортепиано, домбыра, барабан және басқа да аспаптарды еркін меңгерген мультиаспапшы'
                ] : (isEnglish ? [
                    'Raised in a musical family, exhibiting rare pitch and vocal gifts from early childhood',
                    'Completed classical education at Zhubanov Music College and Kazakh National University of Arts',
                    'Master multi-instrumentalist proficient in piano, dombyra, percussion, and keyboards'
                ] : [
                    'Родился в музыкальной семье, с раннего детства проявляя абсолютный слух',
                    'Окончил музыкальный колледж им. Жубанова и Казахский национальный университет искусств',
                    'Виртуозный мультиинструменталист: играет на фортепиано, домбре, ударных и клавишных'
                ]),
                layout: 'split-left',
                imagePrompt: `${name} acoustic grand piano concert hall warm stage lighting 3d render`,
                speakerNotes: isKazakh ? 'Балалық шағы, музыкалық білімі мен талантының қалыптасуы.' : 'Детские годы, фундаментальное академическое образование и освоение инструментов.',
                seed: 20202
            },
            {
                title: isKazakh ? 'Феноменалды вокал диапазоны: 6 октава' : (isEnglish ? 'Phenomenal 6-Octave Vocal Range' : 'Уникальный диапазон: Свыше 6 октав'),
                statVal: '6+ октава',
                points: isKazakh ? [
                    'Бас регистрінен бастап ысқырық регистріне (whistle register) дейінгі сирек кездесетін шеберлік',
                    'Белканто, опера, поп-музыка, фольклор мен рок жанрларын еркін үйлестіруі',
                    'Әлемдік деңгейдегі жетекші вокал сарапшылары мен сыншыларының жоғары бағасы'
                ] : (isEnglish ? [
                    'Stretches from resonant bass notes to ethereal whistle register with total control',
                    'Seamlessly bridges classical bel canto, dramatic opera, pop balladry, and rock',
                    'Acclaimed by premier international vocal analysts and critics worldwide'
                ] : [
                    'Охватывает от глубокого баса до свисткового регистра (whistle register) с идеальным контролем',
                    'Легко объединяет академическое бельканто, оперу, рок, фолк и современную эстраду',
                    'Признан феноменом ведущими вокальными экспертами и педагогами мира'
                ]),
                layout: 'stat',
                imagePrompt: 'golden microphone musical soundwaves sparkling spectrum stage lights 3d render',
                speakerNotes: isKazakh ? 'Дауыс ерекшелігі, 6 октавалық диапазон және вокалдық техникасы.' : 'Технические характеристики голоса, диапазон и виртуозный контроль дыхания.',
                seed: 20303
            },
            {
                title: isKazakh ? 'Халықаралық триумф және әлемдік белестер' : (isEnglish ? 'International Triumphs and Key Milestones' : 'Хронология триумфа на мировой арене'),
                points: isKazakh ? [
                    '2015 жыл: «Славян базары» гран-приінің иегері атанып, халықаралық деңгейде мойындалды',
                    '2017 жыл: Қытайдағы «I Am a Singer» жобасында феноменге айналып, жаһандық даңққа бөленді',
                    '2019 жыл: АҚШ-тың Нью-Йорк қаласындағы Barclays Center стадионындағы аншлаг жеке концерті'
                ] : (isEnglish ? [
                    '2015: Grand Prix victory at Slavianski Bazaar, initiating international recognition',
                    '2017: Sensational breakthrough on China\'s «I Am a Singer», sparking global fandom',
                    '2019: Sold-out solo arena concert at New York\'s legendary Barclays Center'
                ] : [
                    '2015 год: Триумфальная победа и Гран-при на конкурсе «Славянский базар»',
                    '2017 год: Сенсация на проекте «I Am a Singer» в Китае, взрыв популярности на планете',
                    '2019 год: Полный аншлаг на сольном концерте в Нью-Йорке на арене Barclays Center'
                ]),
                layout: 'steps',
                imagePrompt: 'grand stadium concert spotlight arena cheering fans confetti 3d render',
                speakerNotes: isKazakh ? 'Славян базары, Қытайдағы Singer жобасы және АҚШ-тағы жеке концерті.' : 'Главные победы: Slavianski Bazaar, I Am a Singer и арены США.',
                seed: 20404
            },
            {
                title: isKazakh ? 'Хиттері, шедеврлері және көптілді өнері' : (isEnglish ? 'Signature Masterpieces and Repertoire' : 'Главные шедевры и репертуар'),
                points: isKazakh ? [
                    '«SOS d\'un terrien en détresse» — әлемді таңқалдырған тарихи вокалдық шедевр',
                    '«Дайдидау», «Самалтау» — қазақтың ұлттық халық әндерін әлемге таныту',
                    '«Story of One Sky», «Stranger» — бейбітшілік пен гуманизмді дәріптейтін авторлық туындылар',
                    'Қазақ, ағылшын, француз, қытай, итальян, испан және орыс тілдеріндегі репертуар'
                ] : (isEnglish ? [
                    '«SOS d\'un terrien en détresse» — iconic vocal performance captivating global audiences',
                    '«Daididau», «Samaltau» — elevating rich Kazakh folk heritage to world recognition',
                    '«Story of One Sky», «Stranger» — cinematic masterpieces advocating global unity and peace',
                    'Repertoire spanning Kazakh, English, French, Chinese, Italian, Spanish, and Russian'
                ] : [
                    '«SOS d\'un terrien en détresse» — историческое исполнение, потрясшее миллионы',
                    '«Дайдидау», «Самалтау» — триумф казахского национального фольклора на мировых сценах',
                    '«Story of One Sky», «Stranger» — масштабные авторские гимны миру и человечности',
                    'Многоязычный репертуар на казахском, английском, французском, китайском и других языках'
                ]),
                layout: 'cards-grid',
                imagePrompt: 'golden record music album awards sparkling trophies spotlights 3d render',
                speakerNotes: isKazakh ? 'Ең үздік әндері мен көптілді орындау шеберлігі.' : 'Обзор ключевых музыкальных композиций и разнообразие жанров.',
                seed: 20505
            },
            {
                title: isKazakh ? 'Dears жанкүйерлері және мәдени елші' : (isEnglish ? 'Global Dears Community and Cultural Ambassadorship' : 'Сообщество Dears и культурная миссия'),
                points: isKazakh ? [
                    'Әлемнің 150-ден астам елінде ресми «Dears» фан-клубтары жұмыс істейді',
                    'Жүздеген мың шетелдік жанкүйерлер әндерін тыңдау үшін қазақ тілін үйренуде',
                    'Қазақстанның бай тарихы мен мәдениетін жаһанға паш етуші нағыз мәдени елші'
                ] : (isEnglish ? [
                    'Official «Dears» fan clubs active across more than 150 countries worldwide',
                    'Thousands of international fans actively learning Kazakh to sing his lyrics authentically',
                    'A cultural ambassador carrying the soul of Kazakhstan to international stages'
                ] : [
                    'Официальные фан-клубы «Dears» открыты более чем в 150 странах мира',
                    'Тысячи иностранных поклонников вдохновенно изучают казахский язык ради его песен',
                    'Полномочный посол казахской культуры, открывший величие родной земли миру'
                ]),
                layout: 'compare',
                imagePrompt: 'global unity world map golden threads musical notes connecting people 3d render',
                speakerNotes: isKazakh ? 'Dears жанкүйерлер қозғалысы мен қазақ мәдениетінің таралуы.' : 'Масштаб фан-сообщества Dears и популяризация языка и культуры.',
                seed: 20606
            },
            {
                title: isKazakh ? 'Мұрасы мен тарихи миссиясы' : (isEnglish ? 'Legacy, Inspiration and Vision' : 'Историческая миссия и наследие'),
                points: isKazakh ? [
                    '«Өнер — шекара мен тілге қарамастан, адамдардың жүрегін біріктіретін ұлы күш»',
                    'Қазақстан өнерінің әлемдік мәдениет төріндегі биік белесі',
                    'Жас ұрпаққа үлгі боларлық еңбекқорлық, қарапайымдылық пен патриотизм'
                ] : (isEnglish ? [
                    '«Music is an eternal bridge connecting souls across borders and languages»',
                    'A monumental era of Kazakh presence in world musical history',
                    'A shining example of dedication, humility, and patriotism for rising generations'
                ] : [
                    '«Музыка — универсальный язык мира, стирающий границы между народами»',
                    'Золотая эпоха признания казахстанского искусства на мировой карте',
                    'Вдохновляющий пример трудолюбия, скромности и преданности Родине'
                ]),
                layout: 'insight',
                imagePrompt: 'golden laurel wreath crystal dove peace eternal stage lights 3d render',
                speakerNotes: isKazakh ? 'Баяндаманы қорытындылап, негізгі мәдени миссияны атап өту.' : 'Заключительный аккорд о значении творчества для общества и культуры.',
                seed: 20707
            }
        ];

    // ── SPECIFIC DOMAIN 3: PHYSICS & QUANTUM ──────────────────
    } else if (/физик|ньютон|ом|ток|электр|квант|механик|энерги|термодинамик|оптика|physics/i.test(lower)) {
        slides = [
            {
                title: cleanTopic,
                points: isKazakh ? [
                    'Әлемнің іргелі заңдылықтары мен табиғат құбылыстарын зерттеу',
                    'Теориялық дәлелдеулерден заманауи өндіріс пен технологияларға дейін'
                ] : (isEnglish ? [
                    'Exploring fundamental laws that govern the physical universe',
                    'From theoretical equations to revolutionary technology'
                ] : [
                    'Исследование фундаментальных законов мироздания и материи',
                    'От строгих математических формул к передовым инженерным технологиям'
                ]),
                layout: 'cover',
                imagePrompt: `${cleanTopic} physics quantum equations glowing optics laboratory 3d render 8k`,
                speakerNotes: isKazakh ? `Физика пәні бойынша дәрісімізді бастаймыз: ${cleanTopic}.` : `Приветствие. Разбираем тему по физике: ${cleanTopic}.`,
                seed: 30101
            },
            {
                title: isKazakh ? 'Негізгі ұғымдар мен физикалық мәні' : (isEnglish ? 'Core Physical Concepts and Fundamentals' : 'Физическая сущность и ключевые понятия'),
                points: isKazakh ? [
                    'Зерттелетін құбылыстың табиғи мәні және оны сипаттайтын негізгі шамалар',
                    'Халықаралық бірліктер жүйесіндегі (SI) өлшем бірліктері',
                    'Тәжірибелік бақылаулар мен күнделікті тұрмыстағы көріністері'
                ] : (isEnglish ? [
                    'Intrinsic nature of the observed phenomenon and measurable parameters',
                    'Standard International (SI) units of measurement and relationships',
                    'Everyday manifestations and observable empirical physical phenomena'
                ] : [
                    'Физическая сущность изучаемого эффекта и базовые величины',
                    'Единицы измерения в Международной системе СИ и размерности',
                    'Наглядные проявления в природе, технике и повседневной жизни'
                ]),
                layout: 'split-left',
                imagePrompt: 'abstract physics atom glowing orbits particles force fields 3d render',
                speakerNotes: isKazakh ? 'Құбылыстың физикалық табиғаты мен негізгі терминдері.' : 'Объяснение физической сути и базовых расчетных единиц.',
                seed: 30202
            },
            {
                title: isKazakh ? 'Фундаменталды формула және математикалық байланыс' : (isEnglish ? 'Fundamental Formulas and Mathematical Models' : 'Фундаментальные законы и формулы'),
                statVal: 'F = m·a',
                points: isKazakh ? [
                    'Шамалар арасындағы тура және кері пропорционалды математикалық тәуелділік',
                    'Формулаға кіретін тұрақты шамалар (константалар) және олардың мәні',
                    'Заңның орындалу шарттары мен қолданылу аясының шектері'
                ] : (isEnglish ? [
                    'Direct and inverse mathematical dependencies between key quantities',
                    'Role of universal constants and dimensional proportionality coefficients',
                    'Boundary conditions and rigorous limits of formula applicability'
                ] : [
                    'Прямая и обратная математическая зависимость между величинами',
                    'Физический смысл постоянных величин и коэффициентов пропорциональности',
                    'Границы применимости формулы и строгие условия выполнения закона'
                ]),
                layout: 'stat',
                imagePrompt: 'mathematical physics formulas glowing on dark glass board 3d render',
                speakerNotes: isKazakh ? 'Формуланы есептер шығаруда қолдану тәсілдері.' : 'Разбор формулы, вывод соотношений и размерности величин.',
                seed: 30303
            },
            {
                title: isKazakh ? 'Тәжірибелік зерттеу және өлшеу барысы' : (isEnglish ? 'Laboratory Experimentation and Method' : 'Экспериментальная методика и этапы опыта'),
                points: isKazakh ? [
                    '1-қадам: Зертханалық қондырғыны жинақтау және датчиктерді қосу',
                    '2-қадам: Параметрлерді жүйелі түрде өзгертіп, өлшеулер сериясын жүргізу',
                    '3-қадам: Алынған нәтижелер бойынша тәуелділік графигін тұрғызу'
                ] : (isEnglish ? [
                    'Step 1: Assembling experimental apparatus and calibrating sensory probes',
                    'Step 2: Conducting controlled measurement iterations under varying conditions',
                    'Step 3: Plotting parametric response curves and calculating uncertainty margins'
                ] : [
                    'Шаг 1: Сборка лабораторного стенда и подключение контрольных датчиков',
                    'Шаг 2: Проведение серии контрольных измерений при изменяемых параметрах',
                    'Шаг 3: Построение графиков зависимостей и вычисление погрешностей'
                ]),
                layout: 'steps',
                imagePrompt: 'laser physics optical experiment glowing prisms glass sensors 3d render',
                speakerNotes: isKazakh ? 'Зертханалық жұмыстың орындалу алгоритмі мен қателіктерді есептеу.' : 'Пошаговый алгоритм лабораторного эксперимента и построение графиков.',
                seed: 30404
            },
            {
                title: isKazakh ? 'Заманауи техника мен өндірісте қолданылуы' : (isEnglish ? 'Industrial and Engineering Applications' : 'Практическое применение в технологиях'),
                points: isKazakh ? [
                    'Энергетикалық жүйелер, электр желілері мен жаңартылатын қуат көздері',
                    'Микроэлектроника, компьютерлік чиптер және жоғары дәлдікті сенсорлар',
                    'Авиация, көлік қауіпсіздігі және ғарыштық аппараттар'
                ] : (isEnglish ? [
                    'Power distribution networks, power electronics, and renewable energy grids',
                    'Semiconductor fabrication, microchips, and precision sensory instrumentation',
                    'Aerospace systems, structural mechanics, and high-speed transportation'
                ] : [
                    'Энергетические комплексы, электросети и возобновляемая генерация',
                    'Полупроводниковая микроэлектроника, процессоры и прецизионные датчики',
                    'Аэрокосмические аппараты, машиностроение и транспортная безопасность'
                ]),
                layout: 'cards-grid',
                imagePrompt: 'futuristic industrial turbine microchips electronics engineering 3d render',
                speakerNotes: isKazakh ? 'Бұл физикалық заңның өндіріс пен технологиядағы маңызы.' : 'Реальное воплощение физических принципов в современной промышленности.',
                seed: 30505
            },
            {
                title: isKazakh ? 'Салыстырмалы талдау және артықшылықтар' : (isEnglish ? 'Comparative Analysis and Theoretical Scope' : 'Сравнительный анализ моделей'),
                points: isKazakh ? [
                    'Классикалық физикалық түсініктер мен кванттық көзқарастардың салыстырмасы',
                    'Энергияны үнемдеу және жүйенің пайдалы әсер коэффициентін (ПӘК) арттыру',
                    'Ғылыми зерттеулердегі дәлдік пен болжау сенімділігі'
                ] : (isEnglish ? [
                    'Comparison of classical Newtonian mechanics with quantum interpretations',
                    'Efficiency optimization and maximizing coefficient of performance',
                    'Predictive precision in cutting-edge simulation and research'
                ] : [
                    'Сопоставление классических законов с квантово-релятивистскими моделями',
                    'Оптимизация потерь энергии и повышение коэффициента полезного действия',
                    'Точность прогнозирования динамики физических систем в расчетах'
                ]),
                layout: 'compare',
                imagePrompt: 'comparative balance scales energy physics glowing dual forces 3d render',
                speakerNotes: isKazakh ? 'Классикалық және заманауи тәсілдерді салыстыру.' : 'Сопоставление теоретических рамок и пределов применимости.',
                seed: 30606
            },
            {
                title: isKazakh ? 'Қорытынды және ғылыми тұжырымдар' : (isEnglish ? 'Summary and Conceptual Takeaways' : 'Итоги и научные выводы'),
                points: isKazakh ? [
                    '«Табиғат заңдарын білу — адамзат өркениетінің даму қозғалтқышы»',
                    'Теориялық білімдер есептер шығару мен өнертабыстар жасауға негіз болады',
                    'Физикалық құбылыстарды терең түсіну тың жаңалықтарға жол ашады'
                ] : (isEnglish ? [
                    '«Understanding the laws of nature fuels human technological civilization»',
                    'Theoretical mastery forms the bedrock for innovative engineering breakthroughs',
                    'Grounded physics literacy unlocks deeper insights into universal phenomena'
                ] : [
                    '«Постижение законов физики — главный двигатель научно-технического прогресса»',
                    'Теоретическая база служит ключом к решению инженерных задач и открытиям',
                    'Глубокое понимание физических законов открывает путь в будущее'
                ]),
                layout: 'insight',
                imagePrompt: 'glowing futuristic crystal trophy innovation scientific breakthrough 3d render',
                speakerNotes: isKazakh ? 'Сабақты қорытындылап, негізгі формуланы бекіту.' : 'Обобщение рассмотренного материала и финальные тезисы выступления.',
                seed: 30707
            }
        ];

    // ── SPECIFIC DOMAIN 4: STARTUP / TECH HUB / ECOSYSTEM ─────
    } else if (/хаб|hub|стартап|startup|инкуба|бизнес|жоба|кызылорда|kyzylorda|astana|астана|акселера|инвест|pitch/i.test(lower)) {
        slides = [
            {
                title: cleanTopic,
                points: isKazakh ? [
                    'Инновациялық идеяларды қолдау, цифрлық дағдылар мен кәсіпкерлікті дамыту',
                    'Жастар стартаптарын өсіріп, халықаралық нарықтарға шығару экожүйесі'
                ] : (isEnglish ? [
                    'Empowering innovative ideas, digital entrepreneurship and venture growth',
                    'Ecosystem fostering startups from ideation to international scaling'
                ] : [
                    'Поддержка инновационных идей, развитие цифровых навыков и венчурного бизнеса',
                    'Экосистема ускоренного роста стартапов от идеи до международного масштабирования'
                ]),
                layout: 'cover',
                imagePrompt: `${cleanTopic} modern innovation hub coworking office team 3d render 8k`,
                speakerNotes: isKazakh ? `Құрметті инвесторлар мен стартаптар, бүгінгі таныстырылымымыз: ${cleanTopic}.` : `Приветствие инвесторов и партнеров. Презентация: ${cleanTopic}.`,
                seed: 40101
            },
            {
                title: isKazakh ? `${cleanTopic} бизнес-инкубациялау орталығы` : (isEnglish ? `${cleanTopic} Ecosystem & Key Services` : `${cleanTopic} — Экосистема развития стартапов`),
                tagline: isKazakh ? 'Жастардың инновациялық идеяларын қолдап, кәсіпкерлікке жол ашамыз' : 'Создаем условия для развития инновационных идей и привлечения инвестиций',
                centerTitle: isKazakh ? 'Hub қызметтері' : 'Ключевые сервисы',
                layout: 'hub-ecosystem',
                leftMetrics: isKazakh ? [
                    { icon: 'fa-graduation-cap', val: '145', lbl: 'резидент түлектер' },
                    { icon: 'fa-users', val: '1 750', lbl: 'қатысушы жоба' },
                    { icon: 'fa-gear', val: '52', lbl: 'іске асқан стартап' }
                ] : [
                    { icon: 'fa-graduation-cap', val: '145', lbl: 'выпускников резидентов' },
                    { icon: 'fa-users', val: '1 750', lbl: 'участников проектов' },
                    { icon: 'fa-gear', val: '52', lbl: 'запущенных стартапов' }
                ],
                rightMetrics: isKazakh ? [
                    { icon: 'fa-people-group', val: '15 500', lbl: 'жастар қамтылды' },
                    { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'инвестиция тартылды' }
                ] : [
                    { icon: 'fa-people-group', val: '15 500', lbl: 'охват молодежи' },
                    { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'привлечено инвестиций' }
                ],
                spokes: isKazakh ? [
                    { title: 'Инкубация', icon: 'fa-rocket' },
                    { title: 'Фестивальдер', icon: 'fa-trophy' },
                    { title: 'Консультация', icon: 'fa-comments' },
                    { title: 'Demo Day', icon: 'fa-chart-pie' },
                    { title: 'Инвестициялар', icon: 'fa-seedling' },
                    { title: 'Маркетинг', icon: 'fa-bullhorn' },
                    { title: 'IT курстар', icon: 'fa-book-open' },
                    { title: 'Байқаулар', icon: 'fa-award' },
                    { title: 'Хакатондар', icon: 'fa-code' },
                    { title: '0% салықтар', icon: 'fa-file-invoice' }
                ] : [
                    { title: 'Инкубация', icon: 'fa-rocket' },
                    { title: 'Фестивали', icon: 'fa-trophy' },
                    { title: 'Трекинг', icon: 'fa-comments' },
                    { title: 'Demo Day', icon: 'fa-chart-pie' },
                    { title: 'Инвестиции', icon: 'fa-seedling' },
                    { title: 'PR & Маркетинг', icon: 'fa-bullhorn' },
                    { title: 'IT курсы', icon: 'fa-book-open' },
                    { title: 'Конкурсы', icon: 'fa-award' },
                    { title: 'Хакатоны', icon: 'fa-code' },
                    { title: '0% налогов', icon: 'fa-file-invoice' }
                ],
                points: isKazakh ? [
                    '145 резидент түлектер мен 52 сәтті іске қосылған жоба',
                    '111 500 000 ₸ көлемінде тартылған инвестициялар'
                ] : [
                    '145 резидентов выпускников и 52 запущенных проекта',
                    '111 500 000 ₸ привлеченных венчурных инвестиций'
                ],
                imagePrompt: 'modern tech startup hub coworking center team collaboration 3d render',
                speakerNotes: isKazakh ? 'Хабтың 10 негізгі бағыты мен қол жеткізген нәтижелері.' : 'Обзор 10 направлений поддержки резидентов и ключевых метрик.',
                seed: 40202
            },
            {
                title: isKazakh ? 'KPI Дашборд: Негізгі экономикалық көрсеткіштер' : (isEnglish ? 'KPI Dashboard: Economic Growth & Traction' : 'KPI Дашборд: Ключевые показатели роста'),
                layout: 'kpi-grid',
                kpis: isKazakh ? [
                    { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'Тартылған инвестициялар мен гранттар', delta: '+48%' },
                    { icon: 'fa-people-group', val: '15 500+', lbl: 'Іс-шаралармен қамтылған жастар', delta: '+35%' },
                    { icon: 'fa-graduation-cap', val: '145', lbl: 'Инкубация түлектері', delta: '+28%' },
                    { icon: 'fa-code', val: '1 750', lbl: 'Хакатондар қатысушылары', delta: '+62%' },
                    { icon: 'fa-gear', val: '52', lbl: 'Іске асқан стартаптар', delta: '+19%' },
                    { icon: 'fa-trophy', val: '98.4%', lbl: 'Резиденттердің қанағаттануы', delta: '+4.2%' }
                ] : [
                    { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'Привлеченные инвестиции и гранты', delta: '+48%' },
                    { icon: 'fa-people-group', val: '15 500+', lbl: 'Охват молодежи в мероприятиях', delta: '+35%' },
                    { icon: 'fa-graduation-cap', val: '145', lbl: 'Выпускников инкубационных программ', delta: '+28%' },
                    { icon: 'fa-code', val: '1 750', lbl: 'Участников хакатонов и батлов', delta: '+62%' },
                    { icon: 'fa-gear', val: '52', lbl: 'Действующих технологических стартапов', delta: '+19%' },
                    { icon: 'fa-trophy', val: '98.4%', lbl: 'Индекс удовлетворенности резидентов', delta: '+4.2%' }
                ],
                points: isKazakh ? [
                    'Жыл сайынғы инвестициялық тартымдылықтың 48%-ға артуы',
                    'Өңір жастарының цифрлық сауаттылығын еселеп көтеру'
                ] : [
                    'Рост объема инвестиций резидентов на 48% год к году',
                    'Масштабное вовлечение молодежи в технологические проекты'
                ],
                imagePrompt: 'glowing financial startup KPI metrics dashboard graphs 3d render',
                speakerNotes: isKazakh ? 'Негізгі экономикалық көрсеткіштер мен қаржылық нәтижелер.' : 'Разбор финансовых показателей и операционной эффективности.',
                seed: 40303
            },
            {
                title: isKazakh ? 'Инкубациялаудың 4 кезеңі' : (isEnglish ? '4-Stage Incubation & Acceleration Roadmap' : '4 этапа инкубации и акселерации проектов'),
                points: isKazakh ? [
                    '1-кезең: Идеяны іріктеу және scoring (Ideation & Selection)',
                    '2-кезең: 8 апталық қарқынды оқыту мен менторлық (Intensive Tracking)',
                    '3-кезең: MVP жасау және алғашқы сатылымдар (Product Traction)',
                    '4-кезең: Demo Day, питчинг және венчурлік инвестиция тарту'
                ] : [
                    'Этап 1: Отбор и валидация гипотезы (Ideation & Scoring)',
                    'Этап 2: 8 недель интенсивного трекинга и менторства',
                    'Этап 3: Запуск MVP и первые коммерческие продажи (Traction)',
                    'Этап 4: Финальный Demo Day и закрытие раунда финансирования'
                ],
                layout: 'steps',
                imagePrompt: 'startup development acceleration roadmap milestones glowing 3d isometric',
                speakerNotes: isKazakh ? 'Стартаптың идеядан инвестицияға дейінгі өсу алгоритмі.' : 'Пошаговая методология доведения идеи до первых продаж.',
                seed: 40404
            },
            {
                title: isKazakh ? 'Резиденттерге берілетін мүмкіндіктер' : (isEnglish ? 'Resident Benefits & Infrastructure' : 'Инфраструктура и преференции резидентов'),
                points: isKazakh ? [
                    'Startup Garage: жабдықталған заманауи коворкинг және жедел интернет',
                    'Менторлық пул: салалық сарапшылардан апта сайынғы жеке бағыт-бағдар',
                    'Seed Money: прототип әзірлеуге арналған қайтарымсыз қаржылай гранттар',
                    'Салықтық жеңілдіктер: 0% КТС, 0% ЖТС (Astana Hub серіктестігі)'
                ] : [
                    'Startup Garage: комфортный коворкинг, серверные мощности и рабочие места',
                    'Менторский пул: еженедельный трекинг от топ-предпринимателей рынка',
                    'Seed Money: предпосевные безвозмездные гранты лучшим проектам',
                    'Налоговые преференции: 0% КПН, 0% ИПН в партнерстве с технопарком'
                ],
                layout: 'cards-grid',
                imagePrompt: 'modern startup coworking open space innovation hub 3d render',
                speakerNotes: isKazakh ? 'Резиденттерге жасалған жағдайлар мен материалдық көмек.' : 'Материальные и налоговые преимущества участия в экосистеме.',
                seed: 40505
            },
            {
                title: isKazakh ? 'Дәстүрлі бизнес пен стартаптың айырмашылығы' : (isEnglish ? 'Traditional Business vs Scalable Tech Startup' : 'Традиционный бизнес и Tech-стартапы'),
                points: isKazakh ? [
                    'Шектеусіз жаһандық масштабталу әлеуеті және цифрлық өнім',
                    'Инновациялық технологиялар арқылы нарықтағы көшбасшылық',
                    'Венчурлік капитал мен халықаралық акселерациялық бағдарламалар',
                    'Тәуекелдерді тез бағалап, жаңа бағытқа бейімделу икемділігі'
                ] : [
                    'Высокий потенциал глобального масштабирования цифрового продукта',
                    'Создание технологического преимущества за счет собственного софта и ИИ',
                    'Привлечение венчурных раундов и выход на международные рынки',
                    'Гибкость бизнес-модели и быстрая проверка продуктовых гипотез'
                ],
                layout: 'compare',
                imagePrompt: 'startup growth rocket versus traditional balance scales 3d render',
                speakerNotes: isKazakh ? 'Стартаптардың артықшылығы мен өсу әлеуеті.' : 'Ключевые отличия масштабируемого стартапа от классического бизнеса.',
                seed: 40606
            },
            {
                title: isKazakh ? 'Миссиясы мен стратегиялық болашағы' : (isEnglish ? 'Strategic Vision and Future Horizons' : 'Стратегическое видение и миссия'),
                points: isKazakh ? [
                    'Өңірдегі ең ірі цифрлық инновациялық қауымдастықты қалыптастыру',
                    'Отандық стартаптарды жаһандық венчурлік нарықтарға шығару',
                    'Келесі 3 жылда 500+ жаңа жоғары ақылы жұмыс орнын ашу'
                ] : [
                    'Формирование ведущего IT-сообщества и кузницы технологических лидеров',
                    'Масштабирование проектов на рынки Центральной Азии и мира',
                    'Создание 500+ квалифицированных рабочих мест в сфере высоких технологий'
                ],
                layout: 'insight',
                imagePrompt: 'futuristic tech trophy innovation crystal globe rocket 3d render',
                speakerNotes: isKazakh ? 'Болашақ жоспарлар мен әріптестікке шақыру.' : 'Стратегическое видение развития инноваций в регионе.',
                seed: 40707
            }
        ];

    // ── SPECIFIC DOMAIN 5: GENERAL EDUCATIONAL / TOPIC SYNTHESIZER ──
    } else {
        slides = [
            {
                title: cleanTopic,
                points: isKazakh ? [
                    `«${cleanTopic}» тақырыбы бойынша кешенді ғылыми-танымдық баяндама`,
                    'Іргелі негіздері, даму кезеңдері мен заманауи практикалық маңызы'
                ] : (isEnglish ? [
                    `Comprehensive analytical study and review: «${cleanTopic}»`,
                    'Theoretical foundations, developmental stages, and modern practical impact'
                ] : [
                    `Комплексный аналитический обзор по теме: «${cleanTopic}»`,
                    'Фундаментальные основы, этапы развития и ключевое практическое значение'
                ]),
                layout: 'cover',
                imagePrompt: `${cleanTopic} conceptual presentation cover illustration masterpiece 3d octane render 8k`,
                speakerNotes: isKazakh ? `Құрметті қатысушылар, бүгінгі тақырыбымыз: ${cleanTopic}.` : `Приветствие участников. Тема нашего выступления: ${cleanTopic}.`,
                seed: 50101
            },
            {
                title: isKazakh ? `Кіріспе және негізгі ұғымдар: ${cleanTopic}` : (isEnglish ? `Introduction & Key Concepts: ${cleanTopic}` : `Введение и базовые понятия: ${cleanTopic}`),
                points: isKazakh ? [
                    `${cleanTopic} — заманауи ғылым мен өмірдегі маңызды бағыттардың бірі`,
                    `Тақырыптың өзектілігі мен қарастырылатын негізгі сұрақтары`,
                    `Құбылыстың табиғи мәні мен негізгі ғылыми анықтамалары`
                ] : (isEnglish ? [
                    `${cleanTopic} represents a crucial field in modern science and practical application`,
                    'Core rationale, foundational definitions, and prime investigative objectives',
                    'Key structural components that define the operational essence of the subject'
                ] : [
                    `${cleanTopic} — актуальное и значимое направление в современной науке и практике`,
                    'Базовые определения, структура понятийного аппарата и предмет изучения',
                    'Предпосылки возникновения и фундаментальная роль в современной системе знаний'
                ]),
                layout: 'split-left',
                imagePrompt: `${cleanTopic} theory glowing concept abstract 3d render`,
                speakerNotes: isKazakh ? 'Тақырыптың өзектілігі мен негізгі түсініктерін түсіндіру.' : 'Обоснуйте актуальность темы и сформулируйте базовые понятия.',
                seed: 50202
            },
            {
                title: isKazakh ? 'Негізгі көрсеткіштер мен ғылыми деректер' : (isEnglish ? 'Key Quantitative Metrics and Empirical Facts' : 'Главные параметры, показатели и метрики'),
                statVal: '★ Топ',
                points: isKazakh ? [
                    `${cleanTopic} бойынша тіркелген басты сандық және сапалық көрсеткіштер`,
                    'Құбылыстың басты қасиеттері мен заңдылық байланыстары',
                    'Практикалық зерттеулердегі өлшеу дәлдігі мен сенімділік деңгейі'
                ] : (isEnglish ? [
                    'Systematic qualitative and quantitative benchmarks established in research',
                    'Measurable parameters, functional correlations, and empirical metrics',
                    'Rigorous precision and predictive consistency in real-world observations'
                ] : [
                    'Ключевые качественные и количественные параметры, подтвержденные исследованиями',
                    'Фундаментальные закономерности, взаимосвязи и контрольные метрики',
                    'Высокая точность и воспроизводимость результатов в практических испытаниях'
                ]),
                layout: 'stat',
                imagePrompt: `${cleanTopic} metrics analytics infographic glowing data 3d render`,
                speakerNotes: isKazakh ? 'Негізгі сандық көрсеткіштер мен фактілерге назар аудару.' : 'Прокомментируйте ключевые показатели и аналитические метрики.',
                seed: 50303
            },
            {
                title: isKazakh ? 'Даму кезеңдері мен орындалу алгоритмі' : (isEnglish ? 'Chronological Stages & Implementation Roadmap' : 'Хронология и ключевые этапы развития'),
                points: isKazakh ? [
                    '1-кезең: Бастапқы зерттеу, мақсат қою және концептуалды негіздеме',
                    '2-кезең: Негізгі үдерісті іске асыру және тәжірибелік тексеру',
                    '3-кезең: Қорытынды нәтижелерді шығару және тәжірибеге енгізу'
                ] : (isEnglish ? [
                    'Stage 1: Foundational research, goal definition, and conceptual framework',
                    'Stage 2: Implementation of core methodologies and empirical verification',
                    'Stage 3: Analytical synthesis of findings and practical scaling'
                ] : [
                    'Этап 1: Формирование концептуальной базы и постановка исследовательских задач',
                    'Этап 2: Практическая реализация ключевых процессов и контрольное тестирование',
                    'Этап 3: Подведение итоговых результатов, валидация и масштабирование'
                ]),
                layout: 'steps',
                imagePrompt: `${cleanTopic} progression steps milestones roadmap isometric 3d render`,
                speakerNotes: isKazakh ? 'Даму кезеңдерін рет-ретімен түсіндіру.' : 'Опишите пошаговую методологию и ключевые стадии реализации.',
                seed: 50404
            },
            {
                title: isKazakh ? 'Құрылымы, компоненттері және бағыттары' : (isEnglish ? 'Structural Architecture and Core Components' : 'Структура, компоненты и практическая ценность'),
                points: isKazakh ? [
                    'Құрамдас бөліктер мен ішкі элементтердің өзара үйлесімді байланысы',
                    'Отандық және халықаралық тәжірибедегі озық үлгілер мен стандарттар',
                    'Заманауи цифрлық технологиялар мен тиімді тәсілдерді қолдану',
                    'Нәтижелілікті арттыруға бағытталған практикалық шешімдер'
                ] : (isEnglish ? [
                    'Interconnection between structural components and underlying operational subsystems',
                    'Best domestic and international standards applied in the field',
                    'Utilization of modern high-tech tools and data-driven methodologies',
                    'Actionable recommendations designed to maximize overall efficiency'
                ] : [
                    'Взаимосвязь ключевых структурных модулей и внутренних процессов',
                    'Передовые отечественные и международные практики внедрения',
                    'Использование современных технологических инструментов и методик',
                    'Практические сценарии применения с измеримой прикладной отдачей'
                ]),
                layout: 'cards-grid',
                imagePrompt: `${cleanTopic} modular structure network connected blocks 3d render`,
                speakerNotes: isKazakh ? 'Құрылымдық элементтер мен олардың өзара байланысы.' : 'Разберите архитектуру системы и реальные примеры практического применения.',
                seed: 50505
            },
            {
                title: isKazakh ? 'Салыстырмалы талдау және артықшылықтары' : (isEnglish ? 'Comparative Analysis and Distinct Advantages' : 'Сравнительный анализ и преимущества'),
                points: isKazakh ? [
                    'Дәстүрлі тәсілдерге қарағанда айтарлықтай жоғары тиімділік пен сенімділік',
                    'Үдерістерді оңтайландыру және уақыт пен ресурстарды үнемдеу мүмкіндігі',
                    'Инновациялық шешімдердің ұзақ мерзімді тұрақтылығы',
                    'Жаңа мүмкіндіктер мен болашақ өсу әлеуеті'
                ] : (isEnglish ? [
                    'Substantially higher efficiency and reliability compared to traditional baselines',
                    'Process optimization delivering measurable time and resource savings',
                    'Long-term durability and systemic sustainability of modern solutions',
                    'Opening expansive horizons for future growth and scalability'
                ] : [
                    'Значительное повышение эффективности и надежности по сравнению с аналогами',
                    'Оптимизация ключевых процессов, экономия времени и материальных ресурсов',
                    'Долгосрочная системная устойчивость внедряемых решений',
                    'Открытие широких возможностей для дальнейшего прогресса и масштабирования'
                ]),
                layout: 'compare',
                imagePrompt: `${cleanTopic} comparative balance scales contrast 3d render`,
                speakerNotes: isKazakh ? 'Салыстырмалы талдау жасап, негізгі артықшылықтарды атап өту.' : 'Сопоставьте ключевые подходы и подчеркните главные преимущества.',
                seed: 50606
            },
            {
                title: isKazakh ? 'Қорытынды, тұжырымдар мен болашағы' : (isEnglish ? 'Strategic Conclusions and Future Vision' : 'Стратегические выводы и перспективы'),
                points: isKazakh ? [
                    `«${cleanTopic} — ғылым мен білім дамуындағы серпінді қадам»`,
                    'Қарастырылған ғылыми деректер негізінде жасалған басты тұжырымдар',
                    'Болашақтағы даму векторлары мен жаңа мүмкіндіктер'
                ] : (isEnglish ? [
                    `«${cleanTopic} represents a transformative catalyst for knowledge and progress»`,
                    'Core analytical conclusions distilled from comprehensive theoretical study',
                    'Strategic forward-looking directions and emerging research horizons'
                ] : [
                    `«${cleanTopic} — мощный драйвер научно-технического прогресса»`,
                    'Обобщение рассмотренного материала и ключевые выводы исследования',
                    'Перспективные направления развития и открытые исследовательские горизонты'
                ]),
                layout: 'insight',
                imagePrompt: `${cleanTopic} futuristic glowing crystal idea light bulb vision 3d render`,
                speakerNotes: isKazakh ? 'Баяндаманы қорытындылап, сұрақ-жауап кезеңіне көшу.' : 'Подведите итоги выступления и перейдите к сессии вопросов и ответов.',
                seed: 50707
            }
        ];
    }

    // ── FIT TO REQUESTED SLIDE COUNT (5, 7, 10, 12) ────────────
    if (slides && slides.length > 0) {
        if (slides.length > targetSlideCount) {
            // Trim to target count (e.g. 5)
            const cover = slides[0];
            const last = slides[slides.length - 1];
            const middle = slides.slice(1, slides.length - 1);
            const neededMiddle = targetSlideCount - 2;
            if (neededMiddle <= 0) {
                slides = [cover, last].slice(0, targetSlideCount);
            } else {
                const step = middle.length / neededMiddle;
                const selectedMiddle = [];
                for (let i = 0; i < neededMiddle; i++) {
                    selectedMiddle.push(middle[Math.min(middle.length - 1, Math.floor(i * step))]);
                }
                slides = [cover, ...selectedMiddle, last];
            }
        } else if (slides.length < targetSlideCount) {
            // Expand to target count (e.g. 10 or 12) using unique distinct extra slides
            const neededExtras = targetSlideCount - slides.length;
            const extraSlides = buildExtraSlides(cleanTopic, neededExtras);
            // Insert extra slides before the last slide (insight/conclusion)
            slides.splice(slides.length - 1, 0, ...extraSlides);
        }
    }

    return {
        title: cleanTopic,
        theme: {
            backgroundColor: activeIntel.theme?.backgroundColor || '#060713',
            primaryTextColor: activeIntel.theme?.primaryTextColor || '#cbd5e1',
            accentColor: activeIntel.theme?.accentColor || '#00f0ff',
            style: activeIntel.theme?.style || 'Cyber Nebula 4K'
        },
        slides: slides
    };
}

async function callUniversalAI(promptText, sourceContext = '', intel = null, options = {}) {
    const slideCount = (options && options.slideCount) || 7;
    const audienceLevel = (options && options.audienceLevel) || 'school';
    const requestedLang = (options && options.slideLang) || 'auto';

    let targetLang = requestedLang;
    if (!targetLang || targetLang === 'auto') {
        const isKk = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test((promptText || '') + ' ' + (sourceContext || '')) || 
                     /\b(сабақ|жоспары|мақсаты|физика|химия|биология|сынып|оқушы|тұлға|өмірбаян|қазақ|тарих|баяндама|жетістік|шедевр)\b/i.test((promptText || '') + ' ' + (sourceContext || ''));
        targetLang = isKk ? 'kk' : 'ru';
    }

    const langName = targetLang === 'kk' ? 'Қазақ тілі' : (targetLang === 'en' ? 'English' : 'Русский');

    // 1. FAST TIER: Pollinations AI Text JSON Generator (100% Free, No key, Direct JSON)
    try {
        const compactSystem = `You are an expert presentation designer. Create a JSON presentation with ${slideCount} slides about "${promptText}". Language: ${langName}. Respond with pure JSON only, matching format: {"title":"...","slides":[{"title":"...","layout":"cover|split-left|stat|steps|cards-grid|compare|insight","points":["...","..."],"imagePrompt":"... in English","speakerNotes":"..."}]}`;
        const res = await fetchWithTimeout(`https://text.pollinations.ai/${encodeURIComponent(compactSystem)}?json=true&model=openai`, {}, 10000);
        if (res.ok) {
            const raw = await res.text();
            const parsed = parseJsonDeck(raw);
            if (parsed && Array.isArray(parsed.slides) && parsed.slides.length >= 3) {
                console.info('[AI Deck] Successfully generated via Pollinations AI');
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Pollinations AI fast tier skipped:', e.message);
    }

    // 2. TIER 2: Google Gemini (ONLY if user has a genuine key starting with AIzaSy)
    if (API_KEY && API_KEY.startsWith('AIzaSy')) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
            const gemPrompt = `Create a ${slideCount}-slide presentation in ${langName} on topic "${promptText}". Return pure JSON with title and slides.`;
            const res = await fetchWithTimeout(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: gemPrompt }] }],
                    generationConfig: { responseMimeType: 'application/json' }
                })
            }, 4000);
            if (res.ok) {
                const data = await res.json();
                const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                const parsed = parseJsonDeck(rawText);
                if (parsed && Array.isArray(parsed.slides) && parsed.slides.length >= 3) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('Gemini personal key skipped:', e.message);
        }
    }

    // 3. TIER 3: User OpenAI Key (sk-proj-...)
    if (API_KEY && API_KEY.startsWith('sk-proj-')) {
        try {
            const res = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + API_KEY
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: `Create a ${slideCount}-slide presentation in ${langName} as JSON object.` },
                        { role: 'user', content: promptText }
                    ],
                    temperature: 0.3
                })
            }, 5000);
            if (res.ok) {
                const oaiData = await res.json();
                const content = oaiData?.choices?.[0]?.message?.content;
                const parsed = parseJsonDeck(content);
                if (parsed && Array.isArray(parsed.slides) && parsed.slides.length >= 3) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('User OpenAI API key skipped:', e.message);
        }
    }

    // 4. TIER 4: Guaranteed Pedagogical Deck Synthesizer (Instant, Zero Delay, Content-Rich)
    console.info('Activating High-Grade Smart Deck Synthesizer...');
    return generateOfflineSmartDeck(promptText, sourceContext, intel, options);
}

const callGemini = callUniversalAI;





/* ──────────────────────────────────────────────
   STATE & RENDER WORKSPACE
─────────────────────────────────────────────── */
function detectTopicIntelligence(topicText, sourceText = '') {
    const combined = `${topicText || ''} ${sourceText || ''}`.toLowerCase();

    // 0. Person / Biography / Historical & Modern Figures (Dimash, Abai, Shokan, Al-Farabi, Elon Musk, Einstein, etc.)
    if (/димаш|dimash|құдайберген|кудайберген|кто такой|кто такая|ким ол|тұлға|өмірбаян|биография|персона|абай|шоқан|әл-фараби|пушкин|эйнштейн|ньютон|илон маск|стив джобс|певец|әнші|композитор|жазушы|ақын|ғалым|президент|хан|батыр|личность/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'imperial-gold') || DESIGN_TEMPLATES.find(t => t.id === 'apple-titanium') || DESIGN_TEMPLATES[0];
    }

    // 1. Startup & Tech Hub Ecosystem (Kyzylorda Hub, Astana Hub, Business Incubator, Pitch Deck)
    if (/kyzylorda\s*hub|кызылорда\s*хаб|астана\s*хаб|astana\s*hub|стартап\s*экожүйе|стартап\s*экосистем|бизнес-инкуба|акселератор|венчур|pitch deck/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'hub-startup') || DESIGN_TEMPLATES[0];
    }

    // 2. Space & Astronomy
    if (/космос|ғарыш|планет|астроном|space|mars|марс|звезд|галактик|orbit|солнечн|астероид|юпитер|спутник/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'cyber-nebula') || DESIGN_TEMPLATES[0];
    }

    // 3. Physics & Quantum
    if (/физик|ньютон|ом|ток|электр|квант|гравитац|механик|динамик|резистор|энерги|термодинамик|voltage|physics|оптика|линз/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'quantum-tech') || DESIGN_TEMPLATES[2];
    }

    // 4. Biology & Genetics
    if (/биолог|клетк|жасуша|днк|митохондр|хлоропласт|генет|эволюци|организм|микроскоп|бактери|био|анатоми|вирус/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'biotech-matrix') || DESIGN_TEMPLATES[5];
    }

    // 5. AI, IT, Coding & Robotics
    if (/информатик|робот|жасанды интеллект|нейро|ai|код|программ|cyber|технолог|алгоритм|machine learning|python|web/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'cyber-nebula') || DESIGN_TEMPLATES[0];
    }

    // 6. Chemistry & Periodic Table
    if (/хими|менделеев|период|атом|молекул|реакци|кислот|щелоч|колб|раствор|chem|элемент|оксид/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'cosmic-aurora') || DESIGN_TEMPLATES[8];
    }

    // 7. History, Kazakh Culture & Literature
    if (/тарих|батыр|хан|қазақ|мұра|әдебиет|культура|рухани|казахстан|истори|номад|шежире/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'imperial-gold') || DESIGN_TEMPLATES[3];
    }

    // 8. Math, Geometry & Engineering
    if (/математик|геометр|пифагор|үшбұрыш|инженер|формул|алгебр|уравнен|график|теорем|math|треугольник|числа/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'deep-ocean') || DESIGN_TEMPLATES[7];
    }

    // 9. Nature, Ecology & Geography
    if (/эколог|табиғат|природ|климат|географ|өзен|мұхит|жануар|nature|forest|water|планета земля|океан/i.test(combined)) {
        return DESIGN_TEMPLATES.find(t => t.id === 'solar-flare') || DESIGN_TEMPLATES[6];
    }

    // 10. Default Universal Template (Cyber Nebula or Apple Titanium)
    return DESIGN_TEMPLATES[0];
}

function getSelectedTemplate() {
    return DESIGN_TEMPLATES.find(t => t.id === selectedTemplateId) || DESIGN_TEMPLATES[0];
}

function getSlideLayoutType(slide, index) {
    if (index === 0) return 'cover';
    if (slide && slide.layout && ['cover', 'stat', 'steps', 'compare', 'cards-grid', 'insight', 'split-left', 'split-right', 'hub-ecosystem', 'kpi-grid'].includes(slide.layout)) {
        return slide.layout;
    }
    const sequence = ['split-left', 'stat', 'steps', 'cards-grid', 'compare', 'insight', 'split-right'];
    return sequence[(index - 1) % sequence.length];
}

function initPresentationState(data, intel = null) {
    const slides = Array.isArray(data.slides) ? data.slides : [];
    if (slides.length === 0) throw new Error('ИИ не сгенерировал ни одного слайда');

    const activeIntel = intel || detectTopicIntelligence(data.title || 'Урок');
    const tpl = getSelectedTemplate();

    const theme = {
        backgroundColor: activeIntel.theme?.backgroundColor || tpl.theme.backgroundColor,
        primaryTextColor: activeIntel.theme?.primaryTextColor || tpl.theme.primaryTextColor,
        accentColor: activeIntel.theme?.accentColor || tpl.theme.accentColor,
        accentSecondary: activeIntel.theme?.accentSecondary || tpl.theme.accentSecondary || activeIntel.theme?.accentColor || '#a855f7',
        accentGlow: activeIntel.theme?.accentGlow || tpl.theme.accentGlow || 'rgba(0, 240, 255, 0.35)',
        style: activeIntel.theme?.style || tpl.theme.style,
        tileBg: activeIntel.theme?.tileBg || (tpl.isDark ? 'rgba(12, 16, 33, 0.65)' : '#FFFFFF'),
        tileBorder: activeIntel.theme?.tileBorder || (tpl.isDark ? 'rgba(0, 240, 255, 0.25)' : '#E2E8F0'),
        titleColor: activeIntel.theme?.titleColor || (tpl.isDark ? '#FFFFFF' : '#0F172A'),
        isDark: activeIntel.isDark !== undefined ? activeIntel.isDark : tpl.isDark
    };

    presentationState = {
        title: data.title || 'Новая презентация',
        theme: theme,
        slides: slides.map((s, i) => ({
            title: s.title || `Слайд ${i + 1}`,
            points: Array.isArray(s.points) ? s.points : [],
            imagePrompt: s.imagePrompt || 'educational presentation illustration',
            imageUrl: s.imageUrl || '',
            statVal: s.statVal || '',
            leftMetrics: s.leftMetrics,
            rightMetrics: s.rightMetrics,
            centerTitle: s.centerTitle,
            tagline: s.tagline,
            spokes: s.spokes,
            kpis: s.kpis,
            layout: getSlideLayoutType(s, i),
            speakerNotes: s.speakerNotes || '',
            seed: Math.floor(Math.random() * 100000)
        })),
        currentSlideIndex: 0
    };
}

function renderWorkspace() {
    const wsTitleInput    = document.getElementById('workspace-title-input');
    const themeStyleBadge = document.getElementById('theme-style-badge');
    const slidesCount     = document.getElementById('slides-count');
    const currentTheme    = presentationState.theme || {};
    
    if (wsTitleInput)    wsTitleInput.value = presentationState.title;
    if (themeStyleBadge) themeStyleBadge.textContent = `Дизайн: ${currentTheme.style || 'AshyqLab Pro'}`;
    if (slidesCount)     slidesCount.textContent = presentationState.slides.length;

    // Highlight active Quick Theme button
    document.querySelectorAll('.q-theme-btn').forEach(btn => {
        if (btn.getAttribute('data-theme-id') === selectedTemplateId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    renderThumbnailsList();
    loadActiveSlideToEditor();
    renderLiveSlidePreview();
}

function getCurrentSlide() {
    return presentationState.slides[presentationState.currentSlideIndex];
}

function getLayoutIconAndLabel(layout) {
    switch (layout) {
        case 'cover': return { icon: '<i class="fa-solid fa-crown"></i>', label: 'Cover' };
        case 'hub-ecosystem': return { icon: '<i class="fa-solid fa-circle-nodes"></i>', label: 'Hub' };
        case 'kpi-grid': return { icon: '<i class="fa-solid fa-chart-column"></i>', label: 'KPI' };
        case 'stat': return { icon: '<i class="fa-solid fa-bolt"></i>', label: 'Stat' };
        case 'steps': return { icon: '<i class="fa-solid fa-list-ol"></i>', label: 'Steps' };
        case 'cards-grid': return { icon: '<i class="fa-solid fa-table-cells-large"></i>', label: 'Cards' };
        case 'compare': return { icon: '<i class="fa-solid fa-arrows-split-up-and-left"></i>', label: 'Compare' };
        case 'insight': return { icon: '<i class="fa-solid fa-lightbulb"></i>', label: 'Insight' };
        case 'split-left': return { icon: '<i class="fa-solid fa-table-columns"></i>', label: 'Split' };
        case 'split-right': return { icon: '<i class="fa-solid fa-table-columns fa-flip-horizontal"></i>', label: 'Split' };
        default: return { icon: '<i class="fa-solid fa-layer-group"></i>', label: 'Slide' };
    }
}

/* Render Thumbnails Navigator */
function renderThumbnailsList() {
    const thumbsList = document.getElementById('slides-thumbnails-list');
    if (!thumbsList) return;
    thumbsList.innerHTML = '';

    presentationState.slides.forEach((slide, idx) => {
        const thumb = document.createElement('div');
        const isActive = idx === presentationState.currentSlideIndex;
        thumb.className = `slide-thumb ${isActive ? 'active' : ''}`;
        
        const layout = slide.layout || getSlideLayoutType(slide, idx);
        const meta = getLayoutIconAndLabel(layout);
        const titleText = (slide.title || `Слайд ${idx + 1}`).trim();

        thumb.innerHTML = `
            <div class="slide-thumb-header">
                <span class="slide-thumb-num">#${idx + 1}</span>
                <span class="slide-thumb-layout-badge">${meta.icon} ${meta.label}</span>
            </div>
            <div class="slide-thumb-title" title="${escapeHtml(titleText)}">${escapeHtml(titleText)}</div>
        `;

        if (isActive && presentationState.theme?.accentColor) {
            thumb.style.borderColor = presentationState.theme.accentColor;
        }

        thumb.addEventListener('click', () => {
            presentationState.currentSlideIndex = idx;
            renderThumbnailsList();
            loadActiveSlideToEditor();
            renderLiveSlidePreview();
        });
        thumbsList.appendChild(thumb);
    });
}

function updateActiveThumbnail() {
    const activeThumb = document.querySelector('.slide-thumb.active');
    if (activeThumb) {
        const slide = getCurrentSlide();
        const idx = presentationState.currentSlideIndex;
        if (slide) {
            const layout = slide.layout || getSlideLayoutType(slide, idx);
            const meta = getLayoutIconAndLabel(layout);
            const titleText = (slide.title || `Слайд ${idx + 1}`).trim();
            activeThumb.innerHTML = `
                <div class="slide-thumb-header">
                    <span class="slide-thumb-num">#${idx + 1}</span>
                    <span class="slide-thumb-layout-badge">${meta.icon} ${meta.label}</span>
                </div>
                <div class="slide-thumb-title" title="${escapeHtml(titleText)}">${escapeHtml(titleText)}</div>
            `;
        }
    }
}

/* Load Selected Slide Data into Sidebar Editor Form */
function loadActiveSlideToEditor() {
    const slide = getCurrentSlide();
    if (!slide) return;

    const activeNum = document.getElementById('active-slide-num');
    if (activeNum) activeNum.textContent = presentationState.currentSlideIndex + 1;
    const titleInput = document.getElementById('edit-slide-title');
    if (titleInput) titleInput.value = slide.title || '';
    const pointsInput = document.getElementById('edit-slide-points');
    if (pointsInput) pointsInput.value = (slide.points || []).join('\n');
    const notesInput = document.getElementById('edit-speaker-notes');
    if (notesInput) notesInput.value = slide.speakerNotes || '';
    const promptInput = document.getElementById('edit-image-prompt');
    if (promptInput) promptInput.value = slide.imagePrompt || '';
    const editImgUrl = document.getElementById('edit-image-url');
    if (editImgUrl) editImgUrl.value = slide.imageUrl || '';

    const currentLayout = getSlideLayoutType(slide, presentationState.currentSlideIndex);
    document.querySelectorAll('.layout-opt-btn').forEach(btn => {
        if (btn.getAttribute('data-layout') === currentLayout) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}


/* ──────────────────────────────────────────────
   LIVE HTML SLIDE PREVIEW WITH 7 WOW ARCHETYPES
─────────────────────────────────────────────── */
function renderLiveSlidePreview() {
    const card = document.getElementById('live-slide-card');
    const slide = getCurrentSlide();
    if (!card || !slide) return;

    buildSlideCardHTML(card, slide, presentationState.currentSlideIndex, presentationState.theme);
}

const CYRILLIC_MAP = {
    'а':'a','б':'b','в':'v','г':'g','д':'d','е':'e','ё':'yo','ж':'zh','з':'z','и':'i','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ъ':'','ы':'y','ь':'','э':'e','ю':'yu','я':'ya','ә':'ae','і':'i','ң':'ng','ғ':'gh','ү':'u','ұ':'u','қ':'q','ө':'o','һ':'h'
};

function transliterateText(str) {
    if (!str) return '';
    return String(str).toLowerCase().split('').map(c => CYRILLIC_MAP[c] || c).join('');
}

function sanitizeImagePrompt(prompt, slideTitle = '', topicTitle = '') {
    let text = (prompt || '').trim();
    const cleanTitle = (slideTitle || '').trim();
    const cleanTopic = (topicTitle || '').trim();

    // Contextual focus based on the specific slide title and content
    const subject = `${cleanTitle} ${text}`.toLowerCase();
    let visualFocus = 'detailed educational 3d visualization, octane render, cinematic lighting';
    
    if (/портрет|биография|өмірбаян|тұлға|персона|личность|абай|димаш|шоқан|ғалым|автор/i.test(subject)) {
        visualFocus = 'cinematic character portrait, dramatic stage and studio lighting, hyperrealistic 8k';
    } else if (/формула|заң|теорема|закон|есеп|уравнен|расчет|stat|kpi/i.test(subject)) {
        visualFocus = 'glowing scientific mathematical physics formulas, illuminated chalkboard equations, 3d render';
    } else if (/зертхана|тәжірибе|опыт|прибор|құрал|лаборатор|аппарат|микроскоп/i.test(subject)) {
        visualFocus = 'high tech research laboratory experiment setup with optical laser glass instruments, 3d render';
    } else if (/кезең|қадам|барысы|этап|хронолог|тарих|steps/i.test(subject)) {
        visualFocus = 'isometric technological workflow roadmap progression steps, glowing volumetric neon 3d';
    } else if (/құрылым|құрам|жүйе|жасуша|ағза|днк|молекул|cards/i.test(subject)) {
        visualFocus = 'exploded cross-section architecture 3d model, bioluminescent emerald and cyan lighting';
    } else if (/салыстыр|артықшылық|айырмашылық|compare/i.test(subject)) {
        visualFocus = 'comparative dual contrast balance scales innovation visual concept 3d';
    } else if (/қорытынды|болашақ|викторина|сұрақ|инсайт|insight/i.test(subject)) {
        visualFocus = 'glowing crystal light bulb futuristic trophy eureka moment vision 3d render';
    }

    const titleEn = transliterateText(cleanTitle || cleanTopic);
    const topicEn = transliterateText(cleanTopic);
    return `${topicEn}, ${titleEn}, ${visualFocus}, unreal engine 5 aesthetic, 8k`;
}

function generateSvgIllustration(title, accentColor, bgColor) {
    const safeTitle = escapeHtml((title || 'AshyqLab').slice(0, 32));
    const accent = accentColor || '#38bdf8';
    const bg = bgColor || '#0f172a';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <defs>
            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${bg}" />
                <stop offset="100%" stop-color="#020617" />
            </linearGradient>
            <linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${accent}" />
                <stop offset="100%" stop-color="#a855f7" />
            </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#g1)" />
        <circle cx="400" cy="260" r="160" fill="${accent}" opacity="0.12" />
        <circle cx="400" cy="260" r="100" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="6 6" opacity="0.6" />
        <circle cx="400" cy="260" r="60" fill="url(#g2)" opacity="0.9" />
        <path d="M375,235 L425,235 L425,285 L375,285 Z" fill="#ffffff" opacity="0.95" rx="8" />
        <path d="M400,205 L400,315 M345,260 L455,260" stroke="#ffffff" stroke-width="3" stroke-linecap="round" />
        <text x="400" y="440" fill="#f8fafc" font-size="22" font-weight="bold" font-family="system-ui, sans-serif" text-anchor="middle">${safeTitle}</text>
        <text x="400" y="475" fill="${accent}" font-size="13" font-weight="700" font-family="system-ui, sans-serif" text-anchor="middle" letter-spacing="2">ASHYQLAB AI VISUAL</text>
    </svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ── Real Web Photo & Knowledge Engine (Wikipedia, Wikimedia, Unsplash & Curated Archive) ──
let imageSourceMode = localStorage.getItem('vsh_image_source_mode') || 'web'; // 'web' | 'ai'

async function fetchWikipediaKnowledge(query) {
    if (!query) return '';
    const cleanQuery = query.replace(/^(кто такой|кто такая|что такое|ким ол|не ол|туралы|слайд|презентация|баяндама|тақырыбында|реферат|расскажи про|расскажи о|тема)\s+/gi, '').trim();
    if (!cleanQuery) return '';

    const isKazakh = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test(query);
    const langOrder = isKazakh ? ['kk', 'ru', 'en'] : ['ru', 'kk', 'en'];

    for (const lang of langOrder) {
        try {
            const url = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(cleanQuery)}&gsrlimit=2&prop=extracts&exintro=1&explaintext=1&format=json&origin=*`;
            const res = await fetchWithTimeout(url, {}, 3500);
            if (res.ok) {
                const data = await res.json();
                const pages = Object.values(data?.query?.pages || {});
                for (const p of pages) {
                    if (p.extract && p.extract.trim().length > 60) {
                        return p.extract.trim();
                    }
                }
            }
        } catch (e) {
            console.warn(`[Wiki Knowledge ${lang}] error:`, e.message);
        }
    }
    return '';
}

async function fetchWikipediaImages(query, limit = 8) {
    if (!query) return [];
    const cleanQuery = query.replace(/^(кто такой|кто такая|что такое|ким ол|не ол|туралы|слайд|презентация|баяндама|тақырыбында|реферат|расскажи про|тема)\s+/gi, '').trim();
    if (!cleanQuery) return [];

    const results = [];
    const seenUrls = new Set();
    const searchTerms = [cleanQuery];
    const words = cleanQuery.split(' ');
    if (words.length > 2) {
        searchTerms.push(words.slice(0, 2).join(' '));
    }

    for (const term of searchTerms) {
        for (const lang of ['ru', 'kk', 'en']) {
            try {
                const url = `https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(term)}&gsrlimit=${limit}&prop=pageimages|extracts&exintro=1&explaintext=1&pithumbsize=1200&format=json&origin=*`;
                const res = await fetchWithTimeout(url, {}, 3000);
                if (res.ok) {
                    const data = await res.json();
                    const pages = Object.values(data?.query?.pages || {});
                    for (const p of pages) {
                        if (p.thumbnail && p.thumbnail.source && !seenUrls.has(p.thumbnail.source)) {
                            seenUrls.add(p.thumbnail.source);
                            results.push({
                                url: p.thumbnail.source,
                                label: p.title || term,
                                source: `Wikipedia (${lang.toUpperCase()})`
                            });
                        }
                    }
                }
            } catch (e) {}
        }
        if (results.length >= limit) break;
    }
    return results;
}

// Vast Curated Collection of 15+ Unique HD Photos per Domain
const CURATED_PHOTO_BANKS = {
    biology: [
        { url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&auto=format&fit=crop&q=80', label: 'ДНҚ құрылымы және генетика' },
        { url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&auto=format&fit=crop&q=80', label: 'Микробиологиялық зертхана' },
        { url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80', label: 'Биомедициналық талдау' },
        { url: 'https://images.unsplash.com/photo-1518152006812-edab29b069ac?w=1200&auto=format&fit=crop&q=80', label: 'Жасушалық биология және микроскоп' },
        { url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&auto=format&fit=crop&q=80', label: 'Адам анатомиясы мен жүйелері' },
        { url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&auto=format&fit=crop&q=80', label: 'Биохимиялық реакциялар' },
        { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80', label: 'Нейробиология және ми' },
        { url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1200&auto=format&fit=crop&q=80', label: 'Медициналық диагностика' },
        { url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&auto=format&fit=crop&q=80', label: 'Ғылыми жаңалықтар' },
        { url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1200&auto=format&fit=crop&q=80', label: 'Өсімдік жасушасы мен фотосинтез' },
        { url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&auto=format&fit=crop&q=80', label: 'Дәрігерлік зерттеу' },
        { url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=1200&auto=format&fit=crop&q=80', label: 'Жүрек және қанайналым' },
        { url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&auto=format&fit=crop&q=80', label: 'Клиникалық физиология' },
        { url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=1200&auto=format&fit=crop&q=80', label: 'Биотехнологиялық инновациялар' },
        { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80', label: 'Органикалық зерттеулер' }
    ],
    physics: [
        { url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=1200&auto=format&fit=crop&q=80', label: 'Кванттық оптика және лазер' },
        { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80', label: 'Зертханалық физикалық тәжірибе' },
        { url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80', label: 'Формулалар мен есептеулер' },
        { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80', label: 'Инженерлік аппаратура' },
        { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80', label: 'Микроэлектроника және чиптер' },
        { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80', label: 'Электр және кибернетика' },
        { url: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?w=1200&auto=format&fit=crop&q=80', label: 'Плазма және электр разряды' },
        { url: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=1200&auto=format&fit=crop&q=80', label: 'Астрофизикалық кеңістік' },
        { url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80', label: 'Магнит өрісі және күш сызықтары' },
        { url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&auto=format&fit=crop&q=80', label: 'Эксперименттік құрылғылар' },
        { url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&auto=format&fit=crop&q=80', label: 'Жоғары технологиялық өндіріс' },
        { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80', label: 'Кванттық есептеулер' },
        { url: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=1200&auto=format&fit=crop&q=80', label: 'Оптикалық призма және спектр' },
        { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80', label: 'Электрондық жүйелер' },
        { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', label: 'Гравитация және ғарыш' }
    ],
    dimash: [
        { url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Kudaibergen_at_New_Wave_in_2019.jpg/1280px-Kudaibergen_at_New_Wave_in_2019.jpg', label: 'Димаш Құдайберген (New Wave)' },
        { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80', label: 'Концерт және вокалдық сахна' },
        { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80', label: 'Стадиондық шоу және аншлаг' },
        { url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80', label: 'Музыкалық марапаттар мен сахна' },
        { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80', label: 'Студия және микрофон' },
        { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80', label: 'Вокал шеберлігі және сахна' },
        { url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80', label: 'Dears жанкүйерлер қауымдастығы' },
        { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&auto=format&fit=crop&q=80', label: 'Музыкалық шеберлік' },
        { url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=1200&auto=format&fit=crop&q=80', label: 'Классикалық аспаптар' },
        { url: 'https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=1200&auto=format&fit=crop&q=80', label: 'Үлкен симфониялық оркестр' },
        { url: 'https://images.unsplash.com/photo-1520523839898-507125cd53c1?w=1200&auto=format&fit=crop&q=80', label: 'Рояль мен пернелер' },
        { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80', label: 'Дыбыс режиссурасы' },
        { url: 'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=1200&auto=format&fit=crop&q=80', label: 'Сахналық жарық' },
        { url: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1200&auto=format&fit=crop&q=80', label: 'Фестиваль атмосферасы' },
        { url: 'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=1200&auto=format&fit=crop&q=80', label: 'Әлемдік гастрольдер' }
    ],
    startup: [
        { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80', label: 'Startup Hub Coworking' },
        { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80', label: 'Командалық талқылау' },
        { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', label: 'Hackathon & Workshop' },
        { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80', label: 'Pitch Demo Day' },
        { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80', label: 'Венчурлік инвестициялар' },
        { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80', label: 'Цифрлық экожүйе' },
        { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80', label: 'KPI Аналитика' },
        { url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&auto=format&fit=crop&q=80', label: 'Бизнес келіссөздер' },
        { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80', label: 'IT әзірлеушілер тобы' },
        { url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&auto=format&fit=crop&q=80', label: 'Стратегиялық жоспарлау' },
        { url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&auto=format&fit=crop&q=80', label: 'Кәсіпкерлік жетістік' },
        { url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1200&auto=format&fit=crop&q=80', label: 'Жобалық инкубация' },
        { url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&auto=format&fit=crop&q=80', label: 'Конференция спикері' },
        { url: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&auto=format&fit=crop&q=80', label: 'Кеңес беру және менторлық' },
        { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80', label: 'Заманауи бизнес орталығы' }
    ],
    general: [
        { url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop&q=80', label: 'Білім беру және зерттеу' },
        { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', label: 'Жаһандық инновациялар' },
        { url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&auto=format&fit=crop&q=80', label: 'Шығармашылық идеялар' },
        { url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80', label: 'Академиялық оқу үдерісі' },
        { url: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&auto=format&fit=crop&q=80', label: 'Заманауи білім ордасы' },
        { url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80', label: 'Семинар және шеберлік сабағы' },
        { url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1200&auto=format&fit=crop&q=80', label: 'Кітапхана қоры мен ғылым' },
        { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80', label: 'Студенттер қауымдастығы' },
        { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80', label: 'Цифрлық платформа' },
        { url: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=1200&auto=format&fit=crop&q=80', label: 'Мектеп және интерактивті сабақ' },
        { url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&auto=format&fit=crop&q=80', label: 'Оқушылар жетістігі' },
        { url: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=1200&auto=format&fit=crop&q=80', label: 'Зерттеушілік жобалар' },
        { url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80', label: 'Ұстаздар мен оқушылар' },
        { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&auto=format&fit=crop&q=80', label: 'Ынтымақтастық және серіктестік' },
        { url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&auto=format&fit=crop&q=80', label: 'Технологиялық жаңалықтар' }
    ]
};

function getCuratedWebImages(query) {
    const text = (query || '').toLowerCase();
    if (/димаш|dimash|құдайберген|кудайберген/i.test(text)) {
        return CURATED_PHOTO_BANKS.dimash;
    }
    if (/анатом|биолог|клетк|жасуша|днк|орган|жүрек|өкпе|ми|бауыр|мозг|скелет|қаңқа|cell|dna|biology/i.test(text)) {
        return CURATED_PHOTO_BANKS.biology;
    }
    if (/физик|ньютон|ом|ток|электр|квант|механик|энерги|лазер|physics/i.test(text)) {
        return CURATED_PHOTO_BANKS.physics;
    }
    if (/хаб|hub|стартап|startup|инкуба|бизнес|жоба|кызылорда|astana/i.test(text)) {
        return CURATED_PHOTO_BANKS.startup;
    }
    return CURATED_PHOTO_BANKS.general;
}

async function searchAllRealWebPhotos(query, topicTitle = '') {
    const combined = `${query || ''} ${topicTitle || ''}`.trim();
    const curated = getCuratedWebImages(combined);
    const wiki = await fetchWikipediaImages(query || topicTitle, 6);
    
    // Combine Wikipedia images with curated bank
    const all = [...wiki, ...curated];
    const seen = new Set();
    const uniqueList = [];
    for (const item of all) {
        if (!seen.has(item.url)) {
            seen.add(item.url);
            uniqueList.push(item);
        }
    }
    return uniqueList.length >= 5 ? uniqueList : CURATED_PHOTO_BANKS.general;
}

async function autoAttachRealWebPhotos(presentation, mainTopic) {
    if (!presentation || !Array.isArray(presentation.slides)) return;
    
    // Fetch master pool of photos for the topic
    const topicPhotos = await searchAllRealWebPhotos(mainTopic, '');
    const usedUrls = new Set();

    for (let i = 0; i < presentation.slides.length; i++) {
        const slide = presentation.slides[i];
        
        // Find an unused photo from pool
        let chosen = topicPhotos.find(p => !usedUrls.has(p.url));
        if (!chosen) {
            // Pick from general fallback bank to ensure uniqueness
            const fallbackPool = CURATED_PHOTO_BANKS.general;
            chosen = fallbackPool.find(p => !usedUrls.has(p.url)) || topicPhotos[i % topicPhotos.length];
        }

        if (chosen) {
            slide.imageUrl = chosen.url;
            usedUrls.add(chosen.url);
        }
    }
}

function getTopicFallbackImage(prompt, title = '', slideIndex = 0) {
    const text = `${prompt || ''} ${title || ''}`.toLowerCase();
    const list = getCuratedWebImages(text);
    return list[slideIndex % list.length].url;
}

function handleImageFallback(imgEl, title, svgFallback, prompt) {
    if (!imgEl) return;
    const stage = imgEl.getAttribute('data-fallback-stage') || 'ai';
    if (stage === 'ai') {
        imgEl.setAttribute('data-fallback-stage', 'topic');
        imgEl.src = getTopicFallbackImage(prompt, title, 1);
    } else {
        imgEl.onerror = null;
        imgEl.src = svgFallback;
    }
}

function buildPollinationsUrl(prompt, seed, slideTitle = '') {
    const tpl = getSelectedTemplate();
    const styleModifier = tpl && tpl.imageStyle ? `, ${tpl.imageStyle}` : ', high quality educational 3d octane render, volumetric lighting, 8k';
    const cleanPrompt = sanitizeImagePrompt(prompt, slideTitle, presentationState ? presentationState.title : '');
    const fullPrompt = `${cleanPrompt}${styleModifier}`;
    const encoded = encodeURIComponent(fullPrompt);
    const seedParam = seed ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 10000000)}`;
    return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=600&nologo=true${seedParam}`;
}


/* Build Slide Card HTML inner structure with 7 Diverse WOW Archetypes */
function buildSlideCardHTML(card, slide, index, theme) {
    const isDark = theme.isDark !== false;
    const accentColor = theme.accentColor || '#38BDF8';
    const accentSecondary = theme.accentSecondary || theme.accentColor || '#818cf8';
    const accentGlow = theme.accentGlow || 'rgba(56, 189, 248, 0.35)';
    const tileBg = theme.tileBg || (isDark ? 'rgba(15, 23, 42, 0.65)' : '#FFFFFF');
    const tileBorder = theme.tileBorder || (isDark ? 'rgba(56, 189, 248, 0.25)' : '#E2E8F0');
    const titleColor = theme.titleColor || (isDark ? '#F8FAFC' : '#0F172A');
    const bgColor = theme.backgroundColor || '#0B0F19';

    card.style.setProperty('--slide-bg', bgColor);
    card.style.setProperty('--slide-text', theme.primaryTextColor || '#94A3B8');
    card.style.setProperty('--slide-accent', accentColor);
    card.style.setProperty('--slide-accent-sec', accentSecondary);
    card.style.setProperty('--slide-accent-glow', accentGlow);
    card.style.setProperty('--tile-bg', tileBg);
    card.style.setProperty('--tile-border', tileBorder);
    card.style.setProperty('--title-color', titleColor);

    const layout = getSlideLayoutType(slide, index);
    card.className = `slide-card layout-${layout} ${isDark ? 'theme-dark' : 'theme-light'}`;

    const isWebPhoto = Boolean(slide.imageUrl && slide.imageUrl.startsWith('http'));
    const hasImage = isWebPhoto || Boolean(slide.imagePrompt && slide.imagePrompt.trim());
    const imageUrl = isWebPhoto ? slide.imageUrl : (hasImage ? buildPollinationsUrl(slide.imagePrompt, slide.seed, slide.title) : '');
    const metaTagLabel = isWebPhoto ? '<i class="fa-solid fa-globe"></i> WEB PHOTO' : '<i class="fa-solid fa-sparkles"></i> 4K AI';
    const svgFallback = generateSvgIllustration(slide.title, accentColor, theme.backgroundColor);
    const boxId = `slide-img-box-${index}`;
    const loaderId = `slide-loader-${index}`;
    const safeTitle = escapeHtml(slide.title || '').replace(/'/g, "\\'");
    const safePrompt = escapeHtml(slide.imagePrompt || '').replace(/'/g, "\\'");

    // Universal Top Ribbon
    const topRibbonHTML = '<div class="slide-top-ribbon"></div>';

    // Slide Total Count
    const totalSlides = presentationState && Array.isArray(presentationState.slides) ? presentationState.slides.length : 7;

    // Universal Header with HUD Tag
    const categoryLabel = theme.style || 'AshyqLab Pro';
    const headerHTML = `
        <div class="slide-card-header">
            <div class="slide-hud-tag"><span class="hud-dot"></span> <i class="fa-solid fa-sparkles"></i> ${escapeHtml(categoryLabel)} • СЛАЙД ${index + 1} / ${totalSlides}</div>
            <h2 class="slide-card-title">${escapeHtml(slide.title)}</h2>
            <div class="slide-title-divider"></div>
        </div>
    `;

    // Universal Footer with Pagination Track
    let dotsHTML = '';
    for (let d = 0; d < totalSlides; d++) {
        dotsHTML += `<span class="slide-dot-item ${d === index ? 'active' : ''}"></span>`;
    }
    const footerHTML = `
        <div class="slide-card-footer">
            <span class="slide-footer-brand"><i class="fa-solid fa-bolt"></i> ASHYQLAB AI • TOPIC INTELLIGENCE</span>
            <div class="slide-pagination-dots">${dotsHTML}</div>
        </div>
    `;

    // Universal Image Node
    const imageHTML = hasImage ? `
        <div class="slide-col-image">
            <div class="slide-img-container" id="${boxId}">
                <div class="slide-img-loader" id="${loaderId}">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <span>${isWebPhoto ? 'Загрузка фото...' : 'AI 3D Visual...'}</span>
                </div>
                <img src="${imageUrl}" 
                     class="slide-ai-img" 
                     alt="${escapeHtml(slide.title || 'Slide Image')}" 
                     loading="eager"
                     data-fallback-stage="${isWebPhoto ? 'topic' : 'ai'}"
                     onload="this.style.opacity='1'; const l = document.getElementById('${loaderId}'); if(l) l.style.display='none';" 
                     onerror="handleImageFallback(this, '${safeTitle}', '${svgFallback}', '${safePrompt}'); this.style.opacity='1'; const l = document.getElementById('${loaderId}'); if(l) l.style.display='none';" />
                <div class="slide-img-meta-tag">${metaTagLabel}</div>
            </div>
        </div>
    ` : '';

    // ── ARCHETYPE 1: CINEMA HERO COVER ─────────────────────────────
    if (layout === 'cover') {
        card.innerHTML = `
            ${topRibbonHTML}
            <div class="slide-cover-cinema">
                <div class="slide-cover-hero-tile">
                    <div>
                        <div class="slide-hud-tag">
                            <span class="hud-dot"></span> <i class="fa-solid fa-wand-magic-sparkles"></i> ${escapeHtml(categoryLabel)}
                        </div>
                        <h1 class="slide-card-title" style="margin-top:0.4em;">${escapeHtml(slide.title)}</h1>
                        ${slide.points && slide.points.length > 0 ? `<p class="slide-cover-desc">${escapeHtml(slide.points.join(' • '))}</p>` : `<p class="slide-cover-desc">Интеллектуальная презентация с точными фактами и иллюстрациями</p>`}
                    </div>
                    <div class="slide-cover-footer-tags">
                        <span class="slide-cover-tag"><i class="fa-solid fa-graduation-cap"></i> Образовательный модуль</span>
                        <span class="slide-cover-tag"><i class="fa-solid fa-layer-group"></i> ${totalSlides} Слайдов</span>
                        <span class="slide-cover-tag"><i class="fa-solid fa-bolt"></i> Neural Engine 2026</span>
                    </div>
                </div>
                ${imageHTML}
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE: RADIAL HUB & SPOKE ECOSYSTEM (Kyzylorda Hub / Startups / Systems) ───────
    if (layout === 'hub-ecosystem') {
        const isKazakh = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test(slide.title + ' ' + (slide.points || []).join(' '));
        const centerTitle = slide.centerTitle || (isKazakh ? 'Kyzylorda Hub қызметтері' : 'Ключевые направления');
        const tagline = slide.tagline || (slide.points && slide.points.length > 0 ? slide.points[0] : (isKazakh ? 'Жастардың инновациялық идеяларын қолдап, кәсіпкерлік және цифрлық дағдыларын дамытуға жағдай жасаймыз.' : 'Поддержка инновационных проектов, развитие цифровых навыков и акселерация стартапов.'));

        // Left flank metrics
        const leftMetrics = slide.leftMetrics || (isKazakh ? [
            { icon: 'fa-graduation-cap', val: '145', lbl: 'резидент түлектер' },
            { icon: 'fa-users', val: '1 750', lbl: 'қатысушы жоба' },
            { icon: 'fa-gear', val: '52', lbl: 'жоба саны' }
        ] : [
            { icon: 'fa-graduation-cap', val: '145', lbl: 'выпускников резидентов' },
            { icon: 'fa-users', val: '1 750', lbl: 'участников проектов' },
            { icon: 'fa-gear', val: '52', lbl: 'действующих стартапов' }
        ]);

        // Right flank metrics
        const rightMetrics = slide.rightMetrics || (isKazakh ? [
            { icon: 'fa-people-group', val: '15 500', lbl: 'жастар қамтылды' },
            { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'инвестиция тартылды' }
        ] : [
            { icon: 'fa-people-group', val: '15 500', lbl: 'охват молодежи' },
            { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'инвестиций привлечено' }
        ]);

        // Center orbiting spokes (10 items)
        const defaultSpokes = isKazakh ? [
            { title: 'Инкубациялық бағдарламалар', icon: 'fa-rocket' },
            { title: 'Жобалар фестивальдері', icon: 'fa-trophy' },
            { title: 'Консультациялық қызметтер', icon: 'fa-comments' },
            { title: 'Demo Day', icon: 'fa-chart-pie' },
            { title: 'Инвестициялар', icon: 'fa-seedling' },
            { title: 'Маркетинг қызметтері', icon: 'fa-bullhorn' },
            { title: 'Білім курстары', icon: 'fa-book-open' },
            { title: 'Байқаулар', icon: 'fa-award' },
            { title: 'Хакатондар', icon: 'fa-code' },
            { title: 'Салықтық преференциялар', icon: 'fa-file-invoice' }
        ] : [
            { title: 'Программы инкубации', icon: 'fa-rocket' },
            { title: 'Фестивали проектов', icon: 'fa-trophy' },
            { title: 'Консультации и менторство', icon: 'fa-comments' },
            { title: 'Demo Day & Питчинг', icon: 'fa-chart-pie' },
            { title: 'Привлечение инвестиций', icon: 'fa-seedling' },
            { title: 'Маркетинг и PR', icon: 'fa-bullhorn' },
            { title: 'Образовательные курсы', icon: 'fa-book-open' },
            { title: 'Конкурсы и гранты', icon: 'fa-award' },
            { title: 'Хакатоны и хабы', icon: 'fa-code' },
            { title: 'Налоговые преференции', icon: 'fa-file-invoice' }
        ];

        const spokes = slide.spokes && slide.spokes.length ? slide.spokes : defaultSpokes;

        const spokesHTML = spokes.map((spoke, i) => {
            const angle = (i / spokes.length) * 2 * Math.PI - (Math.PI / 2);
            const rx = 38;
            const ry = 36;
            const x = 50 + rx * Math.cos(angle);
            const y = 50 + ry * Math.sin(angle);
            return `
                <div class="hub-spoke-node" style="left:${x.toFixed(1)}%;top:${y.toFixed(1)}%;">
                    <div class="hub-spoke-icon"><i class="fa-solid ${spoke.icon || 'fa-star'}"></i></div>
                    <div class="hub-spoke-label">${escapeHtml(spoke.title)}</div>
                </div>
            `;
        }).join('');

        const galleryPhotos = [
            'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&auto=format&fit=crop&q=80'
        ];

        card.innerHTML = `
            ${topRibbonHTML}
            <div class="slide-hub-header">
                <h1 class="slide-hub-main-title">${escapeHtml(slide.title)}</h1>
                <p class="slide-hub-tagline">${escapeHtml(tagline)}</p>
            </div>
            <div class="slide-hub-stage">
                <!-- Left Flank Metrics -->
                <div class="slide-hub-flank left">
                    ${leftMetrics.map(m => `
                        <div class="hub-metric-badge">
                            <div class="hub-metric-icon"><i class="fa-solid ${m.icon}"></i></div>
                            <div class="hub-metric-info">
                                <div class="hub-metric-val">${escapeHtml(m.val)}</div>
                                <div class="hub-metric-lbl">${escapeHtml(m.lbl)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Center Spoke Wheel -->
                <div class="slide-hub-center-wheel">
                    <svg class="hub-svg-connectors" viewBox="0 0 500 300" preserveAspectRatio="none">
                        <circle cx="250" cy="150" r="105" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="4 4" opacity="0.4"/>
                        <path d="M 40 50 C 90 50, 160 130, 250 150" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"/>
                        <path d="M 40 150 C 120 150, 180 150, 250 150" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"/>
                        <path d="M 40 250 C 90 250, 160 170, 250 150" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"/>
                        <path d="M 460 70 C 400 70, 340 130, 250 150" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"/>
                        <path d="M 460 230 C 400 230, 340 170, 250 150" fill="none" stroke="#f59e0b" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.45"/>
                    </svg>

                    <div class="hub-center-core">
                        <div class="hub-core-title">${escapeHtml(centerTitle)}</div>
                    </div>
                    <div class="hub-spokes-orbital">
                        ${spokesHTML}
                    </div>
                </div>

                <!-- Right Flank Metrics -->
                <div class="slide-hub-flank right">
                    ${rightMetrics.map(m => `
                        <div class="hub-metric-badge">
                            <div class="hub-metric-icon"><i class="fa-solid ${m.icon}"></i></div>
                            <div class="hub-metric-info">
                                <div class="hub-metric-val">${escapeHtml(m.val)}</div>
                                <div class="hub-metric-lbl">${escapeHtml(m.lbl)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Bottom Photo Ribbon -->
            <div class="slide-hub-gallery-ribbon">
                ${galleryPhotos.map((src, i) => `
                    <div class="hub-gallery-photo-card">
                        <img src="${src}" alt="Hub Activity ${i+1}" loading="lazy"/>
                    </div>
                `).join('')}
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE: KPI DASHBOARD GRID (.layout-kpi-grid) ────────────────────
    if (layout === 'kpi-grid') {
        const isKazakh = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test(slide.title + ' ' + (slide.points || []).join(' '));
        const defaultKpis = isKazakh ? [
            { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'Тартылған инвестициялар мен гранттар', delta: '+48%' },
            { icon: 'fa-people-group', val: '15 500+', lbl: 'Іс-шаралармен қамтылған жастар', delta: '+35%' },
            { icon: 'fa-graduation-cap', val: '145', lbl: 'Инкубациялық бағдарлама түлектері', delta: '+28%' },
            { icon: 'fa-code', val: '1 750', lbl: 'Хакатондар мен байқаулар қатысушылары', delta: '+62%' },
            { icon: 'fa-gear', val: '52', lbl: 'Жүзеге асқан цифрлық стартап жобалар', delta: '+19%' },
            { icon: 'fa-trophy', val: '98.4%', lbl: 'Резиденттердің жобалық тиімділігі', delta: '+4.2%' }
        ] : [
            { icon: 'fa-chart-line', val: '111 500 000 ₸', lbl: 'Привлеченные инвестиции и гранты', delta: '+48%' },
            { icon: 'fa-people-group', val: '15 500+', lbl: 'Охват молодежи в мероприятиях', delta: '+35%' },
            { icon: 'fa-graduation-cap', val: '145', lbl: 'Выпускников инкубационных программ', delta: '+28%' },
            { icon: 'fa-code', val: '1 750', lbl: 'Участников хакатонов и батлов', delta: '+62%' },
            { icon: 'fa-gear', val: '52', lbl: 'Действующих технологических стартапов', delta: '+19%' },
            { icon: 'fa-trophy', val: '98.4%', lbl: 'Индекс удовлетворенности резидентов', delta: '+4.2%' }
        ];

        const kpis = slide.kpis && slide.kpis.length ? slide.kpis : defaultKpis;

        card.innerHTML = `
            ${topRibbonHTML}
            ${headerHTML}
            <div class="slide-card-body">
                <div class="kpi-dashboard-row">
                    ${kpis.map(k => `
                        <div class="kpi-metric-tile">
                            <div class="kpi-tile-top">
                                <div class="kpi-tile-icon"><i class="fa-solid ${k.icon}"></i></div>
                                <span class="kpi-tile-delta">${escapeHtml(k.delta || '★ Top')}</span>
                            </div>
                            <div>
                                <div class="kpi-tile-value">${escapeHtml(k.val)}</div>
                                <div class="kpi-tile-desc">${escapeHtml(k.lbl)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE 2: STAT & METRIC HIGHLIGHT ───────────────────────
    if (layout === 'stat') {
        let statNum = '100%';
        let statLabel = 'Ключевой показатель темы';
        const numMatch = (slide.title + ' ' + (slide.points || []).join(' ')).match(/(\d+[\d.,]*%?|\b[E]=mc²\b|\b[F]=m[·*]a\b|\b[I]=U\/R\b|\b3\.0\s*×\s*10⁸\b|\b9\.8\b|\b№\s*\d+\b|\b\d+\s*октав[а-я]*\b|\b\d+\s*млн\b|\b\d+\s*₸\b)/i);
        if (slide.statVal) {
            statNum = slide.statVal;
        } else if (numMatch) {
            statNum = numMatch[1];
        } else {
            const combinedText = (slide.title + ' ' + (slide.points || []).join(' ')).toLowerCase();
            if (/октав|вокал|диапазон|ән|певец|музык|голос/i.test(combinedText)) {
                statNum = '6 октава';
            } else if (/инвест|тенге|₸|\$|валют|грант/i.test(combinedText)) {
                statNum = '111.5M ₸';
            } else if (/процент|үлес|өсім|рост/i.test(combinedText)) {
                statNum = '98.5%';
            } else if (/жылдамдық|жылдам|скорость/i.test(combinedText)) {
                statNum = '300 000 км/с';
            } else {
                statNum = '★ Топ';
            }
        }
        statLabel = slide.points && slide.points.length > 0 ? slide.points[0] : 'Фундаментальная закономерность';
        const restPoints = slide.points && slide.points.length > 1 ? slide.points.slice(1) : (slide.points || []);

        card.innerHTML = `
            ${topRibbonHTML}
            ${headerHTML}
            <div class="slide-card-body">
                <div class="slide-stat-hero-card">
                    <div class="slide-stat-badge"><i class="fa-solid fa-chart-line"></i> Главная метрика / Факт</div>
                    <div class="slide-stat-number-box">
                        <div class="slide-stat-number">${escapeHtml(statNum)}</div>
                        <div class="slide-stat-label">${escapeHtml(statLabel)}</div>
                    </div>
                    ${restPoints.length > 0 ? `
                        <ul class="slide-stat-bullets">
                            ${restPoints.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
                ${imageHTML}
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE 3: STEP-BY-STEP PROCESS ──────────────────────────
    if (layout === 'steps') {
        const points = slide.points && slide.points.length > 0 ? slide.points : ['Анализ и постановка задачи', 'Экспериментальная проверка', 'Выводы и закономерности'];
        const stepPhases = ['Фаза 1: Анализ', 'Фаза 2: Синтез', 'Фаза 3: Верификация'];
        const stepCardsHTML = points.slice(0, 3).map((p, i) => {
            const parts = p.split(/[:—–-]\s*/);
            const stepTitle = parts.length > 1 ? parts[0] : (stepPhases[i] || `Этап ${i + 1}`);
            const stepDesc = parts.length > 1 ? parts.slice(1).join(' — ') : p;
            return `
                <div class="slide-step-card">
                    <div class="slide-step-num-pill">0${i + 1}</div>
                    <div class="slide-step-title">${escapeHtml(stepTitle)}</div>
                    <div class="slide-step-desc">${escapeHtml(stepDesc)}</div>
                </div>
            `;
        }).join('');

        card.innerHTML = `
            ${topRibbonHTML}
            ${headerHTML}
            <div class="slide-card-body">
                <div class="slide-steps-row">
                    ${stepCardsHTML}
                </div>
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE 4: SIDE-BY-SIDE COMPARISON ───────────────────────
    if (layout === 'compare') {
        const points = slide.points || [];
        const mid = Math.ceil(points.length / 2);
        const leftPoints = points.slice(0, mid);
        const rightPoints = points.slice(mid);

        card.innerHTML = `
            ${topRibbonHTML}
            ${headerHTML}
            <div class="slide-card-body">
                <div class="slide-compare-col">
                    <div class="slide-compare-header">
                        <span class="slide-compare-badge left">📌 Сторона А / Тезис</span>
                    </div>
                    <ul class="slide-compare-list">
                        ${leftPoints.map(p => `<li><i class="fa-solid fa-circle-check"></i> <span>${escapeHtml(p)}</span></li>`).join('')}
                    </ul>
                </div>
                <div class="slide-compare-vs-badge">VS</div>
                <div class="slide-compare-col">
                    <div class="slide-compare-header">
                        <span class="slide-compare-badge right">⚡ Сторона Б / Вывод</span>
                    </div>
                    <ul class="slide-compare-list">
                        ${(rightPoints.length ? rightPoints : leftPoints).map(p => `<li><i class="fa-solid fa-bolt" style="color:#a855f7;"></i> <span>${escapeHtml(p)}</span></li>`).join('')}
                    </ul>
                </div>
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE 5: CARDS GRID / BENTO ────────────────────────────
    if (layout === 'cards-grid') {
        const icons = ['fa-atom', 'fa-dna', 'fa-bolt', 'fa-microchip', 'fa-chart-pie', 'fa-star'];
        const miniTilesHTML = (slide.points || []).map((p, i) => `
            <div class="slide-grid-mini-tile">
                <div class="slide-mini-icon-box">
                    <i class="fa-solid ${icons[i % icons.length]}"></i>
                </div>
                <div class="slide-mini-tile-content">${escapeHtml(p)}</div>
            </div>
        `).join('');

        card.innerHTML = `
            ${topRibbonHTML}
            ${headerHTML}
            <div class="slide-card-body">
                <div class="slide-cards-grid-row">
                    <div class="slide-grid-col-cards">
                        ${miniTilesHTML}
                    </div>
                    ${imageHTML}
                </div>
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE 6: INSIGHT & FOCUS QUOTE ─────────────────────────
    if (layout === 'insight') {
        const quoteText = slide.points && slide.points.length > 0 ? slide.points[0] : slide.title;
        const subPoints = slide.points && slide.points.length > 1 ? slide.points.slice(1) : [];

        card.innerHTML = `
            ${topRibbonHTML}
            ${headerHTML}
            <div class="slide-card-body">
                <div class="slide-insight-hero-tile">
                    <div>
                        <div class="slide-hud-tag"><i class="fa-solid fa-lightbulb"></i> Главный вывод / Инсайт</div>
                        <div class="slide-insight-quote-icon" style="margin-top:0.3em;">“</div>
                        <div class="slide-insight-quote-text">${escapeHtml(quoteText)}</div>
                    </div>
                    ${subPoints.length > 0 ? `
                        <ul class="slide-insight-points">
                            ${subPoints.map(p => `<li>${escapeHtml(p)}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
                ${imageHTML}
            </div>
            ${footerHTML}
        `;
        return;
    }

    // ── ARCHETYPE 7: SPLIT LEFT / SPLIT RIGHT ──────────────────────
    const pointsListHTML = `
        <ul class="slide-points-ul">
            ${(slide.points || []).map((p, pIdx) => `<li><span class="point-num">${pIdx + 1}</span> <span>${escapeHtml(p)}</span></li>`).join('')}
        </ul>
    `;

    card.innerHTML = `
        ${topRibbonHTML}
        ${headerHTML}
        <div class="slide-card-body">
            <div class="slide-split-points-card">
                ${pointsListHTML}
            </div>
            ${imageHTML}
        </div>
        ${footerHTML}
    `;
}


/* ──────────────────────────────────────────────
   FULLSCREEN PRESENTER MODE RENDERING
─────────────────────────────────────────────── */
function renderPresenterSlide() {
    const card = document.getElementById('presenter-slide-card');
    const counter = document.getElementById('presenter-counter');
    const fill = document.getElementById('presenter-progress-fill');
    const notesContent = document.getElementById('presenter-notes-content');
    const total = presentationState.slides.length;
    const current = presentationState.currentSlideIndex;

    if (!card) return;
    const slide = getCurrentSlide();
    buildSlideCardHTML(card, slide, current, presentationState.theme);

    if (counter) counter.textContent = `Слайд ${current + 1} из ${total}`;
    if (fill) fill.style.width = `${((current + 1) / total) * 100}%`;
    if (notesContent && slide) {
        notesContent.textContent = slide.speakerNotes || (slide.points && slide.points.length ? `Ключевые тезисы для озвучивания: ${slide.points.join('; ')}` : 'Расскажите об основных аспектах темы этого слайда.');
    }
}


/* ──────────────────────────────────────────────
   FULL MULTI-PAGE PDF EXPORT (ALL SLIDES!)
─────────────────────────────────────────────── */
async function downloadPDF() {
    if (!presentationState.slides.length) {
        showToast('Презентация пуста', 'error');
        return;
    }
    showToast('Подготовка многостраничного PDF (все слайды)...', 'info');

    // Create off-screen container for rendering ALL slides sequentially
    const exportContainer = document.createElement('div');
    exportContainer.style.position = 'fixed';
    exportContainer.style.left = '-9999px';
    exportContainer.style.top = '0';
    exportContainer.style.width = '960px';

    const { theme, slides } = presentationState;

    slides.forEach((slide, idx) => {
        const pageDiv = document.createElement('div');
        pageDiv.style.width = '960px';
        pageDiv.style.height = '540px';
        pageDiv.style.position = 'relative';
        pageDiv.style.overflow = 'hidden';
        pageDiv.style.pageBreakAfter = 'always'; // FORCE PAGE BREAK IN PDF

        buildSlideCardHTML(pageDiv, slide, idx, theme);
        exportContainer.appendChild(pageDiv);
    });

    document.body.appendChild(exportContainer);

    const opt = {
        margin: 0,
        filename: `${presentationState.title || 'Презентация'}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: { scale: 1.5, useCORS: true, logging: false },
        jsPDF: { unit: 'px', format: [960, 540], orientation: 'landscape' }
    };

    try {
        await html2pdf().set(opt).from(exportContainer).save();
        showToast(`PDF с ${slides.length} слайдами скачан!`, 'success');
    } catch (e) {
        console.error('[PDF Error]', e);
        showToast('Ошибка при экспорте PDF: ' + e.message, 'error');
    } finally {
        document.body.removeChild(exportContainer);
    }
}


/* ──────────────────────────────────────────────
   FULL MULTI-PAGE PPTX EXPORT (ALL SLIDES + CORS)
─────────────────────────────────────────────── */
async function generatePPTX(presentation, btn) {
    if (!presentation || !Array.isArray(presentation.slides) || presentation.slides.length === 0) {
        showToast('Презентация пуста', 'error');
        return;
    }
    if (typeof PptxGenJS === 'undefined') {
        showToast('Библиотека PptxGenJS не загружена', 'error');
        return;
    }

    btn.disabled = true;
    showToast('Генерация картинок и сборка PPTX (все слайды)...', 'info');

    try {
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        pptx.title  = presentation.title;

        const theme = presentation.theme || {};
        const bgHex     = (theme.backgroundColor  || '#F8FAFC').replace('#', '');
        const textHex   = '475569';
        const titleHex  = '0F172A';
        const accentHex = (theme.accentColor      || '#3B82F6').replace('#', '');

        const totalSlides = presentation.slides.length;

        for (let i = 0; i < totalSlides; i++) {
            const slideData = presentation.slides[i];
            const slide = pptx.addSlide();
            slide.background = { color: bgHex };

            if (slideData.speakerNotes) {
                slide.addNotes(slideData.speakerNotes);
            }

            const layout = getSlideLayoutType(slideData, i);

            // Top Decorative Blue Accent Line (NotebookLM Style)
            slide.addShape(pptx.ShapeType.rect, {
                x: 0, y: 0, w: '100%', h: 0.1, fill: { color: accentHex }
            });

            // Cover slide (Index 0)
            if (layout === 'cover') {
                const coverHasImage = Boolean(slideData.imageUrl || slideData.imagePrompt);
                let coverImgBase64 = null;
                if (coverHasImage) {
                    const imageUrl = slideData.imageUrl || buildPollinationsUrl(slideData.imagePrompt, slideData.seed, slideData.title);
                    showToast(`Загрузка обложки слайда 1/${totalSlides}...`, 'info');
                    coverImgBase64 = await fetchImageAsBase64(imageUrl, slideData.title, theme);
                }

                if (coverImgBase64) {
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 0.8, y: 1.15, w: 4.6, h: 3.9,
                        fill: { color: 'FFFFFF' },
                        line: { color: 'E2E8F0', width: 1 },
                        rectRadius: 0.15
                    });
                    slide.addText(slideData.title || '', {
                        x: 1.0, y: 1.5, w: 4.2, h: 2.0,
                        fontSize: 28, bold: true, color: titleHex,
                        align: 'left', valign: 'middle', fontFace: 'Arial'
                    });
                    if (slideData.points && slideData.points.length > 0) {
                        slide.addText(slideData.points.join(' • '), {
                            x: 1.0, y: 3.6, w: 4.2, h: 1.0,
                            fontSize: 14, color: textHex,
                            align: 'left', valign: 'top', fontFace: 'Arial'
                        });
                    }
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 5.6, y: 1.15, w: 3.8, h: 3.9,
                        fill: { color: 'FFFFFF' },
                        line: { color: 'E2E8F0', width: 1 },
                        rectRadius: 0.15
                    });
                    slide.addImage({ data: coverImgBase64, x: 5.7, y: 1.25, w: 3.6, h: 3.7 });
                } else {
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 1.0, y: 1.2, w: 8.0, h: 3.3,
                        fill: { color: 'FFFFFF' },
                        line: { color: 'E2E8F0', width: 1 },
                        rectRadius: 0.15
                    });
                    slide.addText(slideData.title || '', {
                        x: 1.2, y: 1.6, w: 7.6, h: 1.5,
                        fontSize: 34, bold: true, color: titleHex,
                        align: 'center', valign: 'middle', fontFace: 'Arial'
                    });
                    if (slideData.points && slideData.points.length > 0) {
                        slide.addText(slideData.points.join(' • '), {
                            x: 1.2, y: 3.2, w: 7.6, h: 0.8,
                            fontSize: 15, color: textHex,
                            align: 'center', valign: 'top', fontFace: 'Arial'
                        });
                    }
                }
                continue;
            }

            // Regular Slide Header
            slide.addText(slideData.title || '', {
                x: 0.6, y: 0.35, w: 8.8, h: 0.6,
                fontSize: 24, bold: true, color: titleHex,
                align: 'left', valign: 'middle', fontFace: 'Arial'
            });

            // Decorative Title Accent Bar
            slide.addShape(pptx.ShapeType.rect, {
                x: 0.6, y: 0.95, w: 0.8, h: 0.04, fill: { color: accentHex }
            });

            const points = slideData.points || [];
            const hasImage = Boolean(slideData.imageUrl || (slideData.imagePrompt && slideData.imagePrompt.trim()));

            let imageBase64 = null;
            if (hasImage) {
                const imageUrl = slideData.imageUrl || buildPollinationsUrl(slideData.imagePrompt, slideData.seed, slideData.title);
                showToast(`Загрузка картинки слайда ${i + 1}/${totalSlides}...`, 'info');
                imageBase64 = await fetchImageAsBase64(imageUrl, slideData.title, theme);
            }

            if (layout === 'hub-ecosystem') {
                // Kyzylorda Hub Style Radial Ecosystem Slide with Left/Right KPI cards & Bottom Strip
                const leftMetrics = slideData.leftMetrics || [
                    { val: '145', lbl: 'резидент түлектер' },
                    { val: '1 750', lbl: 'қатысушы жоба' },
                    { val: '52', lbl: 'жоба саны' }
                ];
                for (let k = 0; k < leftMetrics.length; k++) {
                    const cardY = 1.15 + k * 0.85;
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 0.5, y: cardY, w: 2.1, h: 0.72,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.1
                    });
                    slide.addText(leftMetrics[k].val, {
                        x: 0.6, y: cardY + 0.05, w: 1.9, h: 0.35,
                        fontSize: 16, bold: true, color: accentHex, fontFace: 'Arial'
                    });
                    slide.addText(leftMetrics[k].lbl, {
                        x: 0.6, y: cardY + 0.38, w: 1.9, h: 0.28,
                        fontSize: 9, color: textHex, fontFace: 'Arial'
                    });
                }

                const rightMetrics = slideData.rightMetrics || [
                    { val: '15 500', lbl: 'жастар қамтылды' },
                    { val: '111 500 000 ₸', lbl: 'инвестиция тартылды' }
                ];
                for (let k = 0; k < rightMetrics.length; k++) {
                    const cardY = 1.25 + k * 1.0;
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 7.0, y: cardY, w: 2.4, h: 0.85,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.1
                    });
                    slide.addText(rightMetrics[k].val, {
                        x: 7.1, y: cardY + 0.08, w: 2.2, h: 0.38,
                        fontSize: 15, bold: true, color: accentHex, fontFace: 'Arial'
                    });
                    slide.addText(rightMetrics[k].lbl, {
                        x: 7.1, y: cardY + 0.46, w: 2.2, h: 0.32,
                        fontSize: 9, color: textHex, fontFace: 'Arial'
                    });
                }

                // Central Hub Circle
                slide.addShape(pptx.ShapeType.ellipse, {
                    x: 3.8, y: 1.35, w: 2.0, h: 2.0,
                    fill: { color: 'FFF7ED' }, line: { color: accentHex, width: 2 }
                });
                const centerName = slideData.centerTitle || slideData.title || 'Kyzylorda Hub қызметтері';
                slide.addText(centerName, {
                    x: 3.9, y: 1.85, w: 1.8, h: 1.0,
                    fontSize: 13, bold: true, color: 'EA580C', align: 'center', fontFace: 'Arial'
                });

                // Surrounding Spoke Badges
                const spokes = slideData.spokes || [
                    { title: 'Инкубациялық бағдарламалар' },
                    { title: 'Жобалар фестивальдері' },
                    { title: 'Консультациялық қызметтер' },
                    { title: 'Demo Day' },
                    { title: 'Инвестициялар' },
                    { title: 'Маркетинг қызметтері' },
                    { title: 'Білім курстары' },
                    { title: 'Хакатондар' }
                ];
                const spokePositions = [
                    { x: 2.8, y: 1.0 },
                    { x: 4.8, y: 1.0 },
                    { x: 5.9, y: 1.7 },
                    { x: 5.9, y: 2.6 },
                    { x: 4.8, y: 3.3 },
                    { x: 2.8, y: 3.3 },
                    { x: 1.8, y: 2.6 },
                    { x: 1.8, y: 1.7 }
                ];
                for (let s = 0; s < Math.min(spokes.length, spokePositions.length); s++) {
                    const pos = spokePositions[s];
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: pos.x, y: pos.y, w: 1.8, h: 0.45,
                        fill: { color: 'FFFFFF' }, line: { color: 'CBD5E1', width: 1 }, rectRadius: 0.2
                    });
                    slide.addText(spokes[s].title || '', {
                        x: pos.x + 0.05, y: pos.y + 0.05, w: 1.7, h: 0.35,
                        fontSize: 8.5, bold: true, color: titleHex, align: 'center', valign: 'middle', fontFace: 'Arial'
                    });
                }

                // Bottom Photo Strip
                slide.addShape(pptx.ShapeType.roundRect, {
                    x: 0.5, y: 3.85, w: 8.9, h: 1.25,
                    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.1
                });
                if (slideData.tagline) {
                    slide.addText(slideData.tagline, {
                        x: 0.7, y: 3.95, w: 8.5, h: 0.35,
                        fontSize: 9.5, italic: true, color: '64748B', align: 'center', fontFace: 'Arial'
                    });
                }
                const bottomLabels = ['Инкубация', 'Хакатоны', 'Demo Day', 'Meetup & Networking', 'Воркшопы', 'Инвесторлармен кездесу'];
                for (let b = 0; b < 6; b++) {
                    const bX = 0.7 + b * 1.42;
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: bX, y: 4.35, w: 1.3, h: 0.65,
                        fill: { color: 'F8FAFC' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.08
                    });
                    slide.addText(bottomLabels[b], {
                        x: bX + 0.05, y: 4.45, w: 1.2, h: 0.45,
                        fontSize: 8, bold: true, color: '334155', align: 'center', valign: 'middle', fontFace: 'Arial'
                    });
                }

            } else if (layout === 'kpi-grid') {
                // 3x2 KPI Metric Cards Grid
                const kpis = slideData.kpis || [
                    { val: '111 500 000 ₸', lbl: 'Тартылған инвестициялар', delta: '+48%' },
                    { val: '15 500+', lbl: 'Қамтылған жастар', delta: '+35%' },
                    { val: '145', lbl: 'Инкубация түлектері', delta: '+28%' },
                    { val: '1 750', lbl: 'Хакатон қатысушылары', delta: '+62%' },
                    { val: '52', lbl: 'Іске асқан стартаптар', delta: '+19%' },
                    { val: '98.4%', lbl: 'Жобалық тиімділік', delta: '+4.2%' }
                ];
                const cardW = 2.8;
                const cardH = 1.8;
                for (let k = 0; k < Math.min(kpis.length, 6); k++) {
                    const col = k % 3;
                    const row = Math.floor(k / 3);
                    const kX = 0.6 + col * 3.05;
                    const kY = 1.15 + row * 2.0;

                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: kX, y: kY, w: cardW, h: cardH,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });
                    if (kpis[k].delta) {
                        slide.addShape(pptx.ShapeType.roundRect, {
                            x: kX + cardW - 0.95, y: kY + 0.15, w: 0.8, h: 0.3,
                            fill: { color: 'DCFCE7' }, line: { color: '86EFAC', width: 0.5 }, rectRadius: 0.08
                        });
                        slide.addText(kpis[k].delta, {
                            x: kX + cardW - 0.95, y: kY + 0.15, w: 0.8, h: 0.3,
                            fontSize: 9, bold: true, color: '166534', align: 'center', valign: 'middle', fontFace: 'Arial'
                        });
                    }
                    slide.addText(kpis[k].val || '', {
                        x: kX + 0.2, y: kY + 0.45, w: cardW - 0.4, h: 0.55,
                        fontSize: 20, bold: true, color: accentHex, fontFace: 'Arial'
                    });
                    slide.addText(kpis[k].lbl || '', {
                        x: kX + 0.2, y: kY + 1.05, w: cardW - 0.4, h: 0.6,
                        fontSize: 11, bold: true, color: titleHex, fontFace: 'Arial', valign: 'top'
                    });
                }

            } else if (layout === 'stat') {
                // Large Stat & Formula Callout
                const textW = imageBase64 ? 4.8 : 8.8;
                slide.addShape(pptx.ShapeType.roundRect, {
                    x: 0.6, y: 1.15, w: textW, h: 3.9,
                    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                });

                let statNum = '100%';
                let statLabel = slideData.points && slideData.points.length > 0 ? slideData.points[0] : 'Ключевой показатель';
                const numMatch = (slideData.title + ' ' + (slideData.points || []).join(' ')).match(/(\d+[\d.,]*%?|\b[E]=mc²\b|\b[F]=m[·*]a\b|\b[I]=U\/R\b|\b3\.0\s*×\s*10⁸\b|\b9\.8\b|\b№\s*\d+\b)/i);
                if (numMatch) statNum = numMatch[1];

                slide.addText(statNum, {
                    x: 0.8, y: 1.35, w: textW - 0.4, h: 1.1,
                    fontSize: 38, bold: true, color: accentHex, fontFace: 'Arial'
                });
                slide.addText(statLabel, {
                    x: 0.8, y: 2.5, w: textW - 0.4, h: 0.7,
                    fontSize: 16, bold: true, color: titleHex, fontFace: 'Arial'
                });

                const restPoints = slideData.points && slideData.points.length > 1 ? slideData.points.slice(1) : [];
                if (restPoints.length > 0) {
                    const bulletItems = restPoints.map(p => ({
                        text: p,
                        options: { fontSize: 13, color: textHex, bullet: { code: '2713', color: accentHex }, paraSpaceBefore: 6 }
                    }));
                    slide.addText(bulletItems, { x: 0.8, y: 3.3, w: textW - 0.4, h: 1.6, fontFace: 'Arial', valign: 'top' });
                }

                if (imageBase64) {
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 5.6, y: 1.15, w: 3.8, h: 3.9,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });
                    slide.addImage({ data: imageBase64, x: 5.7, y: 1.25, w: 3.6, h: 3.7 });
                }
            } else if (layout === 'steps') {
                // 3 Horizontal Step Process Cards
                const stepCount = Math.min(points.length, 3);
                const stepW = (8.8 - (0.25 * (stepCount - 1))) / Math.max(stepCount, 1);

                for (let k = 0; k < stepCount; k++) {
                    const cardX = 0.6 + k * (stepW + 0.25);
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: cardX, y: 1.15, w: stepW, h: 3.9,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });

                    slide.addText(`0${k + 1}`, {
                        x: cardX + 0.2, y: 1.35, w: 0.6, h: 0.5,
                        fontSize: 18, bold: true, color: accentHex, fontFace: 'Arial'
                    });

                    const p = points[k] || '';
                    const parts = p.split(/[:—–-]\s*/);
                    const stepTitle = parts.length > 1 ? parts[0] : `Этап ${k + 1}`;
                    const stepDesc = parts.length > 1 ? parts.slice(1).join(' — ') : p;

                    slide.addText(stepTitle, {
                        x: cardX + 0.2, y: 2.0, w: stepW - 0.4, h: 0.6,
                        fontSize: 14, bold: true, color: titleHex, fontFace: 'Arial'
                    });
                    slide.addText(stepDesc, {
                        x: cardX + 0.2, y: 2.7, w: stepW - 0.4, h: 2.1,
                        fontSize: 12, color: textHex, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.2
                    });
                }
            } else if (layout === 'compare') {
                // 2 Balanced Comparative Columns
                const colW = 4.25;
                const mid = Math.ceil(points.length / 2);
                const leftPoints = points.slice(0, mid);
                const rightPoints = points.slice(mid);

                // Left Column
                slide.addShape(pptx.ShapeType.roundRect, {
                    x: 0.6, y: 1.15, w: colW, h: 3.9,
                    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                });
                slide.addText('📌 Сторона А / Тезис', {
                    x: 0.8, y: 1.35, w: colW - 0.4, h: 0.4,
                    fontSize: 13, bold: true, color: accentHex, fontFace: 'Arial'
                });
                if (leftPoints.length > 0) {
                    const bulletItems = leftPoints.map(p => ({
                        text: p,
                        options: { fontSize: 13, color: textHex, bullet: { code: '2713', color: accentHex }, paraSpaceBefore: 6 }
                    }));
                    slide.addText(bulletItems, { x: 0.8, y: 1.85, w: colW - 0.4, h: 3.0, fontFace: 'Arial', valign: 'top' });
                }

                // Right Column
                slide.addShape(pptx.ShapeType.roundRect, {
                    x: 5.15, y: 1.15, w: colW, h: 3.9,
                    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                });
                slide.addText('⚡ Сторона Б / Вывод', {
                    x: 5.35, y: 1.35, w: colW - 0.4, h: 0.4,
                    fontSize: 13, bold: true, color: '8B5CF6', fontFace: 'Arial'
                });
                const rPoints = rightPoints.length ? rightPoints : leftPoints;
                if (rPoints.length > 0) {
                    const bulletItems = rPoints.map(p => ({
                        text: p,
                        options: { fontSize: 13, color: textHex, bullet: { code: '2713', color: '8B5CF6' }, paraSpaceBefore: 6 }
                    }));
                    slide.addText(bulletItems, { x: 5.35, y: 1.85, w: colW - 0.4, h: 3.0, fontFace: 'Arial', valign: 'top' });
                }
            } else if (layout === 'insight') {
                // Focus Insight Hero
                const textW = imageBase64 ? 4.8 : 8.8;
                slide.addShape(pptx.ShapeType.roundRect, {
                    x: 0.6, y: 1.15, w: textW, h: 3.9,
                    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                });

                const quoteText = points.length > 0 ? points[0] : slideData.title;
                slide.addText(`“ ${quoteText} ”`, {
                    x: 0.8, y: 1.4, w: textW - 0.4, h: 1.5,
                    fontSize: 17, bold: true, color: titleHex, fontFace: 'Arial', italic: true
                });

                const subPoints = points.length > 1 ? points.slice(1) : [];
                if (subPoints.length > 0) {
                    const bulletItems = subPoints.map(p => ({
                        text: p,
                        options: { fontSize: 13, color: textHex, bullet: { code: '2713', color: accentHex }, paraSpaceBefore: 6 }
                    }));
                    slide.addText(bulletItems, { x: 0.8, y: 3.0, w: textW - 0.4, h: 1.8, fontFace: 'Arial', valign: 'top' });
                }

                if (imageBase64) {
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 5.6, y: 1.15, w: 3.8, h: 3.9,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });
                    slide.addImage({ data: imageBase64, x: 5.7, y: 1.25, w: 3.6, h: 3.7 });
                }
            } else if (layout === 'split-right') {
                // Image Left (0.6 -> 4.4), Text Right (4.6 -> 9.4)
                if (imageBase64) {
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 0.6, y: 1.15, w: 3.8, h: 3.9,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });
                    slide.addImage({ data: imageBase64, x: 0.7, y: 1.25, w: 3.6, h: 3.7 });
                }

                const textX = imageBase64 ? 4.6 : 0.6;
                const textW = imageBase64 ? 4.8 : 8.8;

                slide.addShape(pptx.ShapeType.roundRect, {
                    x: textX, y: 1.15, w: textW, h: 3.9,
                    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                });

                if (points.length > 0) {
                    const bulletItems = points.map(p => ({
                        text: p,
                        options: { fontSize: 15, color: textHex, bullet: { code: '2713', color: accentHex }, paraSpaceBefore: 8 }
                    }));
                    slide.addText(bulletItems, { x: textX + 0.2, y: 1.35, w: textW - 0.4, h: 3.5, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.2 });
                }
            } else if (layout === 'cards-grid') {
                const maxTextWidth = imageBase64 ? 4.8 : 8.8;
                const pointCount = Math.min(points.length, 3);
                const cardWidth = pointCount > 0 ? (maxTextWidth - (0.2 * (pointCount - 1))) / pointCount : maxTextWidth;

                for (let k = 0; k < pointCount; k++) {
                    const cardX = 0.6 + k * (cardWidth + 0.2);
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: cardX, y: 1.15, w: cardWidth, h: 3.9,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });

                    slide.addText(`${k + 1}`, {
                        x: cardX + 0.15, y: 1.3, w: 0.4, h: 0.4,
                        fontSize: 14, bold: true, color: accentHex, align: 'center', fontFace: 'Arial'
                    });

                    slide.addText(points[k], {
                        x: cardX + 0.15, y: 1.8, w: cardWidth - 0.3, h: 3.0,
                        fontSize: 13, color: textHex, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.2
                    });
                }

                if (imageBase64) {
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 5.6, y: 1.15, w: 3.8, h: 3.9,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });
                    slide.addImage({ data: imageBase64, x: 5.7, y: 1.25, w: 3.6, h: 3.7 });
                }
            } else {
                // Default split-left
                const textW = imageBase64 ? 4.8 : 8.8;

                slide.addShape(pptx.ShapeType.roundRect, {
                    x: 0.6, y: 1.15, w: textW, h: 3.9,
                    fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                });

                if (points.length > 0) {
                    const bulletItems = points.map(p => ({
                        text: p,
                        options: { fontSize: 15, color: textHex, bullet: { code: '2713', color: accentHex }, paraSpaceBefore: 8 }
                    }));
                    slide.addText(bulletItems, { x: 0.8, y: 1.35, w: textW - 0.4, h: 3.5, fontFace: 'Arial', valign: 'top', lineSpacingMultiple: 1.2 });
                }

                if (imageBase64) {
                    slide.addShape(pptx.ShapeType.roundRect, {
                        x: 5.6, y: 1.15, w: 3.8, h: 3.9,
                        fill: { color: 'FFFFFF' }, line: { color: 'E2E8F0', width: 1 }, rectRadius: 0.15
                    });
                    slide.addImage({ data: imageBase64, x: 5.7, y: 1.25, w: 3.6, h: 3.7 });
                }
            }

            if (slideData.imagePrompt) slide.addNotes(`AI Image Prompt: ${slideData.imagePrompt}`);
            slide.addText(`${i + 1} / ${totalSlides}`, {
                x: 8.5, y: 5.15, w: 1.0, h: 0.3,
                fontSize: 10, color: '94A3B8', align: 'right'
            });
        }

        const safeFileName = (presentation.title || 'Презентация').replace(/[\\/:*?"<>|]/g, '').trim() || 'Урок';
        await pptx.writeFile({ fileName: `${safeFileName}.pptx` });
        showToast(`PPTX с ${totalSlides} слайдами скачан!`, 'success');

    } catch (err) {
        console.error('[PPTX Error]', err);
        showToast('Ошибка экспорта PPTX: ' + err.message, 'error');
    } finally {
        btn.disabled = false;
    }
}

async function fetchImageAsBase64(url, fallbackTitle = '', theme = {}) {
    try {
        if (!url) throw new Error('No URL');
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6500);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.warn('[Fetch Base64 Fallback]', e);
        return generateSvgIllustration(fallbackTitle, theme.accentColor, theme.backgroundColor);
    }
}


/* ──────────────────────────────────────────────
   LOCALSTORAGE PERSISTENCE
─────────────────────────────────────────────── */
function saveToLocalStorage() {
    try {
        localStorage.setItem('vsh_presentation_state', JSON.stringify(presentationState));
    } catch (e) {}
}

function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('vsh_presentation_state');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                presentationState = parsed;
            }
        }
    } catch (e) {}
}


/* ──────────────────────────────────────────────
   UTILITIES
─────────────────────────────────────────────── */
function switchScreen(target) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    target.classList.add('active');
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const icons = { error: 'fa-circle-exclamation', success: 'fa-circle-check', info: 'fa-circle-info' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i> ${escapeHtml(message)}`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
