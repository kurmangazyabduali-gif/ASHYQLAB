// Google Translate cookie helpers
function purgeGoogleTranslateCookies() {
    ['googtrans', 'googtrans_prev', 'googtrans_saved'].forEach(function(c) {
        document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (location.hostname) {
            document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname + ";";
            document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + location.hostname + ";";
        }
    });
}
if ((localStorage.getItem('vsh-lang') || 'kk') === 'kk') {
    purgeGoogleTranslateCookies();
}

/**
 * AshyqLab — Main Lobby Script
 */

// ══════════════════════════════════════════
//  TRANSLATIONS
// ══════════════════════════════════════════
const i18n = {
    ru: {
        heroBadge: '🔬 Интерактивные лаборатории',
        heroSubtitle: 'Центр интерактивных лабораторных исследований',
        searchPlaceholder: 'Поиск по 32 лабораториям (например: Оптика, Клетка, Пифагор)...',
        chemistry: 'Химия', tools: 'Инструменты',
        statLabsLabel: 'лабораторий', statVisitedLabel: 'пройдено',
        statProgressLabel: 'прогресс', statSubjectsLabel: 'предметов',
        recentTitle: '🕐 Недавно открытые', progressLabel: 'Ваш прогресс',
        announceText: 'Новые лаборатории добавлены: Фотосинтез • Реакции • Алгоритмы',
        aboutTitle: 'ℹ️ О проекте',
        about1Title: 'Цель проекта', about1Text: 'Интерактивные виртуальные лаборатории помогают ученикам понять сложные темы через практику и визуализацию.',
        about2Title: 'Как пользоваться', about2Text: 'Выберите предмет, откройте лабораторию и экспериментируйте! Все симуляции работают прямо в браузере без установки.',
        about3Title: 'Любое устройство', about3Text: 'Сайт адаптирован для компьютеров, планшетов и смартфонов. Учитесь где угодно и когда угодно.',
        footerText: 'AshyqLab • Интерактивные лабораторные работы • 2025',
        soon: 'Скоро',
        physics: 'Физика', informatics: 'Информатика', geometry: 'Геометрия',
        kazakh: 'Қазақ тілі', english: 'English', biology: 'Биология',
        gravity: 'Гравитация', optics: 'Оптика', pendulum: 'Маятники', waves: 'Волны',
        logic: 'Логические Схемы', crypto: 'Шифры и Загадки',
        algo: 'Алгоритмы', binary: 'Двоичный код',
        fractals: 'Фракталы', spiro: 'Спирограф', transform: 'Гео-Мастер', pythagoras: 'Теорема Пифагора',
        cards_kk: 'Сөздік Карточкалары', morphology: 'Сөз Конструкторы', grammar: 'Грамматика', phonetics_kk: 'Дыбыстар',
        cards_en: 'Vocabulary Lab', tenses: 'Машина времен', spelling: 'Spelling Bee', idioms: 'Идиомы',
        biolab: 'Живая Клетка', photosynthesis: 'Фотосинтез', genetics: 'Законы Менделя', anatomy: 'Анатомия',
        periodic: 'Таблица Менделеева', reactions: 'Химические реакции', molecules: 'Конструктор молекул', ph_scale: 'Шкала pH',
        calculator: 'Научный калькулятор', converter: 'Конвертер единиц', graphing: 'Графики функций', stopwatch: 'Секундомер',
        createPresentation: 'Создание презентации',
        tabAll: '🌟 Все предметы (8)', tabExact: '⚛️ Точные науки', tabIT: '💻 IT & Информатика', tabNature: '🌿 Естествознание', tabLang: '🌐 Языки', tabTools: '🛠️ Инструменты',
        noResults: 'Ничего не найдено',
        createGame: '🎓 Создать игру', aiName: 'Нейро-Ассистент', aiStatus: 'В сети • Готов помочь',
        aiHello: 'Привет! Я встроенный ИИ <b>AshyqLab</b>. Если у вас есть вопросы по любой теме учебной программы или вам нужна помощь с навигацией по сайту — просто спросите меня!',
        aiPlaceholder: 'Спроси о чем угодно...', aiThinking: 'Анализирую запрос...',
        mobileSubjectPrompt: '📚 Выберите предмет для изучения:',
        expandAll: 'Развернуть все',
        collapseAll: 'Свернуть все',
        labsUnit: 'лаб',
        dockHome: 'Главная',
        dockSubjects: 'Предметы',
        dockAI: 'ИИ Чат',
        dockStudio: 'Игры',
        dockSlides: 'Слайды',
        navHome: 'Главная',
        navSubjects: 'Предметы',
        navSubjectsBadge: '7–11 кл',
        navCreative: 'AI & Студия',
        navTools: 'Инструменты',
        navTagline: '32 интерактивные лаборатории',
        quickSearch: 'Поиск...',
        megaSubjectsTitle: '📚 Образовательные предметы',
        viewAllClasses: '🎓 Все классы (7-11) →',
        presentationTitle: 'AI Презентации',
        presentationDesc: 'Слайды за 15 секунд по методичке',
        showcasePresentationTitle: 'AI Презентации',
        showcasePresentationDesc: 'Создание презентаций за 15 секунд по методичке с 20 готовыми дизайнами',
        docsTitle: 'AI Документация',
        docsDesc: 'КСП, СОР, СОЧ и поурочные планы',
        showcaseDocsTitle: 'AI Документация',
        showcaseDocsDesc: 'Генерация КСП/ҚМЖ, СОР/СОЧ, тестов и аналитики по ГОСО с экспортом в Word (.docx)',
        studioTitle: 'Конструктор игр',
        studioDesc: 'Викторины, тесты и мини-игры',
        showcaseStudioTitle: 'Конструктор игр',
        showcaseStudioDesc: 'Создавайте свои интерактивные викторины, тесты и мини-игры',
        showcaseAssistantTitle: 'Нейро-Ассистент',
        showcaseAssistantDesc: 'Умный виртуальный помощник ответит на любой учебный вопрос 24/7',
        aiTitle: 'Нейро-Ассистент',
        aiDesc: 'Умный ИИ помощник 24/7',
        drawerSub: 'Меню платформы',
        drawerNavTitle: 'Навигация',
        langLabel: 'Язык:',
        themeLabel: 'Тема:',
        themeDark: 'Темная',
        themeLight: 'Светлая',
        subjectsPageTitle: 'Предметы и классы',
        subjectsPageSub: 'Нажмите на предмет, чтобы раскрыть доступные классы для обучения',
        subjectsRow1: '🌿 Естественные науки',
        subjectsRow2: '⚛️ Точные науки и IT',
        subjectsRow3: '🌐 Языковые дисциплины',
        math: 'Математика',
        russian: 'Русский язык',
        langInfoDesc: 'Начало: 1 класс. Окончание: 11 класс.',
        gradeLabel: 'класс',
        grade1: '1 класс', grade2: '2 класс', grade3: '3 класс', grade4: '4 класс', grade5: '5 класс',
        grade6: '6 класс', grade7: '7 класс', grade8: '8 класс', grade9: '9 класс', grade10: '10 класс', grade11: '11 класс'
    },
    kk: {
        heroBadge: '🔬 Интерактивті зертханалар',
        heroSubtitle: 'Интерактивті зертханалық зерттеулер орталығы',
        searchPlaceholder: '32 зертхана бойынша іздеу (мысалы: Оптика, Торша, Пифагор)...',
        chemistry: 'Химия', tools: 'Құралдар',
        statLabsLabel: 'зертхана', statVisitedLabel: 'өтілді',
        statProgressLabel: 'прогресс', statSubjectsLabel: 'пән',
        recentTitle: '🕐 Жақында ашылған', progressLabel: 'Сіздің прогрессіңіз',
        announceText: 'Жаңа зертханалар қосылды: Фотосинтез • Реакциялар • Алгоритмдер',
        aboutTitle: 'ℹ️ Жоба туралы',
        about1Title: 'Жобаның мақсаты', about1Text: 'Интерактивті виртуалды зертханалар оқушыларға күрделі тақырыптарды тәжірибе мен визуализация арқылы түсінуге көмектеседі.',
        about2Title: 'Қалай пайдалану керек', about2Text: 'Пәнді таңдаңыз, зертхананы ашыңыз және эксперимент жасаңыз! Барлық симуляциялар тікелей браузерде орнатусыз жұмыс істейді.',
        about3Title: 'Кез келген құрылғы', about3Text: 'Сайт компьютерлерге, планшеттерге және смартфондарға толық бейімделген. Кез келген жерде оқыңыз.',
        footerText: 'AshyqLab • Интерактивті виртуалды зертханалық жұмыстар • 2025',
        soon: 'Жақында',
        physics: 'Физика', informatics: 'Информатика', geometry: 'Геометрия',
        kazakh: 'Қазақ тілі', english: 'English', biology: 'Биология',
        gravity: 'Гравитация', optics: 'Оптика', pendulum: 'Маятниктер', waves: 'Толқындар',
        logic: 'Логикалық Схемалар', crypto: 'Шифрлар мен Жұмбақтар',
        algo: 'Алгоритмдер', binary: 'Екілік код',
        fractals: 'Фракталдар', spiro: 'Спирограф', transform: 'Гео-Шебер', pythagoras: 'Пифагор теоремасы',
        cards_kk: 'Сөздік Карточкалары', morphology: 'Сөз Конструкторы', grammar: 'Грамматика', phonetics_kk: 'Дыбыстар',
        cards_en: 'Vocabulary Lab', tenses: 'Шақтар машинасы', spelling: 'Spelling Bee', idioms: 'Идиомалар',
        biolab: 'Тіршілік Клеткасы', photosynthesis: 'Фотосинтез', genetics: 'Мендель Заңдары', anatomy: 'Анатомия',
        periodic: 'Менделеев кестесі', reactions: 'Химиялық реакциялар', molecules: 'Молекулалар конструкторы', ph_scale: 'pH шкаласы',
        calculator: 'Ғылыми калькулятор', converter: 'Бірліктер конверторы', graphing: 'Функция графиктері', stopwatch: 'Секундомер',
        createPresentation: 'Презентация жасау',
        tabAll: '🌟 Барлық пәндер (8)', tabExact: '⚛️ Нақты ғылымдар', tabIT: '💻 IT & Информатика', tabNature: '🌿 Жаратылыстану', tabLang: '🌐 Тілдер', tabTools: '🛠️ Құралдар',
        noResults: 'Ештеңе табылмады',
        createGame: '🎓 Ойын жасау', aiName: 'Нейро-Көмекші', aiStatus: 'Желіде • Көмекке дайын',
        aiHello: 'Сәлем! Мен <b>AshyqLab</b> кіріктірілген ИИ-мын. Оқу бағдарламасы бойынша сұрақтарыңыз болса немесе сайтта навигация жасауға көмек керек болса — менен сұраңыз!',
        aiPlaceholder: 'Кез келген нәрсені сұраңыз...', aiThinking: 'Сұрауды талдаудамын...',
        mobileSubjectPrompt: '📚 Оқығыңыз келетін пәнді таңдаңыз:',
        expandAll: 'Барлығын ашу',
        collapseAll: 'Барлығын жабу',
        labsUnit: 'зерт.',
        dockHome: 'Басты',
        dockSubjects: 'Пәндер',
        dockAI: 'ИИ Чат',
        dockStudio: 'Ойындар',
        dockSlides: 'Слайдтар',
        navHome: 'Басты',
        navSubjects: 'Пәндер',
        navSubjectsBadge: '7–11 сынып',
        navCreative: 'AI & Студия',
        navTools: 'Құралдар',
        navTagline: '32 зертханалық жұмыс',
        quickSearch: 'Іздеу...',
        megaSubjectsTitle: '📚 Оқу пәндері',
        viewAllClasses: '🎓 Барлық сыныптар (7-11) →',
        presentationTitle: 'AI Презентациялар',
        presentationDesc: 'Әдістеме бойынша 15 сек слайд',
        showcasePresentationTitle: 'AI Презентациялар',
        showcasePresentationDesc: 'Әдістеме бойынша 15 секундта 20 түрлі дайын дизайнмен слайдтар жасау',
        docsTitle: 'AI Құжаттар',
        docsDesc: 'ҚМЖ, БЖБ, ТЖБ және сабақ жоспарлары',
        showcaseDocsTitle: 'AI Құжаттар',
        showcaseDocsDesc: 'МЖМББС бойынша ҚМЖ, БЖБ, ТЖБ, тесттер құрастыру және Word (.docx) форматына экспорттау',
        studioTitle: 'Ойын студиясы',
        studioDesc: 'Викториналар мен мини-ойындар',
        showcaseStudioTitle: 'Ойын студиясы',
        showcaseStudioDesc: 'Өз интерактивті викториналарыңызды, тесттер мен шағын ойындарыңызды жасаңыз',
        showcaseAssistantTitle: 'Нейро-Көмекші',
        showcaseAssistantDesc: 'Ақылды виртуалды көмекші кез келген оқу сұрағына 24/7 жауап береді',
        aiTitle: 'Нейро-Көмекші',
        aiDesc: 'Ақылды ИИ көмекші 24/7',
        drawerSub: 'Платформа мәзірі',
        drawerNavTitle: 'Навигация',
        langLabel: 'Тіл:',
        themeLabel: 'Тақырып:',
        themeDark: 'Күңгірт',
        themeLight: 'Жарық',
        subjectsPageTitle: 'Пәндер мен сыныптар',
        subjectsPageSub: 'Оқу сыныптарын ашу үшін пәнді таңдаңыз',
        subjectsRow1: '🌿 Жаратылыстану ғылымдары',
        subjectsRow2: '⚛️ Нақты ғылымдар мен IT',
        subjectsRow3: '🌐 Тілдік пәндер',
        math: 'Математика',
        russian: 'Орыс тілі',
        langInfoDesc: 'Басталуы: 1-сынып. Аяқталуы: 11-сынып.',
        gradeLabel: 'сынып',
        grade1: '1 сынып', grade2: '2 сынып', grade3: '3 сынып', grade4: '4 сынып', grade5: '5 сынып',
        grade6: '6 сынып', grade7: '7 сынып', grade8: '8 сынып', grade9: '9 сынып', grade10: '10 сынып', grade11: '11 сынып'
    },
    en: {
        heroBadge: '🔬 Interactive Laboratories',
        heroSubtitle: 'Center for Interactive Laboratory Research',
        searchPlaceholder: 'Search 32 laboratories (e.g., Optics, Cell, Pythagoras)...',
        chemistry: 'Chemistry', tools: 'Tools',
        statLabsLabel: 'labs', statVisitedLabel: 'completed',
        statProgressLabel: 'progress', statSubjectsLabel: 'subjects',
        recentTitle: '🕐 Recently Opened', progressLabel: 'Your Progress',
        announceText: 'New labs added: Photosynthesis • Reactions • Algorithms',
        aboutTitle: 'ℹ️ About the Project',
        about1Title: 'Project Goal', about1Text: 'Interactive virtual labs help students understand complex topics through practice and visualization.',
        about2Title: 'How to Use', about2Text: 'Choose a subject, open a lab, and experiment! All simulations run directly in the browser without installation.',
        about3Title: 'Any Device', about3Text: 'The site is optimized for computers, tablets & smartphones. Learn anywhere, anytime.',
        footerText: 'AshyqLab • Virtual Laboratory Works • 2025',
        soon: 'Soon',
        physics: 'Physics', informatics: 'Informatics', geometry: 'Geometry',
        kazakh: 'Kazakh Language', english: 'English', biology: 'Biology',
        gravity: 'Gravity', optics: 'Optics', pendulum: 'Pendulums', waves: 'Waves',
        logic: 'Logic Circuits', crypto: 'Ciphers & Puzzles',
        algo: 'Algorithms', binary: 'Binary Code',
        fractals: 'Fractals', spiro: 'Spirograph', transform: 'Geo-Master', pythagoras: 'Pythagorean Theorem',
        cards_kk: 'Vocab Cards (KK)', morphology: 'Word Constructor', grammar: 'Grammar', phonetics_kk: 'Kazakh Phonetics',
        cards_en: 'Vocabulary Lab', tenses: 'Time Machine (Tenses)', spelling: 'Spelling Bee', idioms: 'Idioms',
        biolab: 'Living Cell', photosynthesis: 'Photosynthesis', genetics: 'Mendelian Genetics', anatomy: 'Anatomy',
        periodic: 'Periodic Table', reactions: 'Chemical Reactions', molecules: 'Molecule Builder', ph_scale: 'pH Scale',
        calculator: 'Scientific Calculator', converter: 'Unit Converter', graphing: 'Graphing Calculator', stopwatch: 'Stopwatch',
        createPresentation: 'Create Presentation',
        tabAll: '🌟 All Subjects (8)', tabExact: '⚛️ Exact Sciences', tabIT: '💻 IT & Informatics', tabNature: '🌿 Natural Sciences', tabLang: '🌐 Languages', tabTools: '🛠️ Tools',
        noResults: 'No results found',
        createGame: '🎓 Create Game', aiName: 'Neuro-Assistant', aiStatus: 'Online • Ready to help',
        aiHello: 'Hello! I am the built-in AI of <b>AshyqLab</b>. If you have questions on any curriculum topic or need help navigating the site — just ask me!',
        aiPlaceholder: 'Ask me anything...', aiThinking: 'Analyzing request...',
        mobileSubjectPrompt: '📚 Choose a subject to explore:',
        expandAll: 'Expand all',
        collapseAll: 'Collapse all',
        labsUnit: 'labs',
        dockHome: 'Home',
        dockSubjects: 'Subjects',
        dockAI: 'AI Chat',
        dockStudio: 'Games',
        dockSlides: 'Slides',
        navHome: 'Home',
        navSubjects: 'Subjects',
        navSubjectsBadge: 'Grades 7–11',
        navCreative: 'AI & Studio',
        navTools: 'Tools',
        navTagline: '32 interactive laboratories',
        quickSearch: 'Search...',
        megaSubjectsTitle: '📚 Academic Subjects',
        viewAllClasses: '🎓 All grades (7-11) →',
        presentationTitle: 'AI Presentations',
        presentationDesc: 'Slides in 15 seconds from text',
        showcasePresentationTitle: 'AI Presentations',
        showcasePresentationDesc: 'Generate presentations in 15 seconds with 20 professional designs',
        docsTitle: 'AI Documents',
        docsDesc: 'Lesson plans, tests & assessments',
        showcaseDocsTitle: 'AI Documents',
        showcaseDocsDesc: 'Generate lesson plans, assessments and tests with Word (.docx) export',
        studioTitle: 'Game Studio',
        studioDesc: 'Quizzes, tests and mini-games',
        showcaseStudioTitle: 'Game Studio',
        showcaseStudioDesc: 'Create your own interactive quizzes, tests and mini-games',
        showcaseAssistantTitle: 'Neuro-Assistant',
        showcaseAssistantDesc: 'Smart virtual tutor available 24/7 for any curriculum questions',
        aiTitle: 'Neuro-Assistant',
        aiDesc: 'Smart AI tutor 24/7',
        drawerSub: 'Platform Menu',
        drawerNavTitle: 'Navigation',
        langLabel: 'Language:',
        themeLabel: 'Theme:',
        themeDark: 'Dark',
        themeLight: 'Light',
        subjectsPageTitle: 'Subjects & Grades',
        subjectsPageSub: 'Click on a subject to expand available grades for learning',
        subjectsRow1: '🌿 Natural Sciences',
        subjectsRow2: '⚛️ Exact Sciences & IT',
        subjectsRow3: '🌐 Language Disciplines',
        math: 'Mathematics',
        russian: 'Russian Language',
        langInfoDesc: 'Starts: Grade 1. Finishes: Grade 11.',
        gradeLabel: 'Grade',
        grade1: 'Grade 1', grade2: 'Grade 2', grade3: 'Grade 3', grade4: 'Grade 4', grade5: 'Grade 5',
        grade6: 'Grade 6', grade7: 'Grade 7', grade8: 'Grade 8', grade9: 'Grade 9', grade10: 'Grade 10', grade11: 'Grade 11'
    }
};

