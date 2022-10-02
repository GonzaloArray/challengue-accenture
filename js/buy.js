import { data } from "./data.js";

document.addEventListener("DOMContentLoaded", startApp);
const charterCard = document.querySelector('#charterCard');
const thruCard = document.querySelector('#thruCard');
const selectCard = document.querySelector('#changeSelect');
const selectCard2 = document.querySelector('#changeSelect2');
const nameCard = document.querySelector('#nameCard');
const dniCard = document.querySelector('#dniCard');
const cvvCard = document.querySelector('#cvvCard');
const formulario = document.querySelector('#formulario');
const containerDiv = document.querySelector('.container-card');

const information = data.events;
let info = [];
const cardValue = {
    charterCard: "",
    date: "",
    name: "",
    company: "",
    credit: false,
    debit: false,
    id: "",
    cvv: ""

}


function startApp() {
    charterCard.addEventListener("input", numberCard);
    thruCard.addEventListener("input", changeDate);
    selectCard.addEventListener("change", changeSelect);
    selectCard2.addEventListener("change", changeSelect2);
    nameCard.addEventListener("input", nameDate);
    dniCard.addEventListener("input", dniValue);
    cvvCard.addEventListener("input", cvvValue);
    formulario.addEventListener("submit", submitForm);
    encontrarAgente(information);
}

const numberCard = (e) =>{
    cardValue.charterCard = e.target.value;
    const chartValue = String(e.target.value);

    const resultado = chartValue.slice(0, 4) + "  " + chartValue.slice(4, 8) + "  " + chartValue.slice(8, 12) + " " + chartValue.slice(12, 16);


    if(charterCard.value.length > 16){
        charterCard.value = charterCard.value.slice(0,16);
    }
    if (resultado.length < 21){
        document.querySelector(".changeNumber").classList.add("bg-dark", "p-2", "rounded", "text-light");
        document.querySelector(".changeNumber").textContent = resultado;
    }else{
        document.querySelector(".changeNumber").classList.remove("bg-dark", "p-2", "rounded", "text-light");
        document.querySelector(".changeNumber").textContent = resultado;
    }

}
const changeDate = ({target}) => {
    const data = target.value;
    const date = new Date(data).toLocaleDateString('en-us', { year:"numeric", month:"numeric"});

    document.querySelector('.changeDate').textContent = date;
    cardValue.date = date;
};

const changeSelect = (e) =>{
    const cardCompany = e.target.value;

    document.querySelector('.changeSelected').innerHTML = `<img src="../img/${cardCompany}.png" alt="${cardCompany}" />`;
    cardValue.company = cardCompany;

};
const changeSelect2 = (e) =>{
    const cardCompany = e.target.value;
    if (cardCompany === "Debit") {
        cardValue.debit = true;
        cardValue.credit = false;
    }else{
        cardValue.credit = true;
        cardValue.debit = false;
    }
    document.querySelector('.changeSelected2').textContent = cardCompany;
};
const nameDate = (e) =>{
    const name = e.target.value;
    if(name.length > 30){
        e.target.value = name.slice(0,30);
    }
    if(name.length < 10){
        document.querySelector(".changeName").classList.add("bg-dark", "p-2", "rounded", "text-light");
    }else{
        document.querySelector(".changeName").classList.remove("bg-dark", "p-2", "rounded", "text-light");
    }

    document.querySelector('.changeName').textContent = name;

    cardValue.name = name;
};
const dniValue = (e) =>{
    cardValue.id = e.target.value;
    if(e.target.value.length > 8){
        e.target.value = cardValue.id.slice(0,8);
    }

};
const cvvValue = (e) =>{
    cardValue.cvv = e.target.value;
    if(e.target.value.length > 3){
        e.target.value = cardValue.cvv.slice(0,3);
    }
};
const submitForm = (e) => {
    e.preventDefault();

    if (cardValue.charterCard.length !== 17) {
        mensajeError("Ingrese correctamente los digitos de su tarjeta", "error-digito");
    }else if(cardValue.id.length < 8){
        mensajeError("Ingrese correctamente el numero de DNI", "error-dni");
    }else if(cardValue.cvv.length < 2){
        mensajeError("Ingrese correctamente el CVV", "error-cvv");
    }else if(cardValue.name.length < 8){
        mensajeError("Ingrese correctamente el nombre de la tarjeta", "error-name");
    } else if(cardValue.date < "09/2022"){
        mensajeError("Ingrese correctamente la fecha de expiración", "error-date");
    }else if(cardValue.credit === false && cardValue.debit === false){
        mensajeError("Ingrese correctamente debito o credito", "error-company");
    }else if(cardValue.company === 0){
        mensajeError("Ingrese correctamente una compania", "error-card");
    }else{
        Swal.fire(
            'successful purchase!',
            'You clicked the button!',
            'success'
        )
    }
}

// Mensaje de error
const mensajeError = (message, category) => {
    const error = document.querySelector(".error");
    const mensajeAlerta = document.querySelector(".mensajeError");

    if (!mensajeAlerta) {
        const contenedorError = document.createElement("div");
        contenedorError.className = "d-flex justify-content-center align-items-center bg-danger p-2 mt-4";

        const textoError = document.createElement("p");
        textoError.className = "mensajeError text-light fw-semibold text-uppercase fs-5 m-0";
        textoError.textContent = message;

        contenedorError.appendChild(textoError);

        if (category === "error-digito") {
            error.appendChild(contenedorError);
        }else if(category === "error-dni"){
            error.appendChild(contenedorError);
        }else if(category === "error-cvv"){
            error.appendChild(contenedorError);
        }else if(category === "error-name"){
            error.appendChild(contenedorError);
        }else if(category === "error-date"){
            error.appendChild(contenedorError);
        }else if(category === "error-company"){
            error.appendChild(contenedorError);
        }else if(category === "error-card"){
            error.appendChild(contenedorError);
        }else if(category === "error-default"){
            error.appendChild(contenedorError);
        }

        setTimeout(() => {
            contenedorError.remove()
        }, 2000);
    }
}


// Card
let cadenaParametrosUrl = location.search;
let parametros = new URLSearchParams(cadenaParametrosUrl)
let id = parametros.get('id');

const encontrarAgente = (info) =>{
    const resultado = info.find(agente => agente._id == id);

    imprimirData(resultado);
}
const imprimirData = (info) =>{
    const {image, name, category, price } = info;


    const divContainer = document.createElement('div');
    divContainer.className = 'd-flex flex-column flex-md-row justify-content-md-start rounded mt-5';
    divContainer.innerHTML = `

            <div class="">
                <img src="${image}" class="card-img-top" alt="${name}">
            </div>
            <div class="bg-light px-5 py-3">
                <h2 class="fw-bold text-center">${name}</h2>
                <div class="d-flex justify-content-evenly align-items-center">
                    <div class="d-flex align-items-center justify-content-center">
                        <i class="fa-solid fa-money-bill-wave text-success"></i>
                        <p class="text-dark fs-5 m-0 ps-2 fw-bold">$ ${price}</p>
                    </div>
                </div>

                <p class="fw-bold text-primary text-center mt-3">Category: <span class="text-dark">${category}</span></p>
            </div>
    `
    containerDiv.appendChild(divContainer);

}
