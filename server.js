import axios from 'axios';
import cheerio from 'cheerio';
import mysql from 'mysql';


// TODO - CHECK ALL TITLES -> JAWA PROD_DATE IS NOT WORKING

// DB SETUP
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "car-web-scrape"
})

// SCRAPE CAR URLS
const carBazarUrl = `https://www.sauto.cz`;
const carTypeUrl = `inzerce/osobni/bmw`;
const carPageUrl = `?strana=1`;
const carFullUrl = `${carBazarUrl}/${carTypeUrl}/${carPageUrl}`;

const eachCarUrl = [];
const fullCarInfo = [];

async function scrapeCarUrls(){
    try{

        const res = await axios(carFullUrl);
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

    for (const carUrl of eachCarUrl) {
        index++;
        console.log(index);

        await scrapeCar(carUrl);
    }

    // await scrapeCar('https://www.sauto.cz/osobni/detail/porsche/911/188996724');
    // await scrapeCar('https://www.sauto.cz/osobni/detail/porsche/cayenne/189120921');
    // await scrapeCar('https://www.sauto.cz/motorky/detail/jawa/ostatni/164076649');
    
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

        let carCondition = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(1) > td').text();
        if(carCondition) carDetails.condition = carCondition;

        let carDistanceLabel = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(2) > th').text();
        if(carDistanceLabel === "Najeto:"){
            let carDistance = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(2) > td').text()
            if(carDistance) carDetails.distance = carDistance.split(' km')[0].replace(/[^\x00-\x7F]/g, "");
        }
        else if(carDistanceLabel === "Vyrobeno:"){
            let carProdDate = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(2) > td').text();
            if(carProdDate) carDetails.prodDate = carProdDate;
        }

        let carProdLabel = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(3) > th').text();
        if(carProdLabel === "Vyrobeno:"){
            let carProdDate = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(2) > tbody > tr:nth-child(3) > td').text();
            if(carProdDate) carDetails.prodDate = carProdDate;
        }

        let carBody = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(4) > tbody > tr:nth-child(1) > td').text();
        if(carBody) carDetails.body = carBody;

        let carColor = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(4) > tbody > tr:nth-child(2) > td').text();
        if(carColor) carDetails.color = carColor;

        let carFuel = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(1) > td').text();
        if(carFuel) carDetails.fuel = carFuel;

        let carCapacity = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(2) > td').text();
        if(carCapacity) carDetails.capacity = carCapacity.split(' ccm')[0].replace(/[^\x00-\x7F]/g, "");

        let carPerformance = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(3) > td').text();
        if(carPerformance) carDetails.performance = carPerformance.split(' kW')[0].replace(/[^\x00-\x7F]/g, "");

        if($('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(4) > th').text() === "Převodovka:"){
            let carTransmission = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(4) > td').text();
            if(carTransmission) carDetails.transmission = carTransmission;
        }

        if($('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(5) > th').text() === "Pohon:"){
            let carGear = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(6) > tbody > tr:nth-child(5) > td').text();
            if(carGear) carDetails.gear = carGear;
        }

        for (let i = 0; i < 5; i++) {
            let currentDetail = $(`#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(8) > tbody > tr:nth-child(${i}) > th`).text();

            if(currentDetail == "Země původu:"){
                let carCountryOrigin = $(`#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.sds-surface.sds-surface--05.p-uw-item-detail__info.c-car-details > div > table:nth-child(8) > tbody > tr:nth-child(${i}) > td`).text();
                if(carCountryOrigin) carDetails.countryOrigin = carCountryOrigin;
                
                break;
            }
        }


        let carTel = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div:nth-child(6) > div > div.c-seller-contact-section__responsive > div:nth-child(3) > div > div > div > a').attr('href');
        if(carTel) carDetails.telContact = carTel.replace('tel:+', '');

        let imageUrl = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.c-a-gallery > div > div.ob-c-gallery__content > div > div > div > div.ob-c-carousel__item.ob-c-carousel__item--active > div > img');
        if(imageUrl) carDetails.imageUrl = `https:/${imageUrl.attr('src')}`;

        // Push carDetails object into array
        fullCarInfo.push(carDetails);
    }
    catch(err){
        console.log(err);
    }
}


// Send data to database
async function createTable(){
    let date = new Date().getTime();
    let categorySplited = carTypeUrl.split('/');
    let category = categorySplited[categorySplited.length - 1];
    let tableId = `car_${category}_${date}`;

    // MySQL Create Table
    const createTableQuery = "CREATE TABLE ?? LIKE template";

    try{
        db.query(createTableQuery, tableId);
    }
    catch(err){
        console.log(err);
    }
    finally{
        await pushDataIntoTable(tableId);
    }
}

async function pushDataIntoTable(tableId){
    for (const carInfo of fullCarInfo) {
        const fillTableQuery = "INSERT INTO ??(`name`, `prize`, `condition_car`, `distance`, `prod_date`, `body`, `color`, `fuel`, `capacity`, `performance`, `transmission`, `gear`, `country_origin`, `tel_contact`, `url`, `image_url`) VALUES(?)";

        const values = Object.values(carInfo);

        try{
            db.query(fillTableQuery, [tableId, values]);
        }
        catch(err){
            console.log(err);
        }
    }

    console.log('Completed');
}


await scrapeCarUrls();


console.log('restarted');