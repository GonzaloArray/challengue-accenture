let cadenaParametrosUrl = location.search;
let parametros = new URLSearchParams(cadenaParametrosUrl)
let id = parametros.get('id');
const containerDiv = document.querySelector('.container-card');
const containerTitle = document.querySelector('.title');

const fetchContainer = async () => {
    const url = `https://amazing-events.herokuapp.com/api/events`;

    const request = await fetch(url);
    const json = await request.json();
    const arrayInfo = json.events;
    const currentDate = json.currentDate;

    encontrarAgente(arrayInfo, currentDate);
}

const encontrarAgente = (info, currentDate) =>{
    const resultado = info.find(agente => agente._id == id);

    imprimirData(resultado, currentDate);
}

const imprimirData = (info, currentDate) =>{
    const {image, date, description, name, category, capacity, price, assistance } = info;

    containerTitle.innerHTML = name;
    const divContainer = document.createElement('div');
    divContainer.className = 'row d-flex justify-content-evenly align-items-center bg-light rounded';
    divContainer.innerHTML = `
        <div class="col-12 col-md-6 col-lg-6 m-0 p-0">
            <img src="${image}" class="card-img-top" alt="${name}">
        </div>
        <div class="col-12 col-md-6 col-lg-6 text-center texto">
            <h2 class="fw-bold">${name}</h2>
            <p class="">${description}</p>
            <div class="d-flex justify-content-evenly align-items-center">
                <div class="d-flex align-items-center justify-content-center">
                    <i class="fa-solid fa-money-bill-wave text-success"></i>
                    <p class="text-dark fs-5 m-0 ps-2 fw-bold">$ ${price}</p>
                </div>
                <i class="fa-solid fa-user text-primary"> ${capacity}</i>
            </div>
            <p class="fw-bold mt-2">${capacity - assistance > 0?`<span><i class="fa-solid fa-ticket text-warning"></i> ${capacity-assistance} Available</span>`:"Tickets sold out"}</p>

            <p class="px-5 py-3 bg-dark mt-4 text-light">${currentDate > date?"Past":"Comming"}: <span class="fw-bold">${date}</span></p>

            <p class="fw-bold text-primary mt-5">Category: <span class="text-dark">${category}</span></p>
        </div>
    `
    containerDiv.appendChild(divContainer);

}

fetchContainer();