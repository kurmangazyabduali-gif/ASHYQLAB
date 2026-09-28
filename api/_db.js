// api/_db.js — Universal High-Availability Cloud Database Engine for AshyqLab
import https from 'node:https';
import http from 'node:http';

const USERS_ID = process.env.ASHYQ_USERS_DB_ID || 'ff808181a09d98f701a0e835f36634d7';
const DOCS_ID = process.env.ASHYQ_DOCS_DB_ID || 'ff808181a09d98f701a0e836217334d8';
const GAMES_ID = process.env.ASHYQ_GAMES_DB_ID || 'ff808181a09d98f701a0e836217434d9';

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// Local memory cache
const memoryStore = {
    users: {},
    docs: {},
    games: {}
};

function request(urlStr, options = {}, bodyData = null) {
    return new Promise((resolve, reject) => {
        try {
            const parsed = new URL(urlStr);
            const protocol = parsed.protocol === 'https:' ? https : http;
            
            const reqOptions = {
                hostname: parsed.hostname,
                port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
                path: parsed.pathname + (parsed.search || ''),
                method: options.method || 'GET',
                headers: {
                    'Accept': 'application/json',
                    ...(bodyData ? { 'Content-Type': 'application/json' } : {}),
                    ...(options.headers || {})
                }
            };

            const req = protocol.request(reqOptions, (res) => {
                let chunks = '';
                res.on('data', chunk => { chunks += chunk; });
                res.on('end', () => {
                    resolve({ status: res.statusCode, body: chunks });
                });
            });

            req.on('error', err => reject(err));
            req.setTimeout(6000, () => {
                req.destroy(new Error('Cloud DB Timeout'));
            });

            if (bodyData) {
                req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
            }
            req.end();
        } catch (e) {
            reject(e);
        }
    });
}

// ── Low-level Cloud Object Store ──
async function fetchCloudStore(objectId, fallbackName) {
    try {
        const res = await request(`https://api.restful-api.dev/objects/${objectId}`);
        if (res.status === 200 && res.body) {
            const parsed = JSON.parse(res.body);
            if (parsed && typeof parsed.data === 'object' && parsed.data !== null) {
                return parsed.data;
            }
        }
    } catch (e) {
        console.warn('fetchCloudStore error:', e.message);
    }
    return null;
}

async function updateCloudStore(objectId, name, data) {
    try {
        await request(`https://api.restful-api.dev/objects/${objectId}`, {
            method: 'PUT'
        }, { name, data });
        return true;
    } catch (e) {
        console.warn('updateCloudStore error:', e.message);
        return false;
    }
}

const db = {
    // ════ 1. USERS ════
    getAllUsers: async function() {
        const cloudData = await fetchCloudStore(USERS_ID, 'ashyq_users');
        if (cloudData) {
            memoryStore.users = { ...memoryStore.users, ...cloudData };
            return cloudData;
        }
        return memoryStore.users;
    },

    getUserByEmail: async function(email) {
        const clean = String(email || '').trim().toLowerCase();
        const users = await this.getAllUsers();
        return users[clean] || null;
    },

    saveUser: async function(user) {
        if (!user || !user.email) return false;
        const clean = String(user.email).trim().toLowerCase();
        const users = await this.getAllUsers();
        users[clean] = user;
        memoryStore.users[clean] = user;
        await updateCloudStore(USERS_ID, 'ashyq_users', users);
        return true;
    },

    // ════ 2. DOCUMENTS ════
    getAllDocs: async function() {
        const cloudData = await fetchCloudStore(DOCS_ID, 'ashyq_docs');
        if (cloudData) {
            memoryStore.docs = { ...memoryStore.docs, ...cloudData };
            return cloudData;
        }
        return memoryStore.docs;
    },

    getUserDocs: async function(userId) {
        if (!userId) return [];
        const allDocs = await this.getAllDocs();
        const userDocs = allDocs[userId];
        return Array.isArray(userDocs) ? userDocs : [];
    },

    saveDoc: async function(userId, doc) {
        if (!userId || !doc) return false;
        const allDocs = await this.getAllDocs();
        let list = Array.isArray(allDocs[userId]) ? allDocs[userId] : [];
        list = list.filter(d => d.id !== doc.id);
        list.unshift(doc);
        allDocs[userId] = list.slice(0, 60); // Store up to 60 docs per user
        memoryStore.docs[userId] = allDocs[userId];
        await updateCloudStore(DOCS_ID, 'ashyq_docs', allDocs);
        return true;
    },

    deleteDoc: async function(userId, docId) {
        if (!userId || !docId) return false;
        const allDocs = await this.getAllDocs();
        if (Array.isArray(allDocs[userId])) {
            allDocs[userId] = allDocs[userId].filter(d => d.id !== docId);
            memoryStore.docs[userId] = allDocs[userId];
            await updateCloudStore(DOCS_ID, 'ashyq_docs', allDocs);
        }
        return true;
    },

    // ════ 3. GAMES ════
    getAllGames: async function() {
        const cloudData = await fetchCloudStore(GAMES_ID, 'ashyq_games');
        if (cloudData) {
            memoryStore.games = { ...memoryStore.games, ...cloudData };
            return cloudData;
        }
        return memoryStore.games;
    },

    getUserGames: async function(userId) {
        if (!userId) return [];
        const allGames = await this.getAllGames();
        const userGames = allGames[`user_${userId}`];
        return Array.isArray(userGames) ? userGames : [];
    },

    getGameById: async function(gameId) {
        if (!gameId) return null;
        const allGames = await this.getAllGames();
        return allGames[`game_${gameId}`] || null;
    },

    saveGame: async function(userId, game) {
        if (!game) return false;
        const gid = game.id || ('game_' + Date.now());
        const allGames = await this.getAllGames();
        
        // Save standalone game lookup for link sharing
        allGames[`game_${gid}`] = game;

        // Save in user's games list
        if (userId) {
            let list = Array.isArray(allGames[`user_${userId}`]) ? allGames[`user_${userId}`] : [];
            list = list.filter(g => g.id !== gid);
            list.unshift(game);
            allGames[`user_${userId}`] = list.slice(0, 60);
            memoryStore.games[`user_${userId}`] = allGames[`user_${userId}`];
        }

        memoryStore.games[`game_${gid}`] = game;
        await updateCloudStore(GAMES_ID, 'ashyq_games', allGames);
        return true;
    },

    deleteGame: async function(userId, gameId) {
        if (!gameId) return false;
        const allGames = await this.getAllGames();
        delete allGames[`game_${gameId}`];

        if (userId && Array.isArray(allGames[`user_${userId}`])) {
            allGames[`user_${userId}`] = allGames[`user_${userId}`].filter(g => g.id !== gameId);
            memoryStore.games[`user_${userId}`] = allGames[`user_${userId}`];
        }

        await updateCloudStore(GAMES_ID, 'ashyq_games', allGames);
        return true;
    }
};

export default db;
