// Fill the types and brands
const mainTypeContainer = document.querySelector('.main__container.mainType');
const mainBrandContainer = document.querySelector('.main__bxContainer');

let activeBxs = [{name: null, index: 0}, {name: null, index: 0}];

// Fetch data and insert it to the page
window.addEventListener('load', async () => {
    try{
        const file = await fetch('/res/data/filter.json');
        const datas = await file.json();

        activeBxs[0].name = datas[0].name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        activeBxs[1].name = datas[0].brands[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        datas.forEach((data, index) => {
            // Types
            let isSelected = "",
                isActive = "";
            if(index === 0){
                isSelected = " selected";
                isActive = " active"
            }

            const typeHtml = `
                <div class="main__bx${isSelected}">
                    <h3 class="main__name">${data.name}</h3>
                    <img src="/res/img/${data.icon}.png" alt="Icon of personal car" class="main__img">
                </div>
            `;

            mainTypeContainer.insertAdjacentHTML('beforeend', typeHtml);

            // Brand Containers
            const brandHtml = `
                <div class="main__container mainChoose mainBrand${isActive}">
                    
                </div>
            `;

            mainBrandContainer.insertAdjacentHTML('beforeend', brandHtml);

            // Brand Bxs
            const currentBrand = mainBrandContainer.querySelectorAll('.main__container')[index];

            data.brands.forEach((brand, index) => {
                let isBrandSelected = "";
                if(index === 0) isBrandSelected = " selected";

                const brandBxHtml = `
                    <div class="main__bx${isBrandSelected}">
                        <h3 class="main__name">${brand}</h3>
                        <img src="https://www.sauto.cz/static/img/logos/${data.icon}/${brand.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(' ', '-')}.png" alt="Icon of Audi Company" class="main__img">
                    </div>
                `;

                currentBrand.insertAdjacentHTML('beforeend', brandBxHtml);
            })
        })

        selectOnClick();
    }
    catch(err){
        console.log(err);
    }
})

// Util range
const utilRange = document.querySelector('.util__range');
const utilCount = document.querySelector('.util__count');

utilRange.addEventListener('input', () => {
    utilCount.innerText = utilRange.value;
})


// Active bxs
function selectOnClick(){
    const mainTypeBxs = document.querySelectorAll('.main__container.mainType .main__bx');
    const mainBrandContainers = document.querySelectorAll('.main__container.mainBrand');

    // Types
    mainTypeBxs.forEach((bx, typeIndex) => {
        bx.addEventListener('click', () => {
            mainTypeBxs[activeBxs[0].index].classList.remove('selected');
            mainBrandContainers[activeBxs[0].index].classList.remove('active');

            allBrandBxs[activeBxs[0].index][activeBxs[1].index].classList.remove('selected');

            activeBxs[0].index = typeIndex;
            activeBxs[0].name = bx.querySelector('.main__name').innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            activeBxs[1].index = 0;
            activeBxs[1].name = allBrandBxs[activeBxs[0].index][0].querySelector('.main__name').innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            allBrandBxs[activeBxs[0].index][0].classList.add('selected');

            bx.classList.add('selected'); 
            mainBrandContainers[activeBxs[0].index].classList.add('active');
        })
    })

    // Brands
    const allBrandBxs = [];

    mainBrandContainers.forEach(container => {
        const mainBrandBxs = container.querySelectorAll('.main__bx');
        allBrandBxs.push(mainBrandBxs);

        mainBrandBxs.forEach((brandBx, bxIndex) => {
            brandBx.addEventListener('click', () => {
                allBrandBxs[activeBxs[0].index][activeBxs[1].index].classList.remove('selected');
                
                activeBxs[1].index = bxIndex;
                activeBxs[1].name = brandBx.querySelector('.main__name').innerText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                brandBx.classList.add('selected');
            })
        })
    })
}


// View Button
const mainViewBtn = document.querySelector('.main__submit');
const utilNumberInput = document.querySelector('.util__number');
const utilDbBx = document.querySelector('.util__db');
const utilDbInput = document.querySelector('.util__dbInput');

mainViewBtn.addEventListener('click', (e) => {
    document.body.classList.remove('bodyChoose');
    document.body.classList.add('bodyPreloader');

    e.preventDefault();

    let saveDb = !utilDbBx.classList.contains('disabled') && utilDbInput.checked ? true : false;

    const carUrlInfo = {
        type: activeBxs[0].name,
        brand: activeBxs[1].name,
        page: utilNumberInput.value ? parseInt(utilNumberInput.value) : 1,
        count: parseInt(utilRange.value),
        db: saveDb
    }

    const finalUrl = `/auto/data/?type=${carUrlInfo.type}&brand=${carUrlInfo.brand}&page=${carUrlInfo.page}&count=${carUrlInfo.count}&db=${saveDb}`;

    $.ajax({
        url: finalUrl,
        processData: false,
        contentType: false,
        type: 'POST',
        success: (carData) => {
            insertDataToPage(carData);
        },
        error: () => {
            console.error('Backend error :)');

            document.body.className = "";
            document.body.insertAdjacentHTML('afterbegin', '<h1 style="text-align: center; color: red;">There is some error, please try it later</h1>');
        }
    })
})



// Insert final data to the page
const mainTable = document.querySelector('.main__table tbody');

function insertDataToPage(data){
    data.forEach(car => {
        const tableHtml = `
            <tr>
                <td>${car.name}</td>
                <td>${car.prize}</td>
                <td>${car.condition}</td>
                <td>${car.distance}</td>
                <td>${car.prodDate}</td>
                <td>${car.body}</td>
                <td>${car.color}</td>
                <td>${car.fuel}</td>
                <td>${car.capacity}</td>
                <td>${car.performance}</td>
                <td>${car.transmission}</td>
                <td>${car.gear}</td>
                <td>${car.countryOrigin}</td>
                <td>
                    <a href="tel:+${car.telContact}">+${car.telContact}</a>
                </td>
                <td>
                    <a target="_blank" href="${car.url}">${car.url}</a>
                </td>
                <td>
                    <a target="_blank" href="${car.imageUrl}">${car.imageUrl}</a>
                </td>
            </tr>
        `;

        mainTable.insertAdjacentHTML('beforeend', tableHtml);
    })

    console.log('now done :)');

    document.body.classList.remove('bodyPreloader');
    document.body.classList.add('bodyTable');
}