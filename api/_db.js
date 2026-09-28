// api/_db.js — Universal Cloud Database Driver for AshyqLab
// Supports: Upstash Redis, Vercel KV, KVdb.io Cloud Bucket, and fallback store.

const https = require('https');
const http = require('http');

const BUCKET_ID = process.env.ASHYQ_DB_BUCKET || 'ashyqlab_cloud_v1';
const KV_REST_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_REST_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

// In-memory fallback
const memoryCache = new Map();

function httpRequest(urlStr, options = {}, postData = null) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(urlStr);
        const protocol = parsed.protocol === 'https:' ? https : http;
        
        const reqOptions = {
            hostname: parsed.hostname,
            port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
            path: parsed.pathname + (parsed.search || ''),
            method: options.method || 'GET',
            headers: options.headers || {}
        };

        const req = protocol.request(reqOptions, (res) => {
            let data = '';
            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                resolve({ statusCode: res.statusCode, body: data });
            });
        });

        req.on('error', (e) => reject(e));
        req.setTimeout(5000, () => {
            req.destroy(new Error('DB Timeout'));
        });

        if (postData) {
            req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
        }
        req.end();
    });
}

const db = {
    // 1. GET key
    get: async function(key) {
        // Priority 1: Upstash / Vercel KV
        if (KV_REST_URL && KV_REST_TOKEN) {
            try {
                const res = await httpRequest(`${KV_REST_URL}/get/${encodeURIComponent(key)}`, {
                    headers: { 'Authorization': `Bearer ${KV_REST_TOKEN}` }
                });
                if (res.statusCode === 200) {
                    const parsed = JSON.parse(res.body);
                    if (parsed.result !== null && parsed.result !== undefined) {
                        try { return JSON.parse(parsed.result); } catch(e) { return parsed.result; }
                    }
                    return null;
                }
            } catch (e) {
                console.warn('KV GET error:', e.message);
            }
        }

        // Priority 2: KVdb.io cloud bucket
        try {
            const cleanKey = encodeURIComponent(key.replace(/[^a-zA-Z0-9_\-\.:]/g, '_'));
            const res = await httpRequest(`https://kvdb.io/${BUCKET_ID}/${cleanKey}`);
            if (res.statusCode === 200 && res.body) {
                try {
                    return JSON.parse(res.body);
                } catch(e) {
                    return res.body;
                }
            }
        } catch (e) {
            console.warn('Cloud KVdb GET error:', e.message);
        }

        // Priority 3: Memory fallback
        return memoryCache.get(key) || null;
    },

    // 2. SET key
    set: async function(key, value) {
        const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
        memoryCache.set(key, value);

        // Priority 1: Upstash / Vercel KV
        if (KV_REST_URL && KV_REST_TOKEN) {
            try {
                await httpRequest(`${KV_REST_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(stringVal)}`, {
                    headers: { 'Authorization': `Bearer ${KV_REST_TOKEN}` }
                });
                return true;
            } catch (e) {
                console.warn('KV SET error:', e.message);
            }
        }

        // Priority 2: KVdb.io cloud bucket
        try {
            const cleanKey = encodeURIComponent(key.replace(/[^a-zA-Z0-9_\-\.:]/g, '_'));
            await httpRequest(`https://kvdb.io/${BUCKET_ID}/${cleanKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            }, stringVal);
            return true;
        } catch (e) {
            console.warn('Cloud KVdb SET error:', e.message);
        }

        return true;
    },

    // 3. DELETE key
    del: async function(key) {
        memoryCache.delete(key);

        if (KV_REST_URL && KV_REST_TOKEN) {
            try {
                await httpRequest(`${KV_REST_URL}/del/${encodeURIComponent(key)}`, {
                    headers: { 'Authorization': `Bearer ${KV_REST_TOKEN}` }
                });
                return true;
            } catch (e) {}
        }

        try {
            const cleanKey = encodeURIComponent(key.replace(/[^a-zA-Z0-9_\-\.:]/g, '_'));
            await httpRequest(`https://kvdb.io/${BUCKET_ID}/${cleanKey}`, {
                method: 'DELETE'
            });
            return true;
        } catch (e) {}

        return true;
    }
};

module.exports = db;
