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
            game.id = gid;
            await db.saveGame(userId, game);

            return res.status(200).json({
                status: 'ok',
                message: 'Ойын бұлттық базада сақталды',
                gameId: gid
            });
        }

        // 2. GET SINGLE GAME (FOR SHARED DIRECT LINKS)
        if (action === 'get' && gameId) {
            const foundGame = await db.getGameById(gameId);
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
            const games = await db.getUserGames(userId);
            return res.status(200).json({
                status: 'ok',
                games: games
            });
        }

        // 4. DELETE GAME
        if (action === 'delete' && gameId) {
            await db.deleteGame(userId, gameId);
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
