const express = require('express');
const app = express();
const sqlite = require("sqlite3");
const asyncHandler = require("express-async-handler");

const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

const db = new sqlite.Database('ip.db');
db.run(`CREATE TABLE IF NOT EXISTS tabqa (
        ip INTEGER UNIQUE NOT NULL,
        name TEXT NOT NULL
    )`);
db.run(`CREATE TABLE IF NOT EXISTS rqaa (
    ip INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL
)`);
db.run(`CREATE TABLE IF NOT EXISTS kobani (
    ip INTEGER UNIQUE NOT NULL,
    name TEXT NOT NULL
)`);

app.post('/tabqa/add', asyncHandler(async (req, res) => {
    const ip = req.body.ip;
    const name = req.body.name;

    if (!ip || !name) {
        return res.status(400).send("IP and name are required.");
    }

    db.run(`INSERT INTO tabqa (ip, name) VALUES (?, ?)`, [ip, name], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        } else {
            return res.status(200).send("ok");
        }
    });
}));


app.post('/rqaa/add', asyncHandler(async (req, res) => {
    const ip = req.body.ip;
    const name = req.body.name;

    if (!ip || !name) {
        return res.status(400).send("IP and name are required.");
    }

    db.run(`INSERT INTO rqaa (ip, name) VALUES (?, ?)`, [ip, name], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        } else {
            return res.status(200).send("ok");
        }
    });
}));

app.post('/kobani/add', asyncHandler(async (req, res) => {
    const ip = req.body.ip;
    const name = req.body.name;

    if (!ip || !name) {
        return res.status(400).send("IP and name are required.");
    }

    db.run(`INSERT INTO kobani (ip, name) VALUES (?, ?)`, [ip, name], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send("Database error");
        } else {
            return res.status(200).send("ok");
        }
    });
}));

async function searchByIp(ip) {
    return new Promise((resolve, reject) => {
        const tables = ['tabqa', 'rqaa', 'kobani'];
        const results = [];

        tables.forEach(table => {
            const query = `SELECT name FROM ${table} WHERE ip = ?`;
            db.all(query, [ip], (err, rows) => {
                if (err) {
                    reject(err);
                } else if (rows.length > 0) {
                    // إذا كان هناك نتائج، نضيف اسم الجدول مع الأسماء
                    results.push({ table, names: rows.map(row => row.name) });
                }

                // إذا تم البحث في جميع الجداول، نقوم بإرجاع النتيجة
                if (results.length === tables.length) {
                    resolve(results);
                }
            });
        });
    });
}

app.post('/search', asyncHandler(async (req, res) => {
    const ip = req.body.ip;

    if (!ip) {
        return res.status(400).send("الـ IP مفقود.");
    }

    try {
        const results = await searchByIp(ip);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ في قاعدة البيانات.");
    }
}));




app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
