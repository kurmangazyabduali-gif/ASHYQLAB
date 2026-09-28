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
            await db.saveDoc(userId, doc);
            return res.status(200).json({
                status: 'ok',
                message: 'Құжат бұлттық базада сақталды',
                docId: doc.id
            });
        }

        // 2. LIST USER DOCUMENTS
        if (action === 'list' && userId) {
            const docs = await db.getUserDocs(userId);
            return res.status(200).json({
                status: 'ok',
                docs: docs
            });
        }

        // 3. DELETE DOCUMENT
        if (action === 'delete' && userId && docId) {
            await db.deleteDoc(userId, docId);
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
