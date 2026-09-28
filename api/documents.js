// api/documents.js — Vercel Serverless Documents Storage API (ES Module)
import db from './_db.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
        const { action, doc, docId, userId } = body;

        // 1. SAVE DOCUMENT
        if (action === 'save' && userId && doc) {
            const listKey = `user_docs:${userId}`;
            let currentDocs = (await db.get(listKey)) || [];
            if (!Array.isArray(currentDocs)) currentDocs = [];

            const filtered = currentDocs.filter(d => d.id !== doc.id);
            filtered.unshift(doc);
            
            const trimmed = filtered.slice(0, 60);
            await db.set(listKey, trimmed);

            return res.status(200).json({
                status: 'ok',
                message: 'Құжат бұлттық базада сақталды',
                docId: doc.id
            });
        }

        // 2. LIST DOCUMENTS
        if (action === 'list' && userId) {
            const listKey = `user_docs:${userId}`;
            const docs = (await db.get(listKey)) || [];
            return res.status(200).json({
                status: 'ok',
                docs: Array.isArray(docs) ? docs : []
            });
        }

        // 3. DELETE DOCUMENT
        if (action === 'delete' && userId && docId) {
            const listKey = `user_docs:${userId}`;
            let currentDocs = (await db.get(listKey)) || [];
            if (Array.isArray(currentDocs)) {
                const updated = currentDocs.filter(d => d.id !== docId);
                await db.set(listKey, updated);
            }

            return res.status(200).json({
                status: 'ok',
                message: 'Құжат бұлттан өшірілді',
                docId
            });
        }

        return res.status(200).json({
            status: 'ok',
            service: 'AshyqLab Cloud Documents API',
            version: '2.0'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
