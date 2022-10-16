// Dinamic stats
document.addEventListener('DOMContentLoaded', startApp);

// Querys
const root = document.querySelector('#root');
const pastEvent = document.querySelector('#pastEvent');
const root3 = document.querySelector('#root3');


let fecha;
let dataUpcoming = [];
let dataPast = [];
let maxUpcoming;
let minPastEvent;
let maxPastEvent;

function startApp() {
    fetchContainer();
}

const fetchContainer = async () => {
    const url = `https://amazing-events.herokuapp.com/api/events`;

    const request = await fetch(url);
    const json = await request.json();
    const arrayInfo = json.events;
    const currentDate = json.currentDate;

    controlador(arrayInfo, currentDate);
}

const controlador = (info, currentDate) => {
    filtroCategory(info, currentDate);
}

const filtroCategory = (obj, currentDate) => {

    fecha = currentDate;

    filtraInfo(obj);
    filtroUpcomingPast(obj)
}

function filtraInfo(obj) {
    const resultado = [];
    const resultadoUpcoming = [];

    obj.filter(element => {
        if (element.date < fecha) {
            resultado.push({
                valor: ((element.assistance / element.capacity * 100)),
                name: element.name,
                capacity: element.capacity,
                image: element.image
            });
        } else if (element.date > fecha) {
            resultadoUpcoming.push({
                valor: ((element.estimate / element.capacity * 100)),
                name: element.name,
                image: element.image,
                capacity: element.capacity,
                asistencia: element.estimate
            });
        }
    });

    const valores = resultado.sort((a, b) => (a.valor - b.valor));
    const valoresUpcoming = resultadoUpcoming.sort((a, b) => (a.asistencia - b.asistencia));
    const resultadosPastUpcoming = valores.slice(0, 1).concat(valores.slice(-1)).concat(valoresUpcoming.slice(-1));

    mostrarValores(resultadosPastUpcoming);
}

const mostrarValores = (obj) => {
    const parrafo = document.createElement('tr');
    parrafo.className = "py-2 px-5 bg-dark text-light container my-1";
    obj.forEach(element => {

        const { name, capacity, asistencia, image, valor } = element;


        const texto = document.createElement('td');
        texto.className = "m-0"
        texto.innerHTML = `
            <img src="${image}" alt="${name}"/>
            <p class="mt-3">${name} ${asistencia ? `Capacity ${asistencia}` : `${valor}%`}</p>
        `;

        parrafo.appendChild(texto);

        root3.appendChild(parrafo);

    });
}

const filtroUpcomingPast = (info) => {
    const maxDate = info.filter(element => {
        if (element.date > fecha) {
            return element
        }
    })

    const minDate = info.filter(element => {
        if (element.date < fecha) {
            return element
        }
    })


    filtrarPast(minDate);
    filtrarUpcomimg(maxDate);
}

const filtrarUpcomimg = (info) => {


    const result = Object.values(info.reduce((acc, value) => {

        acc[value.category] = acc[value.category] || {
            categoria: value.category,
            valorFinal: 0,
            valorEstimado: 0,
            capacidad: 0,
            estimado: 0,
            porcentage: 0,
            longitud: 0
        };

        //Sumas el respectivo valor
        acc[value.category].valorFinal += value.price * value.capacity;
        acc[value.category].valorEstimado += value.price * value.estimate;
        acc[value.category].capacidad += parseInt(value.capacity);
        acc[value.category].estimado += parseInt(value.estimate);
        acc[value.category].porcentage += (100 * parseInt(value.estimate) / parseInt(value.capacity))
        acc[value.category].longitud += 1 * 100
        return acc; //retornas el nuevo acumulado
    }, {}));

    mostrarTabla(result);
}

const filtrarPast = (info) => {
    const result = Object.values(info.reduce((acc, value) => {

        acc[value.category] = acc[value.category] || {
            categoria: value.category,
            valorFinal: 0,
            valorEstimado: 0,
            capacidad: 0,
            asistencia: 0,
            porcentage: 0,
            longitud: 0,
            date: value.date

        };

        //Sumas el respectivo valor
        acc[value.category].valorFinal += value.price * value.capacity;
        acc[value.category].valorEstimado += value.price * parseInt(value.assistance);
        acc[value.category].capacidad += parseInt(value.capacity);
        acc[value.category].asistencia += parseInt(value.assistance);
        acc[value.category].porcentage += (100 * parseInt(value.assistance) / parseInt(value.capacity))
        acc[value.category].longitud += 1 * 100
        return acc; //retornas el nuevo acumulado
    }, {}));

    mostrarTabla(result);
}

const mostrarTabla = (obj) => {
    obj.forEach(element => {
        const { categoria, valorEstimado, porcentage, longitud, date } = element;
        const valor = (porcentage * 100 / longitud).toFixed(2);

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <tr>
                <th scope="row">${date > fecha ? categoria : categoria}</th>
                <td>$${date > fecha ? valorEstimado.toLocaleString() : valorEstimado.toLocaleString()}</td>
                <td>${valorEstimado.toLocaleString() ?  valor : valor}%</td>
                </tr>
                `;
        if (fecha > date) {
            pastEvent.appendChild(tr);
        } else {
            root.appendChild(tr);
        }

    });

}
