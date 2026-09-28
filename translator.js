/**
 * AshyqLab — Unified Page Translator & Language Switcher
 * Provides full multilingual translation across all non-lab pages (Kazakh default, Russian, English, and more)
 */

(function () {
    // 1. Ensure CSS for the segmented control and clean Google Translate integration
    const styleId = 'ashyqlab-translator-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Clean Segmented Control */
            .lang-segmented-control {
                display: inline-flex !important;
                align-items: center !important;
                background: #f1f5f9 !important;
                border: 1px solid #e2e8f0 !important;
                border-radius: 12px !important;
                padding: 3px !important;
                gap: 2px !important;
                user-select: none !important;
                vertical-align: middle !important;
            }
            [data-theme="dark"] .lang-segmented-control {
                background: rgba(15, 23, 42, 0.85) !important;
                border: 1px solid rgba(255, 255, 255, 0.15) !important;
            }
            .lang-segment {
                background: transparent !important;
                border: none !important;
                color: #64748b !important;
                font-family: inherit !important;
                font-size: 0.76rem !important;
                font-weight: 700 !important;
                padding: 5px 10px !important;
                border-radius: 9px !important;
                cursor: pointer !important;
                transition: all 0.2s ease !important;
                line-height: 1 !important;
            }
            .lang-segment:hover {
                color: #0f172a !important;
                background: #e2e8f0 !important;
            }
            [data-theme="dark"] .lang-segment {
                color: #94a3b8 !important;
            }
            [data-theme="dark"] .lang-segment:hover {
                color: #ffffff !important;
                background: rgba(255, 255, 255, 0.1) !important;
            }
            .lang-segment.active {
                background: #0f172a !important;
                color: #ffffff !important;
                box-shadow: 0 2px 8px rgba(15, 23, 42, 0.2) !important;
            }
            [data-theme="dark"] .lang-segment.active {
                background: linear-gradient(135deg, #0284c7 0%, #06b6d4 100%) !important;
                color: #ffffff !important;
                box-shadow: 0 2px 10px rgba(6, 182, 212, 0.4) !important;
            }

            /* Clean Google Translate Overrides - Hide banners, tooltips, frames */
            .goog-te-banner-frame.skiptranslate,
            .goog-te-banner-frame,
            iframe.goog-te-banner-frame {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
            }
            body {
                top: 0px !important;
                position: static !important;
            }
            .goog-tooltip,
            .goog-tooltip:hover,
            .goog-text-highlight {
                background-color: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }
            #goog-gt-tt,
            .goog-te-balloon-frame {
                display: none !important;
            }
            #google_translate_element {
                display: none !important;
            }
            .translated-ltr, .translated-rtl {
                margin-top: 0 !important;
            }
        `;
        document.head.appendChild(style);
    }

    // 2. Cookie Helpers
    function setGoogleTranslateCookie(lang) {
        if (!lang || lang === 'kk') {
            purgeGoogleTranslateCookies();
            return;
        }
        const cookieVal = '/kk/' + lang;
        const cookieStr = 'googtrans=' + cookieVal + '; path=/;';
        document.cookie = cookieStr;
        if (location.hostname) {
            document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=' + location.hostname + ';';
            document.cookie = 'googtrans=' + cookieVal + '; path=/; domain=.' + location.hostname + ';';
        }
    }

    function purgeGoogleTranslateCookies() {
        ['googtrans', 'googtrans_prev', 'googtrans_saved'].forEach(function (c) {
            document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            if (location.hostname) {
                document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + location.hostname + ";";
                document.cookie = c + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=." + location.hostname + ";";
            }
        });
    }

    // 3. Core Translation Trigger
    function triggerGoogleTranslate(lang) {
        const combo = document.querySelector('.goog-te-combo');
        if (combo) {
            combo.value = lang;
            combo.dispatchEvent(new Event('change'));
        }
    }

    // 4. Global Language Setter
    window.setLang = function (lang) {
        const currentLang = lang || 'kk';
        localStorage.setItem('vsh-lang', currentLang);
        document.documentElement.setAttribute('lang', currentLang);

        // Update active buttons across DOM
        document.querySelectorAll('.lang-segment, .lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });

        // Manage Google Translate cookie
        setGoogleTranslateCookie(currentLang);

        // If local i18n handler exists (from lobby.js or page custom script), run it
        if (window.__localSetLang && typeof window.__localSetLang === 'function') {
            window.__localSetLang(currentLang);
        }

        // Trigger Google Translate engine
        triggerGoogleTranslate(currentLang);
    };

    // 5. Initialize Google Translate Element
    window.googleTranslateInitHandler = function () {
        new google.translate.TranslateElement({
            pageLanguage: 'kk',
            includedLanguages: 'kk,ru,en,tr,uz,ky,de,fr,es,zh-CN,ar',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');

        // Apply saved language if not 'kk'
        const savedLang = localStorage.getItem('vsh-lang') || 'kk';
        if (savedLang && savedLang !== 'kk') {
            setTimeout(function () {
                triggerGoogleTranslate(savedLang);
            }, 300);
        }
    };

    // 6. DOM Preparation
    document.addEventListener('DOMContentLoaded', function () {
        // Ensure google_translate_element exists in body
        if (!document.getElementById('google_translate_element')) {
            const div = document.createElement('div');
            div.id = 'google_translate_element';
            div.style.display = 'none';
            document.body.appendChild(div);
        }

        // Load Google Translate script dynamically if not already loaded
        if (!document.getElementById('google-translate-script')) {
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.type = 'text/javascript';
            script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateInitHandler';
            document.body.appendChild(script);
        }

        // Sync initial UI state
        const savedLang = localStorage.getItem('vsh-lang') || 'kk';
        document.querySelectorAll('.lang-segment, .lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === savedLang);
        });
    });

    // Capture existing local setLang if already defined
    if (typeof window.setLang === 'function' && window.setLang !== window.__localSetLang) {
        window.__localSetLang = window.setLang;
    }
})();
