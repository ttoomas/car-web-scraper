import express from 'express';
import path from 'path';
import { startScraping } from './scrapeData.js';



// PAGE SETUP
const app = express();
const PORT = 8090;

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, ('public'))));

app.get('/', (req, res) => {
    res.render('home.ejs');
})

app.post('/auto/data/', async (req, res) => {
    let carData = await startScraping(req.query);

    res.send(carData);
})



app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
})


console.log('restarted');