// ══════════════════════════════════════════
//  EXPERIMENT DATA (for search)
// ══════════════════════════════════════════
const LABS = [
    { id: 'gravity',       icon: '🪐', href: 'gravity.html',       subjectKey: 'physics' },
    { id: 'optics',        icon: '🔦', href: 'optics.html',        subjectKey: 'physics' },
    { id: 'pendulum',      icon: '🕰️', href: 'pendulum.html',      subjectKey: 'physics' },
    { id: 'waves',         icon: '🌊', href: 'waves.html',         subjectKey: 'physics' },
    { id: 'logic',         icon: '🔌', href: 'logic.html',         subjectKey: 'informatics' },
    { id: 'crypto',        icon: '🔐', href: 'crypto.html',        subjectKey: 'informatics' },
    { id: 'algo',          icon: '📊', href: 'algo.html',          subjectKey: 'informatics' },
    { id: 'binary',        icon: '🔢', href: 'binary.html',        subjectKey: 'informatics' },
    { id: 'fractals',      icon: '❄️', href: 'fractals.html',      subjectKey: 'geometry' },
    { id: 'spiro',         icon: '🌀', href: 'spiro.html',         subjectKey: 'geometry' },
    { id: 'transform',     icon: '💠', href: 'transform.html',     subjectKey: 'geometry' },
    { id: 'pythagoras',    icon: '📐', href: 'pythagoras.html',    subjectKey: 'geometry' },
    { id: 'cards_kk',      icon: '🔤', href: 'cards_kk.html',      subjectKey: 'kazakh' },
    { id: 'morphology',    icon: '🏗️', href: 'morphology.html',    subjectKey: 'kazakh' },
    { id: 'grammar',       icon: '🧩', href: 'grammar.html',       subjectKey: 'kazakh' },
    { id: 'phonetics_kk',  icon: '🗣️', href: 'phonetics_kk.html',  subjectKey: 'kazakh' },
    { id: 'cards_en',      icon: '🗣️', href: 'cards_en.html',      subjectKey: 'english' },
    { id: 'tenses',        icon: '⏳', href: 'tenses.html',        subjectKey: 'english' },
    { id: 'spelling',      icon: '🐝', href: 'spelling.html',      subjectKey: 'english' },
    { id: 'idioms',        icon: '🎭', href: 'idioms.html',        subjectKey: 'english' },
    { id: 'biology',       icon: '🔬', href: 'biology.html',       subjectKey: 'biology' },
    { id: 'photosynthesis',icon: '🌱', href: 'photosynthesis.html',subjectKey: 'biology' },
    { id: 'genetics',      icon: '🫛', href: 'genetics.html',      subjectKey: 'biology' },
    { id: 'anatomy',       icon: '👁️', href: 'anatomy.html',       subjectKey: 'biology' },
    { id: 'periodic',      icon: '🧪', href: 'periodic.html',      subjectKey: 'chemistry' },
    { id: 'reactions',     icon: '🧫', href: 'reactions.html',     subjectKey: 'chemistry' },
    { id: 'molecules',     icon: '🔗', href: 'molecules.html',     subjectKey: 'chemistry' },
    { id: 'ph_scale',      icon: '🍋', href: 'ph_scale.html',      subjectKey: 'chemistry' },
    { id: 'calculator',    icon: '🧮', href: 'calculator.html',    subjectKey: 'tools' },
    { id: 'converter',     icon: '⚖️', href: 'converter.html',     subjectKey: 'tools' },
    { id: 'graphing',      icon: '📈', href: 'graphing.html',      subjectKey: 'tools' },
    { id: 'stopwatch',     icon: '⏱️', href: 'stopwatch.html',     subjectKey: 'tools' },
];

