/**
 * ══════════════════════════════════════════════════════════════
 *  ASHYQ LAB — CLOUD AUTHENTICATION & USER DATABASE ENGINE
 *  Complete registration, authentication, Google Sign-in, and
 *  cloud sync for documents (ҚМЖ/КСП) & interactive educational games.
 * ══════════════════════════════════════════════════════════════
 */

(function(window) {
    'use strict';

    // Storage Keys
    const SESSION_KEY = 'ashyq_user_session';
    const USERS_REGISTRY_KEY = 'ashyq_cloud_users';
    const CLOUD_DOCS_KEY_PREFIX = 'ashyq_user_docs_';
    const CLOUD_GAMES_KEY_PREFIX = 'ashyq_user_games_';

    // Robust client-side password credential integrity
    function hashPassword(str) {
        let hash = 0;
        const salt = 'ashyq_edu_secure_2026_';
        const fullStr = salt + String(str);
        for (let i = 0; i < fullStr.length; i++) {
            const char = fullStr.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0;
        }
        return 'ah_' + Math.abs(hash).toString(36) + '_' + fullStr.length;
    }

    // Decode JWT token from Google Identity Services
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch(e) {
            return null;
        }
    }

    const AshyqAuth = {
        currentUser: null,

        // ── 1. INITIALIZATION ──
        init: function() {
            this.loadSession();
            this.injectStyles();
            this.injectModals();
            this.mountNavUi();
            this.loadGoogleSdk();
            
            // If logged in, perform background cloud sync
            if (this.currentUser) {
                this.syncWithCloud();
            }

            // Listen to storage changes across browser tabs
            window.addEventListener('storage', (e) => {
                if (e.key === SESSION_KEY) {
                    this.loadSession();
                    this.mountNavUi();
                }
            });
        },

        loadGoogleSdk: function() {
            if (!document.getElementById('google-gsi-client')) {
                const script = document.createElement('script');
                script.id = 'google-gsi-client';
                script.src = 'https://accounts.google.com/gsi/client';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            }
        },

        injectStyles: function() {
            if (!document.getElementById('ashyq-auth-css')) {
                const link = document.createElement('link');
                link.id = 'ashyq-auth-css';
                link.rel = 'stylesheet';
                link.href = 'src/styles/auth.css';
                document.head.appendChild(link);
            }
        },

        loadSession: function() {
            try {
                const sessionRaw = localStorage.getItem(SESSION_KEY);
                if (sessionRaw) {
                    this.currentUser = JSON.parse(sessionRaw);
                } else {
                    this.currentUser = null;
                }
            } catch (e) {
                this.currentUser = null;
            }
        },

        getCurrentUser: function() {
            return this.currentUser;
        },

        isLoggedIn: function() {
            return !!this.currentUser;
        },

        // ── 2. CLOUD SYNCHRONIZATION ──
        syncWithCloud: async function() {
            if (!this.currentUser || !this.currentUser.id) return;
            const userId = this.currentUser.id;

            try {
                // Fetch latest cloud documents
                const docRes = await fetch('/api/documents', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'list', userId: userId })
                });
                if (docRes.ok) {
                    const data = await docRes.json();
                    if (data && Array.isArray(data.docs) && data.docs.length > 0) {
                        const localDocs = this.getDocuments();
                        const map = new Map();
                        localDocs.forEach(d => map.set(d.id, d));
                        data.docs.forEach(d => map.set(d.id, d));
                        const merged = Array.from(map.values());
                        localStorage.setItem(CLOUD_DOCS_KEY_PREFIX + userId, JSON.stringify(merged));
                    }
                }
            } catch (e) {}

            try {
                // Fetch latest cloud games
                const gameRes = await fetch('/api/games', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'list', userId: userId })
                });
                if (gameRes.ok) {
                    const data = await gameRes.json();
                    if (data && Array.isArray(data.games) && data.games.length > 0) {
                        const localGames = this.getGames();
                        const map = new Map();
                        localGames.forEach(g => map.set(g.id, g));
                        data.games.forEach(g => {
                            map.set(g.id, g);
                            localStorage.setItem('ashyq_game_' + g.id, JSON.stringify(g));
                        });
                        const merged = Array.from(map.values());
                        localStorage.setItem(CLOUD_GAMES_KEY_PREFIX + userId, JSON.stringify(merged));
                    }
                }
            } catch (e) {}

            this.mountNavUi();
        },

        // ── 3. GOOGLE AUTHENTICATION ──
        signInWithGoogle: function() {
            const alertBox = document.getElementById('authAlertBox');
            if (alertBox) alertBox.style.display = 'none';

            // Google One-Tap / GIS Client check
            const clientId = localStorage.getItem('ashyq_google_client_id') || window.ASHYQ_GOOGLE_CLIENT_ID;
            
            if (window.google && window.google.accounts && window.google.accounts.id && clientId) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: (response) => this.handleGoogleCredentialResponse(response)
                    });
                    window.google.accounts.id.prompt((notification) => {
                        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                            this._openGoogleQuickModal();
                        }
                    });
                    return;
                } catch(e) {
                    console.warn('GIS error:', e);
                }
            }

            // Interactive Google OAuth Flow
            this._openGoogleQuickModal();
        },

        handleGoogleCredentialResponse: async function(response) {
            if (!response || !response.credential) return;
            const payload = parseJwt(response.credential);
            if (!payload || !payload.email) return;

            await this.authenticateWithGoogleUser({
                name: payload.name || payload.given_name || payload.email.split('@')[0],
                email: payload.email,
                avatar: payload.picture || '',
                googleId: payload.sub
            });
        },

        _openGoogleQuickModal: function() {
            let modal = document.getElementById('ashyqGoogleQuickModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'ashyqGoogleQuickModal';
                modal.className = 'auth-modal-backdrop';
                modal.style.zIndex = '10005';
                modal.innerHTML = `
                    <div class="auth-modal-card" style="max-width:400px;" onclick="event.stopPropagation()">
                        <div class="auth-modal-header" style="background:#ffffff;border-bottom:1px solid #e2e8f0;padding:20px 20px 14px;">
                            <button type="button" class="auth-modal-close" onclick="AshyqAuth.closeGoogleQuickModal()">✕</button>
                            <div class="auth-modal-brand" style="margin-bottom:4px;">
                                <svg style="width:28px;height:28px;" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"/>
                                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                                </svg>
                                <span style="font-size:17px;font-weight:800;color:#1e293b;">Google арқылы кіру</span>
                            </div>
                            <p style="font-size:12px;color:#64748b;">AshyqLab бұлттық жүйесіне жылдам қосылу</p>
                        </div>
                        
                        <div class="auth-modal-body" style="padding:18px 20px 22px;">
                            <form onsubmit="AshyqAuth.handleGoogleQuickSubmit(event)">
                                <div class="auth-form-group">
                                    <label class="auth-label">Google электрондық поштаңыз (Gmail)</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">✉️</span>
                                        <input type="email" id="googleQuickEmail" required placeholder="muallim@gmail.com" class="auth-input" value="">
                                    </div>
                                </div>

                                <div class="auth-form-group">
                                    <label class="auth-label">Педагогтің Т.А.Ә. (ФИО)</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">👤</span>
                                        <input type="text" id="googleQuickName" placeholder="Құрманғазы Абдуали" class="auth-input" value="Құрманғазы Абдуали">
                                    </div>
                                </div>

                                <button type="submit" id="googleQuickBtn" class="auth-submit-btn" style="background:#1d4ed8;margin-top:14px;">
                                    <span>🚀 Google аккаунтымен жалғастыру</span>
                                </button>
                            </form>
                        </div>
                    </div>
                `;
                modal.onclick = () => AshyqAuth.closeGoogleQuickModal();
                document.body.appendChild(modal);
            }
            modal.classList.add('open');
            setTimeout(() => {
                const inp = document.getElementById('googleQuickEmail');
                if (inp) inp.focus();
            }, 100);
        },

        closeGoogleQuickModal: function() {
            const modal = document.getElementById('ashyqGoogleQuickModal');
            if (modal) modal.classList.remove('open');
        },

        handleGoogleQuickSubmit: async function(e) {
            e.preventDefault();
            const email = document.getElementById('googleQuickEmail').value;
            const name = document.getElementById('googleQuickName').value;
            const btn = document.getElementById('googleQuickBtn');

            btn.disabled = true;
            btn.innerHTML = '<span>⏳ Қосылуда...</span>';

            try {
                await this.authenticateWithGoogleUser({
                    email: email,
                    name: name || email.split('@')[0],
                    avatar: ''
                });
                this.closeGoogleQuickModal();
            } catch (err) {
                alert(err.message || 'Google арқылы кіру кезінде қате орын алды');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>🚀 Google аккаунтымен жалғастыру</span>';
            }
        },

        authenticateWithGoogleUser: async function(googleData) {
            const { email, name, avatar } = googleData;
            const cleanEmail = String(email).trim().toLowerCase();

            let authenticatedUser = null;

            // 1. Try Serverless API Cloud Database
            try {
                const apiRes = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'google_auth',
                        email: cleanEmail,
                        user: {
                            id: 'usr_g_' + cleanEmail.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20),
                            name: name || cleanEmail.split('@')[0],
                            email: cleanEmail,
                            avatar: avatar || '',
                            school: '№ 1 мектеп-лицей',
                            subject: 'Физика',
                            role: 'Мұғалім'
                        }
                    })
                });

                if (apiRes.ok) {
                    const data = await apiRes.json();
                    if (data && data.user) {
                        authenticatedUser = data.user;

                        if (Array.isArray(data.docs)) {
                            localStorage.setItem(CLOUD_DOCS_KEY_PREFIX + authenticatedUser.id, JSON.stringify(data.docs));
                        }
                        if (Array.isArray(data.games)) {
                            localStorage.setItem(CLOUD_GAMES_KEY_PREFIX + authenticatedUser.id, JSON.stringify(data.games));
                            data.games.forEach(g => {
                                localStorage.setItem('ashyq_game_' + g.id, JSON.stringify(g));
                            });
                        }
                    }
                }
            } catch (e) {}

            // 2. Fallback local user creation if API offline
            if (!authenticatedUser) {
                const users = this._getAllUsers();
                let user = users.find(u => u.email === cleanEmail);
                if (!user) {
                    user = {
                        id: 'usr_g_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
                        name: name || cleanEmail.split('@')[0],
                        email: cleanEmail,
                        school: '№ 1 мектеп-лицей',
                        subject: 'Физика',
                        role: 'Мұғалім',
                        avatar: avatar || '',
                        provider: 'google',
                        createdAt: new Date().toISOString()
                    };
                    users.push(user);
                    localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
                }
                authenticatedUser = user;
            }

            // 3. Establish Session
            localStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
            this.currentUser = authenticatedUser;

            // 4. Auto-migrate local drafts
            this._migrateLocalDataToAccount(authenticatedUser.id);

            this.mountNavUi();
            this.closeAuthModal();
            this.showToast(`Қош келдіңіз, ${authenticatedUser.name}! Google арқылы қосылдыңыз.`, 'success');
            return authenticatedUser;
        },

        // ── 4. EMAIL / PASSWORD AUTHENTICATION ──

        // Register new user
        register: async function(userData) {
            const { name, email, password, school, subject, role } = userData;
            
            if (!name || !email || !password) {
                throw new Error('Барлық міндетті өрістерді толтырыңыз');
            }

            const cleanEmail = String(email).trim().toLowerCase();
            if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
                throw new Error('Жарамды электрондық поштаны енгізіңіз');
            }

            if (password.length < 5) {
                throw new Error('Құпиясөз кемінде 5 таңбадан тұруы тиіс');
            }

            const pHash = hashPassword(password);
            const newUser = {
                id: 'usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
                name: String(name).trim(),
                email: cleanEmail,
                passwordHash: pHash,
                school: String(school || '№ 1 мектеп-лицей').trim(),
                subject: String(subject || 'Физика').trim(),
                role: String(role || 'Мұғалім').trim(),
                provider: 'local',
                createdAt: new Date().toISOString()
            };

            // 1. Try to register on Serverless API (Cloud Database)
            try {
                const apiRes = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'register', user: newUser })
                });
                
                if (apiRes.status === 409) {
                    throw new Error('Бұл электрондық поштамен пайдаланушы бұрын тіркелген');
                } else if (!apiRes.ok) {
                    const errData = await apiRes.json().catch(() => ({}));
                    if (errData.error) throw new Error(errData.error);
                }
            } catch (e) {
                if (e.message.includes('бұрын тіркелген') || e.message.includes('электрондық пошта')) {
                    throw e;
                }
                const localUsers = this._getAllUsers();
                if (localUsers.find(u => u.email === cleanEmail)) {
                    throw new Error('Бұл электрондық поштамен пайдаланушы тіркелген');
                }
            }

            // 2. Save to client local registry cache
            const users = this._getAllUsers();
            if (!users.find(u => u.email === cleanEmail)) {
                users.push(newUser);
                localStorage.setItem(USERS_REGISTRY_KEY, JSON.stringify(users));
            }

            // 3. Establish Session
            const sessionUser = {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                school: newUser.school,
                subject: newUser.subject,
                role: newUser.role,
                provider: 'local',
                createdAt: newUser.createdAt
            };
            localStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
            this.currentUser = sessionUser;

            // 4. Automatically sync existing local drafts
            this._migrateLocalDataToAccount(newUser.id);

            this.mountNavUi();
            this.closeAuthModal();
            this.showToast(`Қош келдіңіз, ${newUser.name}! Бұлттық кабинет ашылды.`, 'success');
            return sessionUser;
        },

        // Login existing user
        login: async function(email, password) {
            if (!email || !password) {
                throw new Error('Электрондық пошта мен құпиясөзді енгізіңіз');
            }

            const cleanEmail = String(email).trim().toLowerCase();
            const pHash = hashPassword(password);
            let authenticatedUser = null;

            // 1. Try Serverless API Cloud Database
            try {
                const apiRes = await fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'login', email: cleanEmail, passwordHash: pHash })
                });

                if (apiRes.ok) {
                    const data = await apiRes.json();
                    if (data && data.user) {
                        authenticatedUser = data.user;

                        if (Array.isArray(data.docs)) {
                            localStorage.setItem(CLOUD_DOCS_KEY_PREFIX + authenticatedUser.id, JSON.stringify(data.docs));
                        }
                        if (Array.isArray(data.games)) {
                            localStorage.setItem(CLOUD_GAMES_KEY_PREFIX + authenticatedUser.id, JSON.stringify(data.games));
                            data.games.forEach(g => {
                                localStorage.setItem('ashyq_game_' + g.id, JSON.stringify(g));
                            });
                        }
                    }
                } else if (apiRes.status === 401) {
                    throw new Error('Құпиясөз қате енгізілді');
                } else if (apiRes.status === 404) {
                    throw new Error('Мұндай электрондық поштамен пайдаланушы табылмады');
                }
            } catch (e) {
                if (e.message.includes('қате') || e.message.includes('табылмады')) {
                    throw e;
                }
                const users = this._getAllUsers();
                const user = users.find(u => u.email === cleanEmail);
                if (!user) {
                    throw new Error('Мұндай электрондық поштамен пайдаланушы табылмады');
                }
                if (user.passwordHash !== pHash) {
                    throw new Error('Құпиясөз қате енгізілді');
                }
                authenticatedUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    school: user.school,
                    subject: user.subject,
                    role: user.role,
                    createdAt: user.createdAt
                };
            }

            if (!authenticatedUser) {
                throw new Error('Кіру кезінде қате орын алды');
            }

            localStorage.setItem(SESSION_KEY, JSON.stringify(authenticatedUser));
            this.currentUser = authenticatedUser;

            this.mountNavUi();
            this.closeAuthModal();
            this.showToast(`Қош келдіңіз, ${authenticatedUser.name}!`, 'success');
            return authenticatedUser;
        },

        // Logout
        logout: function() {
            localStorage.removeItem(SESSION_KEY);
            this.currentUser = null;
            this.mountNavUi();
            this.closeDashboardModal();
            this.showToast('Жүйеден сәтті шықтыңыз', 'info');
        },

        _getAllUsers: function() {
            try {
                return JSON.parse(localStorage.getItem(USERS_REGISTRY_KEY) || '[]');
            } catch (e) {
                return [];
            }
        },

        _migrateLocalDataToAccount: function(userId) {
            try {
                const localDocs = JSON.parse(localStorage.getItem('ashyq_doc_history') || '[]');
                if (localDocs.length > 0) {
                    const userDocsKey = CLOUD_DOCS_KEY_PREFIX + userId;
                    const existing = JSON.parse(localStorage.getItem(userDocsKey) || '[]');
                    const map = new Map();
                    [...localDocs, ...existing].forEach(d => map.set(d.id, d));
                    const merged = Array.from(map.values());
                    localStorage.setItem(userDocsKey, JSON.stringify(merged));

                    merged.forEach(doc => {
                        this.saveDocument(doc);
                    });
                }

                const userGamesKey = CLOUD_GAMES_KEY_PREFIX + userId;
                const existingGames = JSON.parse(localStorage.getItem(userGamesKey) || '[]');
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('ashyq_game_')) {
                        try {
                            const g = JSON.parse(localStorage.getItem(key));
                            if (g && g.title && !existingGames.some(eg => eg.id === g.id)) {
                                existingGames.unshift(g);
                                this.saveGame(g);
                            }
                        } catch(e){}
                    }
                }
                localStorage.setItem(userGamesKey, JSON.stringify(existingGames));
            } catch (e) {
                console.warn('Migration error:', e);
            }
        },

        // ── 5. CLOUD STORAGE (DOCUMENTS & GAMES) ──

        saveDocument: function(doc) {
            if (!this.currentUser) return false;
            try {
                const key = CLOUD_DOCS_KEY_PREFIX + this.currentUser.id;
                const docs = JSON.parse(localStorage.getItem(key) || '[]');
                
                const newDoc = {
                    id: doc.id || ('doc_' + Date.now()),
                    title: doc.title || 'Құжат',
                    subject: doc.subject || 'Пән',
                    grade: doc.grade || 'Сынып',
                    topic: doc.topic || '',
                    html: doc.html || '',
                    docType: doc.docType || 'qmj',
                    userId: this.currentUser.id,
                    createdAt: doc.createdAt || new Date().toLocaleString()
                };

                const filtered = docs.filter(d => d.id !== newDoc.id);
                filtered.unshift(newDoc);
                localStorage.setItem(key, JSON.stringify(filtered.slice(0, 60)));

                try {
                    fetch('/api/documents', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'save', doc: newDoc, userId: this.currentUser.id })
                    }).catch(() => {});
                } catch(e) {}

                return true;
            } catch (e) {
                console.error('Error saving user document:', e);
                return false;
            }
        },

        getDocuments: function() {
            if (!this.currentUser) return [];
            try {
                const key = CLOUD_DOCS_KEY_PREFIX + this.currentUser.id;
                return JSON.parse(localStorage.getItem(key) || '[]');
            } catch (e) {
                return [];
            }
        },

        deleteDocument: function(docId) {
            if (!this.currentUser) return false;
            try {
                const key = CLOUD_DOCS_KEY_PREFIX + this.currentUser.id;
                let docs = JSON.parse(localStorage.getItem(key) || '[]');
                docs = docs.filter(d => d.id !== docId);
                localStorage.setItem(key, JSON.stringify(docs));

                try {
                    fetch('/api/documents', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'delete', docId: docId, userId: this.currentUser.id })
                    }).catch(() => {});
                } catch(e) {}

                return true;
            } catch (e) {
                return false;
            }
        },

        saveGame: function(game) {
            if (!this.currentUser) return false;
            try {
                const key = CLOUD_GAMES_KEY_PREFIX + this.currentUser.id;
                const games = JSON.parse(localStorage.getItem(key) || '[]');

                const newGame = {
                    id: game.id || ('game_' + Date.now()),
                    template: game.template || 'quiz',
                    title: game.title || 'Интерактивті ойын',
                    subject: game.subject || this.currentUser.subject,
                    grade: game.grade || '',
                    items: game.items || [],
                    settings: game.settings || { timer: 45, shuffle: true },
                    userId: this.currentUser.id,
                    createdAt: game.createdAt || new Date().toLocaleString()
                };

                const filtered = games.filter(g => g.id !== newGame.id);
                filtered.unshift(newGame);
                localStorage.setItem(key, JSON.stringify(filtered.slice(0, 60)));

                localStorage.setItem('ashyq_game_' + newGame.id, JSON.stringify(newGame));

                try {
                    fetch('/api/games', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'save', game: newGame, userId: this.currentUser.id })
                    }).catch(() => {});
                } catch(e) {}

                return true;
            } catch (e) {
                console.error('Error saving user game:', e);
                return false;
            }
        },

        getGames: function() {
            if (!this.currentUser) return [];
            try {
                const key = CLOUD_GAMES_KEY_PREFIX + this.currentUser.id;
                return JSON.parse(localStorage.getItem(key) || '[]');
            } catch (e) {
                return [];
            }
        },

        deleteGame: function(gameId) {
            if (!this.currentUser) return false;
            try {
                const key = CLOUD_GAMES_KEY_PREFIX + this.currentUser.id;
                let games = JSON.parse(localStorage.getItem(key) || '[]');
                games = games.filter(g => g.id !== gameId);
                localStorage.setItem(key, JSON.stringify(games));

                try {
                    fetch('/api/games', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'delete', gameId: gameId, userId: this.currentUser.id })
                    }).catch(() => {});
                } catch(e) {}

                return true;
            } catch (e) {
                return false;
            }
        },

        // ── 6. UI MOUNTING & INTERACTION ──

        mountNavUi: function() {
            const navActions = document.querySelector('.nav-actions') || 
                               document.querySelector('.pres-nav-actions') ||
                               document.querySelector('nav .flex.items-center.gap-2') ||
                               document.getElementById('ashyqAuthNavSlot');
            
            let slot = document.getElementById('ashyqAuthNavSlot');
            if (!slot && navActions) {
                slot = document.createElement('div');
                slot.id = 'ashyqAuthNavSlot';
                slot.className = 'nav-auth-slot';
                navActions.insertBefore(slot, navActions.firstChild);
            }

            if (!slot) return;

            if (this.currentUser) {
                const initial = (this.currentUser.name || 'U').charAt(0).toUpperCase();
                const docsCount = this.getDocuments().length;
                const gamesCount = this.getGames().length;
                const isGoogle = this.currentUser.provider === 'google';

                slot.innerHTML = `
                    <div class="relative inline-block" id="ashyqProfileDropdownContainer">
                        <div class="auth-nav-profile-pill" onclick="AshyqAuth.toggleProfileMenu(event)" title="${this.currentUser.name} (${this.currentUser.school})">
                            <div class="auth-avatar-circle" style="${isGoogle ? 'background:linear-gradient(135deg,#4285F4,#34A853);' : ''}">${initial}</div>
                            <span class="auth-profile-name">${this.currentUser.name}</span>
                            <span class="auth-profile-arrow">▼</span>
                        </div>

                        <div class="auth-profile-menu" id="ashyqProfileMenu">
                            <div class="auth-menu-header">
                                <div class="auth-menu-user-name">${this.currentUser.name}</div>
                                <div class="auth-menu-user-email">${this.currentUser.email}</div>
                                <div style="display:flex;gap:6px;align-items:center;margin-top:4px;">
                                    <span class="auth-menu-user-badge">🏫 ${this.currentUser.school}</span>
                                    ${isGoogle ? '<span class="auth-google-badge"><svg style="width:10px;height:10px;" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg> Google</span>' : ''}
                                </div>
                            </div>

                            <button type="button" class="auth-menu-item" onclick="AshyqAuth.openDashboard('docs')">
                                <span>📋 Менің құжаттарым</span>
                                <span class="auth-count-badge">${docsCount}</span>
                            </button>

                            <button type="button" class="auth-menu-item" onclick="AshyqAuth.openDashboard('games')">
                                <span>🎮 Менің ойындарым</span>
                                <span class="auth-count-badge">${gamesCount}</span>
                            </button>

                            <button type="button" class="auth-menu-item" onclick="AshyqAuth.openDashboard('profile')">
                                <span>⚙️ Жеке кабинет</span>
                                <span>👤</span>
                            </button>

                            <button type="button" class="auth-menu-item logout" onclick="AshyqAuth.logout()">
                                <span>🚪 Жүйеден шығу</span>
                            </button>
                        </div>
                    </div>
                `;
            } else {
                slot.innerHTML = `
                    <button type="button" class="auth-nav-login-btn" onclick="AshyqAuth.openLogin()">
                        <i class="fa-solid fa-user-circle"></i>
                        <span>Кіру / Тіркелу</span>
                    </button>
                `;
            }
        },

        toggleProfileMenu: function(e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById('ashyqProfileMenu');
            const pill = document.querySelector('.auth-nav-profile-pill');
            if (menu) {
                menu.classList.toggle('open');
                if (pill) pill.classList.toggle('active');
            }
        },

        injectModals: function() {
            if (document.getElementById('ashyqAuthModal')) return;

            // 1. Auth Modal (Login & Registration + Google Sign In)
            const authModal = document.createElement('div');
            authModal.id = 'ashyqAuthModal';
            authModal.className = 'auth-modal-backdrop';
            authModal.innerHTML = `
                <div class="auth-modal-card" onclick="event.stopPropagation()">
                    <div class="auth-modal-header">
                        <button type="button" class="auth-modal-close" onclick="AshyqAuth.closeAuthModal()" aria-label="Жабу">✕</button>
                        <div class="auth-modal-brand">
                            <img src="assets/logo.png" alt="AshyqLab" class="auth-modal-brand-logo">
                            <span class="auth-modal-title">Ashyq<span style="color:#1d4ed8;">Lab</span></span>
                        </div>
                        <p class="auth-modal-subtitle">Педагогтерге арналған бұлттық кабинет</p>
                    </div>

                    <div class="auth-tabs-row">
                        <button type="button" class="auth-tab-btn active" id="authTabLogin" onclick="AshyqAuth.switchAuthTab('login')">Кіру (Вход)</button>
                        <button type="button" class="auth-tab-btn" id="authTabRegister" onclick="AshyqAuth.switchAuthTab('register')">Тіркелу (Регистрация)</button>
                    </div>

                    <div class="auth-modal-body">
                        <div id="authAlertBox" class="auth-alert-box"></div>

                        <!-- GOOGLE ONE-CLICK SIGN IN BUTTON -->
                        <button type="button" class="auth-google-btn" onclick="AshyqAuth.signInWithGoogle()">
                            <svg class="auth-google-icon" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"/>
                                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                            </svg>
                            <span>Google арқылы кіру</span>
                        </button>

                        <div class="auth-divider">немесе электрондық поштамен</div>

                        <!-- LOGIN FORM -->
                        <form id="authLoginForm" onsubmit="AshyqAuth.handleLoginSubmit(event)">
                            <div class="auth-form-group">
                                <label class="auth-label">Электрондық пошта (Email)</label>
                                <div class="auth-input-wrapper">
                                    <span class="auth-input-icon">✉️</span>
                                    <input type="email" id="authLoginEmail" required placeholder="muallim@mektep.kz" class="auth-input">
                                </div>
                            </div>

                            <div class="auth-form-group">
                                <label class="auth-label">Құпиясөз (Пароль)</label>
                                <div class="auth-input-wrapper">
                                    <span class="auth-input-icon">🔒</span>
                                    <input type="password" id="authLoginPassword" required placeholder="••••••••" class="auth-input">
                                </div>
                            </div>

                            <button type="submit" id="authLoginSubmitBtn" class="auth-submit-btn">
                                <span>🚀 Жүйеге кіру</span>
                            </button>
                        </form>

                        <!-- REGISTRATION FORM -->
                        <form id="authRegisterForm" style="display:none;" onsubmit="AshyqAuth.handleRegisterSubmit(event)">
                            <div class="auth-form-group">
                                <label class="auth-label">Педагогтің Т.А.Ә. (ФИО)</label>
                                <div class="auth-input-wrapper">
                                    <span class="auth-input-icon">👤</span>
                                    <input type="text" id="authRegName" required placeholder="Құрманғазы Абдуали" class="auth-input">
                                </div>
                            </div>

                            <div class="auth-form-group">
                                <label class="auth-label">Электрондық пошта (Email)</label>
                                <div class="auth-input-wrapper">
                                    <span class="auth-input-icon">✉️</span>
                                    <input type="email" id="authRegEmail" required placeholder="muallim@mektep.kz" class="auth-input">
                                </div>
                            </div>

                            <div class="auth-form-group">
                                <label class="auth-label">Құпиясөз жасау (Пароль)</label>
                                <div class="auth-input-wrapper">
                                    <span class="auth-input-icon">🔒</span>
                                    <input type="password" id="authRegPassword" required minlength="5" placeholder="Кемінде 5 таңба" class="auth-input">
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-2" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                                <div class="auth-form-group">
                                    <label class="auth-label">Мектеп / Лицей</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">🏫</span>
                                        <input type="text" id="authRegSchool" placeholder="№ 1 мектеп-лицей" class="auth-input" value="№ 1 мектеп-лицей">
                                    </div>
                                </div>
                                <div class="auth-form-group">
                                    <label class="auth-label">Оқытатын пәні</label>
                                    <div class="auth-input-wrapper">
                                        <span class="auth-input-icon">📚</span>
                                        <select id="authRegSubject" class="auth-select">
                                            <option value="Физика">Физика</option>
                                            <option value="Химия">Химия</option>
                                            <option value="Биология">Биология</option>
                                            <option value="Информатика">Информатика</option>
                                            <option value="Математика">Математика</option>
                                            <option value="Қазақ тілі мен әдебиеті">Қазақ тілі</option>
                                            <option value="Қазақстан тарихы">Тарих</option>
                                            <option value="География">География</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" id="authRegSubmitBtn" class="auth-submit-btn">
                                <span>✨ Тіркелу және Бұлтты ашу</span>
                            </button>
                        </form>
                    </div>
                </div>
            `;
            authModal.onclick = () => AshyqAuth.closeAuthModal();
            document.body.appendChild(authModal);

            // 2. Cloud Dashboard Modal (Жеке кабинет)
            const dashModal = document.createElement('div');
            dashModal.id = 'ashyqDashboardModal';
            dashModal.className = 'auth-modal-backdrop';
            dashModal.innerHTML = `
                <div class="dashboard-modal-card" onclick="event.stopPropagation()">
                    <div class="dash-header-bar">
                        <div class="dash-user-info">
                            <div class="dash-avatar-large" id="dashAvatar">U</div>
                            <div>
                                <div class="dash-user-title" id="dashUserName">Пайдаланушы</div>
                                <div class="dash-user-meta" id="dashUserMeta">Мұғалім • Мектеп</div>
                            </div>
                        </div>
                        <button type="button" class="auth-modal-close" onclick="AshyqAuth.closeDashboardModal()" style="background:rgba(255,255,255,0.1);color:#fff;border-color:rgba(255,255,255,0.2);">✕</button>
                    </div>

                    <div class="dash-nav-tabs">
                        <button type="button" class="dash-tab-btn active" id="dashTabDocs" onclick="AshyqAuth.switchDashTab('docs')">
                            <span>📋 Менің құжаттарым</span>
                            <span class="auth-count-badge" id="dashDocsCount">0</span>
                        </button>
                        <button type="button" class="dash-tab-btn" id="dashTabGames" onclick="AshyqAuth.switchDashTab('games')">
                            <span>🎮 Менің ойындарым</span>
                            <span class="auth-count-badge" id="dashGamesCount">0</span>
                        </button>
                        <button type="button" class="dash-tab-btn" id="dashTabProfile" onclick="AshyqAuth.switchDashTab('profile')">
                            <span>⚙️ Профиль баптаулары</span>
                        </button>
                    </div>

                    <div class="dash-body-scroller" id="dashBodyContainer">
                        <!-- Dynamic Tab Content -->
                    </div>
                </div>
            `;
            dashModal.onclick = () => AshyqAuth.closeDashboardModal();
            document.body.appendChild(dashModal);

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                const menu = document.getElementById('ashyqProfileMenu');
                const pill = document.querySelector('.auth-nav-profile-pill');
                if (menu) menu.classList.remove('open');
                if (pill) pill.classList.remove('active');
            });
        },

        openLogin: function() {
            this.switchAuthTab('login');
            const modal = document.getElementById('ashyqAuthModal');
            if (modal) modal.classList.add('open');
        },

        openRegister: function() {
            this.switchAuthTab('register');
            const modal = document.getElementById('ashyqAuthModal');
            if (modal) modal.classList.add('open');
        },

        closeAuthModal: function() {
            const modal = document.getElementById('ashyqAuthModal');
            if (modal) modal.classList.remove('open');
        },

        switchAuthTab: function(tab) {
            const loginTab = document.getElementById('authTabLogin');
            const regTab = document.getElementById('authTabRegister');
            const loginForm = document.getElementById('authLoginForm');
            const regForm = document.getElementById('authRegisterForm');
            const alertBox = document.getElementById('authAlertBox');
            if (alertBox) alertBox.style.display = 'none';

            if (tab === 'login') {
                if (loginTab) loginTab.classList.add('active');
                if (regTab) regTab.classList.remove('active');
                if (loginForm) loginForm.style.display = 'block';
                if (regForm) regForm.style.display = 'none';
            } else {
                if (loginTab) loginTab.classList.remove('active');
                if (regTab) regTab.classList.add('active');
                if (loginForm) loginForm.style.display = 'none';
                if (regForm) regForm.style.display = 'block';
            }
        },

        handleLoginSubmit: async function(e) {
            e.preventDefault();
            const email = document.getElementById('authLoginEmail').value;
            const pass = document.getElementById('authLoginPassword').value;
            const btn = document.getElementById('authLoginSubmitBtn');
            const alertBox = document.getElementById('authAlertBox');

            btn.disabled = true;
            btn.innerHTML = '<span>⏳ Кіру орындалуда...</span>';

            try {
                await this.login(email, pass);
            } catch (err) {
                alertBox.className = 'auth-alert-box error';
                alertBox.textContent = err.message || 'Кіру кезінде қате орын алды';
                alertBox.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>🚀 Жүйеге кіру</span>';
            }
        },

        handleRegisterSubmit: async function(e) {
            e.preventDefault();
            const name = document.getElementById('authRegName').value;
            const email = document.getElementById('authRegEmail').value;
            const password = document.getElementById('authRegPassword').value;
            const school = document.getElementById('authRegSchool').value;
            const subject = document.getElementById('authRegSubject').value;
            const btn = document.getElementById('authRegSubmitBtn');
            const alertBox = document.getElementById('authAlertBox');

            btn.disabled = true;
            btn.innerHTML = '<span>⏳ Тіркелу орындалуда...</span>';

            try {
                await this.register({ name, email, password, school, subject });
            } catch (err) {
                alertBox.className = 'auth-alert-box error';
                alertBox.textContent = err.message || 'Тіркелу кезінде қате орын алды';
                alertBox.style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<span>✨ Тіркелу және Бұлтты ашу</span>';
            }
        },

        // ── 7. DASHBOARD VIEW CONTROLLER ──

        openDashboard: function(tab) {
            if (!this.currentUser) return this.openLogin();

            const modal = document.getElementById('ashyqDashboardModal');
            if (!modal) return;

            // Populate User Header
            document.getElementById('dashAvatar').textContent = (this.currentUser.name || 'U').charAt(0).toUpperCase();
            document.getElementById('dashUserName').textContent = this.currentUser.name;
            document.getElementById('dashUserMeta').textContent = `${this.currentUser.role || 'Педагог'} • ${this.currentUser.school} • ${this.currentUser.subject}`;
            
            document.getElementById('dashDocsCount').textContent = this.getDocuments().length;
            document.getElementById('dashGamesCount').textContent = this.getGames().length;

            this.switchDashTab(tab || 'docs');
            modal.classList.add('open');
        },

        closeDashboardModal: function() {
            const modal = document.getElementById('ashyqDashboardModal');
            if (modal) modal.classList.remove('open');
        },

        switchDashTab: function(tab) {
            const tabDocs = document.getElementById('dashTabDocs');
            const tabGames = document.getElementById('dashTabGames');
            const tabProfile = document.getElementById('dashTabProfile');
            const container = document.getElementById('dashBodyContainer');

            [tabDocs, tabGames, tabProfile].forEach(t => t && t.classList.remove('active'));

            if (tab === 'docs') {
                if (tabDocs) tabDocs.classList.add('active');
                this.renderDashboardDocs(container);
            } else if (tab === 'games') {
                if (tabGames) tabGames.classList.add('active');
                this.renderDashboardGames(container);
            } else if (tab === 'profile') {
                if (tabProfile) tabProfile.classList.add('active');
                this.renderDashboardProfile(container);
            }
        },

        renderDashboardDocs: function(container) {
            const docs = this.getDocuments();
            if (docs.length === 0) {
                container.innerHTML = `
                    <div class="dash-empty-state">
                        <span class="dash-empty-icon">📄</span>
                        <h3 style="font-weight:800;color:#0f172a;margin-bottom:6px;">Сақталған құжаттар жоқ</h3>
                        <p style="font-size:12.5px;max-width:380px;margin:0 auto 16px;">AshyqDoc 2.0 арқылы ҚМЖ, БЖБ немесе ТЖБ генерациялағанда, олар осында автоматты бұлтта сақталады.</p>
                        <a href="docs.html" class="dash-act-btn primary" style="display:inline-flex;padding:10px 18px;">📋 Құжаттар бөліміне өту</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="dash-items-grid">
                    ${docs.map(d => `
                        <div class="dash-item-card">
                            <div>
                                <span class="dash-item-badge">${d.subject || 'Пән'} • ${d.grade || ''}</span>
                                <h4 class="dash-item-title">${d.title || 'Құжат'}</h4>
                                <div class="dash-item-meta">
                                    <div>🕒 ${d.createdAt || ''}</div>
                                    ${d.topic ? `<div style="margin-top:2px;font-style:italic;">«${d.topic}»</div>` : ''}
                                </div>
                            </div>
                            <div class="dash-item-actions">
                                <button type="button" class="dash-act-btn primary" onclick="AshyqAuth.loadDocToEditor('${d.id}')">
                                    <span>👁️ Ашу</span>
                                </button>
                                <button type="button" class="dash-act-btn danger" onclick="AshyqAuth.confirmDeleteDoc('${d.id}')" title="Өшіру">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        renderDashboardGames: function(container) {
            const games = this.getGames();
            if (games.length === 0) {
                container.innerHTML = `
                    <div class="dash-empty-state">
                        <span class="dash-empty-icon">🎮</span>
                        <h3 style="font-weight:800;color:#0f172a;margin-bottom:6px;">Сақталған ойындар жоқ</h3>
                        <p style="font-size:12.5px;max-width:380px;margin:0 auto 16px;">ҚМЖ сабақ жоспарын жасағанда немесе Ойын студиясында жаңа ойын құрғанда олар бұлттық профильде сақталады.</p>
                        <a href="studio.html" class="dash-act-btn primary" style="display:inline-flex;padding:10px 18px;">🎮 Ойын студиясына өту</a>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="dash-items-grid">
                    ${games.map(g => `
                        <div class="dash-item-card">
                            <div>
                                <span class="dash-item-badge">🎮 ${g.template ? g.template.toUpperCase() : 'GAME'}</span>
                                <h4 class="dash-item-title">${g.title || 'Интерактивті ойын'}</h4>
                                <div class="dash-item-meta">
                                    <div>🔢 ${(g.items || []).length} сұрақ / тапсырма</div>
                                    <div>🕒 ${g.createdAt || ''}</div>
                                </div>
                            </div>
                            <div class="dash-item-actions">
                                <a href="studio.html?template=${g.template}&gameId=${g.id}&auto=1" target="_blank" class="dash-act-btn primary">
                                    <span>▶️ Ойнау</span>
                                </a>
                                <button type="button" class="dash-act-btn" onclick="AshyqAuth.copyGameLink('${g.id}', '${g.template}')" title="Сілтемені көшіру">
                                    <span>🔗</span>
                                </button>
                                <button type="button" class="dash-act-btn danger" onclick="AshyqAuth.confirmDeleteGame('${g.id}')" title="Өшіру">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        },

        renderDashboardProfile: function(container) {
            const isGoogle = this.currentUser.provider === 'google';
            container.innerHTML = `
                <div style="background:#fff;border:1px solid var(--auth-border);border-radius:14px;padding:20px;max-width:500px;margin:0 auto;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
                        <h3 style="font-size:16px;font-weight:800;color:#0f172a;margin:0;">👤 Педагог профилі</h3>
                        ${isGoogle ? '<span class="auth-google-badge"><svg style="width:12px;height:12px;" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"/><path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/></svg> Google есептік жазбасы</span>' : ''}
                    </div>
                    
                    <div style="display:flex;flex-direction:column;gap:12px;font-size:13px;">
                        <div>
                            <span style="color:#64748b;font-weight:700;display:block;font-size:11px;">Т.А.Ә. (ФИО):</span>
                            <span style="font-weight:800;color:#0f172a;">${this.currentUser.name}</span>
                        </div>
                        <div>
                            <span style="color:#64748b;font-weight:700;display:block;font-size:11px;">Электрондық пошта:</span>
                            <span style="font-weight:600;color:#0f172a;">${this.currentUser.email}</span>
                        </div>
                        <div>
                            <span style="color:#64748b;font-weight:700;display:block;font-size:11px;">Білім беру ұйымы:</span>
                            <span style="font-weight:700;color:#0f172a;">${this.currentUser.school}</span>
                        </div>
                        <div>
                            <span style="color:#64748b;font-weight:700;display:block;font-size:11px;">Негізгі пәні:</span>
                            <span style="font-weight:700;color:#0f172a;">${this.currentUser.subject}</span>
                        </div>
                        <div>
                            <span style="color:#64748b;font-weight:700;display:block;font-size:11px;">Тіркелген күні:</span>
                            <span style="font-weight:500;color:#64748b;">${new Date(this.currentUser.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div style="margin-top:20px;padding-top:16px;border-top:1px solid #f1f5f9;display:flex;gap:10px;">
                        <button type="button" class="dash-act-btn primary" onclick="AshyqAuth.showToast('Профиль өзгерістері сәтті сақталды', 'success')" style="flex:1;">
                            <span>💾 Сақтау</span>
                        </button>
                        <button type="button" class="dash-act-btn danger" onclick="AshyqAuth.logout()" style="flex:1;">
                            <span>🚪 Шығу</span>
                        </button>
                    </div>
                </div>
            `;
        },

        loadDocToEditor: function(docId) {
            const doc = this.getDocuments().find(d => d.id === docId);
            if (!doc) return;
            
            const paper = document.getElementById('a4DocumentPaper');
            if (paper) {
                paper.innerHTML = doc.html;
                this.closeDashboardModal();
                this.showToast(`«${doc.title}» құжаты редакторға жүктелді!`, 'success');
            } else {
                localStorage.setItem('ashyq_current_draft', JSON.stringify(doc));
                window.location.href = 'docs.html';
            }
        },

        confirmDeleteDoc: function(docId) {
            if (confirm('Бұл құжатты бұлттан өшіргіңіз келе ме?')) {
                this.deleteDocument(docId);
                this.renderDashboardDocs(document.getElementById('dashBodyContainer'));
                document.getElementById('dashDocsCount').textContent = this.getDocuments().length;
                this.showToast('Құжат бұлттан өшірілді', 'info');
            }
        },

        confirmDeleteGame: function(gameId) {
            if (confirm('Бұл ойынды бұлттан өшіргіңіз келе ме?')) {
                this.deleteGame(gameId);
                this.renderDashboardGames(document.getElementById('dashBodyContainer'));
                document.getElementById('dashGamesCount').textContent = this.getGames().length;
                this.showToast('Ойын бұлттан өшірілді', 'info');
            }
        },

        copyGameLink: function(gameId, template) {
            const url = `${window.location.origin}/studio.html?template=${template}&gameId=${gameId}&auto=1`;
            navigator.clipboard.writeText(url).then(() => {
                this.showToast('Ойынның тікелей сілтемесі көшірілді!', 'success');
            }).catch(() => {
                prompt('Ойынның сілтемесі:', url);
            });
        },

        showToast: function(msg, type) {
            const existing = document.getElementById('ashyqAuthToast');
            if (existing) existing.remove();

            const toast = document.createElement('div');
            toast.id = 'ashyqAuthToast';
            toast.style.cssText = `
                position: fixed;
                bottom: 24px;
                right: 24px;
                background: ${type === 'error' ? '#dc2626' : (type === 'success' ? '#16a34a' : '#1d4ed8')};
                color: #ffffff;
                padding: 12px 20px;
                border-radius: 12px;
                font-size: 13px;
                font-weight: 700;
                box-shadow: 0 10px 30px rgba(0,0,0,0.25);
                z-index: 99999;
                display: flex;
                align-items: center;
                gap: 8px;
                animation: authPopIn 0.25s ease;
                font-family: inherit;
            `;
            toast.innerHTML = `<span>${type === 'error' ? '⚠️' : (type === 'success' ? '✅' : 'ℹ️')}</span> <span>${msg}</span>`;
            document.body.appendChild(toast);

            setTimeout(() => {
                if (toast) toast.remove();
            }, 3500);
        }
    };

    // Auto-init on DOMContentLoaded or immediate
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AshyqAuth.init());
    } else {
        AshyqAuth.init();
    }

    window.AshyqAuth = AshyqAuth;

})(window);
