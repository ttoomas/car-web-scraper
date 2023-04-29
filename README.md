# Car Web Scraper

## Small project about scraping data about cars from car bazar and store it to the database

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

## Customization
### Database
- Open `server.js`
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

### Finding Car
- Find `Scrape Car Url (comment)`;
```
const carBazarUrl = `https://www.sauto.cz`;
const carTypeUrl = `inzerce/ctyrkolky`;
const carPageUrl = `?strana=2`;
```
- carBazarUrl: Your car bazar url
- carTypeUrl: Type of car you want to search
- carPageUrl: Page you want to scrape, if you want to scrape first page, leave it empty