const TOTAL_LABS = LABS.length;

// ══════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════
let currentLang = localStorage.getItem('vsh-lang') || 'kk';
let visitedSet = new Set(JSON.parse(localStorage.getItem('vsh-visited') || '[]'));
let recentList = JSON.parse(localStorage.getItem('vsh-recent') || '[]');

// Sync googtrans cookie with currentLang on load
(function syncCookie() {
    var gtrans = '/ru/' + currentLang;
    if (currentLang === 'ru') { 
        document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (location.hostname) {
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=" + location.hostname + "; path=/;";
            document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=." + location.hostname + "; path=/;";
        }
 } else {
        document.cookie = "googtrans=" + gtrans + "; path=/";
    if (location.hostname) { document.cookie = "googtrans=" + gtrans + "; domain=" + location.hostname + "; path=/"; document.cookie = "googtrans=" + gtrans + "; domain=." + location.hostname + "; path=/"; }
    }
})();

// ══════════════════════════════════════════
// ══════════════════════════════════════════
//  CLEAN MINIMAL HIGH-TECH BACKGROUND ENGINE
//  Features: Smooth Aurora Ambient Glow, Minimal Stars & Robot Holo-Pedestal
// ══════════════════════════════════════════
const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
let width, height;
let particles = [];
let scienceSymbols = [];
let mouse = { x: -1000, y: -1000, active: false };

