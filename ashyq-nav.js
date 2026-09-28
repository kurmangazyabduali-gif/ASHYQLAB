/**
 * AshyqLab Universal Navigation & Mobile Drawer Engine
 * Self-contained navigation component with embedded styles for standalone labs & simulators.
 */
(function() {
    // 1. Pages that have their own dedicated navigation headers - SKIP injection completely
    const currentFile = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const excludedPages = ['index.html', 'docs.html', 'presentation.html', 'studio.html', 'subjects.html', ''];
    if (excludedPages.includes(currentFile)) {
        return;
    }

    if (document.querySelector('.docs-header') || document.querySelector('.pres-header') || document.getElementById('topNav')) {
        return;
    }

    // Determine relative asset path
    const isSubfolder = window.location.pathname.includes('/src/');
    const logoSrc = isSubfolder ? '../../assets/logo.png' : 'assets/logo.png';

    // Translations for Nav Items
    const navI18n = {
        kk: {
            home: 'Басты бет',
            subjects: 'Пәндер',
            subjectsBadge: '7–11 сынып',
            games: 'Ойындар',
            docs: 'AI Құжаттар',
            slides: 'AI Слайдтар',
            tools: 'Құралдар',
            calculator: 'Ғылыми калькулятор',
            converter: 'Бірліктер конверторы',
            graphing: 'Функция графигі',
            stopwatch: 'Секундомер',
            periodic: 'Менделеев кестесі',
            back: '← Басты бетке',
            menu: 'Мәзір',
            sections: 'Бөлімдер',
            scienceLabs: 'Зертханалар',
            theme: 'Тақырып'
        },
        ru: {
            home: 'Главная',
            subjects: 'Предметы',
            subjectsBadge: '7–11 класс',
            games: 'Игры',
            docs: 'AI Документы',
            slides: 'AI Слайды',
            tools: 'Инструменты',
            calculator: 'Научный калькулятор',
            converter: 'Конвертер величин',
            graphing: 'График функций',
            stopwatch: 'Секундомер',
            periodic: 'Таблица Менделеева',
            back: '← На главную',
            menu: 'Меню',
            sections: 'Разделы',
            scienceLabs: 'Лаборатории',
            theme: 'Тема'
        },
        en: {
            home: 'Home',
            subjects: 'Subjects',
            subjectsBadge: 'Grades 7–11',
            games: 'Games',
            docs: 'AI Docs',
            slides: 'AI Slides',
            tools: 'Tools',
            calculator: 'Scientific Calculator',
            converter: 'Unit Converter',
            graphing: 'Function Grapher',
            stopwatch: 'Stopwatch',
            periodic: 'Periodic Table',
            back: '← Back to Home',
            menu: 'Menu',
            sections: 'Sections',
            scienceLabs: 'Labs',
            theme: 'Theme'
        }
    };

    function getLang() {
        return localStorage.getItem('vsh-lang') || 'kk';
    }

    // 2. Inject Self-Contained CSS Styles
    function injectStyles() {
        if (document.getElementById('ashyqNavEmbeddedStyles')) return;
        const style = document.createElement('style');
        style.id = 'ashyqNavEmbeddedStyles';
        style.textContent = `
            /* Universal Top Navigation */
            .ashyq-universal-nav {
                position: sticky;
                top: 0;
                left: 0;
                width: 100%;
                height: 56px;
                background: rgba(15, 23, 42, 0.96) !important;
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
                display: flex !important;
                align-items: center !important;
                justify-content: space-between !important;
                padding: 0 16px !important;
                z-index: 99999 !important;
                box-sizing: border-box !important;
                font-family: 'Inter', 'Roboto', sans-serif !important;
            }

            [data-theme="light"] .ashyq-universal-nav {
                background: rgba(255, 255, 255, 0.96) !important;
                border-bottom: 1px solid rgba(15, 23, 42, 0.1) !important;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05) !important;
            }

            .ashyq-nav-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .ashyq-nav-brand {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                text-decoration: none !important;
                color: #ffffff !important;
            }

            .ashyq-nav-logo {
                width: 32px !important;
                height: 32px !important;
                object-fit: contain !important;
            }

            .ashyq-brand-info {
                display: flex;
                flex-direction: column;
            }

            .ashyq-brand-title {
                font-size: 15px !important;
                font-weight: 800 !important;
                letter-spacing: 0.5px;
                color: #ffffff !important;
            }

            [data-theme="light"] .ashyq-brand-title {
                color: #0f172a !important;
            }

            .ashyq-brand-accent {
                color: #00f3ff !important;
            }

            .ashyq-brand-seal {
                font-size: 9.5px;
                color: #94a3b8 !important;
                font-weight: 500;
            }

            .ashyq-nav-center {
                display: flex;
                align-items: center;
                gap: 6px;
                background: rgba(255, 255, 255, 0.04);
                padding: 4px 8px;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.06);
            }

            [data-theme="light"] .ashyq-nav-center {
                background: #f1f5f9 !important;
                border-color: #e2e8f0 !important;
            }

            .ashyq-nav-link {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 5px 10px;
                border-radius: 7px;
                font-size: 12.5px;
                font-weight: 600;
                color: #94a3b8 !important;
                text-decoration: none !important;
                transition: all 0.15s ease;
            }

            .ashyq-nav-link:hover {
                color: #ffffff !important;
                background: rgba(255, 255, 255, 0.08);
            }

            [data-theme="light"] .ashyq-nav-link:hover {
                color: #0f172a !important;
                background: #e2e8f0 !important;
            }

            .ashyq-nav-link.active {
                color: #00f3ff !important;
                background: rgba(0, 243, 255, 0.1);
                font-weight: 700;
            }

            [data-theme="light"] .ashyq-nav-link.active {
                color: #0284c7 !important;
                background: #ffffff !important;
                box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
            }

            .ashyq-nav-badge {
                font-size: 9px;
                background: rgba(0, 243, 255, 0.2);
                color: #00f3ff;
                padding: 1px 5px;
                border-radius: 5px;
                font-weight: 700;
            }

            .ashyq-nav-right {
                display: flex;
                align-items: center;
                gap: 6px;
            }

            .ashyq-icon-btn {
                width: 34px;
                height: 34px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: #94a3b8 !important;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.15s ease;
                text-decoration: none !important;
            }

            .ashyq-icon-btn:hover {
                background: rgba(255, 255, 255, 0.12);
                color: #ffffff !important;
            }

            [data-theme="light"] .ashyq-icon-btn {
                background: #f1f5f9 !important;
                border-color: #e2e8f0 !important;
                color: #475569 !important;
            }

            .ashyq-lang-control {
                display: flex;
                align-items: center;
                background: rgba(255, 255, 255, 0.06);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 8px;
                padding: 2px;
                gap: 2px;
            }

            [data-theme="light"] .ashyq-lang-control {
                background: #f1f5f9 !important;
                border-color: #e2e8f0 !important;
            }

            .ashyq-lang-btn {
                background: transparent;
                border: none;
                color: #94a3b8;
                font-size: 10.5px;
                font-weight: 700;
                padding: 4px 6px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.15s ease;
            }

            .ashyq-lang-btn.active {
                background: #00f3ff;
                color: #020617;
            }

            [data-theme="light"] .ashyq-lang-btn.active {
                background: #0284c7 !important;
                color: #ffffff !important;
            }

            .ashyq-hamburger-btn {
                display: none;
                width: 38px;
                height: 38px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.08);
                border: 1px solid rgba(255, 255, 255, 0.12);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 4px;
                cursor: pointer;
                padding: 0;
            }

            [data-theme="light"] .ashyq-hamburger-btn {
                background: #f1f5f9 !important;
                border-color: #e2e8f0 !important;
            }

            .ham-bar {
                width: 18px;
                height: 2px;
                background: #ffffff;
                border-radius: 2px;
            }

            [data-theme="light"] .ham-bar {
                background: #0f172a !important;
            }

            /* Slide-out Mobile Drawer */
            .ashyq-drawer-backdrop {
                position: fixed !important;
                inset: 0 !important;
                background: rgba(0, 0, 0, 0.65) !important;
                backdrop-filter: blur(6px) !important;
                -webkit-backdrop-filter: blur(6px) !important;
                z-index: 999998 !important;
                opacity: 0 !important;
                visibility: hidden !important;
                pointer-events: none !important;
                transition: all 0.25s ease !important;
            }

            .ashyq-drawer-backdrop.active {
                opacity: 1 !important;
                visibility: visible !important;
                pointer-events: auto !important;
            }

            .ashyq-mobile-drawer {
                position: fixed !important;
                top: 0 !important;
                right: 0 !important;
                width: min(320px, 85vw) !important;
                height: 100vh !important;
                background: #0b132b !important;
                border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
                z-index: 999999 !important;
                display: flex !important;
                flex-direction: column !important;
                transform: translateX(100%) !important;
                visibility: hidden !important;
                transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.25s ease !important;
                box-shadow: -8px 0 25px rgba(0, 0, 0, 0.5) !important;
                overflow: hidden !important;
                box-sizing: border-box !important;
                font-family: 'Inter', 'Roboto', sans-serif !important;
            }

            [data-theme="light"] .ashyq-mobile-drawer {
                background: #ffffff !important;
                border-left: 1px solid #e2e8f0 !important;
            }

            .ashyq-mobile-drawer.active {
                transform: translateX(0) !important;
                visibility: visible !important;
            }

            .ashyq-drawer-header {
                padding: 14px 18px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            [data-theme="light"] .ashyq-drawer-header {
                border-bottom-color: #e2e8f0 !important;
            }

            .ashyq-drawer-brand {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 16px;
                font-weight: 800;
                color: #ffffff;
            }

            [data-theme="light"] .ashyq-drawer-brand {
                color: #0f172a !important;
            }

            .ashyq-drawer-logo {
                width: 28px;
                height: 28px;
            }

            .ashyq-drawer-close {
                background: transparent;
                border: none;
                font-size: 24px;
                color: #94a3b8;
                cursor: pointer;
                line-height: 1;
            }

            .ashyq-drawer-body {
                flex: 1;
                overflow-y: auto;
                -webkit-overflow-scrolling: touch;
                padding: 14px 16px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .ashyq-drawer-group-title {
                font-size: 10.5px;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: #64748b;
                margin-top: 8px;
                margin-bottom: 3px;
            }

            .ashyq-drawer-nav {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }

            .ashyq-drawer-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.04);
                border: 1px solid rgba(255, 255, 255, 0.06);
                color: #e2e8f0 !important;
                text-decoration: none !important;
                font-size: 13.5px;
                font-weight: 600;
                transition: all 0.15s ease;
            }

            [data-theme="light"] .ashyq-drawer-item {
                background: #f8fafc !important;
                border-color: #e2e8f0 !important;
                color: #334155 !important;
            }

            .ashyq-drawer-item:active,
            .ashyq-drawer-item.active {
                background: rgba(0, 243, 255, 0.12);
                border-color: #00f3ff;
                color: #00f3ff !important;
            }

            .drawer-pill {
                margin-left: auto;
                font-size: 9.5px;
                background: rgba(52, 211, 153, 0.15);
                color: #34d399;
                padding: 2px 6px;
                border-radius: 5px;
                font-weight: 700;
            }

            .drawer-pill.purple { background: rgba(168, 85, 247, 0.15); color: #a855f7; }
            .drawer-pill.amber { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
            .drawer-pill.cyan { background: rgba(6, 182, 212, 0.15); color: #06b6d4; }

            .ashyq-drawer-tools-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 6px;
            }

            .ashyq-tool-chip {
                padding: 8px 10px;
                border-radius: 8px;
                background: rgba(255, 255, 255, 0.03);
                border: 1px solid rgba(255, 255, 255, 0.06);
                color: #cbd5e1 !important;
                text-decoration: none !important;
                font-size: 12px;
                font-weight: 500;
            }

            [data-theme="light"] .ashyq-tool-chip {
                background: #f1f5f9 !important;
                border-color: #e2e8f0 !important;
                color: #334155 !important;
            }

            .ashyq-drawer-insta-card {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 12px;
                border-radius: 10px;
                background: linear-gradient(45deg, rgba(240, 148, 51, 0.15), rgba(220, 39, 67, 0.15), rgba(188, 24, 136, 0.15));
                border: 1px solid rgba(225, 48, 108, 0.3);
                color: #ffffff !important;
                text-decoration: none !important;
            }

            .ashyq-drawer-insta-card i { font-size: 20px; color: #e1306c; }
            .ashyq-drawer-insta-card small { display: block; color: #94a3b8; font-size: 10.5px; }

            .ashyq-drawer-footer {
                padding: 12px 16px;
                border-top: 1px solid rgba(255, 255, 255, 0.08);
                background: rgba(0, 0, 0, 0.2);
            }

            [data-theme="light"] .ashyq-drawer-footer {
                border-top-color: #e2e8f0 !important;
                background: #f8fafc !important;
            }

            @media (max-width: 992px) {
                .ashyq-nav-center { display: none !important; }
                .ashyq-hamburger-btn { display: flex !important; }
                .ashyq-brand-seal { display: none !important; }
            }
        `;
        document.head.appendChild(style);
    }

    function initUniversalNav() {
        injectStyles();

        const lang = getLang();
        const t = navI18n[lang] || navI18n.kk;

        const headerHtml = `
            <header class="ashyq-universal-nav" id="ashyqUniNav">
                <div class="ashyq-nav-left">
                    <a href="index.html" class="ashyq-nav-brand" title="AshyqLab">
                        <img src="${logoSrc}" alt="AshyqLab" class="ashyq-nav-logo">
                        <div class="ashyq-brand-info">
                            <span class="ashyq-brand-title">Ashyq<span class="ashyq-brand-accent">Lab</span></span>
                            <span class="ashyq-brand-seal">Интерактивті зертханалар</span>
                        </div>
                    </a>
                </div>

                <div class="ashyq-nav-center">
                    <a href="index.html" class="ashyq-nav-link">
                        <i class="fa-solid fa-house"></i> <span>${t.home}</span>
                    </a>
                    <a href="subjects.html" class="ashyq-nav-link">
                        <i class="fa-solid fa-book-open"></i> <span>${t.subjects}</span>
                        <span class="ashyq-nav-badge">${t.subjectsBadge}</span>
                    </a>
                    <a href="studio.html" class="ashyq-nav-link">
                        <i class="fa-solid fa-gamepad"></i> <span>${t.games}</span>
                    </a>
                    <a href="presentation.html" class="ashyq-nav-link">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> <span>${t.slides}</span>
                    </a>
                    <a href="docs.html" class="ashyq-nav-link">
                        <i class="fa-solid fa-file-signature"></i> <span>${t.docs}</span>
                    </a>
                </div>

                <div class="ashyq-nav-right">
                    <a href="https://www.instagram.com/abduali__krm?stkn=MW44Y2RsdGhtYXk3OQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" class="ashyq-icon-btn" title="Instagram: @abduali__krm">
                        <i class="fa-brands fa-instagram" style="color: #e1306c;"></i>
                    </a>

                    <button type="button" class="ashyq-icon-btn" id="ashyqThemeBtn" onclick="window.ashyqToggleTheme()" title="Тақырыпты ауыстыру">
                        <i class="fa-solid fa-moon" id="ashyqThemeIcon"></i>
                    </button>

                    <div class="ashyq-lang-control">
                        <button class="ashyq-lang-btn ${lang === 'ru' ? 'active' : ''}" onclick="window.ashyqSetLang('ru')">RU</button>
                        <button class="ashyq-lang-btn ${lang === 'kk' ? 'active' : ''}" onclick="window.ashyqSetLang('kk')">ҚАЗ</button>
                        <button class="ashyq-lang-btn ${lang === 'en' ? 'active' : ''}" onclick="window.ashyqSetLang('en')">EN</button>
                    </div>

                    <button type="button" class="ashyq-hamburger-btn" id="ashyqHamBtn" onclick="window.ashyqToggleDrawer()" title="Мәзір">
                        <span class="ham-bar"></span>
                        <span class="ham-bar"></span>
                        <span class="ham-bar"></span>
                    </button>
                </div>
            </header>

            <div class="ashyq-drawer-backdrop" id="ashyqDrawerBackdrop" onclick="window.ashyqToggleDrawer(false)"></div>
            <aside class="ashyq-mobile-drawer" id="ashyqMobileDrawer">
                <div class="ashyq-drawer-header">
                    <div class="ashyq-drawer-brand">
                        <img src="${logoSrc}" alt="AshyqLab" class="ashyq-drawer-logo">
                        <span>Ashyq<span class="ashyq-brand-accent">Lab</span></span>
                    </div>
                    <button type="button" class="ashyq-drawer-close" onclick="window.ashyqToggleDrawer(false)">&times;</button>
                </div>

                <div class="ashyq-drawer-body">
                    <div class="ashyq-drawer-group-title">${t.sections}</div>
                    <nav class="ashyq-drawer-nav">
                        <a href="index.html" class="ashyq-drawer-item" onclick="window.ashyqToggleDrawer(false)">
                            <i class="fa-solid fa-house" style="color: #3b82f6;"></i> <span>${t.home}</span>
                        </a>
                        <a href="subjects.html" class="ashyq-drawer-item" onclick="window.ashyqToggleDrawer(false)">
                            <i class="fa-solid fa-book-open" style="color: #10b981;"></i> <span>${t.subjects}</span>
                            <span class="drawer-pill">${t.subjectsBadge}</span>
                        </a>
                        <a href="studio.html" class="ashyq-drawer-item" onclick="window.ashyqToggleDrawer(false)">
                            <i class="fa-solid fa-gamepad" style="color: #a855f7;"></i> <span>${t.games}</span>
                            <span class="drawer-pill purple">Play</span>
                        </a>
                        <a href="presentation.html" class="ashyq-drawer-item" onclick="window.ashyqToggleDrawer(false)">
                            <i class="fa-solid fa-wand-magic-sparkles" style="color: #f59e0b;"></i> <span>${t.slides}</span>
                            <span class="drawer-pill amber">AI</span>
                        </a>
                        <a href="docs.html" class="ashyq-drawer-item" onclick="window.ashyqToggleDrawer(false)">
                            <i class="fa-solid fa-file-signature" style="color: #06b6d4;"></i> <span>${t.docs}</span>
                            <span class="drawer-pill cyan">Doc</span>
                        </a>
                    </nav>

                    <div class="ashyq-drawer-group-title">${t.tools}</div>
                    <div class="ashyq-drawer-tools-grid">
                        <a href="calculator.html" class="ashyq-tool-chip" onclick="window.ashyqToggleDrawer(false)">
                            <span>🧮 ${t.calculator}</span>
                        </a>
                        <a href="converter.html" class="ashyq-tool-chip" onclick="window.ashyqToggleDrawer(false)">
                            <span>⚖️ ${t.converter}</span>
                        </a>
                        <a href="graphing.html" class="ashyq-tool-chip" onclick="window.ashyqToggleDrawer(false)">
                            <span>📈 ${t.graphing}</span>
                        </a>
                        <a href="stopwatch.html" class="ashyq-tool-chip" onclick="window.ashyqToggleDrawer(false)">
                            <span>⏱️ ${t.stopwatch}</span>
                        </a>
                        <a href="periodic.html" class="ashyq-tool-chip" onclick="window.ashyqToggleDrawer(false)">
                            <span>🧪 ${t.periodic}</span>
                        </a>
                    </div>

                    <div class="ashyq-drawer-group-title">Instagram</div>
                    <a href="https://www.instagram.com/abduali__krm?stkn=MW44Y2RsdGhtYXk3OQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" class="ashyq-drawer-insta-card" onclick="window.ashyqToggleDrawer(false)">
                        <i class="fa-brands fa-instagram"></i>
                        <div>
                            <strong>@abduali__krm</strong>
                            <small>Ресми парақша</small>
                        </div>
                    </a>
                </div>

                <div class="ashyq-drawer-footer">
                    <div class="ashyq-lang-control" style="width: 100%; justify-content: center;">
                        <button class="ashyq-lang-btn ${lang === 'ru' ? 'active' : ''}" onclick="window.ashyqSetLang('ru')">RU</button>
                        <button class="ashyq-lang-btn ${lang === 'kk' ? 'active' : ''}" onclick="window.ashyqSetLang('kk')">ҚАЗ</button>
                        <button class="ashyq-lang-btn ${lang === 'en' ? 'active' : ''}" onclick="window.ashyqSetLang('en')">EN</button>
                    </div>
                </div>
            </aside>
        `;

        const wrapper = document.createElement('div');
        wrapper.id = 'ashyqUniversalNavWrapper';
        wrapper.innerHTML = headerHtml;
        document.body.insertBefore(wrapper, document.body.firstChild);

        // Apply theme
        const savedTheme = localStorage.getItem('vsh-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.getElementById('ashyqThemeIcon');
        if (icon) {
            icon.className = savedTheme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    // Global Drawer Toggle
    window.ashyqToggleDrawer = function(force) {
        const drawer = document.getElementById('ashyqMobileDrawer') || document.getElementById('mobileDrawer');
        const backdrop = document.getElementById('ashyqDrawerBackdrop') || document.getElementById('drawerBackdrop');
        if (!drawer) return;

        const isOpen = typeof force === 'boolean' ? force : !drawer.classList.contains('active');
        drawer.classList.toggle('active', isOpen);
        if (backdrop) backdrop.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // Global Theme Toggle
    window.ashyqToggleTheme = function() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('vsh-theme', next);

        const icon = document.getElementById('ashyqThemeIcon') || document.getElementById('themeIcon');
        if (icon) {
            icon.className = next === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    };

    // Global Language Set
    window.ashyqSetLang = function(lang) {
        localStorage.setItem('vsh-lang', lang);
        if (typeof window.setLang === 'function') {
            window.setLang(lang);
        } else {
            window.location.reload();
        }
    };

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.ashyqToggleDrawer(false);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUniversalNav);
    } else {
        initUniversalNav();
    }
})();
