const listaCanciones = document.getElementById('listaCanciones');
const inputBusqueda = document.getElementById('inputBusqueda');
const btnMezclar = document.getElementById('btnMezclar');

const inputNombre = document.getElementById('inputNombre');
const inputArtista = document.getElementById('inputArtista');
const btnAgregar = document.getElementById('btnAgregar');

const obtenerPlaylist = () => {
    const datos = localStorage.getItem('playlist');
    if (datos) {
        return JSON.parse(datos);
    } else {
        return [];
    }
};

const guardarPlaylist = (lista) => {
    const datosJSON = JSON.stringify(lista);
    localStorage.setItem('playlist', datosJSON);
};

if (listaCanciones) {

    const moverCancion = (index, direccion, filtro) => {
        const playlist = obtenerPlaylist();
        const nuevoIndex = index + direccion;

        if (nuevoIndex < 0 || nuevoIndex >= playlist.length) {
            return;
        }

        const temporal = playlist[index];
        playlist[index] = playlist[nuevoIndex];
        playlist[nuevoIndex] = temporal;

        guardarPlaylist(playlist);
        renderizarLista(filtro);
    };

    const eliminarCancion = (index, filtro) => {
        const playlist = obtenerPlaylist();
        playlist.splice(index, 1);
        guardarPlaylist(playlist);
        renderizarLista(filtro);
    };

    const renderizarLista = (filtro) => {
        if (!filtro) {
        filtro = "";
        }
        
        listaCanciones.innerHTML = "";
        const playlist = obtenerPlaylist();

        const filtradas = playlist.filter((cancion) => {
            const texto = filtro.toLowerCase();
            return cancion.nombre.toLowerCase().includes(texto) ||
                   cancion.artista.toLowerCase().includes(texto);
        });

        if (filtradas.length === 0) {
            listaCanciones.innerHTML = "<li>No hay canciones que mostrar :(</li>";
            return;
        }

        filtradas.forEach((cancion) => {
            const index = playlist.indexOf(cancion);

            const li = document.createElement('li');

            const spanTexto = document.createElement('span');
            spanTexto.textContent = cancion.nombre + " - " + cancion.artista;

            const divBotones = document.createElement('div');

            const btnSubir = document.createElement('a');
            const iconoSubir = document.createElement('i');
            iconoSubir.className = "fa-solid fa-arrow-up";
            btnSubir.appendChild(iconoSubir);
            btnSubir.title = "Subir";
            btnSubir.onclick = () => moverCancion(index, -1, filtro);

            const btnBajar = document.createElement('a');
            const iconoBajar = document.createElement('i');
            iconoBajar.className = "fa-solid fa-arrow-down";
            btnBajar.appendChild(iconoBajar);
            btnBajar.title = "Bajar";
            btnBajar.onclick = () => moverCancion(index, 1, filtro);

            const btnEliminar = document.createElement('a');
            const iconoBorrar = document.createElement('i');
            iconoBorrar.className = "fa-solid fa-trash-can";
            btnEliminar.appendChild(iconoBorrar);
            btnEliminar.title = "Eliminar";
            btnEliminar.onclick = () => eliminarCancion(index, filtro);

            divBotones.appendChild(btnSubir);
            divBotones.appendChild(btnBajar);
            divBotones.appendChild(btnEliminar);

            li.appendChild(spanTexto);
            li.appendChild(divBotones);

            listaCanciones.appendChild(li);
        });
    };

    inputBusqueda.addEventListener('input', (evento) => {
        renderizarLista(evento.target.value);
    });

    btnMezclar.addEventListener('click', () => {
        const playlist = obtenerPlaylist();

        for (let i = playlist.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = playlist[i];
            playlist[i] = playlist[j];
            playlist[j] = temp;
        }

        guardarPlaylist(playlist);
        renderizarLista();
    });

    renderizarLista();
}

if (btnAgregar) {
    btnAgregar.addEventListener('click', () => {
        const nombre = inputNombre.value.trim();
        const artista = inputArtista.value.trim();

        if (nombre === "" || artista === "") {
            alert("Debes llenar los dos campos");
            return;
        }

        const playlist = obtenerPlaylist();
        playlist.push({ nombre: nombre, artista: artista });
        guardarPlaylist(playlist);

        inputNombre.value = "";
        inputArtista.value = "";

        window.location.href = "index.html";
    });
}