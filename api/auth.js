// api/auth.js — Vercel Serverless Cloud Authentication API (ES Module)
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
        const { action, user, email, passwordHash } = body;

        // 1. REGISTER
        if (action === 'register') {
            if (!user || !user.email) {
                return res.status(400).json({ error: 'Пайдаланушы мәліметтері толық емес' });
            }

            const cleanEmail = String(user.email).trim().toLowerCase();
            const existingUser = await db.get(`users:${cleanEmail}`);

            if (existingUser) {
                return res.status(409).json({ error: 'Бұл электрондық пошта бұлттық базада бар' });
            }

            const userRecord = {
                id: user.id || ('usr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)),
                name: String(user.name || '').trim(),
                email: cleanEmail,
                passwordHash: user.passwordHash,
                school: String(user.school || '№ 1 мектеп-лицей').trim(),
                subject: String(user.subject || 'Физика').trim(),
                role: String(user.role || 'Мұғалім').trim(),
                createdAt: user.createdAt || new Date().toISOString()
            };

            await db.set(`users:${cleanEmail}`, userRecord);
            await db.set(`users_by_id:${userRecord.id}`, userRecord);

            return res.status(200).json({
                status: 'ok',
                message: 'Пайдаланушы бұлттық базаға сәтті тіркелді',
                user: {
                    id: userRecord.id,
                    name: userRecord.name,
                    email: userRecord.email,
                    school: userRecord.school,
                    subject: userRecord.subject,
                    role: userRecord.role,
                    createdAt: userRecord.createdAt
                }
            });
        }

        // 2. LOGIN
        if (action === 'login') {
            const cleanEmail = String(email || '').trim().toLowerCase();
            if (!cleanEmail) {
                return res.status(400).json({ error: 'Электрондық поштаны енгізіңіз' });
            }

            const existingUser = await db.get(`users:${cleanEmail}`);
            if (!existingUser) {
                return res.status(404).json({ error: 'Бұл электрондық поштамен пайдаланушы табылмады' });
            }

            if (passwordHash && existingUser.passwordHash && existingUser.passwordHash !== passwordHash) {
                return res.status(401).json({ error: 'Құпиясөз қате енгізілді' });
            }

            // Load user's cloud docs and games
            const userDocs = (await db.get(`user_docs:${existingUser.id}`)) || [];
            const userGames = (await db.get(`user_games:${existingUser.id}`)) || [];

            return res.status(200).json({
                status: 'ok',
                message: 'Авторизация сәтті өтті',
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    school: existingUser.school,
                    subject: existingUser.subject,
                    role: existingUser.role,
                    createdAt: existingUser.createdAt
                },
                docs: userDocs,
                games: userGames
            });
        }

        // 3. GET USER PROFILE
        if (action === 'get_user') {
            const cleanEmail = String(email || '').trim().toLowerCase();
            const existingUser = await db.get(`users:${cleanEmail}`);
            if (!existingUser) return res.status(404).json({ error: 'Табылмады' });

            return res.status(200).json({
                status: 'ok',
                user: {
                    id: existingUser.id,
                    name: existingUser.name,
                    email: existingUser.email,
                    school: existingUser.school,
                    subject: existingUser.subject,
                    role: existingUser.role
                }
            });
        }

        return res.status(200).json({
            status: 'ok',
            service: 'AshyqLab Cloud Auth API',
            version: '2.0 PRO'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
