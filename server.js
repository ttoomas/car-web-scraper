import axios from 'axios';
import cheerio from 'cheerio';
import mysql from 'mysql';


// DB SETUP
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "car-web-scrape"
})

// SCRAPE CAR URLS
const carBazarUrl = `https://www.sauto.cz/`;
const url = `${carBazarUrl}inzerce/osobni/porsche`;
const eachCarUrl = [];
const fullCarInfo = [];

async function scrapeCarUrls(){
    try{

        const res = await axios(url);
        const $ = cheerio.load(res.data);

        let linkBxs = $('.sds-surface.sds-surface--clickable.sds-surface--00.c-item__link');

        linkBxs.each((index, bx) => {
            let currentUrl = $(bx).attr('href');

            eachCarUrl.push(currentUrl);
        })

        await scrapeEachCar();
    }
    catch(err){
        console.log(err);
    }
}



async function scrapeEachCar(){
    let index = 0;

    // for (const carUrl of eachCarUrl) {
    //     index++;
    //     console.log(index);

    //     await scrapeCar(carUrl);

    // }

    await scrapeCar('https://www.sauto.cz/osobni/detail/porsche/911/188996724');
    // await scrapeCar('https://www.sauto.cz/osobni/detail/porsche/cayenne/189120921');
    
    await createTable();
}


async function scrapeCar(carUrl){
    if(!carUrl.includes(carBazarUrl)) return;

    try{
        const res = await axios(carUrl);
        const $ = cheerio.load(res.data);
        
        let carDetails = {
            name: null,
            prize: null,
            condition: null,
            distance: null,
            prodDate: null, 
            body: null,
            color: null,
            fuel: null,
            capacity: null,
            performance: null,
            transmission: null,
            gear: null,
            countryOrigin: null,
            telContact: null,
            url: carUrl,
            imageUrl: null
        }


        // GET CAR DETAILS
        let carNameLong = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.p-uw-item-detail__wrap > div.sds-surface.sds-surface--05.p-uw-item-detail__info > div.c-a-basic-info > h1').text();
        if(carNameLong) carDetails.name = carNameLong.split(',')[0];

        let carPrize = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.p-uw-item-detail__wrap > div.sds-surface.sds-surface--05.p-uw-item-detail__info > div.c-a-basic-info > div.c-a-basic-info__price-wrapper > div:nth-child(1) > div').text();
        if(carPrize) carDetails.prize = carPrize.split(' Kč')[0].replace(/[^\x00-\x7F]/g, "");

        carDetails.condition = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(1) > td').text();

        let carDistance = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(2) > td').text()
        if(carDistance) carDetails.distance = carDistance.split(' km')[0];

        carDetails.prodDate = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(3) > td').text();

        carDetails.body = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(4) > tbody > tr:nth-child(1) > td').text();

        carDetails.color = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(4) > tbody > tr:nth-child(2) > td').text();

        carDetails.fuel = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(1) > td').text();

        let carCapacity = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(2) > td').text();
        if(carCapacity) carDetails.capacity = carCapacity.split(' ccm')[0];

        let carPerformance = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(3) > td').text();
        if(carPerformance) carDetails.performance = carPerformance.split(' kW')[0];

        if($('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(4) > th').text() === "Převodovka:"){
            carDetails.transmission = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(4) > td').text();
        }

        if($('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(5) > th').text() === "Pohon:"){
            carDetails.gear = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(5) > td').text();
        }

        for (let i = 0; i < 5; i++) {
            let currentDetail = $(`#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(8) > tbody > tr:nth-child(${i}) > th`).text();

            if(currentDetail == "Země původu:"){
                carDetails.countryOrigin = $(`#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(8) > tbody > tr:nth-child(${i}) > td`).text();
                
                break;
            }
        }


        let carTel = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div:nth-child(6) > div > div.c-seller-contact-section__responsive > div:nth-child(3) > div > div > div > a').attr('href');
        if(carTel) carDetails.telContact = carTel.replace('tel:+', '');

        let imageUrl = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.c-a-gallery > div > div.ob-c-gallery__content > div > div > div > div.ob-c-carousel__item.ob-c-carousel__item--active > div > img');
        if(imageUrl) carDetails.imageUrl = `https:/${imageUrl.attr('src')}`;

        // Push carDetails object into array
        fullCarInfo.push(carDetails);

        console.log(carDetails);
    }
    catch(err){
        console.log(err);
    }
}


// Send data to database
async function createTable(){
    let date = new Date().getTime();

    // MySQL Create Table
    const createTableQuery = `CREATE TABLE car_? LIKE template`;

    try{
        db.query(createTableQuery, date);
    }
    catch(err){
        console.log(err);
    }
    finally{
        await pushDataIntoTable(date);
    }
}

async function pushDataIntoTable(date){
    let index = 0;

    for (const carInfo of fullCarInfo) {
        index++;

        const fillTableQuery = "INSERT INTO car_?(`name`, `prize`, `condition_car`, `distance`, `prod_date`, `body`, `color`, `fuel`, `capacity`, `performance`, `transmission`, `gear`, `country_origin`, `tel_contact`, `url`, `image_url`) VALUES(?)";

        const values = Object.values(carInfo);

        try{
            db.query(fillTableQuery, [date, values]);
        }
        catch(err){
            console.log(err);
        }
    }

    console.log('Completed');
}


await scrapeCarUrls();


console.log('restarted');