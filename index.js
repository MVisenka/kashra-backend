const express = require ('express');
const app = express();

app.get('/', (req, res) => {res.send('Kashra backend running'});

app.listen(PORT, () => console.log('Server running on PORT ${PORT}'));