function initResize() {
    if (!canvas) return;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

if (canvas) {
    window.addEventListener('resize', initResize);
    initResize();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
        mouse.active = false;
    });
}

/* Minimal Subtle Constellation Star Class */
class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.size = Math.random() * 1.5 + 0.8;
        this.alpha = Math.random() * 0.3 + 0.15;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#a855f7';
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Subtle interactive mouse force
        if (mouse.active) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x -= (dx / dist) * force * 1.2;
                this.y -= (dy / dist) * force * 1.2;
            }
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* Minimal Floating Science Symbols (Sparse & Subtle) */
const SCI_SYMBOLS_LIST = ['⚛', 'π', '∑', '∞', 'λ', 'E=mc²', 'Ω', '∫'];
class ScienceSymbol {
    constructor() {
        this.reset(true);
    }
    reset(initial = false) {
        this.x = Math.random() * width;
        this.y = initial ? Math.random() * height : height + 30;
        this.text = SCI_SYMBOLS_LIST[Math.floor(Math.random() * SCI_SYMBOLS_LIST.length)];
        this.vy = -(Math.random() * 0.18 + 0.08);
        this.vx = (Math.random() - 0.5) * 0.1;
        this.size = Math.floor(Math.random() * 6 + 12);
        this.alpha = Math.random() * 0.15 + 0.05;
        this.color = Math.random() > 0.5 ? '#00f3ff' : '#a855f7';
    }
    update() {
        this.y += this.vy;
        this.x += this.vx;
        if (this.y < -40) this.reset();
    }
    draw() {
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        ctx.save();
        ctx.font = `500 ${this.size}px 'Inter', sans-serif`;
        ctx.fillStyle = isLight ? '#6366f1' : this.color;
        ctx.globalAlpha = isLight ? this.alpha * 0.6 : this.alpha;
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// Populate minimal clean elements (few & non-intrusive)
if (canvas) {
    for (let i = 0; i < 24; i++) particles.push(new Particle());
    for (let i = 0; i < 5; i++) scienceSymbols.push(new ScienceSymbol());
}

// Holographic Pedestal beneath 3D Robot
let holoRingRot = 0;
function drawRobotHoloPedestal() {
    if (width < 768) return; // Skip on mobile
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    // Robot screen position on desktop (centered-right)
    const rx = width * 0.72;
    const ry = height * 0.62;

    holoRingRot += 0.008;

    ctx.save();
    ctx.translate(rx, ry);

    // Glowing base ellipse
    const baseGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 240);
    baseGlow.addColorStop(0, isLight ? 'rgba(59, 130, 246, 0.1)' : 'rgba(0, 243, 255, 0.12)');
    baseGlow.addColorStop(0.6, isLight ? 'rgba(168, 85, 247, 0.04)' : 'rgba(188, 19, 254, 0.05)');
    baseGlow.addColorStop(1, 'transparent');

    ctx.fillStyle = baseGlow;
    ctx.beginPath();
    ctx.ellipse(0, 0, 240, 70, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer Rotating Dashed Ring
    ctx.strokeStyle = isLight ? 'rgba(59, 130, 246, 0.28)' : 'rgba(0, 243, 255, 0.28)';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    ctx.ellipse(0, 0, 210, 58, holoRingRot, 0, Math.PI * 2);
    ctx.stroke();

    // Inner Counter-Rotating Dashed Ring
    ctx.strokeStyle = isLight ? 'rgba(168, 85, 247, 0.3)' : 'rgba(188, 19, 254, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.beginPath();
    ctx.ellipse(0, 0, 150, 42, -holoRingRot * 1.4, 0, Math.PI * 2);
    ctx.stroke();

    ctx.setLineDash([]);
    ctx.restore();
}

// Aurora Glow Mesh (3 Smooth Soft Ambient Gradient Orbs)
let auroraAngle = 0;
function drawAuroraGlow() {
    auroraAngle += 0.004;
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';

    const a1x = width * 0.18 + Math.sin(auroraAngle * 0.8) * 80;
    const a1y = height * 0.25 + Math.cos(auroraAngle * 0.6) * 60;

    const a2x = width * 0.80 + Math.cos(auroraAngle * 0.7) * 90;
    const a2y = height * 0.45 + Math.sin(auroraAngle * 0.9) * 70;

    const a3x = width * 0.48 + Math.sin(auroraAngle * 0.5) * 100;
    const a3y = height * 0.78 + Math.cos(auroraAngle * 0.8) * 60;

    // Orb 1: Cyan
    const g1 = ctx.createRadialGradient(a1x, a1y, 10, a1x, a1y, 450);
    g1.addColorStop(0, isLight ? 'rgba(2, 132, 199, 0.07)' : 'rgba(0, 243, 255, 0.09)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, width, height);

    // Orb 2: Purple / Violet
    const g2 = ctx.createRadialGradient(a2x, a2y, 10, a2x, a2y, 460);
    g2.addColorStop(0, isLight ? 'rgba(126, 34, 206, 0.06)' : 'rgba(188, 19, 254, 0.08)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, width, height);

    // Orb 3: Royal Blue
    const g3 = ctx.createRadialGradient(a3x, a3y, 10, a3x, a3y, 420);
    g3.addColorStop(0, isLight ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.07)');
    g3.addColorStop(1, 'transparent');
    ctx.fillStyle = g3;
    ctx.fillRect(0, 0, width, height);
}

function animateBg() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, width, height);
    ctx.globalAlpha = 1;

    // 1. Subtle Holographic Pedestal under 3D Robot
    drawRobotHoloPedestal();

    // 3. Sparse, faint Science Symbols (5 symbols)
    scienceSymbols.forEach(sym => { sym.update(); sym.draw(); });

    // 4. Subtle Star Particles & gentle constellation lines
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    particles.forEach(p => { p.update(); p.draw(); });

    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 90) {
                const alpha = (1 - dist / 90) * 0.15;
                ctx.strokeStyle = isLight ? `rgba(2, 132, 199, ${alpha})` : `rgba(0, 243, 255, ${alpha})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateBg);
}
if (canvas) animateBg();

// ══════════════════════════════════════════
//  3D TILT EFFECT
// ══════════════════════════════════════════
const cards = document.querySelectorAll('.subject-card');
cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rotateX = ((y -  cy) / cy) * -8;
        const rotateY = ((x - cx) / cx) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ══════════════════════════════════════════
//  PROGRESS TRACKING
// ══════════════════════════════════════════
function updateProgress() {
    const count = visitedSet.size;
    const pct = Math.round((count / TOTAL_LABS) * 100);
    const visitedEl = document.getElementById('visitedCount');
    if (visitedEl) visitedEl.textContent = count;
    const pctEl = document.getElementById('progressPct');
    if (pctEl) pctEl.textContent = pct + '%';
    const barEl = document.getElementById('progressBar');
    if (barEl) barEl.style.width = pct + '%';
    const valTextEl = document.getElementById('progressValueText');
    if (valTextEl) valTextEl.textContent = `${count} / ${TOTAL_LABS}`;
    LABS.forEach(lab => {
        const dot = document.getElementById('dot-' + lab.id);
        if (dot) dot.classList.toggle('visited', visitedSet.has(lab.id));
    });
}

// ══════════════════════════════════════════
//  RECENTLY VISITED
// ══════════════════════════════════════════
function updateRecent() {
    const section = document.getElementById('recentSection');
    const chips = document.getElementById('recentChips');
    if (!section || !chips) return;
    if (!recentList.length) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    const t = i18n[currentLang] || i18n.kk;
    chips.innerHTML = recentList.slice(0, 6).map(item => {
        const displayName = t[item.id] || item.name;
        return `
        <a href="${item.href}" class="recent-chip" onclick="trackVisit('${item.id}','${displayName}','${item.href}','${item.icon}')">
            <span class="recent-chip-icon">${item.icon}</span>
            <span>${displayName}</span>
        </a>
    `}).join('');
}

function trackVisit(id, name, href, icon) {
    visitedSet.add(id);
    localStorage.setItem('vsh-visited', JSON.stringify([...visitedSet]));
    recentList = recentList.filter(r => r.id !== id);
    recentList.unshift({ id, name, href, icon });
    if (recentList.length > 6) recentList.pop();
    localStorage.setItem('vsh-recent', JSON.stringify(recentList));
}

// ══════════════════════════════════════════
//  SEARCH
// ══════════════════════════════════════════
function handleSearch(query) {
    const q = query.trim().toLowerCase();
    const results = document.getElementById('searchResults');
    const clearBtn = document.getElementById('searchClear');
    if (clearBtn) clearBtn.style.display = q ? 'block' : 'none';
    if (!results) return;
    if (!q) { results.style.display = 'none'; resetGrid(); return; }
    const t = i18n[currentLang] || i18n.kk;
    const matches = LABS.filter(lab => {
        const curName = (t[lab.id] || lab.id).toLowerCase();
        const curSubj = (t[lab.subjectKey] || lab.subjectKey).toLowerCase();
        const ruName = (i18n.ru[lab.id] || '').toLowerCase();
        const kkName = (i18n.kk[lab.id] || '').toLowerCase();
        const enName = (i18n.en[lab.id] || '').toLowerCase();
        return curName.includes(q) || curSubj.includes(q) || ruName.includes(q) || kkName.includes(q) || enName.includes(q);
    });
    if (!matches.length) {
        results.innerHTML = `<div class="search-no-results">${t.noResults || 'Ештеңе табылмады'}</div>`;
        results.style.display = 'block';
        highlightGrid([]);
        return;
    }
    results.innerHTML = matches.map(lab => `
        <a href="${lab.href}" class="search-result-item" onclick="trackVisit('${lab.id}','${t[lab.id] || lab.id}','${lab.href}','${lab.icon}')">
            <span class="search-result-icon">${lab.icon}</span>
            <div class="search-result-info">
                <span class="search-result-name">${t[lab.id] || lab.id}</span>
                <span class="search-result-subject">${t[lab.subjectKey] || lab.subjectKey}</span>
            </div>
        </a>
    `).join('');
    results.style.display = 'block';
    highlightGrid(matches.map(l => l.id));
}

function clearSearch() {
    const input = document.getElementById('searchInput');
    input.value = '';
    handleSearch('');
    input.focus();
}

function highlightGrid(matchIds) {
    document.querySelectorAll('.subject-card').forEach(card => {
        let cardHasMatch = false;
        card.querySelectorAll('.exp-link[data-id]').forEach(link => {
            const id = link.dataset.id;
            if (matchIds.includes(id)) { link.classList.add('search-highlight'); cardHasMatch = true; }
            else link.classList.remove('search-highlight');
        });
        card.classList.toggle('search-hidden', !cardHasMatch);
        if (cardHasMatch) {
            // Auto expand card on mobile when search matches
            card.classList.remove('is-collapsed');
        }
    });
    updateToggleAllButton();
}

function resetGrid() {
    document.querySelectorAll('.subject-card').forEach(c => {
        c.classList.remove('search-hidden');
    });
    document.querySelectorAll('.exp-link').forEach(l => l.classList.remove('search-highlight'));
    updateToggleAllButton();
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
        document.getElementById('searchResults').style.display = 'none';
    }
});

// ══════════════════════════════════════════
//  MOBILE SUBJECT ACCORDION
// ══════════════════════════════════════════
function isMobileView() {
    return window.innerWidth <= 768;
}

function updateToggleAllButton() {
    const btn = document.getElementById('mobileToggleAllBtn');
    const textEl = document.getElementById('toggleAllText');
    if (!btn || !textEl) return;
    
    const visibleCards = Array.from(document.querySelectorAll('.subject-card')).filter(c => c.style.display !== 'none' && !c.classList.contains('search-hidden'));
    if (!visibleCards.length) return;
    
    const hasCollapsed = visibleCards.some(c => c.classList.contains('is-collapsed'));
    const t = i18n[currentLang] || i18n.kk;
    textEl.textContent = hasCollapsed ? t.expandAll : t.collapseAll;
}

function toggleSubjectCard(cardEl) {
    if (!cardEl) return;
    
    // Toggle state
    const isNowCollapsed = cardEl.classList.toggle('is-collapsed');
    
    // If expanding on mobile, smoothly scroll into view if card top is above viewport
    if (!isNowCollapsed && isMobileView()) {
        setTimeout(() => {
            const rect = cardEl.getBoundingClientRect();
            if (rect.top < 70) {
                window.scrollTo({
                    top: window.scrollY + rect.top - 80,
                    behavior: 'smooth'
                });
            }
        }, 120);
    }
    
    updateToggleAllButton();
}

function toggleAllSubjects() {
    const visibleCards = Array.from(document.querySelectorAll('.subject-card')).filter(c => c.style.display !== 'none' && !c.classList.contains('search-hidden'));
    if (!visibleCards.length) return;
    
    const hasCollapsed = visibleCards.some(c => c.classList.contains('is-collapsed'));
    
    visibleCards.forEach(card => {
        if (hasCollapsed) {
            card.classList.remove('is-collapsed');
        } else {
            card.classList.add('is-collapsed');
        }
    });
    
    updateToggleAllButton();
}

// ══════════════════════════════════════════
//  NAVBAR, SEARCH FOCUS & DRAWER CONTROLS
// ══════════════════════════════════════════
function focusSearch() {
    const input = document.getElementById('searchInput');
    const wrapper = document.querySelector('.search-wrapper');
    if (!input || !wrapper) return;

    // Smooth scroll to search area
    const rect = wrapper.getBoundingClientRect();
    window.scrollTo({
        top: window.scrollY + rect.top - 90,
        behavior: 'smooth'
    });

    setTimeout(() => {
        input.focus();
        wrapper.classList.remove('search-glow-active');
        void wrapper.offsetWidth;
        wrapper.classList.add('search-glow-active');
        setTimeout(() => wrapper.classList.remove('search-glow-active'), 1200);
    }, 250);
}

function scrollToSubject(subjKey) {
    const card = document.querySelector(`.subject-card[data-subject="${subjKey}"]`);
    if (!card) return;

    // Unhide if filtered or hidden
    card.style.display = '';
    card.classList.remove('is-collapsed', 'search-hidden');

    const rect = card.getBoundingClientRect();
    window.scrollTo({
        top: window.scrollY + rect.top - 80,
        behavior: 'smooth'
    });

    updateToggleAllButton();
}

function toggleMobileDrawer(forceState) {
    const drawer = document.getElementById('mobileDrawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const hamburger = document.getElementById('navHamburgerBtn');
    if (!drawer || !backdrop) return;

    const shouldOpen = typeof forceState === 'boolean' ? forceState : !drawer.classList.contains('active');

    drawer.classList.toggle('active', shouldOpen);
    backdrop.classList.toggle('active', shouldOpen);
    if (hamburger) hamburger.classList.toggle('active', shouldOpen);
    drawer.setAttribute('aria-hidden', !shouldOpen);

    // Prevent body scroll when drawer is open
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
}

function toggleDrawerSubmenu(triggerEl) {
    const accordion = triggerEl.closest('.drawer-accordion');
    if (accordion) {
        accordion.classList.toggle('open');
    }
}

// Global Keyboard Shortcuts (Ctrl+K for search, Esc to close modals/drawer)
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        focusSearch();
    }
    if (e.key === 'Escape') {
        toggleMobileDrawer(false);
        const searchResults = document.getElementById('searchResults');
        if (searchResults) searchResults.style.display = 'none';
        const aiModal = document.getElementById('ai-modal');
        if (aiModal && aiModal.classList.contains('active')) {
            aiModal.classList.remove('active');
        }
    }
});

// Top Navbar Scroll Shadow Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('topNav');
    if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 15);
    }
}, { passive: true });

// ══════════════════════════════════════════
//  LANGUAGE SWITCHER
// ══════════════════════════════════════════
function setLang(lang) {
    currentLang = lang || 'kk';
    localStorage.setItem('vsh-lang', currentLang);
    document.documentElement.setAttribute('lang', currentLang);
    
    // Manage googtrans cookie and trigger
    if (currentLang === 'kk') {
        purgeGoogleTranslateCookies();
        const combo = document.querySelector('.goog-te-combo');
        if (combo && combo.value !== 'kk') {
            combo.value = 'kk';
            combo.dispatchEvent(new Event('change'));
        }
    } else {
        const cookieVal = '/kk/' + currentLang;
        document.cookie = 'googtrans=' + cookieVal + '; path=/;';
        if (location.hostname) {
            document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=' + location.hostname + ';';
            document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=.' + location.hostname + ';';
        }
        const combo = document.querySelector('.goog-te-combo');
        if (combo && combo.value !== currentLang) {
            combo.value = currentLang;
            combo.dispatchEvent(new Event('change'));
        }
    }

    // Sync all language buttons (both desktop and mobile drawer)
    document.querySelectorAll('.lang-btn, .lang-segment').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
    
    const t = i18n[currentLang] || i18n.kk;
    
    const safeSetText = (id, val) => {
        const el = document.getElementById(id);
        if (el && val !== undefined) el.innerHTML = val;
    };

    safeSetText('heroBadge', t.heroBadge);
    safeSetText('heroSubtitle', t.heroSubtitle);
    safeSetText('statLabsLabel', t.statLabsLabel);
    safeSetText('statVisitedLabel', t.statVisitedLabel);
    safeSetText('statProgressLabel', t.statProgressLabel);
    safeSetText('statSubjectsLabel', t.statSubjectsLabel);
    safeSetText('recentTitle', t.recentTitle);
    safeSetText('progressLabel', t.progressLabel);
    safeSetText('announceText', t.announceText);
    safeSetText('aboutTitle', t.aboutTitle);
    safeSetText('about1Title', t.about1Title);
    safeSetText('about1Text', t.about1Text);
    safeSetText('about2Title', t.about2Title);
    safeSetText('about2Text', t.about2Text);
    safeSetText('about3Title', t.about3Title);
    safeSetText('about3Text', t.about3Text);
    safeSetText('footerText', t.footerText);
    safeSetText('mobileSubjectPrompt', t.mobileSubjectPrompt);
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput && t.searchPlaceholder) searchInput.placeholder = t.searchPlaceholder;
    
    // Translate data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key] !== undefined) {
            el.innerHTML = t[key];
        }
    });
    
    // Translate data-i18n-placeholder elements
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key] !== undefined) {
            el.placeholder = t[key];
        }
    });
    
    // Sync drawer theme text
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const drawerThemeText = document.getElementById('drawerThemeText');
    if (drawerThemeText) {
        drawerThemeText.textContent = isLight ? (t.themeLight || 'Жарық') : (t.themeDark || 'Күңгірт');
    }

    updateToggleAllButton();
    updateRecent();
}

// ══════════════════════════════════════════
//  THEME TOGGLE SYSTEM (DARK / LIGHT)
// ══════════════════════════════════════════
function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    
    const icon = document.getElementById('themeIcon');
    if (icon) {
        // If theme is dark, show sun (click to switch to light); if light, show moon (click to switch to dark)
        icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        if (icon.parentElement) {
            icon.parentElement.title = isDark 
                ? (currentLang === 'kk' ? 'Жарық тақырыпқа ауысу' : currentLang === 'ru' ? 'Включить светлую тему' : 'Switch to Light Theme')
                : (currentLang === 'kk' ? 'Күңгірт тақырыпқа ауысу' : currentLang === 'ru' ? 'Включить темную тему' : 'Switch to Dark Theme');
        }
    }
    const drawerIcon = document.getElementById('drawerThemeIcon');
    if (drawerIcon) {
        drawerIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
    const t = i18n[currentLang] || i18n.kk;
    const drawerThemeText = document.getElementById('drawerThemeText');
    if (drawerThemeText) {
        drawerThemeText.textContent = isDark ? (t.themeDark || 'Күңгірт') : (t.themeLight || 'Жарық');
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('vsh-theme', newTheme);
    applyTheme(newTheme);
}

// ══════════════════════════════════════════
//  CATEGORY TABS FILTER
// ══════════════════════════════════════════
function initCategoryTabs() {
    const tabs = document.querySelectorAll('.subj-tab');
    if (!tabs.length) return;

    const filterMap = {
        'all': ['physics', 'informatics', 'geometry', 'kazakh', 'english', 'biology', 'chemistry', 'tools'],
        'exact': ['physics', 'geometry', 'chemistry'],
        'informatics': ['informatics'],
        'nature': ['biology', 'chemistry'],
        'languages': ['kazakh', 'english'],
        'tools': ['tools']
    };

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const filter = tab.dataset.filter || 'all';
            const allowed = filterMap[filter] || filterMap['all'];

            document.querySelectorAll('.subject-card').forEach(card => {
                const subj = card.dataset.subject;
                if (allowed.includes(subj)) {
                    card.style.display = '';
                    card.style.animation = 'none';
                    void card.offsetWidth;
                    card.style.animation = 'cardFadeIn 0.3s ease forwards';
                    
                    // If user specifically filtered (not 'all'), auto-expand filtered cards on mobile
                    if (filter !== 'all') {
                        card.classList.remove('is-collapsed');
                    }
                } else {
                    card.style.display = 'none';
                }
            });
            
            updateToggleAllButton();
        });
    });
}

// ══════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════
function init() {
    updateProgress();
    updateRecent();
    initCategoryTabs();
    setLang(currentLang);
    const savedTheme = localStorage.getItem('vsh-theme') || 'light';
    applyTheme(savedTheme);
    updateToggleAllButton();
}
init();


