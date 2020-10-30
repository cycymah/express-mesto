const express = require('express');
const app = express();
const PORT = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, './public')));

// app.get("/", (req, res) => {
//   res.send("Все работает");
// });

app.listen(PORT, _ => console.log(`Слушаем порт ${PORT}`));
