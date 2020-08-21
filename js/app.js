// Variables
const carrito = document.getElementById('carrito'); // div que contiene la tabla de los cursos del carrito
const cursos = document.getElementById('lista-cursos'); // div donde se alojan todos los cursos
const listaCursos = document.querySelector('#lista-carrito tbody'); // Aqui se insertaran los cursos
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

// Listeners
cargarEventListeners();

function cargarEventListeners(){
    
    // Se ejecuta cuando se preciona "Agregar a carrito"
    cursos.addEventListener('click', comprarCurso);

    // Cuando se elimina un curso del carrito
    carrito.addEventListener('click', eliminarCurso);

    // Al dar click en "Vaciar carrito"
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

    // Al cargar la pagina, leera el LS
    document.addEventListener('DOMContentLoaded', leerLocalStorage);
}

// Funciones

//Añade el curso al carrito
function comprarCurso(e){
    e.preventDefault();

    // Solo se ejecuta si se da clic en un elemento que contenga la clase "agregar-carrito"
    if(e.target.classList.contains('agregar-carrito')){
        // Selecciona desde el padre del padre del elemento, es decir el elemento card
        const curso = e.target.parentElement.parentElement;
        // Se envia el curso para leer sus datos
        leerdatoscurso(curso);
    }
}

// Lee los datos del curso
function leerdatoscurso(curso){
    const infoCurso = {
        imagen: curso.querySelector('img').src, // Se obtine solo la url de la imagen
        titulo: curso.querySelector('h4').textContent, 
        precio: curso.querySelector('.precio span').textContent, // Precio con descuento
        id: curso.querySelector('a').getAttribute('data-id') // Se obtine el valor del atributo "data-id"
    }
    insertarCarrito(infoCurso);
}

// Muestra el curso selecciona en el carrito
function insertarCarrito(curso){
    const row = document.createElement('tr');
    
    // Se crea la plantilla HTML para formatear los cursos
    row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width="100">
        </td>
        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>
        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
    `;
    
    // Se incorpora el elemento como hijo de row
    listaCursos.appendChild(row);

    guardarCursoLocalStorage(curso);
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e){
    e.preventDefault();
    let curso, cursoId;
    if(e.target.classList.contains('borrar-curso')){
        // Traversing para eliminar el elemento completo
        e.target.parentElement.parentElement.remove();

        // Se selecciona la fila completa del curso para eliminarlo del LS
        curso = e.target.parentElement.parentElement;

        // Se obtine el id del curso
        cursoId = curso.querySelector('a').getAttribute('data-id');
    }

    eliminarCursoLocalStorage(cursoId);
}

// Elimina todos los curso del carrito en el DOM
function vaciarCarrito(){
    // Vacia el carrito pero puede ser un poco lento
    /* listaCursos.innerHTML = ''; */

    /* Forma rápida y recomendada. 
    Recorre la lista de curso y elimina los elementos hasta que la lista esta vacia */
    while(listaCursos.firstChild){
        listaCursos.removeChild(listaCursos.firstChild);
    }

    vaciarCarritoLS();

    return false; // Evita efecto de salto
}

function guardarCursoLocalStorage(curso){
    let cursos;

    // Toma el valor de un arreglo del LS o uno vacio
    cursos = obtenerCursosLocalStorage();
    
    // El curso seleccionado se agrega al arreglo
    cursos.push(curso);

    localStorage.setItem('cursos', JSON.stringify(cursos));
}

// Comprueba que haya elementos en LS
function obtenerCursosLocalStorage(){
    let cursosLS;

    // Comprobamos si hay algo en LS
    if(localStorage.getItem('cursos') === null){
        cursosLS = [];
    }
    else{
        cursosLS = JSON.parse(localStorage.getItem('cursos'));
    }

    return cursosLS;
}

// Agrega los curso del LS al carrito
function leerLocalStorage(){
    let cursosLS;
    cursosLS = obtenerCursosLocalStorage();
    cursosLS.forEach(function(curso){
        const row = document.createElement('tr');
    
        // Se crea la plantilla HTML para formatear los cursos
        row.innerHTML = `
            <td>
                <img src="${curso.imagen}" width="100">
            </td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>
                <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
            </td>
        `;
        
        // Se incorpora el elemento como hijo de row
        listaCursos.appendChild(row);
        });
}

// Elimina el curso por id del LS
function eliminarCursoLocalStorage(curso){
    let cursosLS;
    cursosLS = obtenerCursosLocalStorage();

    // Recorremos los curso del LS y compara el id
    cursosLS.forEach(function(cursoLS, index){
        if(cursoLS.id === curso){
            cursosLS.splice(index, 1);
        }
    });

    // Añadimos los cursos restantes
    localStorage.setItem('cursos', JSON.stringify(cursosLS));
}

// Elimina todos los curso del LS
function vaciarCarritoLS(){
    localStorage.clear();
}