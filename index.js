const express = require ('express');
const app = express();

app.get('/', (req, res) => {res.send('Kashra backend running'});

app.liste(3000, () -> console.log('Server running'));
