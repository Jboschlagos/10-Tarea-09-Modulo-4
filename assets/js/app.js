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

const api = new GhibliAPI();
const grid = document.getElementById("grid");

const modal = document.getElementById("modal");
const cerrar = document.getElementById("cerrar");

const banner = document.getElementById("banner");
const titulo = document.getElementById("titulo");
const anio = document.getElementById("anio");
const descripcion = document.getElementById("descripcion");

document.getElementById("btnListar").onclick = async () => {
  try {
    const films = await api.getFilms();

    grid.innerHTML = films.map(f => `
      <div class="card" data-id="${f.id}">
        <img src="${f.image}" alt="${f.title}">
        <h3>${f.title}</h3>
      </div>
    `).join("");

    document.querySelectorAll(".card").forEach(card => {
      card.onclick = () => {
        const film = films.find(f => f.id === card.dataset.id);
        mostrarFicha(film);
      };
    });

  } catch (e) {
    console.error(e.message);
  }
};

function mostrarFicha(film) {
  banner.src = film.movie_banner;
  banner.alt = film.title;
  titulo.textContent = film.title;
  anio.textContent = `Año: ${film.release_date}`;
  descripcion.textContent = film.description;

  modal.classList.remove("hidden");
}

cerrar.onclick = () => {
  modal.classList.add("hidden");
};
