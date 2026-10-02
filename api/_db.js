// api/_db.js — Universal High-Availability Cloud Database Engine for AshyqLab
// Supports: Vercel KV / Upstash Redis, Persistent Cloud Store, and Multi-Tier In-Memory Caching.

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Default Persistent Cloud Store Identifiers (Mirrored across global CDNs)
const CLOUD_STORE_USERS = process.env.ASHYQ_USERS_DB_ID || 'ff808181a09d98f701a0e835f36634d7';
const CLOUD_STORE_DOCS = process.env.ASHYQ_DOCS_DB_ID || 'ff808181a09d98f701a0e836217334d8';
const CLOUD_STORE_GAMES = process.env.ASHYQ_GAMES_DB_ID || 'ff808181a09d98f701a0e836217434d9';

// In-Memory Fast Cache (per serverless lambda lifecycle)
const memCache = {
    users: {},
    docs: {},
    games: {}
};

// ── 1. VERCEL KV / UPSTASH REDIS REST COMMAND EXECUTOR ──
async function execRedis(command, ...args) {
    if (!KV_URL || !KV_TOKEN) return null;
    try {
        const url = KV_URL.endsWith('/') ? KV_URL : KV_URL + '/';
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KV_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([command, ...args]),
            signal: AbortSignal.timeout(6000)
        });
        if (res.ok) {
            const data = await res.json();
            return data.result;
        }
    } catch (e) {
        console.warn('[Vercel KV] Error executing ' + command + ':', e.message);
    }
    return null;
}

// ── 2. PERSISTENT CLOUD REST STORE EXECUTOR (ZERO-CONFIG) ──
async function fetchCloudStore(objectId) {
    try {
        const res = await fetch(`https://api.restful-api.dev/objects/${objectId}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            signal: AbortSignal.timeout(6000)
        });
        if (res.ok) {
            const json = await res.json();
            if (json && typeof json.data === 'object' && json.data !== null) {
                return json.data;
            }
        }
    } catch (e) {
        console.warn('[Cloud Store] Fetch error:', e.message);
    }
    return null;
}

async function updateCloudStore(objectId, name, data) {
    try {
        const res = await fetch(`https://api.restful-api.dev/objects/${objectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, data }),
            signal: AbortSignal.timeout(7000)
        });
        return res.ok;
    } catch (e) {
        console.warn('[Cloud Store] Update error:', e.message);
        return false;
    }
}

