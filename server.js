const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

// Создаем приложение Express
const app = express();
const port = 3000;

// Используем body-parser для обработки JSON запросов
app.use(bodyParser.json());

// Путь для получения и сохранения данных
app.post('/collect', async (req, res) => {
    const data = req.body; // Получаем данные с фронтенда

    try {
        // Загружаем существующие данные из файла (если они есть)
        const existingData = fs.existsSync('userData.json') ? JSON.parse(fs.readFileSync('userData.json')) : [];

        // Добавляем новые данные в массив
        existingData.push(data);

        // Сохраняем обновленные данные в файл
        fs.writeFileSync('userData.json', JSON.stringify(existingData, null, 2));

        res.status(200).send('Данные успешно получены и сохранены!');
    } catch (err) {
        console.error('Ошибка сохранения данных:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Панель управления для просмотра данных
app.get('/panel', async (req, res) => {
    try {
        // Загружаем данные из файла
        const userData = fs.existsSync('userData.json') ? JSON.parse(fs.readFileSync('userData.json')) : [];

        res.send(`
            <html lang="ru">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Панель Управления</title>
                    <style>
                        body {
                            background-color: black;
                            color: white;
                            font-family: 'Courier New', monospace;
                            text-align: center;
                        }
                        h1 {
                            color: #00ff00;
                            text-shadow: 0px 0px 20px rgba(0, 255, 0, 0.8);
                        }
                        table {
                            width: 80%;
                            margin: 20px auto;
                            border-collapse: collapse;
                        }
                        th, td {
                            padding: 10px;
                            text-align: left;
                            border: 1px solid #00ff00;
                        }
                        th {
                            background-color: #333;
                        }
                        tr:nth-child(even) {
                            background-color: #222;
                        }
                    </style>
                </head>
                <body>
                    <h1>Панель Управления - Сохранённые Данные</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>IP</th>
                                <th>Agent</th>
                                <th>Язык</th>
                                <th>Платформа</th>
                                <th>Экран</th>
                                <th>URL</th>
                                <th>Реферер</th>
                                <th>Время</th>
                                <th>Cookies</th>
                                <th>Статус Онлайн</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userData.map((data) => `
                                <tr>
                                    <td>${data.ip}</td>
                                    <td>${data.userAgent}</td>
                                    <td>${data.language}</td>
                                    <td>${data.platform}</td>
                                    <td>${data.screen}</td>
                                    <td>${data.url}</td>
                                    <td>${data.referrer}</td>
                                    <td>${data.timestamp}</td>
                                    <td>${data.cookiesEnabled ? 'Да' : 'Нет'}</td>
                                    <td>${data.onlineStatus ? 'В сети' : 'Оффлайн'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `);
    } catch (err) {
        console.error('Ошибка получения данных:', err);
        res.status(500).send('Ошибка сервера');
    }
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
