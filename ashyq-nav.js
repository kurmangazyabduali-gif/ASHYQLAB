/**
 * AshyqLab Universal Navigation & Mobile Drawer Engine
 * Automatically attaches high-fidelity responsive top navigation and slide-out mobile drawer across all pages.
 */
(function() {
    // Determine relative asset path
    const isSubfolder = window.location.pathname.includes('/src/');
    const logoSrc = isSubfolder ? '../../assets/logo.png' : 'assets/logo.png';
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

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

    function initUniversalNav() {
        const hasExistingHeader = document.querySelector('.docs-header') || 
                                  document.querySelector('.pres-header') || 
                                  document.querySelector('header.top-nav') ||
                                  document.querySelector('nav.top-nav') ||
                                  document.getElementById('topNav');

        const hasExistingDrawer = document.getElementById('mobileDrawer') || document.getElementById('ashyqMobileDrawer');

        const lang = getLang();
        const t = navI18n[lang] || navI18n.kk;

        const isHome = currentPath === 'index.html' || currentPath === '';
        const isSubjects = currentPath === 'subjects.html';
        const isStudio = currentPath === 'studio.html';
        const isDocs = currentPath === 'docs.html';
        const isPresentation = currentPath === 'presentation.html';

        // 1. Build Header HTML if not already present
        let headerHtml = '';
        if (!hasExistingHeader) {
            headerHtml = `
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
                        <a href="index.html" class="ashyq-nav-link ${isHome ? 'active' : ''}">
                            <i class="fa-solid fa-house"></i> <span>${t.home}</span>
                        </a>
                        <a href="subjects.html" class="ashyq-nav-link ${isSubjects ? 'active' : ''}">
                            <i class="fa-solid fa-book-open"></i> <span>${t.subjects}</span>
                            <span class="ashyq-nav-badge">${t.subjectsBadge}</span>
                        </a>
                        <a href="studio.html" class="ashyq-nav-link ${isStudio ? 'active' : ''}">
                            <i class="fa-solid fa-gamepad"></i> <span>${t.games}</span>
                        </a>
                        <a href="presentation.html" class="ashyq-nav-link ${isPresentation ? 'active' : ''}">
                            <i class="fa-solid fa-wand-magic-sparkles"></i> <span>${t.slides}</span>
                        </a>
                        <a href="docs.html" class="ashyq-nav-link ${isDocs ? 'active' : ''}">
                            <i class="fa-solid fa-file-signature"></i> <span>${t.docs}</span>
                        </a>
                    </div>

                    <div class="ashyq-nav-right">
                        <!-- Instagram Link -->
                        <a href="https://www.instagram.com/abduali__krm?stkn=MW44Y2RsdGhtYXk3OQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" class="ashyq-icon-btn" title="Instagram: @abduali__krm">
                            <i class="fa-brands fa-instagram" style="color: #e1306c;"></i>
                        </a>

                        <!-- Theme Toggle -->
                        <button type="button" class="ashyq-icon-btn" id="ashyqThemeBtn" onclick="window.ashyqToggleTheme()" title="Тақырыпты ауыстыру">
                            <i class="fa-solid fa-moon" id="ashyqThemeIcon"></i>
                        </button>

                        <!-- Language Switcher -->
                        <div class="ashyq-lang-control">
                            <button class="ashyq-lang-btn ${lang === 'ru' ? 'active' : ''}" onclick="window.ashyqSetLang('ru')">RU</button>
                            <button class="ashyq-lang-btn ${lang === 'kk' ? 'active' : ''}" onclick="window.ashyqSetLang('kk')">ҚАЗ</button>
                            <button class="ashyq-lang-btn ${lang === 'en' ? 'active' : ''}" onclick="window.ashyqSetLang('en')">EN</button>
                        </div>

                        <!-- Hamburger Button -->
                        <button type="button" class="ashyq-hamburger-btn" id="ashyqHamBtn" onclick="window.ashyqToggleDrawer()" title="Мәзір">
                            <span class="ham-bar"></span>
                            <span class="ham-bar"></span>
                            <span class="ham-bar"></span>
                        </button>
                    </div>
                </header>
            `;
        }

        // 2. Build Mobile Drawer HTML if not already present
        let drawerHtml = '';
        if (!hasExistingDrawer) {
            drawerHtml = `
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
                            <a href="index.html" class="ashyq-drawer-item ${isHome ? 'active' : ''}" onclick="window.ashyqToggleDrawer(false)">
                                <i class="fa-solid fa-house text-blue"></i> <span>${t.home}</span>
                            </a>
                            <a href="subjects.html" class="ashyq-drawer-item ${isSubjects ? 'active' : ''}" onclick="window.ashyqToggleDrawer(false)">
                                <i class="fa-solid fa-book-open text-emerald"></i> <span>${t.subjects}</span>
                                <span class="drawer-pill">${t.subjectsBadge}</span>
                            </a>
                            <a href="studio.html" class="ashyq-drawer-item ${isStudio ? 'active' : ''}" onclick="window.ashyqToggleDrawer(false)">
                                <i class="fa-solid fa-gamepad text-purple"></i> <span>${t.games}</span>
                                <span class="drawer-pill purple">Play</span>
                            </a>
                            <a href="presentation.html" class="ashyq-drawer-item ${isPresentation ? 'active' : ''}" onclick="window.ashyqToggleDrawer(false)">
                                <i class="fa-solid fa-wand-magic-sparkles text-amber"></i> <span>${t.slides}</span>
                                <span class="drawer-pill amber">AI</span>
                            </a>
                            <a href="docs.html" class="ashyq-drawer-item ${isDocs ? 'active' : ''}" onclick="window.ashyqToggleDrawer(false)">
                                <i class="fa-solid fa-file-signature text-cyan"></i> <span>${t.docs}</span>
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
                        <div class="ashyq-lang-control w-full justify-center">
                            <button class="ashyq-lang-btn ${lang === 'ru' ? 'active' : ''}" onclick="window.ashyqSetLang('ru')">RU</button>
                            <button class="ashyq-lang-btn ${lang === 'kk' ? 'active' : ''}" onclick="window.ashyqSetLang('kk')">ҚАЗ</button>
                            <button class="ashyq-lang-btn ${lang === 'en' ? 'active' : ''}" onclick="window.ashyqSetLang('en')">EN</button>
                        </div>
                    </div>
                </aside>
            `;
        }

        if (headerHtml || drawerHtml) {
            const wrapper = document.createElement('div');
            wrapper.id = 'ashyqUniversalNavWrapper';
            wrapper.innerHTML = headerHtml + drawerHtml;
            document.body.insertBefore(wrapper, document.body.firstChild);
        }

        // Apply theme
        const savedTheme = localStorage.getItem('vsh-theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        const icon = document.getElementById('ashyqThemeIcon') || document.getElementById('themeIcon');
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