// ── 3. HIGH-LEVEL UNIFIED DATABASE INTERFACE ──
const db = {
    // ════════ 1. USERS COLLECTION ════════
    getUserByEmail: async function(email) {
        if (!email) return null;
        const clean = String(email).trim().toLowerCase();

        // Tier 1: Vercel KV / Upstash Redis
        if (KV_URL && KV_TOKEN) {
            const raw = await execRedis('GET', `ashyq:user:${clean}`);
            if (raw) {
                try {
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (parsed && parsed.email) {
                        memCache.users[clean] = parsed;
                        return parsed;
                    }
                } catch (e) {}
            }
        }

        // Tier 2: In-Memory Hot Cache
        if (memCache.users[clean]) {
            return memCache.users[clean];
        }

        // Tier 3: Universal Persistent Cloud Store
        const allUsers = await this.getAllUsers();
        if (allUsers && allUsers[clean]) {
            memCache.users[clean] = allUsers[clean];
            return allUsers[clean];
        }

        return null;
    },

    saveUser: async function(user) {
        if (!user || !user.email) return false;
        const clean = String(user.email).trim().toLowerCase();
        
        // Cache in memory immediately
        memCache.users[clean] = user;

        // Tier 1: Vercel KV / Upstash Redis
        if (KV_URL && KV_TOKEN) {
            await execRedis('SET', `ashyq:user:${clean}`, JSON.stringify(user));
            await execRedis('HSET', 'ashyq:users:all', clean, JSON.stringify(user));
        }

        // Tier 2: Universal Persistent Cloud Store
        try {
            const allUsers = await this.getAllUsers();
            allUsers[clean] = user;
            await updateCloudStore(CLOUD_STORE_USERS, 'ashyq_users', allUsers);
        } catch (e) {
            console.warn('[DB] Cloud Store user update error:', e.message);
        }

        return true;
    },

    getAllUsers: async function() {
        // Tier 1: Vercel KV / Upstash Redis
        if (KV_URL && KV_TOKEN) {
            const allHash = await execRedis('HGETALL', 'ashyq:users:all');
            if (allHash) {
                try {
                    const result = {};
                    if (Array.isArray(allHash)) {
                        for (let i = 0; i < allHash.length; i += 2) {
                            const k = allHash[i];
                            const v = allHash[i + 1];
                            result[k] = typeof v === 'string' ? JSON.parse(v) : v;
                        }
                    } else if (typeof allHash === 'object') {
                        for (const [k, v] of Object.entries(allHash)) {
                            result[k] = typeof v === 'string' ? JSON.parse(v) : v;
                        }
                    }
                    if (Object.keys(result).length > 0) {
                        memCache.users = { ...memCache.users, ...result };
                        return result;
                    }
                } catch (e) {}
            }
        }

        // Tier 2: Persistent Cloud Store
        const cloudData = await fetchCloudStore(CLOUD_STORE_USERS);
        if (cloudData) {
            memCache.users = { ...memCache.users, ...cloudData };
            return cloudData;
        }

        return memCache.users;
    },

    // ════════ 2. DOCUMENTS COLLECTION ════════
    getUserDocs: async function(userId) {
        if (!userId) return [];

        // Tier 1: Vercel KV
        if (KV_URL && KV_TOKEN) {
            const raw = await execRedis('GET', `ashyq:docs:${userId}`);
            if (raw) {
                try {
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (Array.isArray(parsed)) {
                        memCache.docs[userId] = parsed;
                        return parsed;
                    }
                } catch (e) {}
            }
        }

        // Tier 2: Memory Cache
        if (Array.isArray(memCache.docs[userId])) {
            return memCache.docs[userId];
        }

        // Tier 3: Persistent Cloud Store
        const allDocs = await fetchCloudStore(CLOUD_STORE_DOCS) || {};
        const userDocs = allDocs[userId];
        if (Array.isArray(userDocs)) {
            memCache.docs[userId] = userDocs;
            return userDocs;
        }
        return [];
    },

    saveDoc: async function(userId, doc) {
        if (!userId || !doc) return false;
        let docs = await this.getUserDocs(userId);
        docs = docs.filter(d => d.id !== doc.id);
        docs.unshift(doc);
        docs = docs.slice(0, 80);
        memCache.docs[userId] = docs;

        // Tier 1: Vercel KV
        if (KV_URL && KV_TOKEN) {
            await execRedis('SET', `ashyq:docs:${userId}`, JSON.stringify(docs));
        }

        // Tier 2: Persistent Cloud Store
        try {
            const allDocs = await fetchCloudStore(CLOUD_STORE_DOCS) || {};
            allDocs[userId] = docs;
            await updateCloudStore(CLOUD_STORE_DOCS, 'ashyq_docs', allDocs);
        } catch (e) {}

        return true;
    },

    deleteDoc: async function(userId, docId) {
        if (!userId || !docId) return false;
        let docs = await this.getUserDocs(userId);
        docs = docs.filter(d => d.id !== docId);
        memCache.docs[userId] = docs;

        // Tier 1: Vercel KV
        if (KV_URL && KV_TOKEN) {
            await execRedis('SET', `ashyq:docs:${userId}`, JSON.stringify(docs));
        }

        // Tier 2: Persistent Cloud Store
        try {
            const allDocs = await fetchCloudStore(CLOUD_STORE_DOCS) || {};
            allDocs[userId] = docs;
            await updateCloudStore(CLOUD_STORE_DOCS, 'ashyq_docs', allDocs);
        } catch (e) {}

        return true;
    },

    // ════════ 3. GAMES COLLECTION ════════
    getUserGames: async function(userId) {
        if (!userId) return [];

        // Tier 1: Vercel KV
        if (KV_URL && KV_TOKEN) {
            const raw = await execRedis('GET', `ashyq:games:${userId}`);
            if (raw) {
                try {
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (Array.isArray(parsed)) {
                        memCache.games[`user_${userId}`] = parsed;
                        return parsed;
                    }
                } catch (e) {}
            }
        }

        // Tier 2: Memory Cache
        if (Array.isArray(memCache.games[`user_${userId}`])) {
            return memCache.games[`user_${userId}`];
        }

        // Tier 3: Persistent Cloud Store
        const allGames = await fetchCloudStore(CLOUD_STORE_GAMES) || {};
        const userGames = allGames[`user_${userId}`];
        if (Array.isArray(userGames)) {
            memCache.games[`user_${userId}`] = userGames;
            return userGames;
        }
        return [];
    },

    getGameById: async function(gameId) {
        if (!gameId) return null;

        // Tier 1: Vercel KV
        if (KV_URL && KV_TOKEN) {
            const raw = await execRedis('GET', `ashyq:game:${gameId}`);
            if (raw) {
                try {
                    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
                    if (parsed && parsed.title) {
                        memCache.games[`game_${gameId}`] = parsed;
                        return parsed;
                    }
                } catch (e) {}
            }
        }

        // Tier 2: Memory Cache
        if (memCache.games[`game_${gameId}`]) {
            return memCache.games[`game_${gameId}`];
        }

        // Tier 3: Persistent Cloud Store
        const allGames = await fetchCloudStore(CLOUD_STORE_GAMES) || {};
        return allGames[`game_${gameId}`] || null;
    },

    saveGame: async function(userId, game) {
        if (!game) return false;
        const gid = game.id || ('game_' + Date.now());
        game.id = gid;

        memCache.games[`game_${gid}`] = game;

        let userGames = [];
        if (userId) {
            userGames = await this.getUserGames(userId);
            userGames = userGames.filter(g => g.id !== gid);
            userGames.unshift(game);
            userGames = userGames.slice(0, 80);
            memCache.games[`user_${userId}`] = userGames;
        }

        // Tier 1: Vercel KV
        if (KV_URL && KV_TOKEN) {
            await execRedis('SET', `ashyq:game:${gid}`, JSON.stringify(game));
            if (userId) {
                await execRedis('SET', `ashyq:games:${userId}`, JSON.stringify(userGames));
            }
        }

        // Tier 2: Persistent Cloud Store
        try {
            const allGames = await fetchCloudStore(CLOUD_STORE_GAMES) || {};
            allGames[`game_${gid}`] = game;
            if (userId) {
                allGames[`user_${userId}`] = userGames;
            }
            await updateCloudStore(CLOUD_STORE_GAMES, 'ashyq_games', allGames);
        } catch (e) {}

        return true;
    },

    deleteGame: async function(userId, gameId) {
        if (!gameId) return false;
        delete memCache.games[`game_${gameId}`];

        let userGames = [];
        if (userId) {
            userGames = await this.getUserGames(userId);
            userGames = userGames.filter(g => g.id !== gameId);
            memCache.games[`user_${userId}`] = userGames;
        }

        // Tier 1: Vercel KV
        if (KV_URL && KV_TOKEN) {
            await execRedis('DEL', `ashyq:game:${gameId}`);
            if (userId) {
                await execRedis('SET', `ashyq:games:${userId}`, JSON.stringify(userGames));
            }
        }

        // Tier 2: Persistent Cloud Store
        try {
            const allGames = await fetchCloudStore(CLOUD_STORE_GAMES) || {};
            delete allGames[`game_${gameId}`];
            if (userId) {
                allGames[`user_${userId}`] = userGames;
            }
            await updateCloudStore(CLOUD_STORE_GAMES, 'ashyq_games', allGames);
        } catch (e) {}

        return true;
    }
};

export default db;
