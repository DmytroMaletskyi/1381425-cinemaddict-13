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
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${film.isInWatchlist ? `film-card__controls-item--active` : ``}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${film.isWatched ? `film-card__controls-item--active` : ``}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${film.isFavorite ? `film-card__controls-item--active` : ``}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCardView extends AbstractView {
  constructor(film) {
    super();

    this._film = film;
    this._popupOpenHandler = this._popupOpenHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._addToFavoriteHandler = this._addToFavoriteHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  _popupOpenHandler(evt) {
    evt.preventDefault();

    this._callback.click();
  }

  setPopupOpenHandlers(callback) {
    this._callback.click = callback;

    const element = this.getElement();

    element.querySelector(`.film-card__title`).addEventListener(`click`, this._popupOpenHandler);
    element.querySelector(`.film-card__poster`).addEventListener(`click`, this._popupOpenHandler);
    element.querySelector(`.film-card__comments`).addEventListener(`click`, this._popupOpenHandler);
  }

  _commonButtonClickHandler(evt) {
    evt.preventDefault();

    evt.target.classList.toggle(`film-card__controls-item--active`);
  }

  toggleButtonState(target) {
    const element = this.getElement();

    switch (target) {
      case `watchlist`:
        target = `.film-card__controls-item--add-to-watchlist`;
        break;
      case `watched`:
        target = `.film-card__controls-item--mark-as-watched`;
        break;
      case `favorite`:
        target = `.film-card__controls-item--favorite`;
        break;
    }

    element.querySelector(target).classList.toggle(`film-card__controls-item--active`);
  }

  _addToWatchlistHandler(evt) {
    this._commonButtonClickHandler(evt);
    this._callback.addToWatchList();
  }

  setAddtoWatchlistClickHandler(callback) {
    this._callback.addToWatchList = callback;

    const element = this.getElement();

    element.querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._addToWatchlistHandler);
  }

  _markAsWatchedHandler(evt) {
    this._commonButtonClickHandler(evt);
    this._callback.markAsWatched();
  }

  setMarkAsWatchedClickHandler(callback) {
    this._callback.markAsWatched = callback;

    const element = this.getElement();

    element.querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._markAsWatchedHandler);
  }

  _addToFavoriteHandler(evt) {
    this._commonButtonClickHandler(evt);
    this._callback.addToFavorite();
  }

  setAddToFavoriteClickHandler(callback) {
    this._callback.addToFavorite = callback;

    const element = this.getElement();

    element.querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._addToFavoriteHandler);
  }
}
