const express = require('express');
const app = express();
const mysql = require('mysql2');
const asyncHandler = require('express-async-handler');
const cors = require('cors');

const port = 4000; 

// Middlewares
app.use(cors());
app.use(express.json());

// إعداد الاتصال بقاعدة البيانات
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // اسم المستخدم الذي أنشأته في MariaDB
    password: '', // كلمة المرور (إذا كانت فارغة)
    database: 'ip_database' // اسم قاعدة البيانات
});

// اختبار الاتصال بقاعدة البيانات
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ', err);
        return;
    }
    console.log('Connected to the database');
});

// واجهة اختبارية
app.get("/", (req, res) => {
    res.send("API is running...");
});

// إضافة بيانات إلى الجداول
['tabqa', 'rqaa', 'kobani'].forEach(table => {
    app.post(`/${table}/add`, asyncHandler(async (req, res) => {
        const { ip, name } = req.body;
        if (!ip || !name) {
            return res.status(400).send("IP and name are required.");
        }

        db.query(`INSERT INTO ${table} (ip, name) VALUES (?, ?)`, [ip, name], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send("Database error");
            } else {
                return res.status(200).send("ok");
            }
        });
    }));
});

// دالة البحث بعدة IPs مع تجاهل الجداول الفارغة
async function searchByIps(ips) {
    const tables = ['tabqa', 'rqaa', 'kobani'];
    const results = [];

    for (const table of tables) {
        const placeholders = ips.map(() => '?').join(', ');
        const query = `SELECT name FROM ${table} WHERE ip IN (${placeholders})`;

        const names = await new Promise((resolve, reject) => {
            db.query(query, ips, (err, rows) => {
                if (err) reject(err);
                else resolve(rows.map(row => row.name));
            });
        });

        if (names.length > 0) {
            results.push({ table, names });
        }
    }

    return results;
}

// نقطة البحث التي تستقبل عدة IPs
app.post('/search', asyncHandler(async (req, res) => {
    const { ips } = req.body;

    if (!Array.isArray(ips) || ips.length === 0) {
        return res.status(400).send("يرجى إرسال IP واحد على الأقل.");
    }

    try {
        const results = await searchByIps(ips);
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).send("خطأ في قاعدة البيانات.");
    }
}));

// بدء السيرفر
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
});
