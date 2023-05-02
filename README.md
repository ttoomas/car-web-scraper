# Car Web Scraper

## Small project about scraping car data from car bazar and store it to the database

---

## Instalation
- Clone repository
```
git clone https://github.com/ttoomas/car-web-scraper.git
cd car-web-scraper
```
- Open terminal
```
npm i
npm start
```

## Database
- Create database with name `car-web-scraper`
- Inside this db, import `car-web-scape.sql`
- In file `home.ejs`, find this code (somewhere around line 60):
```
<div class="util__bx">
<div class="util__db disabled">
<input type="checkbox" name="utilDb" id="utilDb" class="util__dbInput">
```
- Here, you want to delete `disabled` class from `util__db` element, so you can save data to database

## Customization
### Database
- Open `index.js`
- Find `DB Setup`
- Customizate your db
```
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "car-web-scrape"
})
```
- password: Your local db password
- database: Database name

### Finding Car without website
- Open `scrapeData.js`
- Find comment `Scrape Car Variables`;
```
let carTypeUrl = `inzerce/osobni/bmw`;
let currPage = 1;
let carsNumber = 4;
let saveToDb = false;
```
- carTypeUrl: Type of car you want to search
- currPage: Page you want to start scraping
- carsNumber: Number of cars you want to scrape
- saveToDb: true/false if you want to save this to database