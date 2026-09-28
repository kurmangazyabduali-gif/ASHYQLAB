// api/games.js — Vercel Serverless Interactive Games Storage API (ES Module)
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
        const { action, game, gameId, userId } = body;

        // 1. SAVE GAME
        if (action === 'save' && game) {
            const gid = game.id || ('game_' + Date.now());
            await db.set(`game:${gid}`, game);

            if (userId) {
                const listKey = `user_games:${userId}`;
                let userGames = (await db.get(listKey)) || [];
                if (!Array.isArray(userGames)) userGames = [];

                const filtered = userGames.filter(g => g.id !== gid);
                filtered.unshift(game);
                await db.set(listKey, filtered.slice(0, 60));
            }

            return res.status(200).json({
                status: 'ok',
                message: 'Ойын бұлттық базада сақталды',
                gameId: gid
            });
        }

        // 2. GET SINGLE GAME (FOR SHARED DIRECT LINKS)
        if (action === 'get' && gameId) {
            const foundGame = await db.get(`game:${gameId}`);
            if (!foundGame) {
                return res.status(404).json({ error: 'Ойын табылмады' });
            }
            return res.status(200).json({
                status: 'ok',
                game: foundGame
            });
        }

        // 3. LIST USER GAMES
        if (action === 'list' && userId) {
            const listKey = `user_games:${userId}`;
            const games = (await db.get(listKey)) || [];
            return res.status(200).json({
                status: 'ok',
                games: Array.isArray(games) ? games : []
            });
        }

        // 4. DELETE GAME
        if (action === 'delete' && gameId) {
            await db.del(`game:${gameId}`);

            if (userId) {
                const listKey = `user_games:${userId}`;
                let userGames = (await db.get(listKey)) || [];
                if (Array.isArray(userGames)) {
                    const filtered = userGames.filter(g => g.id !== gameId);
                    await db.set(listKey, filtered);
                }
            }

            return res.status(200).json({
                status: 'ok',
                message: 'Ойын бұлттан өшірілді',
                gameId
            });
        }

        return res.status(200).json({
            status: 'ok',
            service: 'AshyqLab Cloud Games API',
            version: '2.0'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
