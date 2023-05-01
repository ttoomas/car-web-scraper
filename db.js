import mysql from 'mysql';

// DB SETUP
export const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "car-web-scrape"
})