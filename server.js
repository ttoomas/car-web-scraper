import axios from 'axios';
import cheerio from 'cheerio';


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

    for (const carUrl of eachCarUrl) {
        index++;
        // if(index !== 17) continue;
        console.log(index);

        await scrapeCar(carUrl);

    }

    await sendDataToDb();

    await scrapeCar('https://www.sauto.cz/osobni/detail/porsche/911/188996724');
    // await scrapeCar('https://www.sauto.cz/osobni/detail/porsche/cayenne/189120921');
}


async function scrapeCar(carUrl){
    if(!carUrl.includes(carBazarUrl)) return;

    try{
        const res = await axios(carUrl);
        const $ = cheerio.load(res.data);
        
        let carDetails = {
            name: undefined,
            prize: undefined,
            condition: undefined,
            distance: undefined,
            prodDate: undefined, 
            body: undefined,
            color: undefined,
            fuel: undefined,
            capacity: undefined,
            performance: undefined,
            transmission: undefined,
            gear: undefined,
            countryOrigin: undefined,
            telContact: undefined,
            url: carUrl,
            imageUrl: undefined
        }


        // GET CAR DETAILS
        let carNameLong = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.p-uw-item-detail__wrap > div.sds-surface.sds-surface--05.p-uw-item-detail__info > div.c-a-basic-info > h1').text();
        if(carNameLong) carDetails.name = carNameLong.split(',')[0];

        let carPrize = $('#page > div.c-layout__wrapper > div.p-uw-item-detail.c-layout > div.c-layout__content > div > div.p-uw-item-detail__car-column > div.p-uw-item-detail__wrap > div.sds-surface.sds-surface--05.p-uw-item-detail__info > div.c-a-basic-info > div.c-a-basic-info__price-wrapper > div:nth-child(1) > div').text();
        if(carPrize) carDetails.prize = carPrize.split(' Kč')[0];

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
    }
    catch(err){
        console.log(err);
    }
}


// Send data to database
async function sendDataToDb(){
    console.log(fullCarInfo);
}


await scrapeCarUrls();


console.log('restarted');