import { data } from "./data.js";

document.addEventListener("DOMContentLoaded", inciarApp);

function inciarApp() {
    // Como primer Instrucción renderiza la cards
    mostrarHTML(info);

    // Evento click por cada checkboxes
    [...checkboxes].map(e => e.addEventListener("click", cheq));
    document.querySelector("#searchInput").addEventListener("input", search);
}
// Query
const indexCard = document.querySelector('.indexCard');
const upcomingEvents = document.querySelector('.upcomingEvents');
const pastEvent = document.querySelector('.pastEvent');
const checkbox = document.querySelector('#checkbox');
const checkboxes = document.getElementsByClassName('form-check-input');

// Data de los objetos
const info = data.events;

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
const cheq = () => {
    const resultado = [...checkboxes].filter(e => {
        if (e.checked) {
            return e.value;
        }
    });

    logicaCheck(resultado);
}

const logicaCheck = (data) => {
    let resultado = [];

    if (data.length === 0) {
        mostrarHTML(info)
        return;
    }

    info.filter(eventos => {
        data.forEach(value => {
            if (eventos.category.includes(value.value)) {
                return resultado.push(eventos)
            }
        });
    });

    mostrarHTML(resultado);
}

// Manejo de input
const search = (e) => {

    busqueda.busqueda = e.target.value.toLowerCase();

    const chequeado = [...checkboxes].filter(e => e.checked);

    const resultado = info.map(element => {
        const { name } = element;

        element.name = name.toLowerCase();

        return element;
    }).filter(elemetn => elemetn.name.includes(busqueda.busqueda));

    if (chequeado.length === 0) {
        mostrarHTML(resultado);

    } else if (chequeado.length > 0) {

        let resultado = [];

        info.filter(eventos => {
            chequeado.forEach(value => {
                if (eventos.category.includes(value.value)) {
                    return resultado.push(eventos)
                }
            })
        });

        const filtrado = resultado.filter(element => element.name.includes(busqueda.busqueda))

        mostrarHTML(filtrado);
    } else {
        mostrarHTML(resultado);
    }
}

// Renderizo la data --> (cards)
const mostrarHTML = (informacion) => {

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
                <a target="_blank" href="${indexCard !== null ? "./html" : "."}/buy.html?id=${_id}" class="${data.currentDate > date ? "pastDisable" : ""} effectBuy rounded-pill d-block btn mt-4 btn-success fw-bold text-uppercase">Buy <i class="ms-2 fa-solid fa-arrow-right"></i></a>
                <a target="_blank" href="${indexCard !== null ? "./html" : "."}/details.html?id=${_id}" class="effectBuy rounded-pill d-block btn mt-4 btn-primary fw-bold text-uppercase">More info <i class="ms-2 fa-solid fa-arrow-right"></i></a>
                <p class="px-5 py-3 bg-dark mt-4 text-light">${data.currentDate > date ? "Past" : "Comming"}: <span class="fw-bold">${date}</span></p>
            </div>
        `

        if (indexCard !== null) {
            // General
            indexCard.appendChild(divContainer);
        } else if (upcomingEvents !== null) {

            if (date > data.currentDate) {
                upcomingEvents.appendChild(divContainer);
            }
        } else if (pastEvent !== null) {

            if (date < data.currentDate) {
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
        <img class="notFound" src=".${indexCard!==null?"":"."}/img/notFound.svg" alt="not found" />
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

// Declarando
dropCategory(info);
mostrarCheckbox(reducirCategoria(categoycard));