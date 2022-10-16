document.addEventListener("DOMContentLoaded", inciarApp);

function inciarApp() {
    // Como primer Instrucción renderiza la cards, check
    sincrono()

    // Declarando
    searchType.addEventListener("keyup", filtrarInput);
    checkbox.addEventListener("change", filtrarInput);
}

// Query
const indexCard = document.querySelector('.indexCard');
const upcomingEvents = document.querySelector('.upcomingEvents');
const pastEvent = document.querySelector('.pastEvent');
const checkbox = document.querySelector('#checkbox');
const searchType = document.querySelector("#searchInput");
let currentDate;
let informacion;

// Data de los objetos
const sincrono = async () => {
    const url = `https://amazing-events.herokuapp.com/api/events`;

    const request = await fetch(url);
    const json = await request.json();
    const arrayInfo = json.events;
    const currentDate = json.currentDate;
    mostrarHTML(arrayInfo, currentDate);
    dropCategory(arrayInfo);
    mostrarCheckbox(reducirCategoria(categoycard));
    controlador(arrayInfo, currentDate);
}

// Data de los nombres de las categoy
const categoycard = [];

// Busqueda de los inputs
const busqueda = {
    busqueda: ""
}

// Logica de los nombres de los checkbox
const dropCategory = (data) => {
    const resultado = data.filter((event) => {
        const { category } = event;

        return categoycard.push(category);
    });
    return resultado;
}
const reducirCategoria = (data) => {
    const result = data.reduce((acc, item) => {
        if (!acc.includes(item)) {
            acc.push(item);
        }
        return acc;
    }, []);

    return result;
}

// Renderizado de los checkbox
const mostrarCheckbox = (data) => {
    const rowCheck = document.createElement('div');
    rowCheck.className = 'd-flex justify-content-start flex-column flex-md-row justify-content-md-between m-lg-auto p-0 m-0';
    data.forEach(element => {
        const divChecked = document.createElement('div');
        divChecked.className = 'py-2 py-md-4 py-md-3';
        divChecked.innerHTML = `
            <div class="row m-lg-auto">
                <div class="form-check col-12">
                    <input class="form-check-input ms-2 ms-sm-0" id="${element.slice(0, 4)}" name="${element}" type="checkbox" value="${element}">
                    <label for="${element.slice(0, 4)}" class="ms-2 ms-sm-1 form-check-label" for="flexCheckChecked">
                        ${element}
                    </label>
                </div>
            </div>
        `;

        rowCheck.appendChild(divChecked);
        checkbox.appendChild(rowCheck);
    });
}

// Logica de los check para filtrado
const cheq = (info) => {
    const inputCheck = document.querySelectorAll("input[type='checkbox']");
    const check = [...inputCheck, inputCheck];
    const trueCheck = check.filter(inputCheck => inputCheck.checked);
    const valueCheck = trueCheck.map(check => check.value)
    let filtrados = [];

    info.filter(eventos => {
        valueCheck.forEach(value => {
            if (eventos.category.includes(value)) {
                return filtrados.push(eventos)
            }
        })
    })
    if (filtrados.length == 0) {
        return info
    }
    return filtrados
}

// Manejo de input
const search = (info) => {
    busqueda.busqueda = searchType.value.toLowerCase();

    const resultado = info.map(element => {
        const { name } = element;

        element.name = name.toLowerCase();

        return element;
    }).filter(elemetn => elemetn.name.includes(busqueda.busqueda));

    return resultado;
}

// Controlador de eventos
const controlador = (info, data) => {
    currentDate = data
    informacion = info;
}

// Super Filtro
const filtrarInput = () => {
    let eventFilter2 = cheq(informacion);
    let eventFilter = search(eventFilter2)

    mostrarHTML(eventFilter, currentDate);

}

// Renderizo la data --> (cards)
const mostrarHTML = (informacion, currentDate) => {

    limpiarHTML();

    if (informacion.length === 0) return message();


    informacion.forEach(element => {
        const { image, date, name, category, capacity, price, _id } = element;

        const divContainer = document.createElement('div');
        divContainer.className = 'bg-light m-2 card-width card-hover';
        divContainer.innerHTML = `
            <img src="${image}" class="card-img-top imgFit" alt="${name}">
            <div class="d-flex justify-content-between flex-column p-2 texto">
                <h5 class="card-title fw-bold text-uppercase">${name}</h5>
                <p class="card-text">Category: ${category}</p>
                <div class="d-flex justify-content-evenly align-items-center">
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-money-bill-wave text-success"></i>
                        <p class="text-dark fs-5 m-0 ps-2 fw-bold">$ ${price}</p>
                    </div>
                    <i class="fa-solid fa-user text-primary"> ${capacity}</i>
                </div>
                <a target="_blank" href="${indexCard !== null ? "./html" : "."}/buy.html?id=${_id}" class="${currentDate > date ? "pastDisable" : ""} effectBuy rounded-pill d-block btn mt-4 btn-success fw-bold text-uppercase">Buy <i class="ms-2 fa-solid fa-arrow-right"></i></a>
                <a target="_blank" href="${indexCard !== null ? "./html" : "."}/details.html?id=${_id}" class="effectBuy rounded-pill d-block btn mt-4 btn-primary fw-bold text-uppercase">More info <i class="ms-2 fa-solid fa-arrow-right"></i></a>
                <p class="px-5 py-3 bg-dark mt-4 text-light">${currentDate > date ? "Past" : "Comming"}: <span class="fw-bold">${date}</span></p>
            </div>
        `

        if (indexCard !== null) {
            // General
            indexCard.appendChild(divContainer);
        } else if (upcomingEvents !== null) {

            if (date > currentDate) {
                upcomingEvents.appendChild(divContainer);
            }
        } else if (pastEvent !== null) {

            if (date < currentDate) {
                pastEvent.appendChild(divContainer);
            }
        } else {
            console.log("Error en el javascript")
        }
    })
}

// Limpiar y mensajes de error
const limpiarHTML = () => {
    document.querySelector("#card-content").innerHTML = "";
}
const message = () => {
    const divMessage = document.createElement("div");
    divMessage.className = "text-center";

    divMessage.innerHTML = `
        <img class="notFound" src=".${indexCard !== null ? "" : "."}/img/notFound.svg" alt="not found" />
        <p class="text-dark rounded bg-light px-3 py-1 fw-bold fs-3">Not found events</p>
    `;

    // Envio
    if (indexCard !== null) {
        // General
        indexCard.appendChild(divMessage);
    } else if (upcomingEvents !== null) {

        upcomingEvents.appendChild(divMessage);

    } else if (pastEvent !== null) {

        pastEvent.appendChild(divMessage);

    }
}