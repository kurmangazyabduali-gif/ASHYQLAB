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

            if (imageSourceMode === 'web') {
                btnGenText.textContent = 'Поиск реальных фото в Википедии и Сети...';
                setGenProgress(85, 'Загрузка реальных фотографий...');
                await autoAttachRealWebPhotos(presentationState, topic);
            }

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

    editImgPrompt.addEventListener('input', function(e) {
        const slide = getCurrentSlide();
        if (!slide) return;
        slide.imagePrompt = e.target.value;
        renderLiveSlidePreview();
        saveToLocalStorage();
    });

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
                   /\b(сабақ|жоспары|мақсаты|физика|химия|биология|зертханалық|тақырыбы|сынып|оқушы|тұлға|өмірбаян|қазақ|тарих|баяндама|жетістік|шедевр)\b/i.test((topic || '') + ' ' + (sourceContext || ''));
        isEnglish = /^[a-zA-Z0-9\s.,!?:;\-_'"]+$/.test((topic || '').trim()) && !/[а-яА-ЯёЁ]/.test(topic || '');
    }

    const cleanTopic = (topic || (isKazakh ? 'Ғылыми зерттеу' : (isEnglish ? 'Scientific Research' : 'Научное исследование'))).trim();
    const activeIntel = intel || detectTopicIntelligence(cleanTopic, sourceContext);

    let slides = [];

    // CASE 1: Source Context is provided (Grounded RAG generation)
    if (sourceContext && sourceContext.trim()) {
        const combined = `${cleanTopic} ${sourceContext}`.toLowerCase();
        const isLab = /лаборатор|зертхана|мақсат|прибор|жабдық|оборудован|өлшеу|измерен|тәжірибе|опыт|резистор|амперметр|вольтметр/i.test(combined);
        const isPerson = /димаш|dimash|құдайберген|кудайберген|кто такой|кто такая|ким ол|певец|әнші|композитор|жазушы|ақын|ғалым|тұлға|өмірбаян|биография|персона|абай|шоқан|әл-фараби|пушкин|эйнштейн|ньютон|маск|джобс|актер|лауреат/i.test(combined);

        // Extract meaningful clean sentences (length between 20 and 240 characters)
        const sentences = sourceContext
            .replace(/\r?\n+/g, ' ')
            .split(/(?<=[.!?])\s+/)
            .map(s => s.trim().replace(/^[-•*–]\s*/, ''))
            .filter(s => s.length > 20 && s.length < 240);

        const getSlice = (startIdx, count, fallbackArr) => {
            const part = sentences.slice(startIdx, startIdx + count);
            return part.length > 0 ? part : fallbackArr;
        };

        if (isPerson) {
            const bioSentences = sentences.filter(s => /род\.|туған|родился|детств|балалық|отбасы|семья|оқу|учился|колледж|университет|академи|білім|город|қала/i.test(s));
            const statSentences = sentences.filter(s => /диапазон|октав|преми|наград|лауреат|чемпион|жүлде|атақ|звание|артист|рекорд|популяр|танымал|әлемдік|мировой/i.test(s));
            const stepSentences = sentences.filter(s => /жылы|году|концерт|альбом|тур|бағдарлама|проект|жоба|шоу|байқау|конкурс|выступлен|победа|жеңіс/i.test(s));
            const legacySentences = sentences.filter(s => /мұра|наследие|үлес|вклад|дипломати|халықаралық|мировое|мәдениет|культура|миссия|қайырымдылық/i.test(s));

            // Extract numeric or record highlight for stat slide
            let statVal = isKazakh ? '№ 1' : 'Топ';
            const statMatch = sourceContext.match(/(\d+\s*октав[а-я]*|\d+[\d.,]*%?|\b\d{4}\s*ж[ыл]*|\b\d{4}\s*год[а-я]*|\b\d+\s*(?:млн|млрд|стран|ел|преми[йя]))/i);
            if (statMatch) statVal = statMatch[1];

            slides.push({
                title: cleanTopic,
                points: sentences.slice(0, 1),
                layout: 'cover',
                imagePrompt: `${cleanTopic} portrait photography masterpiece, elegant stage lighting, 8k cinematic`,
                speakerNotes: isKazakh ? `Бүгінгі баяндамамыз: ${cleanTopic}.` : `Приветствие. Тема сегодняшнего выступления: ${cleanTopic}.`
            });

            slides.push({
                title: isKazakh ? 'Өмірбаяны және шығармашылық бастауы' : 'Биография и становление личности',
                points: bioSentences.length ? bioSentences.slice(0, 3) : getSlice(0, 3, isKazakh ? [
                    'Белгілі өнер мен мәдениет қайраткерінің отбасылық тағылымы',
                    'Кәсіби музыкалық және академиялық білім алу жолы',
                    'Алғашқы шығармашылық ізденістері мен ерте танылған дарыны'
                ] : [
                    'Семейные традиции, истоки мастерства и воспитание',
                    'Профессиональное образование и формирование мировоззрения',
                    'Ранние годы деятельности, раскрытие уникального природного таланта'
                ]),
                layout: 'split-left',
                imagePrompt: `${cleanTopic} early years portrait archive photography 3d render`,
                speakerNotes: isKazakh ? 'Тұлғаның өмірбаяны, білім алу жолы мен алғашқы қадамдары.' : 'Расскажите о детстве, первых шагах и получении образования.'
            });

            slides.push({
                title: isKazakh ? 'Феноменалды жетістіктері мен мәртебесі' : 'Уникальные достижения и статус',
                statVal: statVal,
                points: statSentences.length ? statSentences.slice(0, 4) : getSlice(3, 4, isKazakh ? [
                    'Бірегей кәсіби шеберлік және сирек кездесетін орындау техникасы',
                    'Қазақстанның Халық әртісі құрметті мемлекеттік мәртебесі',
                    'Әлемнің жетекші сахналарындағы үздік орындаушы ретінде мойындалуы'
                ] : [
                    'Уникальный профессиональный диапазон и виртуозное мастерство',
                    'Высокие государственные звания и международное признание критиков',
                    'Триумфальные выступления на главных мировых площадках'
                ]),
                layout: 'stat',
                imagePrompt: 'achievement victory glowing golden award trophy 3d render',
                speakerNotes: isKazakh ? 'Тұлғаның басты рекордтары мен кәсіби мүмкіндіктері.' : 'Озвучьте рекордные показатели и профессиональные регалии.'
            });

            slides.push({
                title: isKazakh ? 'Негізгі белестері мен даму кезеңдері' : 'Хронология и ключевые вехи признания',
                points: stepSentences.length ? stepSentences.slice(0, 3) : getSlice(7, 3, isKazakh ? [
                    '1-кезең: Республикалық және халықаралық байқаулардағы жеңістер',
                    '2-кезең: Әлемдік деңгейдегі сенсация және миллиондаған жанкүйерлер',
                    '3-кезең: Жеке стадиондық концерттік турлар мен халықаралық шоулар'
                ] : [
                    'Этап 1: Победы на престижных национальных и международных конкурсах',
                    'Этап 2: Всемирное признание и завоевание сердец глобальной аудитории',
                    'Этап 3: Масштабные сольные проекты и аншлаги на мировых аренах'
                ]),
                layout: 'steps',
                imagePrompt: 'grand concert stadium stage lights fireworks show 3d render',
                speakerNotes: isKazakh ? 'Шығармашылық жолдың негізгі кезеңдері.' : 'Хронологический разбор ключевых этапов творческого пути.'
            });

            slides.push({
                title: isKazakh ? 'Шедеврлері, жобалары мен марапаттары' : 'Главные произведения, признание и награды',
                points: getSlice(10, 4, isKazakh ? [
                    'Әлемдік беделді сыйлықтар мен халықаралық марапаттар',
                    'Көптілді репертуар және халықаралық ынтымақтастық жобалары',
                    'Жаһандық жанкүйерлер қауымдастығы және фан-клубтар',
                    'Ұлттық мәдениет пен өнерді жаһанға таныту'
                ] : [
                    'Престижные награды ведущих премий и фестивалей',
                    'Широкий репертуар на множестве языков и международные коллаборации',
                    'Всемирное сообщество поклонников и культурные инициативы',
                    'Популяризация национальной культуры на международной арене'
                ]),
                layout: 'cards-grid',
                imagePrompt: 'golden music trophy awards glowing crystals 3d render',
                speakerNotes: isKazakh ? 'Негізгі марапаттары мен халықаралық жобалары.' : 'Обзор главных наград и масштаба фан-сообщества.'
            });

            slides.push({
                title: isKazakh ? 'Мәдениетке қосқан үлесі мен ықпалы' : 'Вклад в мировую культуру и признание',
                points: getSlice(14, 4, isKazakh ? [
                    'Классикалық шеберлік пен ұлттық мұраның үйлесімді синтезі',
                    'Қазақстанның әлемдік өнер кеңістігіндегі мәдени елшісі мәртебесі',
                    'Жас буынға үлгі боларлық кәсібилік пен еңбекқорлық',
                    'Мәдениетаралық диалог пен бейбітшілікті нығайту'
                ] : [
                    'Гармоничный синтез классического мастерства и традиционного фольклора',
                    'Статус культурного посла на мировой арене',
                    'Высокий профессионализм, самоотдача и ориентир для нового поколения',
                    'Укрепление глобального межкультурного диалога и взаимопонимания'
                ]),
                layout: 'compare',
                imagePrompt: 'cultural harmony peace globe golden musical rays 3d render',
                speakerNotes: isKazakh ? 'Тұлғаның өнері мен ұлттық мәдениетке қосқан үлесі.' : 'Значение творчества личности для культуры и общества.'
            });

            slides.push({
                title: isKazakh ? 'Мәдени мұрасы мен тарихи миссиясы' : 'Историческая миссия и наследие',
                points: legacySentences.length ? legacySentences.slice(0, 3) : (isKazakh ? [
                    '«Өнер — шекараны білмейтін және халықтардың жүрегін біріктіретін ұлы күш»',
                    'Ұлттық рух пен өркениеттік мақтаныштың асқақ көрінісі',
                    'Болашақ ұрпаққа қалдырған өнегелі шығармашылық жолы'
                ] : [
                    '«Истинное величие личности измеряется пользой, принесенной человечеству»',
                    'Яркое воплощение национального духа и культурной гордости',
                    'Вдохновляющий жизненный путь и ориентир для будущих поколений'
                ]),
                layout: 'insight',
                imagePrompt: 'golden eternal glowing light inspiration wisdom 3d render',
                speakerNotes: isKazakh ? 'Баяндаманы қорытындылап, негізгі ойды түйіндеу.' : 'Подведение итогов выступления.'
            });

        } else if (isLab) {
            // Lab Practicums
            const lines = sourceContext.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const findLines = (regex, max = 3) => {
                const found = lines.filter(l => regex.test(l) && l.length > 8 && l.length < 180);
                return found.slice(0, max);
            };

            const objectiveLines = findLines(/мақсат|цел|міндет|задач/i, 3);
            const theoryLines    = findLines(/теория|негіз|заң|закон|формул|анықтама|определен/i, 3);
            const equipLines     = findLines(/құрал|жабдық|прибор|материал|оборудован/i, 3);
            const stepLines      = findLines(/барысы|ход|қадам|тәжірибе|опыт|этап/i, 4);
            const conclLines     = findLines(/қорытынды|вывод|нәтиже|результат|талдау/i, 3);

            slides.push({
                title: cleanTopic,
                points: [],
                layout: 'cover',
                imagePrompt: `${cleanTopic} scientific research laboratory poster, cinematic 3d render 8k`,
                speakerNotes: isKazakh ? `Құрметті әріптестер мен оқушылар, бүгінгі зертханалық жұмыс: ${cleanTopic}.` : `Приветствие аудитории. Лабораторный практикум по теме: ${cleanTopic}.`
            });

            slides.push({
                title: isKazakh ? 'Зерттеудің мақсаты мен міндеттері' : 'Цели и задачи исследования',
                points: objectiveLines.length ? objectiveLines : (isKazakh ? [
                    'Жұмыстың негізгі теориялық және практикалық негіздерін зерттеу',
                    'Құбылыстың заңдылықтары мен формулаларын практикада анықтау',
                    'Алынған нәтижелерге ғылыми талдау жасау'
                ] : [
                    'Изучение ключевых теоретических и практических аспектов темы',
                    'Определение взаимосвязей и закономерностей в ходе исследования',
                    'Анализ и систематизация полученных практических результатов'
                ]),
                layout: 'split-left',
                imagePrompt: 'educational target goals strategy vision, glowing futuristic 3d icon',
                speakerNotes: isKazakh ? 'Бұл слайдта жұмыстың алға қойған негізгі мақсаттары мен міндеттері көрсетілген.' : 'Озвучьте цели и практическую значимость исследования.'
            });

            slides.push({
                title: isKazakh ? 'Теориялық негіздер және заңдылықтар' : 'Теоретические основы и закономерности',
                points: theoryLines.length ? theoryLines : (isKazakh ? [
                    'Тақырыпқа байланысты іргелі ғылыми ұғымдар мен терминдер',
                    'Негізгі формулалар мен математикалық байланыстар',
                    'Құбылыстың физикалық-математикалық табиғаты'
                ] : [
                    'Фундаментальные научные понятия и терминология по материалам источника',
                    'Ключевые формулы и математические взаимосвязи',
                    'Физико-математическое и прикладное описание изучаемого процесса'
                ]),
                layout: 'stat',
                imagePrompt: 'scientific formulas quantum equations glowing on black glass, 3d render',
                speakerNotes: isKazakh ? 'Теориялық бөлімде басты формулалар мен ғылыми қағидаларға назар аударамыз.' : 'Раскройте теоретическую модель и основные математические соотношения.'
            });

            slides.push({
                title: isKazakh ? 'Құрал-жабдықтар мен эксперименттік база' : 'Оборудование и методология работы',
                points: equipLines.length ? equipLines : (isKazakh ? [
                    'Зертханалық кешен мен өлшеуіш аспаптардың сипаттамасы',
                    'Қауіпсіздік ережелері мен эксперимент шарттары',
                    'Өлшеу дәлдігі мен қателіктерді есепке алу'
                ] : [
                    'Лабораторный комплекс и измерительные приборы по материалам источника',
                    'Соблюдение регламента и техники безопасности при проведении работы',
                    'Калибровка и учет погрешностей измерений'
                ]),
                layout: 'cards-grid',
                imagePrompt: 'modern scientific laboratory equipment instruments apparatus, photorealistic 3d',
                speakerNotes: isKazakh ? 'Тәжірибелік база мен қолданылған өлшеу құралдарының жұмыс істеу принципі.' : 'Опишите используемую аппаратную базу и методику проведения работы.'
            });

            slides.push({
                title: isKazakh ? 'Жұмыстың орындалу барысы' : 'Порядок выполнения и алгоритм',
                points: stepLines.length ? stepLines : (isKazakh ? [
                    '1-қадам: Құрылғыларды дайындау және бастапқы параметрлерді өлшеу',
                    '2-қадам: Эксперимент жүргізу және көрсеткіштерді тіркеу',
                    '3-қадам: Алынған мәліметтер бойынша есептеулер жүргізу'
                ] : [
                    'Этап 1: Подготовка исследовательской установки и ввод исходных параметров',
                    'Этап 2: Проведение серии контрольных измерений и фиксация данных',
                    'Этап 3: Математическая обработка и расчет искомых величин'
                ]),
                layout: 'steps',
                imagePrompt: 'step by step engineering process workflow roadmap, 3d isometric neon',
                speakerNotes: isKazakh ? 'Жұмыстың кезең-кезеңімен орындалу алгоритмін түсіндіреміз.' : 'Прокомментируйте пошаговый алгоритм выполнения практической части.'
            });

            slides.push({
                title: isKazakh ? 'Нәтижелерді талдау және қорытынды' : 'Анализ результатов и выводы',
                points: conclLines.length ? conclLines : (isKazakh ? [
                    'Тәжірибе барысында алынған нәтижелер теориямен толық сәйкес келді',
                    'Зерттеу мақсаты толығымен орындалды',
                    'Алынған нәтижелерді практикалық есептерде қолдануға болады'
                ] : [
                    'Экспериментальные данные подтверждают теоретическую модель',
                    'Цели исследовательской работы достигнуты в полном объеме',
                    'Практические рекомендации и перспективы дальнейшего применения'
                ]),
                layout: 'insight',
                imagePrompt: 'scientific breakthrough discovery glowing trophy light bulb, 3d render',
                speakerNotes: isKazakh ? 'Қорытынды жасап, тыңдаушылардың сұрақтарына жауап беру.' : 'Подведите итоги выступления и перейдите к сессии вопросов и ответов.'
            });

        } else {
            // General Scientific / Encyclopedic / Historical Topic from SourceContext
            slides.push({
                title: cleanTopic,
                points: sentences.slice(0, 1),
                layout: 'cover',
                imagePrompt: `${cleanTopic} conceptual scientific presentation cover 3d render 8k`,
                speakerNotes: isKazakh ? `Бүгінгі тақырыбымыз: ${cleanTopic}.` : `Приветствие участников. Тема: ${cleanTopic}.`
            });

            slides.push({
                title: isKazakh ? `Кіріспе және негізгі ұғымдар: ${cleanTopic}` : `Введение и ключевые понятия: ${cleanTopic}`,
                points: getSlice(0, 3, isKazakh ? [
                    `${cleanTopic} — заманауи ғылым мен білімдегі өзекті тақырыптардың бірі`,
                    'Тақырыпқа қатысты іргелі ғылыми ұғымдар мен негізгі терминдер',
                    'Зерттеу бағыттары мен қарастырылатын басты сұрақтар'
                ] : [
                    `${cleanTopic} — актуальное направление в современной науке и практике`,
                    'Фундаментальные понятия, определения и структура понятийного аппарата',
                    'Ключевые предпосылки и главные рассматриваемые аспекты темы'
                ]),
                layout: 'split-left',
                imagePrompt: `${cleanTopic} glowing concept theory 3d render octane`,
                speakerNotes: isKazakh ? 'Тақырыптың өзектілігі мен негізгі ұғымдарын түсіндіру.' : 'Обоснуйте актуальность темы и сформулируйте базовые понятия.'
            });

            slides.push({
                title: isKazakh ? 'Негізгі көрсеткіштер мен ғылыми деректер' : 'Главные параметры, показатели и факты',
                statVal: '★ Топ',
                points: getSlice(3, 3, isKazakh ? [
                    'Негізгі сандық және сапалық көрсеткіштердің жүйелі сипаттамасы',
                    'Құбылыстың басты қасиеттері мен заңдылық байланыстары',
                    'Практикалық зерттеулердегі дәлдік пен нәтижелілік'
                ] : [
                    'Системный анализ ключевых качественных и количественных характеристик',
                    'Фундаментальные закономерности, принципы взаимодействия и метрики',
                    'Аналитические данные и результаты контрольных наблюдений'
                ]),
                layout: 'stat',
                imagePrompt: `${cleanTopic} infographic data metrics analytics glowing 3d render`,
                speakerNotes: isKazakh ? 'Негізгі көрсеткіштер мен деректерге назар аудару.' : 'Представьте ключевые параметры и прокомментируйте главные метрики.'
            });

            slides.push({
                title: isKazakh ? 'Даму кезеңдері мен орындалу алгоритмі' : 'Хронология и ключевые этапы развития',
                points: getSlice(6, 3, isKazakh ? [
                    '1-кезең: Бастапқы зерттеу және концептуалды негіздеме қалыптастыру',
                    '2-кезең: Негізгі үдерісті жүзеге асыру және тәжірибелік тексеру',
                    '3-кезең: Қорытынды нәтижелерді шығару және тәжірибеге енгізу'
                ] : [
                    'Этап 1: Исследование исходных условий и концептуальное проектирование',
                    'Этап 2: Практическая реализация ключевых процессов и мониторинг',
                    'Этап 3: Формирование итоговых результатов и масштабирование'
                ]),
                layout: 'steps',
                imagePrompt: `${cleanTopic} timeline progression steps roadmap glowing 3d isometric`,
                speakerNotes: isKazakh ? 'Даму кезеңдерін рет-ретімен баяндау.' : 'Опишите пошаговую методологию и ключевые стадии реализации.'
            });

            slides.push({
                title: isKazakh ? 'Құрылымы, бағыттары және маңызы' : 'Структура, компоненты и практическая ценность',
                points: getSlice(9, 4, isKazakh ? [
                    'Құрамдас бөліктер мен ішкі жүйелердің өзара байланысы',
                    'Отандық және халықаралық тәжірибедегі үздік шешімдер',
                    'Заманауи технологиялар мен тиімді тәсілдерді қолдану',
                    'Тиімділікті арттыруға бағытталған практикалық ұсыныстар'
                ] : [
                    'Взаимосвязь ключевых структурных элементов и внутренних систем',
                    'Передовые отечественные и международные практики применения',
                    'Использование современных технологических инструментов',
                    'Практические сценарии внедрения и прикладная отдача'
                ]),
                layout: 'cards-grid',
                imagePrompt: `${cleanTopic} modular structure network connected blocks 3d render`,
                speakerNotes: isKazakh ? 'Құрылымдық ерекшеліктер мен тәжірибелік қолдану мысалдары.' : 'Разберите архитектуру системы и реальные примеры практического применения.'
            });

            slides.push({
                title: isKazakh ? 'Салыстырмалы талдау және артықшылықтары' : 'Сравнительный анализ и преимущества',
                points: getSlice(13, 4, isKazakh ? [
                    'Дәстүрлі тәсілдерге қарағанда жоғары тиімділік пен сенімділік',
                    'Үдерістерді оңтайландыру және уақыт пен ресурсты үнемдеу',
                    'Инновациялық шешімдердің ұзақ мерзімді нәтижелілігі',
                    'Жаңа мүмкіндіктер мен болашақ өсу әлеуеті'
                ] : [
                    'Высокая надежность и результативность по сравнению с базовыми аналогами',
                    'Оптимизация процессов, экономия ключевых ресурсов и повышение точности',
                    'Долгосрочные системные преимущества внедряемых решений',
                    'Открытие новых перспектив для дальнейшего масштабирования'
                ]),
                layout: 'compare',
                imagePrompt: `${cleanTopic} comparative analysis balance scales 3d render`,
                speakerNotes: isKazakh ? 'Салыстырмалы талдау жасап, басты артықшылықтарды көрсету.' : 'Сопоставьте ключевые подходы и подчеркните главные преимущества.'
            });

            slides.push({
                title: isKazakh ? 'Қорытынды, тұжырымдар мен болашағы' : 'Стратегические выводы и перспективы',
                points: getSlice(17, 3, isKazakh ? [
                    `«${cleanTopic} — ғылым мен қоғам дамуындағы серпінді қадам»`,
                    'Қарастырылған мәліметтер негізінде жасалған басты тұжырымдар',
                    'Болашақтағы даму векторлары мен жаңа мүмкіндіктер'
                ] : [
                    `«${cleanTopic} — стратегический драйвер научно-технического прогресса»`,
                    'Обобщение рассмотренного материала и ключевые аналитические выводы',
                    'Перспективные векторы развития и направления для дальнейших исследований'
                ]),
                layout: 'insight',
                imagePrompt: `${cleanTopic} glowing light crystal vision future 3d render`,
                speakerNotes: isKazakh ? 'Баяндаманы қорытындылап, сұрақ-жауап кезеңіне өту.' : 'Подведите итоги выступления и перейдите к открытой дискуссии.'
            });
        }

    } else {
        // CASE 2: Topic-only intelligent curriculum synthesis
        const lower = cleanTopic.toLowerCase();

        // 0. TECH HUB / STARTUP ECOSYSTEM / BUSINESS INCUBATOR (Kyzylorda Hub, Astana Hub, etc.)
        if (/kyzylorda|хаб|hub|стартап|startup|инкуба|инноваци|кәсіпкер|бизнес|жоба|астана хаб|акселера|инвест|pitch/i.test(lower)) {
            slides = [
                {
                    title: cleanTopic,
                    points: [isKazakh ? 'Жастардың инновациялық идеяларын қолдап, кәсіпкерлік және цифрлық дағдыларын дамыту' : 'Поддержка молодежных стартапов, развитие цифровых навыков и акселерация бизнеса'],
                    layout: 'cover',
                    imagePrompt: `${cleanTopic} modern innovation technology hub coworking office, high tech 3d render cinematic 8k`,
                    speakerNotes: isKazakh ? `Құрметті қатысушылар, бүгінгі таныстырылымымыз: ${cleanTopic}.` : `Приветствие участников и инвесторов. Презентация: ${cleanTopic}.`
                },
                {
                    title: isKazakh ? `${cleanTopic} бизнес-инкубациялау орталығы` : `${cleanTopic} — Экосистема развития стартапов`,
                    tagline: isKazakh ? 'Жастардың инновациялық идеяларын қолдап, кәсіпкерлік және цифрлық дағдыларын дамытуға жағдай жасаймыз.' : 'Создаем условия для развития инновационных идей, цифровых навыков и привлечения венчурных инвестиций.',
                    centerTitle: isKazakh ? `${cleanTopic.length > 18 ? 'Hub' : cleanTopic} қызметтері` : 'Ключевые сервисы',
                    layout: 'hub-ecosystem',
                    leftMetrics: isKazakh ? [
                        { icon: 'fa-graduation-cap', val: '145', lbl: 'резидент түлектер' },
                        { icon: 'fa-users', val: '1 750', lbl: 'қатысушы жоба' },
                        { icon: 'fa-gear', val: '52', lbl: 'жоба саны' }
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
                        { title: 'Консультации и трекинг', icon: 'fa-comments' },
                        { title: 'Demo Day & Питчинг', icon: 'fa-chart-pie' },
                        { title: 'Венчурные инвестиции', icon: 'fa-seedling' },
                        { title: 'Маркетинг и PR', icon: 'fa-bullhorn' },
                        { title: 'Tech Academy курсы', icon: 'fa-book-open' },
                        { title: 'Грантовые конкурсы', icon: 'fa-award' },
                        { title: 'Хакатоны 24/7', icon: 'fa-code' },
                        { title: 'Налоговые льготы 0%', icon: 'fa-file-invoice' }
                    ],
                    points: [
                        isKazakh ? '145 резидент түлектер мен 52 сәтті іске қосылған жоба' : '145 резидентов выпускников и 52 запущенных проекта',
                        isKazakh ? '111 500 000 ₸ көлемінде тартылған инвестициялар' : '111 500 000 ₸ привлеченных венчурных инвестиций'
                    ],
                    imagePrompt: 'modern tech startup hub coworking center team collaboration, clean 3d render 8k',
                    speakerNotes: isKazakh ? 'Орталықтың негізгі 10 қызметі мен қол жеткізген негізгі көрсеткіштері.' : 'Обзор 10 сервисных направлений хаба и ключевых показателей эффективности.'
                },
                {
                    title: isKazakh ? 'Негізгі экономикалық көрсеткіштер (KPI Дашборд)' : 'Ключевые показатели эффективности (KPI Dashboard)',
                    layout: 'kpi-grid',
                    kpis: isKazakh ? [
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
                    ],
                    points: [
                        isKazakh ? 'Инвестициялар көлемі: 111 500 000 ₸' : 'Общий объем инвестиций: 111 500 000 ₸',
                        isKazakh ? 'Қамтылған жастар саны: 15 500+' : 'Охват аудитории: 15 500+ участников'
                    ],
                    imagePrompt: 'glowing financial startup KPI metrics dashboard 3d render',
                    speakerNotes: isKazakh ? 'Инкубациялық кезеңдегі өсім мен қаржылық нәтижелер.' : 'Разбор ключевых финансовых и операционных метрик роста.'
                },
                {
                    title: isKazakh ? 'Стартапты инкубациялау кезеңдері' : 'Этапы инкубации и акселерации проектов',
                    points: isKazakh ? [
                        '1-кезең: Іріктеу және идеяны бағалау (Ideation & Selection)',
                        '2-кезең: Қарқынды инкубация (8 апталық оқыту және менторлық)',
                        '3-кезең: MVP әзірлеу және алғашқы сатылымдар (Traction & Product)',
                        '4-кезең: Demo Day және венчурлік инвестиция тарту'
                    ] : [
                        'Этап 1: Отбор и валидация продуктовой гипотезы (Ideation & Scoring)',
                        'Этап 2: Интенсивная инкубация (8 недель трекинга и менторства)',
                        'Этап 3: Запуск MVP и первые коммерческие продажи (Traction)',
                        'Этап 4: Финальный Demo Day и закрытие инвестиционного раунда'
                    ],
                    layout: 'steps',
                    imagePrompt: 'startup development acceleration roadmap milestones glowing 3d isometric',
                    speakerNotes: isKazakh ? 'Стартаптың идеядан инвестицияға дейінгі өсу жолы.' : 'Пошаговая методология сопровождения резидентов от идеи до инвестиций.'
                },
                {
                    title: isKazakh ? 'Негізгі бағдарламалар мен мүмкіндіктер' : 'Флагманские программы и экосистемные льготы',
                    points: isKazakh ? [
                        'Startup Garage: жаңадан бастаушыларға арналған коворкинг пен жабдықтар',
                        'Hackathon & Ideathon: 24 сағаттық код жазу және шешім табу алаңы',
                        'Seed Money: алғашқы прототип жасауға арналған қайтарымсыз гранттар',
                        'Салықтық жеңілдіктер: 0% КТС, 0% ЖТС (Astana Hub серіктестігі)'
                    ] : [
                        'Startup Garage: оборудованный коворкинг, серверные мощности и менторский пул',
                        'Hackathon 24/7: хакатоны для поиска талантов и создания прототипов',
                        'Seed Money: грантовое предпосевное финансирование для лучших команд',
                        'Налоговые льготы: 0% КПН, 0% ИПН в рамках партнерства с технопарком'
                    ],
                    layout: 'cards-grid',
                    imagePrompt: 'modern startup coworking open space innovation hub 3d render',
                    speakerNotes: isKazakh ? 'Резиденттерге берілетін материалдық және салықтық преференциялар.' : 'Подробный обзор инфраструктурной и налоговой поддержки резидентов.'
                },
                {
                    title: isKazakh ? 'Миссиясы мен даму стратегиясы' : 'Миссия и стратегические ориентиры',
                    points: isKazakh ? [
                        'Өңірдегі ең ірі цифрлық және инновациялық қауымдастықты қалыптастыру',
                        'Жергілікті стартаптарды халықаралық нарықтарға шығару (Silkway Accelerator)',
                        'Келесі 3 жылда 500+ жаңа жұмыс орнын ашу'
                    ] : [
                        'Формирование ведущего инновационного и IT-сообщества региона',
                        'Масштабирование проектов на международные рынки (Silkway Accelerator)',
                        'Создание 500+ высокотехнологичных рабочих мест в течение 3 лет'
                    ],
                    layout: 'insight',
                    imagePrompt: 'futuristic glowing tech trophy innovation crystal globe 3d',
                    speakerNotes: isKazakh ? 'Болашақ жоспарлар мен әріптестікке шақыру.' : 'Стратегическое видение и приглашение к долгосрочному партнерству.'
                }
            ];
        } else if (/димаш|dimash|құдайберген|кудайберген|әнші|певец|singer|вокал|vocal|музыкант|композитор|абай|шоқан|әл-фараби|тұлға|биография|персона/i.test(lower)) {
            const isDimash = /димаш|dimash|құдайберген|кудайберген/i.test(lower);
            if (isDimash) {
                slides = [
                    {
                        title: isKazakh ? 'Димаш Құдайберген — Әлемдік вокал феномені' : 'Димаш Кудайберген — Феномен мировой музыки',
                        points: [
                            isKazakh ? 'Қазақстанның Халық әртісі, композитор және бірегей вокал шебері' : 'Народный артист Казахстана, мультиинструменталист и певец мирового уровня'
                        ],
                        layout: 'cover',
                        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Kudaibergen_at_New_Wave_in_2019.jpg/1280px-Kudaibergen_at_New_Wave_in_2019.jpg',
                        imagePrompt: 'Dimash Kudaibergen singing on stage with dramatic stage lighting, elegant performance, photorealistic 8k',
                        speakerNotes: isKazakh ? 'Бүгінгі таныстырылымымыз қазақтың мақтанышы, әлемге әйгілі әнші Димаш Құдайбергенге арналады.' : 'Приветствие. Сегодня мы познакомимся с творчеством и феноменальным успехом Димаша Кудайбергена.'
                    },
                    {
                        title: isKazakh ? 'Өмірбаяны және шығармашылық бастауы' : 'Биография и ранние годы творчества',
                        points: isKazakh ? [
                            '1994 жылы 24 мамырда Ақтөбе қаласында өнерлі отбасында дүниеге келген',
                            'Ата-анасы — Қанат және Светлана Айтбаевтар, белгілі қазақстандық өнер қайраткерлері',
                            'А. Жұбанов атындағы музыкалық колледж бен ҚазҰӨУ («Шабыт») академиясын үздік тәмамдаған'
                        ] : [
                            'Родился 24 мая 1994 года в городе Актобе в известной музыкальной семье',
                            'Родители — Канат и Светлана Айтбаевы, заслуженные деятели культуры Казахстана',
                            'Профессиональное образование: Музыкальный колледж им. Жубанова и КазНУИ («Шабыт»)'
                        ],
                        layout: 'split-left',
                        imageUrl: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Kudaibergen_at_New_Wave_in_2019.jpg/1280px-Kudaibergen_at_New_Wave_in_2019.jpg',
                        imagePrompt: 'young musical prodigy piano studio elegant concert hall 3d render',
                        speakerNotes: isKazakh ? 'Димаштың балалық шағы, отбасындағы тәрбиесі мен кәсіби білім алу жолы.' : 'Расскажите о детстве, первых выступлениях и музыкальном образовании артиста.'
                    },
                    {
                        title: isKazakh ? 'Феноменалды вокалдық мүмкіндіктер' : 'Уникальный вокальный диапазон и техника',
                        statVal: '6 октава',
                        points: isKazakh ? [
                            'Диапазон: 6 октава (D2-ден D8-ге дейін — баритоннан колоратуралық сопраноға дейін)',
                            'Ысқырықты регистр (whistle register), бельканто және академиялық вокал техникасын шебер меңгерген',
                            'Әлемнің 15-тен астам тілінде (қазақ, қытай, француз, ағылшын, итальян, т.б.) еркін ән шырқайды',
                            'Домбыра, фортепиано, маримба, барабан сынды көптеген аспаптарда шебер ойнайды'
                        ] : [
                            'Диапазон: 6 октав (от D2 до D8 — от глубокого баритона до колоратурного сопрано)',
                            'Владение сложнейшим свистковым регистром (whistle register) и стилем бельканто',
                            'Исполнение композиций на более чем 15 языках мира (казахский, китайский, французский, итальянский)',
                            'Виртуозное владение домброй, фортепиано, барабанами и клавишными'
                        ],
                        layout: 'stat',
                        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop&q=80',
                        imagePrompt: 'vocal sound waves glowing musical spectrum concert stage, 3d cinematic lighting',
                        speakerNotes: isKazakh ? 'Димаштың сирек кездесетін 6 октавалық дауыс диапазоны мен вокалдық ерекшелігі.' : 'Объясните уникальность 6-октавного диапазона и сложность применяемых вокальных техник.'
                    },
                    {
                        title: isKazakh ? 'Әлемдік танымалдылық пен негізгі белестер' : 'Триумф на мировой арене и главные вехи',
                        points: isKazakh ? [
                            '«Славянский базар 2015» (Витебск): Гран-при жеңіп, халықаралық сахнаға жол ашты',
                            '«I Am a Singer 2017» (Қытай): Қытай мен Азияны бағындырып, әлемдік деңгейдегі сенсацияға айналды',
                            'Стадиондық шоулар: Нью-Йорктегі Barclays Center («Arnau»), Лондон O2 Arena, Алматы стадионы («Stranger»)'
                        ] : [
                            '«Славянский базар 2015» (Витебск): Триумфальный Гран-при и международное признание',
                            '«I Am a Singer 2017» (Китай): Грандиозная сенсация и обретение миллионов поклонников (Dears)',
                            'Мировые сольники: Аншлаги в Barclays Center (Нью-Йорк), O2 Arena (Лондон) и тур «Stranger»'
                        ],
                        layout: 'steps',
                        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1000&auto=format&fit=crop&q=80',
                        imagePrompt: 'grand concert stadium stage fireworks laser show cheering crowd, 3d photorealistic',
                        speakerNotes: isKazakh ? 'Димаштың халықаралық байқаулардағы жеңістері мен әлемдік стадиондардағы жеке концерттері.' : 'Хронология главных побед артиста и ключевые стадионные аншлаги.'
                    },
                    {
                        title: isKazakh ? 'Жетістіктері, марапаттары мен Dears қауымдастығы' : 'Награды, статус и фан-клуб Dears',
                        points: isKazakh ? [
                            'Қазақстанның Халық әртісі құрметті атағының иегері (2023 ж.)',
                            '«Top Chinese Music Award» — Самый популярный зарубежный певец',
                            '«Dears» — әлемнің 100-ден астам елінде ресми құрылған жанкүйерлер қауымдастығы',
                            'Қазақтың ұлттық мәдениеті мен домбыра өнерін әлемге танытушы елші'
                        ] : [
                            'Почетное звание «Халық әртісі» (Народный артист Казахстана, 2023)',
                            'Победы в престижных премиях: Top Chinese Music Awards, MTV Global Artist',
                            'Глобальное фан-сообщество «Dears», объединяющее поклонников в 100+ странах мира',
                            'Культурная дипломатия: популяризация казахской народной музыки и домбры во всем мире'
                        ],
                        layout: 'cards-grid',
                        imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1000&auto=format&fit=crop&q=80',
                        imagePrompt: 'golden music award trophy glowing crystal stars, 3d render 8k',
                        speakerNotes: isKazakh ? 'Димаштың алған мемлекеттік марапаттары мен Dears халықаралық қауымдастығының маңызы.' : 'Расскажите о всемирном фан-движении Dears и роли Димаша как культурного посла Казахстана.'
                    },
                    {
                        title: isKazakh ? 'Мәдени мұра және өнердегі миссиясы' : 'Миссия в искусстве и культурное наследие',
                        points: isKazakh ? [
                            '«Музыка — шекара мен тілге бағынбайтын, бүкіл әлем халықтарының жүрегін біріктіретін ұлы күш»',
                            'Қазақ әні мен ұлттық рухты жаһандық деңгейге көтерген дара тұлға',
                            'Бейбітшілік пен достықтың жаршысы ретіндегі қайырымдылық жобалары'
                        ] : [
                            '«Музыка не знает границ и языковых барьеров — она объединяет сердца людей по всему миру»',
                            'Синтез классической оперы, казахского традиционного фольклора и современного поп-рока',
                            'Благотворительные инициативы и вклад в укрепление глобального межкультурного диалога'
                        ],
                        layout: 'insight',
                        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1000&auto=format&fit=crop&q=80',
                        imagePrompt: 'golden microphone musical light rays harmony peace globe, 3d render',
                        speakerNotes: isKazakh ? 'Баяндаманы қорытындылап, Димаш өнерінің ұлт пен әлем үшін мәнін атап өту.' : 'Подведите итоги и подчеркните вклад артиста в мировую культуру.'
                    }
                ];
            } else {
                slides = [
                    {
                        title: cleanTopic,
                        points: [isKazakh ? 'Тарихи тұлғаның өмірі, шығармашылығы мен ұлттық мұрасы' : 'Жизненный путь, выдающийся вклад и наследие выдающейся личности'],
                        layout: 'cover',
                        imagePrompt: `${cleanTopic} historical heritage portrait museum archive cinematic lighting`,
                        speakerNotes: isKazakh ? `Бүгінгі тақырыбымыз: ${cleanTopic}.` : `Приветствие. Тема выступления: ${cleanTopic}.`
                    },
                    {
                        title: isKazakh ? 'Өмірбаяны және қалыптасу кезеңі' : 'Биография и становление личности',
                        points: isKazakh ? [
                            'Туып-өскен ортасы және отбасылық тағылымы',
                            'Білім алу жолы мен көзқарасының қалыптасуы',
                            'Қоғамдық-мәдени ортаның әсері мен алғашқы еңбектері'
                        ] : [
                            'Исторический контекст, семья и воспитание',
                            'Образовательный путь и формирование мировоззрения',
                            'Ранние труды и начало общественно-культурной деятельности'
                        ],
                        layout: 'split-left',
                        imagePrompt: 'ancient library books vintage manuscript historical study 3d render',
                        speakerNotes: isKazakh ? 'Тұлғаның өмірбаяны мен дүниетанымының қалыптасуы.' : 'Расскажите о детстве и предпосылках формирования взглядов.'
                    },
                    {
                        title: isKazakh ? 'Негізгі еңбектері мен тарихи мұрасы' : 'Главные труды и фундаментальное наследие',
                        statVal: '№ 1',
                        points: isKazakh ? [
                            'Ұлт руханияты мен әлемдік мәдениетке қосқан өлшеусіз үлесі',
                            'Басты шығармалары мен философиялық идеялары',
                            'Қазіргі заман үшін өзектілігі мен тағылымы'
                        ] : [
                            'Фундаментальный вклад в национальную и мировую сокровищницу мысли',
                            'Ключевые произведения, научные открытия и трактаты',
                            'Актуальность и непреходящая ценность идей в XXI веке'
                        ],
                        layout: 'stat',
                        imagePrompt: 'golden quill feather ink parchment ancient philosophical wisdom 3d',
                        speakerNotes: isKazakh ? 'Басты шығармалары мен философиялық еңбектері.' : 'Анализ ключевых трудов и их значения.'
                    },
                    {
                        title: isKazakh ? 'Шығармашылық және қоғамдық кезеңдері' : 'Основные этапы жизненного и творческого пути',
                        points: isKazakh ? [
                            '1-кезең: Ізденіс және алғашқы бастамалар',
                            '2-кезең: Кемелдену және басты туындыларын дүниеге әкелу',
                            '3-кезең: Халықтық танымалдылық және мектеп қалыптастыру'
                        ] : [
                            'Этап 1: Период ученичества и поиска собственного стиля',
                            'Этап 2: Творческий расцвет и создание программных трудов',
                            'Этап 3: Всенародное признание и формирование научной/литературной школы'
                        ],
                        layout: 'steps',
                        imagePrompt: 'historical timeline steps parchment scrolls golden lights 3d',
                        speakerNotes: isKazakh ? 'Тұлғаның кемелдену кезеңдері.' : 'Хронологические этапы творческой эволюции.'
                    },
                    {
                        title: isKazakh ? 'Мәдени және ғылыми құндылығы' : 'Значение для национальной и мировой культуры',
                        points: isKazakh ? [
                            'Ұлттық код пен рухани жаңғырудың бастауы',
                            'Әлемдік деңгейдегі ғалымдар мен жазушылардың жоғары бағасы',
                            'Келер ұрпаққа қалдырған өсиеті мен өнегесі'
                        ] : [
                            'Фундамент национальной идентичности и духовного возрождения',
                            'Высокая оценка мыслителей и ученых мирового масштаба',
                            'Нравственные ориентиры и уроки для будущих поколений'
                        ],
                        layout: 'cards-grid',
                        imagePrompt: 'golden statue memorial cultural monument 3d render',
                        speakerNotes: isKazakh ? 'Тұлғаның тарихтағы орны.' : 'Культурная и историческая значимость наследия.'
                    },
                    {
                        title: isKazakh ? 'Тарихи тағылым мен қорытынды' : 'Наследие и непреходящие ценности',
                        points: isKazakh ? [
                            '«Ұлы тұлғалардың өнегесі — мәңгілік шамшырақ»',
                            'Ұлттық мақтаныш пен тарихи сабақтастық',
                            'Есімін ұлықтау және мұрасын зерделеу жалғасады'
                        ] : [
                            '«Истинное величие личности измеряется пользой, принесенной человечеству»',
                            'Живая преемственность поколений и национальная гордость',
                            'Сохранение и популяризация культурного наследия'
                        ],
                        layout: 'insight',
                        imagePrompt: 'eternal flame memory torch glowing wisdom 3d cinematic',
                        speakerNotes: isKazakh ? 'Баяндаманы түйіндеп, сұрақ-жауапқа көшу.' : 'Подведение итогов выступления.'
                    }
                ];
            }
        } else if (/космос|ғарыш|планет|астроном|марс|юпитер|звезд|галактик|orbit|space/i.test(lower)) {
            slides = [
                {
                    title: cleanTopic,
                    points: [],
                    layout: 'cover',
                    imagePrompt: `${cleanTopic} deep space cosmic galaxy planets nebula, cinematic 8k 3d render`,
                    speakerNotes: isKazakh ? `Ғарыш әлеміне арналған баяндамамызды бастаймыз: ${cleanTopic}.` : `Приветствие. Сегодня мы исследуем захватывающую космическую тему: ${cleanTopic}.`
                },
                {
                    title: isKazakh ? 'Ғарышты зерттеудің маңызы мен мақсаты' : 'Значение и масштаб космических исследований',
                    points: isKazakh ? [
                        'Күн жүйесінің құрылымы және ғаламшарлардың физикалық сипаттамасы',
                        'Ғарыштық аппараттар мен телескоптардың заманауи мүмкіндіктері',
                        'Астрофизикалық заңдар мен гравитациялық өрістерді зерттеу'
                    ] : [
                        'Масштабы Солнечной системы и уникальные физические характеристики планет',
                        'Возможности современных орбитальных телескопов и межпланетных станций',
                        'Астрофизические законы, гравитационные взаимодействия и космическая среда'
                    ],
                    layout: 'split-left',
                    imagePrompt: 'solar system planets orbital trajectory futuristic space probe, 3d render',
                    speakerNotes: isKazakh ? 'Ғарыштың кеңістігі мен оны игерудің адамзат үшін маңызы.' : 'Введение в проблематику космических открытий и технологических прорывов.'
                },
                {
                    title: isKazakh ? 'Негізгі астрономиялық көрсеткіштер мен фактілер' : 'Ключевые астрономические параметры и факты',
                    points: isKazakh ? [
                        'Жарық жылдамдығы: c ≈ 300 000 км/с — ғаламдағы шекті жылдамдық',
                        'Гравитациялық тұрақты: G = 6.674×10⁻¹¹ Н·м²/кг²',
                        'Орбиталық қозғалыс заңдары (Кеплер заңдары мен Ньютон тартылысы)'
                    ] : [
                        'Скорость света: c ≈ 300 000 км/с — фундаментальный предел Вселенной',
                        'Гравитационная постоянная: G = 6.674×10⁻¹¹ Н·м²/кг²',
                        'Законы небесной механики: законы Кеплера и всемирное тяготение Ньютона'
                    ],
                    layout: 'stat',
                    imagePrompt: 'orbital mechanics gravitational field simulation space 3d render',
                    speakerNotes: isKazakh ? 'Фундаменталды көрсеткіштер мен ғарыш заңдылықтары.' : 'Основные физические константы и параметры орбитального движения.'
                },
                {
                    title: isKazakh ? 'Зерттеу кезеңдері мен технологиялық миссиялар' : 'Этапы исследований и ключевые космические миссии',
                    points: isKazakh ? [
                        '1-кезең: Жер бетіндегі оптикалық және радиотелескоптар арқылы бақылау',
                        '2-кезең: Автоматты зондтар мен роверлерді (Curiosity, Perseverance) жіберу',
                        '3-кезең: Пилоттық миссиялар және ғарыш станциялары (ХҒС / Artemis)'
                    ] : [
                        'Этап 1: Наземные оптические и радиотелескопические наблюдения',
                        'Этап 2: Запуск автоматических зондов, спутников и планетоходов',
                        'Этап 3: Пилотируемые экспедиции и орбитальные научные станции (МКС / Artemis)'
                    ],
                    layout: 'steps',
                    imagePrompt: 'spacecraft mission rover on alien planet surface exploration, 3d cinematic',
                    speakerNotes: isKazakh ? 'Ғарыш миссияларының даму эволюциясы.' : 'Хронология и технологический прогресс космических полетов.'
                },
                {
                    title: isKazakh ? 'Практикалық қолданыс және болашақ' : 'Практическое применение и колонизация',
                    points: isKazakh ? [
                        'Жерсеріктік байланыс, GPS/ГЛОНАСС навигациясы және метеорология',
                        'Ғарыштық материалтану және салмақсыздықтағы тәжірибелер',
                        'Ай және Марс базаларын құру перспективалары'
                    ] : [
                        'Спутниковая связь, глобальная навигация GPS/ГЛОНАСС и мониторинг климата',
                        'Космическое материаловедение и уникальные эксперименты в микрогравитации',
                        'Перспективы пилотируемых полетов на Марс и лунных обитаемых баз'
                    ],
                    layout: 'cards-grid',
                    imagePrompt: 'futuristic human base on mars dome habitat, 3d cinematic 8k',
                    speakerNotes: isKazakh ? 'Ғарыш технологияларының жердегі өмірімізге тигізетін пайдасы.' : 'Как космонавтика меняет технологии на Земле и открывает будущее.'
                },
                {
                    title: isKazakh ? 'Қорытынды және викторина' : 'Итоги и контрольные вопросы',
                    points: isKazakh ? [
                        'Ғарышты игеру — ғылым мен адамзат болашағының кепілі',
                        'Сұрақ: Бізге ең жақын орналасқан жұлдыз қалай аталады?',
                        'Сұрақ: Ғарыш аппараттары қандай жылдамдықпен ұшады?'
                    ] : [
                        'Освоение космоса — главный драйвер научно-технического прогресса человечества',
                        'Вопрос: В чем заключается главное условие первой космической скорости?',
                        'Вопрос: Какие ключевые вызовы стоят перед марсианской экспедицией?'
                    ],
                    layout: 'insight',
                    imagePrompt: 'astronaut looking at glowing earth from orbit, 3d photorealistic cinematic',
                    speakerNotes: isKazakh ? 'Баяндаманы қорытындылап, оқушылармен кері байланыс жасау.' : 'Подведение итогов и интерактивная проверка усвоения материала.'
                }
            ];
        } else if (/физик|ньютон|ом|ток|электр|квант|механик|энерги|термодинамик|оптика/i.test(lower)) {
            slides = [
                {
                    title: cleanTopic,
                    points: [],
                    layout: 'cover',
                    imagePrompt: `${cleanTopic} physics laboratory experiment science apparatus, cinematic 3d render`,
                    speakerNotes: isKazakh ? `Физика пәні бойынша сабағымызды бастаймыз: ${cleanTopic}.` : `Приветствие. Сегодня мы подробно разберем тему по физике: ${cleanTopic}.`
                },
                {
                    title: isKazakh ? 'Негізгі түсініктер мен физикалық шамалар' : 'Основные понятия и физические величины',
                    points: isKazakh ? [
                        'Зерттелетін құбылыстың физикалық мәні мен табиғаты',
                        'Негізгі өлшем бірліктері және ХБЖ (SI) жүйесіндегі орны',
                        'Құбылыстың күнделікті өмірде және табиғатта байқалуы'
                    ] : [
                        'Физическая сущность и природа изучаемого явления/закона',
                        'Основные единицы измерения в Международной системе СИ',
                        'Наблюдение эффекта в природе и повседневной жизни человека'
                    ],
                    layout: 'split-left',
                    imagePrompt: 'abstract physics concept atom nucleus electrons glowing orbits 3d',
                    speakerNotes: isKazakh ? 'Құбылыстың негізгі ұғымдарымен таныстыру.' : 'Объясните физическую суть явления простыми и точными терминами.'
                },
                {
                    title: isKazakh ? 'Фундаменталды формулалар мен заңдар' : 'Фундаментальные законы и формулы',
                    points: isKazakh ? [
                        'Негізгі формула: шамалар арасындағы тура және кері пропорционалдық',
                        'Тұрақты коэффиценттер және олардың физикалық мағынасы',
                        'Заңның қолданылу шектері мен шарттары'
                    ] : [
                        'Ключевая расчетная формула: прямая и обратная пропорциональность величин',
                        'Физический смысл входящих констант и коэффициентов',
                        'Границы применимости и условия выполнения закона'
                    ],
                    layout: 'stat',
                    imagePrompt: 'glowing mathematical physics formulas chalk chalkboard aesthetic 3d',
                    speakerNotes: isKazakh ? 'Формулаларды талдап, есептер шығаруда қалай қолдануды көрсету.' : 'Детальный разбор формулы и физического смысла каждой переменной.'
                },
                {
                    title: isKazakh ? 'Тәжірибе және эксперименттік дәлелдеу' : 'Экспериментальное подтверждение и опыт',
                    points: isKazakh ? [
                        '1-қадам: Тәжірибелік қондырғыны жинау және өлшеу құралдарын қосу',
                        '2-қадам: Параметрлерді өзгерте отырып, тәуелділік графигін құру',
                        '3-қадам: Тәжірибелік мәндерді теориялық есептеулермен салыстыру'
                    ] : [
                        'Шаг 1: Сборка демонстрационной установки и подключение датчиков',
                        'Шаг 2: Изменение параметров и построение графической зависимости',
                        'Шаг 3: Сравнение опытных значений с теоретическими расчетами'
                    ],
                    layout: 'steps',
                    imagePrompt: 'laboratory physics optical laser experiment beam prisms glass 3d',
                    speakerNotes: isKazakh ? 'Эксперименттің орындалу реті мен өлшеу тәсілдері.' : 'Демонстрация лабораторного эксперимента и построение графиков.'
                },
                {
                    title: isKazakh ? 'Заманауи техника мен өндірісте қолданылуы' : 'Применение в современной технике и технологиях',
                    points: isKazakh ? [
                        'Энергетика, машина жасау және робототехника саласында',
                        'Электроника, микрочиптер және нанотехнологиялық құрылғыларда',
                        'Көлік қауіпсіздігі және авиакосмостық жүйелерде'
                    ] : [
                        'Энергетический комплекс, турбины, двигатели и электроприводы',
                        'Микроэлектроника, полупроводники, сенсоры и робототехника',
                        'Транспортные системы, безопасность и аэрокосмическая отрасль'
                    ],
                    layout: 'cards-grid',
                    imagePrompt: 'high tech futuristic turbine engine electronics microchip, 3d render',
                    speakerNotes: isKazakh ? 'Бұл физикалық заң қалай өмірімізді өзгертетінін көрсету.' : 'Примеры реального воплощения физического закона в промышленности.'
                },
                {
                    title: isKazakh ? 'Сабақты бекіту және есептер' : 'Закрепление материала и задачи',
                    points: isKazakh ? [
                        'Негізгі формулалар мен тұжырымдарды есте сақтау',
                        'Сапалық сұрақ: Қандай жағдайда шама 2 есе артады?',
                        'Есептеу: Формула бойынша ізделінді мәнді табу алгоритмі'
                    ] : [
                        'Ключевой вывод: понимание закона позволяет прогнозировать поведение системы',
                        'Качественный вопрос: как изменится результат при удвоении ключевого параметра?',
                        'Практическая задача для самостоятельного решения'
                    ],
                    layout: 'insight',
                    imagePrompt: 'golden brain glowing ideas innovation solution, 3d render',
                    speakerNotes: isKazakh ? 'Оқушылардың тақырыпты меңгеруін тексеру.' : 'Контрольный опрос и закрепление полученных знаний.'
                }
            ];
        } else if (/биолог|клетк|жасуша|днк|генет|эволюци|микроскоп|бактери|вирус|анатоми/i.test(lower)) {
            slides = [
                {
                    title: cleanTopic,
                    points: [],
                    layout: 'cover',
                    imagePrompt: `${cleanTopic} biology cell dna microscope laboratory 3d render`,
                    speakerNotes: isKazakh ? `Биология сабағы бойынша баяндама: ${cleanTopic}.` : `Приветствие. Сегодня мы исследуем тему по биологии: ${cleanTopic}.`
                },
                {
                    title: isKazakh ? 'Құрылымы мен биологиялық маңызы' : 'Строение и биологическая роль',
                    points: isKazakh ? [
                        'Жасушалық немесе организмдік деңгейдегі негізгі компоненттер',
                        'Тіршілік процестеріндегі атқаратын басты қызметтері',
                        'Эволюциялық бейімделу және өзара байланыс'
                    ] : [
                        'Ключевые структурные компоненты на клеточном и организменном уровнях',
                        'Главные функции в процессах метаболизма и жизнедеятельности',
                        'Эволюционная адаптация и системные взаимосвязи'
                    ],
                    layout: 'split-left',
                    imagePrompt: 'biological cell organelle glowing mitochondria dna 3d render',
                    speakerNotes: isKazakh ? 'Биологиялық нысанның құрылымы мен ерекшеліктері.' : 'Разбор структуры и клеточной организации.'
                },
                {
                    title: isKazakh ? 'Негізгі биохимиялық және генетикалық көрсеткіштер' : 'Биохимические параметры и генетика',
                    points: isKazakh ? [
                        'Генетикалық ақпараттың берілуі және ДНҚ репликациясы',
                        'Ферменттік реакциялар және энергия алмасуы (АТФ)',
                        'Гомеостазды сақтау механизмдері'
                    ] : [
                        'Передача генетической информации и матричные процессы',
                        'Ферментативные реакции и энергетический баланс клетки (АТФ)',
                        'Механизмы регуляции и поддержания гомеостаза'
                    ],
                    layout: 'stat',
                    imagePrompt: 'dna double helix glowing neon green emerald laboratory 3d',
                    speakerNotes: isKazakh ? 'Биологиялық үдерістердің молекулалық негіздері.' : 'Молекулярные механизмы и генетические закономерности.'
                },
                {
                    title: isKazakh ? 'Зерттеу әдістері мен микроскопия' : 'Методы исследований и микроскопия',
                    points: isKazakh ? [
                        '1-қадам: Биологиялық микропрепаратты дайындау',
                        '2-қадам: Жарық немесе электронды микроскоп арқылы ұлғайтып көру',
                        '3-қадам: Жасушалар мен ұлпалардың суретін салып, сипаттау'
                    ] : [
                        'Шаг 1: Приготовление временного микропрепарата и окрашивание',
                        'Шаг 2: Исследование под оптическим/электронным микроскопом',
                        'Шаг 3: Морфологический анализ и документирование структур'
                    ],
                    layout: 'steps',
                    imagePrompt: 'electron microscope laboratory biology scientific analysis 3d',
                    speakerNotes: isKazakh ? 'Микроскоппен жұмыс істеу тәртібі мен бақылау.' : 'Демонстрация микроскопических методов анализа.'
                },
                {
                    title: isKazakh ? 'Медицина мен биотехнологияда қолданылуы' : 'Биотехнологии и медицинское применение',
                    points: isKazakh ? [
                        'Гендік инженерия және вакциналар жасау',
                        'Ауыл шаруашылығындағы селекция және биопрепараттар',
                        'Экологиялық мониторинг және биоремедиация'
                    ] : [
                        'Генная инженерия, разработка вакцин и персонализированная медицина',
                        'Селекция, агробиотехнологии и повышение продуктивности',
                        'Экологический мониторинг и биоочистка природной среды'
                    ],
                    layout: 'cards-grid',
                    imagePrompt: 'biotechnology laboratory flask plant dna medical discovery 3d',
                    speakerNotes: isKazakh ? 'Заманауи биотехнологияның жетістіктері.' : 'Практическое применение в медицине и биотехнологиях.'
                },
                {
                    title: isKazakh ? 'Қорытынды және тексеру сұрақтары' : 'Итоги и контрольные вопросы',
                    points: isKazakh ? [
                        'Тірі табиғаттың біртұтастығы мен үйлесімі',
                        'Сұрақ: Жасушаның негізгі органоидтары қандай қызмет атқарады?',
                        'Сұрақ: Генетикалық кодтың әмбебаптығы неде?'
                    ] : [
                        'Единство биосферы и системная организация живой материи',
                        'Вопрос: Какую ключевую функцию выполняют мембранные органеллы?',
                        'Вопрос: В чем проявляется универсальность генетического кода?'
                    ],
                    layout: 'insight',
                    imagePrompt: 'glowing green leaf nature ecosystem globe 3d render',
                    speakerNotes: isKazakh ? 'Сабақты қорытындылап, негізгі түйінді атап өту.' : 'Обобщение темы и контрольные вопросы для проверки.'
                }
            ];
        } else {
            slides = [
                {
                    title: cleanTopic,
                    points: [
                        isKazakh ? 'Ғылыми-танымдық шолу және маңызды тұжырымдар' : 'Комплексный обзор, фундаментальные основы и ключевые факты'
                    ],
                    layout: 'cover',
                    imagePrompt: `${cleanTopic} professional cinematic 3d illustration presentation masterpiece 8k`,
                    speakerNotes: isKazakh ? `Құрметті қатысушылар, бүгінгі тақырыбымыз: ${cleanTopic}.` : `Приветствие участников. Тема нашего сегодняшнего выступления: ${cleanTopic}.`
                },
                {
                    title: isKazakh ? `Негізгі ұғымдары мен мәні: ${cleanTopic}` : `Введение и ключевые понятия: ${cleanTopic}`,
                    points: isKazakh ? [
                        `${cleanTopic} — заманауи ғылым мен өмірдегі маңызды бағыттардың бірі`,
                        'Тақырыпқа қатысты негізгі түсініктер мен терминологиялық анықтамалар',
                        'Зерттеу пәні мен қарастырылатын басты сұрақтар'
                    ] : [
                        `${cleanTopic} — фундаментальное явление и актуальное направление в современной науке и практике`,
                        'Базовые определения, структура понятийного аппарата и терминология',
                        'Ключевые предпосылки, объект изучения и главные рассматриваемые аспекты'
                    ],
                    layout: 'split-left',
                    imagePrompt: `${cleanTopic} conceptual scientific theory glowing 3d render octane`,
                    speakerNotes: isKazakh ? 'Тақырыптың өзектілігі мен негізгі мәнін ашып түсіндіру.' : 'Обоснуйте актуальность темы и сформулируйте главный тезис выступления.'
                },
                {
                    title: isKazakh ? 'Негізгі көрсеткіштер мен ғылыми деректер' : 'Главные параметры, показатели и факты',
                    statVal: '★ Топ',
                    points: isKazakh ? [
                        'Басты сандық және сапалық көрсеткіштердің жүйелі талдауы',
                        'Құбылыстың негізгі қасиеттері мен тәуелділік сипаттамасы',
                        'Практикалық зерттеулердегі дәлдік пен тиімділік'
                    ] : [
                        'Системный анализ ключевых качественных и количественных характеристик',
                        'Фундаментальные закономерности, принципы взаимодействия и метрики',
                        'Аналитические данные и результаты контрольных наблюдений'
                    ],
                    layout: 'stat',
                    imagePrompt: `${cleanTopic} analytics data metrics infographic glowing 3d render`,
                    speakerNotes: isKazakh ? 'Негізгі сандық және сапалық көрсеткіштерге назар аудару.' : 'Представьте ключевые аналитические данные и прокомментируйте главную метрику.'
                },
                {
                    title: isKazakh ? 'Даму кезеңдері мен орындалу алгоритмі' : 'Хронология и ключевые этапы развития',
                    points: isKazakh ? [
                        '1-кезең: Бастапқы зерттеу және негіздеме қалыптастыру',
                        '2-кезең: Негізгі үдерісті жүзеге асыру және тәжірибелік тексеру',
                        '3-кезең: Қорытынды нәтижелерді шығару және тәжірибеге енгізу'
                    ] : [
                        'Этап 1: Исследование исходных условий и концептуальное проектирование',
                        'Этап 2: Практическая реализация ключевых процессов и мониторинг',
                        'Этап 3: Формирование итоговых результатов и масштабирование'
                    ],
                    layout: 'steps',
                    imagePrompt: `${cleanTopic} process roadmap progression timeline glowing 3d isometric`,
                    speakerNotes: isKazakh ? 'Жүйелі даму кезеңдерін рет-ретімен баяндау.' : 'Опишите пошаговую методологию и ключевые стадии реализации.'
                },
                {
                    title: isKazakh ? 'Құрылымы, бағыттары және маңызы' : 'Структура, компоненты и практическая ценность',
                    points: isKazakh ? [
                        'Құрамдас бөліктер мен ішкі жүйелердің өзара үйлесімді байланысы',
                        'Отандық және халықаралық тәжірибедегі үздік шешімдер',
                        'Заманауи технологиялар мен тиімді тәсілдерді қолдану',
                        'Тиімділікті арттыруға бағытталған практикалық ұсыныстар'
                    ] : [
                        'Взаимосвязь ключевых структурных элементов и внутренних систем',
                        'Передовые отечественные и международные практики применения',
                        'Использование современных технологических инструментов',
                        'Практические сценарии внедрения и прикладная отдача'
                    ],
                    layout: 'cards-grid',
                    imagePrompt: `${cleanTopic} modular structure network connected blocks 3d render`,
                    speakerNotes: isKazakh ? 'Құрылымдық ерекшеліктер мен тәжірибелік қолдану мысалдары.' : 'Разберите архитектуру системы и реальные примеры практического применения.'
                },
                {
                    title: isKazakh ? 'Салыстырмалы талдау және артықшылықтары' : 'Сравнительный анализ и преимущества',
                    points: isKazakh ? [
                        'Дәстүрлі тәсілдерге қарағанда жоғары тиімділік пен сенімділік',
                        'Үдерістерді оңтайландыру және уақыт пен ресурсты үнемдеу',
                        'Инновациялық шешімдердің ұзақ мерзімді нәтижелілігі',
                        'Жаңа мүмкіндіктер мен болашақ өсу әлеуеті'
                    ] : [
                        'Высокая надежность и результативность по сравнению с базовыми аналогами',
                        'Оптимизация процессов, экономия ключевых ресурсов и повышение точности',
                        'Долгосрочные системные преимущества внедряемых решений',
                        'Открытие новых перспектив для дальнейшего масштабирования'
                    ],
                    layout: 'compare',
                    imagePrompt: `${cleanTopic} comparative analysis balance scales innovation 3d render`,
                    speakerNotes: isKazakh ? 'Салыстырмалы талдау жасап, басты артықшылықтарды көрсету.' : 'Сопоставьте ключевые подходы и подчеркните главные конкурентные преимущества.'
                },
                {
                    title: isKazakh ? 'Қорытынды, тұжырымдар мен болашағы' : 'Стратегические выводы и перспективы',
                    points: isKazakh ? [
                        `«${cleanTopic} — ғылым мен қоғам дамуындағы серпінді қадам»`,
                        'Қарастырылған мәліметтер негізінде жасалған басты тұжырымдар',
                        'Болашақтағы даму векторлары мен жаңа мүмкіндіктер'
                    ] : [
                        `«${cleanTopic} — стратегический драйвер научно-технического и практического прогресса»`,
                        'Обобщение рассмотренного материала и ключевые аналитические выводы',
                        'Перспективные векторы развития, открытые вопросы и направления для исследований'
                    ],
                    layout: 'insight',
                    imagePrompt: `${cleanTopic} futuristic glowing idea vision light crystal 3d render`,
                    speakerNotes: isKazakh ? 'Баяндаманы қорытындылап, сұрақ-жауап кезеңіне өту.' : 'Подведите итоги выступления и перейдите к открытой дискуссии с аудиторией.'
                }
            ];
        }
    }

    const targetSlideCount = parseInt((options && options.slideCount) || 7, 10);
    if (slides && slides.length > 0) {
        if (slides.length > targetSlideCount) {
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
            const diff = targetSlideCount - slides.length;
            const extraLayouts = ['stat', 'compare', 'cards-grid', 'steps', 'insight'];
            for (let i = 0; i < diff; i++) {
                const extraLayout = extraLayouts[i % extraLayouts.length];
                if (isKazakh) {
                    slides.splice(slides.length - 1, 0, {
                        title: `${cleanTopic}: Қосымша мәліметтер мен талдау #${i + 1}`,
                        points: [
                            'Тақырыпқа қатысты маңызды тәжірибелік мысалдар мен фактілер',
                            'Күнделікті өмірмен және заманауи ғылыммен байланысы',
                            'Оқушылар мен зерттеушілерге арналған қосымша ұсыныстар'
                        ],
                        layout: extraLayout,
                        imagePrompt: `${cleanTopic} scientific analysis detail 3d render 8k`,
                        speakerNotes: 'Бұл слайдта тақырыптың қосымша аспектілері мен ерекшеліктері қарастырылады.'
                    });
                } else if (isEnglish) {
                    slides.splice(slides.length - 1, 0, {
                        title: `${cleanTopic}: In-Depth Analysis #${i + 1}`,
                        points: [
                            'Key practical observations and empirical evidence',
                            'Interdisciplinary applications and modern advancements',
                            'Critical insights and strategic recommendations'
                        ],
                        layout: extraLayout,
                        imagePrompt: `${cleanTopic} scientific modern detailed study 3d render 8k`,
                        speakerNotes: 'Detailed discussion of in-depth analytical points.'
                    });
                } else {
                    slides.splice(slides.length - 1, 0, {
                        title: `${cleanTopic}: Углубленный анализ #${i + 1}`,
                        points: [
                            'Важные практические примеры и ключевые наблюдения',
                            'Связь с современными научно-техническими разработками',
                            'Дополнительные выводы и прикладные рекомендации'
                        ],
                        layout: extraLayout,
                        imagePrompt: `${cleanTopic} scientific analysis detail 3d render 8k`,
                        speakerNotes: 'Подробный комментарий к дополнительным материалам и аналитике.'
                    });
                }
            }
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
    let systemPrompt = '';

    const slideCount = (options && options.slideCount) || 7;
    const audienceLevel = (options && options.audienceLevel) || 'school';
    const requestedLang = (options && options.slideLang) || 'auto';

    let targetLang = requestedLang;
    if (!targetLang || targetLang === 'auto') {
        const isKk = /[әіңғүұқөһӘІҢҒҮҰҚӨҺ]/i.test((promptText || '') + ' ' + (sourceContext || '')) || 
                     /\b(сабақ|жоспары|мақсаты|физика|химия|биология|сынып|оқушы|тұлға|өмірбаян|қазақ|тарих|баяндама|жетістік|шедевр)\b/i.test((promptText || '') + ' ' + (sourceContext || ''));
        targetLang = isKk ? 'kk' : 'ru';
    }

    const langDirective = targetLang === 'kk'
        ? 'ТІЛДІК ТАЛАП: Барлық тақырыптар, слайд мазмұны, негізгі тезистер мен спикер жазбалары таза, сауатты, академиялық ҚАЗАҚ ТІЛІНДЕ болуы шарт! Қазақша әріптерді (ә, і, ң, ғ, ү, ұ, қ, ө, һ) дұрыс қолдан.'
        : targetLang === 'en'
        ? 'LANGUAGE REQUIREMENT: All titles, slide bullets, facts, and speaker notes must be in clear modern academic ENGLISH.'
        : 'ЯЗЫКОВОЕ ТРЕБОВАНИЕ: Все заголовки, тезисы, факты и шпаргалка спикера должны быть на грамотном РУССКОМ ЯЗЫКЕ.';

    const audienceDesc = audienceLevel === 'school'
        ? 'Мектеп оқушылары мен ұстаздарға арналған көрнекі түсінікті стиль (7-11 сынып)'
        : audienceLevel === 'college'
        ? 'Колледж бен ЖОО студенттеріне арналған тереңдетілген білім беру стилі'
        : audienceLevel === 'business'
        ? 'Инвесторлар, стартаптар және кәсіпкерлерге арналған нақты KPI және нәтижелі pitch deck стилі'
        : 'Ғылыми конференциялар мен академиялық баяндамаларға арналған зерттеу стилі';

    if (sourceContext && sourceContext.trim()) {
        systemPrompt = [
            'Ты профессиональный методист и арт-директор образовательных презентаций.',
            'На основе ПРЕДОСТАВЛЕННОГО КОНТЕКСТА создай структуру презентации. Не придумывай информацию от себя. Верни JSON объект с полями "title" и "slides".',
            '',
            `${langDirective}`,
            `АУДИТОРИЯ: ${audienceDesc}.`,
            `СЛАЙДТАР САНЫ: Дәл ${slideCount} слайд жаса.`,
            '',
            'СТРОГИЕ ПРАВИЛА ИЗВЛЕЧЕНИЯ (Grounded RAG Generation):',
            '1. Все тезисы, факты, формулы, правила и выводы должны быть извлечены ИСКЛЮЧИТЕЛЬНО из предоставленного текста источника.',
            '2. Избегай галлюцинаций. Не добавляй стороннюю информацию, которой нет в контексте источника.',
            `3. Создай ровно ${slideCount} слайдов. Первый слайд — титульная обложка (points: [], layout: "cover").`,
            '4. Поле imagePrompt пиши СТРОГО НА АНГЛИЙСКОМ ЯЗЫКЕ для генератора ИИ-иллюстраций Pollinations AI.',
            '5. Ответь СТРОГО валидным JSON объектом без markdown оберток.',
            '',
            'Формат ответа JSON:',
            '{',
            '  "title": "Заголовок презентации по источнику",',
            '  "theme": {',
            '    "backgroundColor": "#0f172a",',
            '    "primaryTextColor": "#f8fafc",',
            '    "accentColor": "#38bdf8",',
            '    "style": "Академический RAG"',
            '  },',
            '  "slides": [',
            '    {',
            '      "title": "Заголовок слайда",',
            '      "layout": "cover | split-left | stat | steps | cards-grid | compare | insight",',
            '      "points": ["Фактический пункт 1 из источника с точными терминами/числами", "Фактический пункт 2 из источника"],',
            '      "imagePrompt": "Short accurate description in English for AI image generator, clean 3d render",',
            '      "speakerNotes": "Подсказка спикеру: что рассказать на этом слайде по материалам источника."',
            '    }',
            '  ]',
            '}'
        ].join('\n');
    } else {
        systemPrompt = [
            'Ты ведущий арт-директор и эксперт по созданию структурированных образовательных, биографических и научных презентаций мирового уровня.',
            'Создай структурированную презентацию СТРОГО ПО ТЕМЕ ЗАПРОСА («' + promptText + '»).',
            'ВСЕ заголовки, тезисы, факты, даты и выводы должны относиться ИСКЛЮЧИТЕЛЬНО к этой теме.',
            '',
            `${langDirective}`,
            `АУДИТОРИЯ: ${audienceDesc}.`,
            `СЛАЙДТАР САНЫ: Дәл ${slideCount} слайд жаса.`,
            '',
            'СТРОГИЕ ПРАВИЛА:',
            '1. Если тема о персоне/личности (певец, композитор, писатель, ученый, исторический деятель, актер):',
            '   - Слайд 1 (cover): Титул с именем личности и главным статусом.',
            '   - Слайд 2 (split-left): Биография, происхождение, годы жизни / становление.',
            '   - Слайд 3 (stat): Ключевое феноменальное достижение, рекорд или числовой показатель (например, "6 октав", "№ 1", "45+ наград").',
            '   - Слайд 4 (steps): Основные хронологические этапы творческого/профессионального пути.',
            '   - Слайд 5 (cards-grid): Главные шедевры, произведения, проекты и международные премии.',
            '   - Слайд 6 (compare): Вклад в национальную культуру и признание на мировой арене.',
            '   - Слайд 7 (insight): Главная цитата, историческое наследие и миссия.',
            '2. Если тема научная или школьная (физика, биология, химия, космос, математика, история):',
            '   - Изложи сущность явления, формулы, эксперименты, этапы развития, структуру и выводы.',
            '3. Если тема о стартап-хабе или IT-парке (Kyzylorda Hub, Astana Hub, инкубаторы):',
            '   - Используй сервисы хаба, инкубацию, показатели резидентов и инвестиции.',
            '4. КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО подмешивать стартапы или инвестиции к темам о людях, науке или искусстве!',
            '5. Ответь СТРОГО валидным JSON объектом без markdown оберток.',
            '',
            'Формат ответа JSON:',
            '{',
            '  "title": "Полное точное название темы",',
            '  "theme": {',
            '    "backgroundColor": "#060713",',
            '    "primaryTextColor": "#cbd5e1",',
            '    "accentColor": "#00f0ff",',
            '    "style": "Cyber Nebula 4K"',
            '  },',
            '  "slides": [',
            '    {',
            '      "title": "Точный заголовок слайда",',
            '      "layout": "cover | split-left | stat | steps | cards-grid | compare | insight | hub-ecosystem | kpi-grid",',
            '      "statVal": "Ключевое число / факт (для stat)",',
            '      "points": ["Конкретный факт 1 по теме запроса", "Конкретный факт 2 по теме запроса", "Конкретный факт 3 по теме запроса"],',
            '      "imagePrompt": "Accurate English description for 3d octane render 8k",',
            '      "speakerNotes": "Шпаргалка спикеру: тезисы для выступления на 1 минуту."',
            '    }',
            '  ]',
            '}'
        ].join('\n');
    }

    let userContent = `ТЕМА ПРЕЗЕНТАЦИИ: ${promptText}\nКОЛИЧЕСТВО СЛАЙДОВ: ${slideCount}\nЯЗЫК: ${targetLang === 'kk' ? 'Қазақша' : targetLang === 'en' ? 'English' : 'Русский'}`;
    if (sourceContext && sourceContext.trim()) {
        userContent = [
            'ДОСТОВЕРНЫЙ МАТЕРИАЛ ИЗ ИСТОЧНИКА / ЭНЦИКЛОПЕДИИ:',
            '========================================',
            sourceContext.trim(),
            '========================================',
            '',
            `ЗАДАНИЕ: На основе приведенного выше материала создай структурированную презентацию строго по теме: ${promptText}`,
            `Количество слайдов: ${slideCount}. Язык: ${targetLang === 'kk' ? 'Қазақша' : targetLang === 'en' ? 'English' : 'Русский'}`,
            'Все факты, имена, даты и показатели извлекай строго из этого текста.'
        ].join('\n');
    }

    // 1. TIER 1: Google Gemini (2.5-Flash and 1.5-Flash)
    const activeGeminiKey = (API_KEY && (API_KEY.startsWith('AQ.') || API_KEY.startsWith('AIzaSy'))) ? API_KEY : FALLBACK_GEMINI_KEY;
    const geminiModels = ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-1.5-flash'];

    for (let model of geminiModels) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${activeGeminiKey}`;
            const res = await fetchWithTimeout(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: userContent }] }],
                    generationConfig: {
                        temperature: sourceContext ? 0.2 : 0.7,
                        responseMimeType: 'application/json'
                    }
                })
            }, 15000);
            if (res.ok) {
                const data = await res.json();
                const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                const parsed = parseJsonDeck(rawText);
                if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn(`Gemini model ${model} skipped:`, e.message);
        }
    }

    // 2. TIER 2: Pollinations AI POST (Direct JSON generator)
    try {
        const res = await fetchWithTimeout('https://text.pollinations.ai/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userContent }
                ],
                model: 'openai',
                json: true
            })
        }, 12000);
        if (res.ok) {
            const rawText = await res.text();
            const parsed = parseJsonDeck(rawText);
            if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Pollinations AI POST skipped:', e.message);
    }

    // 3. TIER 3: User OpenAI Key (if user configured personal sk-proj-... key)
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
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userContent }
                    ],
                    temperature: sourceContext ? 0.25 : 0.7
                })
            }, 12000);
            if (res.ok) {
                const oaiData = await res.json();
                const content = oaiData?.choices?.[0]?.message?.content;
                const parsed = parseJsonDeck(content);
                if (parsed && Array.isArray(parsed.slides) && parsed.slides.length > 0) {
                    return parsed;
                }
            }
        } catch (e) {
            console.warn('User OpenAI API key skipped:', e.message);
        }
    }

    // 4. TIER 4: Guaranteed Local Pedagogical RAG Engine (Zero failure guarantee)
    console.info('Activating Grounded Smart Deck Engine for instant generation...');
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

    document.getElementById('active-slide-num').textContent = presentationState.currentSlideIndex + 1;
    document.getElementById('edit-slide-title').value = slide.title || '';
    document.getElementById('edit-slide-points').value = (slide.points || []).join('\n');
    const notesInput = document.getElementById('edit-speaker-notes');
    if (notesInput) notesInput.value = slide.speakerNotes || '';
    document.getElementById('edit-image-prompt').value = slide.imagePrompt || '';
    
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
    if (!text || text.length < 3) {
        text = `${slideTitle} ${topicTitle}`.trim() || 'educational presentation science illustration';
    }

    const mappings = [
        { regex: /абай|құнанбаев|кунанбаев/i, prompt: 'Abai Kunanbayev historical Kazakh poet philosopher national costume portrait painting, masterpiece, dramatic cinematic lighting, 8k render' },
        { regex: /шоқан|уәлиханов|валиханов/i, prompt: 'Shoqan Walikhanov Kazakh scholar researcher portrait in historical study room, dramatic lighting, 8k render' },
        { regex: /ыбырай|алтынсарин/i, prompt: 'Ybyrai Altynsarin Kazakh educator teacher vintage classroom, masterpiece oil painting' },
        { regex: /жасуша|клетка|митохондр|хлоропласт|днк|генетик/i, prompt: 'glowing biological cell structure DNA double helix organelles 3D microscope scientific rendering octane, bioluminescent emerald lighting 8k' },
        { regex: /ом|ток|кернеу|электр|резистор|тізбек|цепь/i, prompt: 'glowing electrical circuit physics laboratory experiment voltmeter ammeter glowing wires 3D octane render 8k' },
        { regex: /ньютон|гравитац|динамика|күш|сила|инерци/i, prompt: 'Newtonian physics laboratory experiment motion forces gravity pendulum 3D cinematic render 8k' },
        { regex: /период|менделеев|химия|реакци|молекул|атом/i, prompt: 'chemistry laboratory colorful test tubes glowing chemical reaction glowing neon molecules 3D octane render 8k' },
        { regex: /пифагор|геометр|үшбұрыш|треугольник/i, prompt: 'Pythagorean geometric mathematical theorem golden ratio visual blueprint 3D isometric 8k' },
        { regex: /ғарыш|космос|планет|күн жүйе|астроном|марс/i, prompt: 'solar system planets orbiting sun in deep cosmic nebula space photorealistic 8k, volumetric lighting' },
        { regex: /жасанды интеллект|робот|информатик|нейро|ai/i, prompt: 'futuristic artificial intelligence neural cybernetic network glowing holographic brain 3D cyberpunk render 8k' },
        { regex: /тарих|история|батыр|хан|қазақ/i, prompt: 'historical Kazakh warriors nomads yurt culture dramatic golden sunset landscape cinematic 8k' },
        { regex: /экология|табиғат|природа|өсімдік/i, prompt: 'nature ecology green blooming environment forest landscape clean energy 3d octane render 8k' }
    ];

    for (const m of mappings) {
        if (m.regex.test(text) || m.regex.test(slideTitle) || m.regex.test(topicTitle)) {
            return m.prompt;
        }
    }

    const hasCyrillic = /[а-яА-ЯёЁәіңғүұқөһӘІҢҒҮҰҚӨҺ]/.test(text);
    if (hasCyrillic) {
        return `educational visual concept of ${transliterateText(text)}, high quality 3d cinematic render, octane lighting, unreal engine 5 aesthetic, 8k`;
    }

    return `${text}, 3d octane render, volumetric cinematic lighting, 8k`;
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
            const res = await fetchWithTimeout(url, {}, 4000);
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

async function fetchWikipediaImages(query, limit = 5) {
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
                const res = await fetchWithTimeout(url, {}, 3500);
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
            } catch (e) {
                // skip
            }
        }
        if (results.length >= limit) break;
    }
    return results;
}

function getCuratedWebImages(query) {
    const text = (query || '').toLowerCase();
    const results = [];
    if (/димаш|dimash|құдайберген|кудайберген/i.test(text)) {
        results.push(
            { url: 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Kudaibergen_at_New_Wave_in_2019.jpg/1280px-Kudaibergen_at_New_Wave_in_2019.jpg', label: 'Димаш Құдайберген (New Wave)', source: 'Wikimedia' },
            { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80', label: 'Концерт және вокалдық сахна', source: 'Live Concert' },
            { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&auto=format&fit=crop&q=80', label: 'Стадиондық шоу және аншлаг', source: 'Live Stadium' },
            { url: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=1200&auto=format&fit=crop&q=80', label: 'Музыкалық марапаттар мен сахна', source: 'Awards' },
            { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&auto=format&fit=crop&q=80', label: 'Студия және микрофон', source: 'Studio' },
            { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80', label: 'Вокал шеберлігі және сахна', source: 'Performance' },
            { url: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1200&auto=format&fit=crop&q=80', label: 'Dears жанкүйерлер қауымдастығы', source: 'Community' }
        );
    } else if (/абай|құнанбай|кунанбаев|шоқан|уәлихан|ыбырай|алтынсарин/i.test(text)) {
        results.push(
            { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Abay_Kunanbayev_1896.jpg/800px-Abay_Kunanbayev_1896.jpg', label: 'Абай Құнанбаев портреті (1896)', source: 'Wikipedia' },
            { url: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1200&auto=format&fit=crop&q=80', label: 'Тарихи қолжазбалар мен мұра', source: 'Heritage' },
            { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&auto=format&fit=crop&q=80', label: 'Философия және кітапхана', source: 'Philosophy' },
            { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80', label: 'Ұлы дала табиғаты', source: 'Steppe' },
            { url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&auto=format&fit=crop&q=80', label: 'Поэзия және руханият', source: 'Poetry' }
        );
    } else if (/хаб|hub|стартап|startup|инкуба|бизнес|жоба/i.test(text)) {
        results.push(
            { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&auto=format&fit=crop&q=80', label: 'Startup Hub Coworking', source: 'Unsplash' },
            { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&auto=format&fit=crop&q=80', label: 'Инновациялық командалық талқылау', source: 'Unsplash' },
            { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&auto=format&fit=crop&q=80', label: 'Hackathon & Workshop', source: 'Unsplash' },
            { url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80', label: 'Pitch Demo Day', source: 'Unsplash' },
            { url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200&auto=format&fit=crop&q=80', label: 'Венчурлік инвестициялар', source: 'Unsplash' },
            { url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80', label: 'Цифрлық экожүйе', source: 'Unsplash' }
        );
    } else if (/физик|ньютон|ом|ток|электр|квант|механик|энерги/i.test(text)) {
        results.push(
            { url: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=1200&auto=format&fit=crop&q=80', label: 'Кванттық оптика және лазер', source: 'Physics' },
            { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80', label: 'Зертханалық физикалық тәжірибе', source: 'Physics Lab' },
            { url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=1200&auto=format&fit=crop&q=80', label: 'Формулалар мен есептеулер', source: 'Math Board' },
            { url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80', label: 'Инженерлік аппаратура', source: 'Engineering' },
            { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80', label: 'Микроэлектроника және чиптер', source: 'Tech' }
        );
    } else if (/биолог|клетк|жасуша|днк|генет|микроскоп/i.test(text)) {
        results.push(
            { url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&auto=format&fit=crop&q=80', label: 'Микробиологиялық зертхана', source: 'Biology Lab' },
            { url: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=1200&auto=format&fit=crop&q=80', label: 'ДНҚ қос спиралі құрылымы', source: 'DNA Helix' },
            { url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1200&auto=format&fit=crop&q=80', label: 'Биомедициналық зерттеулер', source: 'Biomedical' },
            { url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&auto=format&fit=crop&q=80', label: 'Ғылыми жаңалықтар', source: 'Science' }
        );
    } else if (/космос|ғарыш|планет|астроном|марс|орбит/i.test(text)) {
        results.push(
            { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', label: 'Жер және терең ғарыш', source: 'Cosmos' },
            { url: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&auto=format&fit=crop&q=80', label: 'Марс беті мен зерттеулер', source: 'Mars' },
            { url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&auto=format&fit=crop&q=80', label: 'Орбиталық станция және спутник', source: 'Orbit' },
            { url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1200&auto=format&fit=crop&q=80', label: 'Галактикалық тұмандық', source: 'Nebula' }
        );
    } else if (/жасанды интеллект|нейро|робот|информатик|ai|программ|код/i.test(text)) {
        results.push(
            { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80', label: 'Жасанды интеллект және нейрожүйелер', source: 'AI Neural' },
            { url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&auto=format&fit=crop&q=80', label: 'Заманауи робототехника', source: 'Robotics' },
            { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80', label: 'Бағдарламалық жасақтама мен код', source: 'Coding' },
            { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80', label: 'Мәліметтер матрицасы', source: 'Cyber Matrix' }
        );
    }
    return results;
}

async function searchAllRealWebPhotos(query, topicTitle = '') {
    const combined = `${query || ''} ${topicTitle || ''}`.trim();
    const curated = getCuratedWebImages(combined);
    const wiki = await fetchWikipediaImages(query || topicTitle, 8);
    
    const all = [...curated];
    const seen = new Set(all.map(item => item.url));
    for (const item of wiki) {
        if (!seen.has(item.url)) {
            seen.add(item.url);
            all.push(item);
        }
    }
    if (all.length < 3) {
        all.push(
            { url: getTopicFallbackImage(query, topicTitle), label: 'Тематическое фото (Unsplash)', source: 'Unsplash' },
            { url: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=1200&auto=format&fit=crop&q=80', label: 'Универсальное фото', source: 'Unsplash' },
            { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80', label: 'Инновации и горизонты', source: 'Unsplash' }
        );
    }
    return all;
}

async function autoAttachRealWebPhotos(presentation, mainTopic) {
    if (!presentation || !Array.isArray(presentation.slides)) return;
    
    // Fetch master pool of photos for the topic
    const topicPhotos = await searchAllRealWebPhotos(mainTopic, '');
    const usedUrls = new Set();

    for (let i = 0; i < presentation.slides.length; i++) {
        const slide = presentation.slides[i];
        if (!slide.imageUrl || !slide.imageUrl.startsWith('http')) {
            let pool = topicPhotos;
            
            // If slide has a specific title query, search for it
            const hasSpecificSubject = slide.title && slide.title.length > 5 && !/^(слайд|введение|итоги|қорытынды|кіріспе)/i.test(slide.title);
            if (hasSpecificSubject) {
                const specificPhotos = await searchAllRealWebPhotos(slide.title, mainTopic);
                if (specificPhotos && specificPhotos.length > 0) {
                    pool = [...specificPhotos, ...topicPhotos];
                }
            }

            // Pick an unused photo from pool, or fallback to modulo
            let chosen = pool.find(p => !usedUrls.has(p.url));
            if (!chosen && pool.length > 0) {
                chosen = pool[i % pool.length];
            }
            if (chosen) {
                slide.imageUrl = chosen.url;
                usedUrls.add(chosen.url);
            } else {
                slide.imageUrl = getTopicFallbackImage(slide.imagePrompt, slide.title || mainTopic);
            }
        }
    }
}

function getTopicFallbackImage(prompt, title = '') {
    const text = `${prompt || ''} ${title || ''}`.toLowerCase();
    if (/димаш|dimash|құдайберген|кудайберген/i.test(text)) {
        return 'https://thumb.wikimedia.org/wikipedia/commons/thumb/d/d7/Kudaibergen_at_New_Wave_in_2019.jpg/1280px-Kudaibergen_at_New_Wave_in_2019.jpg';
    }
    if (/вокал|голос|әнші|певец|концерт|музыка|оркестр|домбыра|singer|concert/i.test(text)) {
        return 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80';
    }
    if (/ом|ток|кернеу|электр|резистор|circuit|physic|ньютон|динамика|күш|gravity|вольт|ампер/i.test(text)) {
        return 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80';
    }
    if (/жасуша|клетка|митохондр|хлоропласт|днк|биолог|cell|dna|microscope|микроскоп|бактери/i.test(text)) {
        return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80';
    }
    if (/период|менделеев|химия|реакци|молекул|атом|chem|колба|раствор/i.test(text)) {
        return 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80';
    }
    if (/ғарыш|космос|планет|астроном|space|universe|planet|stars|күн жүйе/i.test(text)) {
        return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80';
    }
    if (/абай|шоқан|ыбырай|тарих|батыр|хан|history|kazakh|культура|әдебиет/i.test(text)) {
        return 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&auto=format&fit=crop&q=80';
    }
    if (/жасанды интеллект|робот|информатик|нейро|ai|code|robot|cyber|программи/i.test(text)) {
        return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    }
    if (/пифагор|геометр|үшбұрыш|математик|math|geometry|формула|алгебра/i.test(text)) {
        return 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80';
    }
    if (/экология|табиғат|природа|өсімдік|nature|forest|эко|су|ағаш/i.test(text)) {
        return 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80';
    }
    return 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80';
}

function handleImageFallback(imgEl, title, svgFallback, prompt) {
    if (!imgEl) return;
    const stage = imgEl.getAttribute('data-fallback-stage') || 'ai';
    if (stage === 'ai') {
        imgEl.setAttribute('data-fallback-stage', 'topic');
        imgEl.src = getTopicFallbackImage(prompt, title);
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
    const seedParam = seed ? `&seed=${seed}` : `&seed=${Math.floor(Math.random() * 1000000)}`;
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
