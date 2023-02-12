import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send("Hello, World!");
});

app.listen(4000, () => {
    console.log('express-server listening on: 127.0.0.1:4000');
})
