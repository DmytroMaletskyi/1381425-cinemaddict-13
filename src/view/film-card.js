import AbstractView from "./abstract.js";

const createFilmCardTemplate = (film) => {
  return `<article class="film-card">
    <h3 class="film-card__title">${film.name}</h3>
    <p class="film-card__rating">${film.rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${film.releaseDate.format(`YYYY`)}</span>
      <span class="film-card__duration">${film.duration.$d.hours}h ${film.duration.$d.minutes}m</span>
      <span class="film-card__genre">${film.genre.join(`, `)}</span>
    </p>
    <img src="./images/posters/${film.poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${(film.description.length > 140) ? `${film.description.substring(0, 140)}...` : film.description}</p>
    <a class="film-card__comments">${(film.comments.length === 1) ? `${film.comments.length} comment` : `${film.comments.length} comments`}</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.isInWatchList ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.isWatched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${film.isFavorite ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }
}
