// ===== CLASE API =====
class GhibliAPI {
  constructor(url = "https://ghibliapi.vercel.app/films") {
    this.url = url;
    this.cache = null;
  }

  async getFilms() {
    if (this.cache) return this.cache;

    const res = await fetch(this.url);
    if (!res.ok) throw new Error("Error al obtener películas");

    this.cache = await res.json();
    return this.cache;
  }
}

// ===== VARIABLES =====
const api = new GhibliAPI();

const grid = document.getElementById("grid");
const btnListar = document.getElementById("btnListar");

const filterYear = document.getElementById("filterYear");
const filterDirector = document.getElementById("filterDirector");

const modal = document.getElementById("modal");
const cerrar = document.getElementById("cerrar");

const banner = document.getElementById("banner");
const titulo = document.getElementById("titulo");
const anio = document.getElementById("anio");
const descripcion = document.getElementById("descripcion");

let peliculas = [];

// ===== LISTAR PELÍCULAS =====
btnListar.onclick = async () => {
  try {
    peliculas = await api.getFilms();
    cargarFiltros(peliculas);
    mostrarPeliculas(peliculas);
  } catch (e) {
    console.error(e.message);
  }
};

// ===== MOSTRAR GRID =====
function mostrarPeliculas(lista) {
  grid.innerHTML = lista.map(p => `
    <div class="card" data-id="${p.id}">
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
    </div>
  `).join("");

  document.querySelectorAll(".card").forEach(card => {
    card.onclick = () => {
      const peli = peliculas.find(p => p.id === card.dataset.id);
      mostrarFicha(peli);
    };
  });
}

// ===== FICHA =====
function mostrarFicha(peli) {
  banner.src = peli.movie_banner;
  titulo.textContent = peli.title;
  anio.textContent = `Año: ${peli.release_date}`;
  descripcion.textContent = peli.description;

  modal.classList.remove("hidden");
}

cerrar.onclick = () => {
  modal.classList.add("hidden");
};

// ===== FILTROS =====
function cargarFiltros(lista) {
  const anios = [...new Set(lista.map(p => p.release_date))];
  const directores = [...new Set(lista.map(p => p.director))];

  filterYear.innerHTML =
    `<option value="">Todos los años</option>` +
    anios.map(a => `<option value="${a}">${a}</option>`).join("");

  filterDirector.innerHTML =
    `<option value="">Todos los directores</option>` +
    directores.map(d => `<option value="${d}">${d}</option>`).join("");
}

filterYear.onchange = aplicarFiltros;
filterDirector.onchange = aplicarFiltros;

function aplicarFiltros() {
  let resultado = peliculas;

  if (filterYear.value) {
    resultado = resultado.filter(p => p.release_date === filterYear.value);
  }

  if (filterDirector.value) {
    resultado = resultado.filter(p => p.director === filterDirector.value);
  }

  mostrarPeliculas(resultado);
}
