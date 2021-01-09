import SortView from "../view/film-sort.js";
import StatsSectionView from "../view/stats-section.js";
import FilmsSectionView from "../view/films-section.js";
import NoFilmsTextView from "../view/no-films.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import PopupView from "../view/film-details-popup.js";
import {RenderPosition, renderElement, remove} from "../utils/render.js";
import {sortFilmsBy, updateItem} from "../utils/common.js";
import {SortType} from "../const.js";

const FILMS_AMOUNT_PER_STEP = 5;
const EXTRA_FILMS_AMOUNT = 2;

export default class MovieList {
  constructor(page, mainContainer) {
    this._page = page;
    this._mainContainer = mainContainer;
    this._renderedFilmsCount = FILMS_AMOUNT_PER_STEP;
    this._renderedFilms = {};
    this._openedPopup = ``;
    this._currentSortType = SortType.DEFAULT;

    this._filmsSectionComponent = new FilmsSectionView();
    this._statsSectionComponent = new StatsSectionView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._noFilmsTextComponent = new NoFilmsTextView();
    this._sortComponent = new SortView();

    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();

    this._renderMovieSection();
  }

  _handleFilmChange(updatedFilm) {
    this._films = updateItem(this._films, updatedFilm);
  }

  _renderFilmCardComponent(container, film) {
    const filmComponent = new FilmCardView(film);

    const popupOpenHandler = () => {
      const popupCloseHandler = () => {
        this._page.classList.remove(`hide-overflow`);
        document.removeEventListener(`keydown`, onEscKeyDown);
        remove(this._openedPopup);
        this._openedPopup = ``;
      };

      const onEscKeyDown = (evt) => {
        if (evt.key === `Escape` || evt.key === `Esc`) {
          evt.preventDefault();
          popupCloseHandler();
          document.removeEventListener(`keydown`, onEscKeyDown);
        }
      };

      if (this._openedPopup) {
        popupCloseHandler();
      }
      this._page.classList.add(`hide-overflow`);
      this._openedPopup = new PopupView(film);
      renderElement(this._page, this._openedPopup, RenderPosition.BEFOREEND);

      const addToWatchlistClickHandler = () => {
        film.isInWatchlist = !film.isInWatchlist;
        this._handleFilmChange(film);
        filmComponent.toggleButtonState(`watchlist`);
      };

      const markAsWatchedClickHandler = () => {
        film.isWatched = !film.isWatched;
        this._handleFilmChange(film);
        filmComponent.toggleButtonState(`watched`);
      };

      const addToFavoriteClickHandler = () => {
        film.isFavorite = !film.isFavorite;
        this._handleFilmChange(film);
        filmComponent.toggleButtonState(`favorite`);
      };

      this._openedPopup.setAddtoWatchlistClickHandler(addToWatchlistClickHandler);
      this._openedPopup.setMarkAsWatchedClickHandler(markAsWatchedClickHandler);
      this._openedPopup.setAddToFavoriteClickHandler(addToFavoriteClickHandler);
      this._openedPopup.setCloseButtonClickHandler(popupCloseHandler);
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const addToWatchlistClickHandler = () => {
      film.isInWatchlist = !film.isInWatchlist;
      this._handleFilmChange(film);
    };

    const markAsWatchedClickHandler = () => {
      film.isWatched = !film.isWatched;
      this._handleFilmChange(film);
    };

    const addToFavoriteClickHandler = () => {
      film.isFavorite = !film.isFavorite;
      this._handleFilmChange(film);
    };

    filmComponent.setAddtoWatchlistClickHandler(addToWatchlistClickHandler);
    filmComponent.setMarkAsWatchedClickHandler(markAsWatchedClickHandler);
    filmComponent.setAddToFavoriteClickHandler(addToFavoriteClickHandler);
    filmComponent.setPopupOpenHandlers(popupOpenHandler);

    renderElement(container, filmComponent, RenderPosition.BEFOREEND);

    if (container === this._filmsListContainer) {
      this._renderedFilms[film.id] = filmComponent;
    }
  }

  _renderFilms(from, to) {
    this._films.slice(from, to).forEach((film) => this._renderFilmCardComponent(this._filmsListContainer, film));
  }

  _renderTopFilmsComponent(topType) {
    let topFilmsContainer;
    switch (topType) {
      case SortType.RATING:
        topFilmsContainer = this._topRatedFilmsContainer;
        break;
      case SortType.COMMENTS:
        topFilmsContainer = this._mostCommentedFilmsContainer;
        break;
    }

    const sortedFilms = sortFilmsBy(topType, this._films);
    for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
      this._renderFilmCardComponent(topFilmsContainer, sortedFilms[i]);
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._renderedFilmsCount, this._renderedFilmsCount + FILMS_AMOUNT_PER_STEP);
    this._renderedFilmsCount += FILMS_AMOUNT_PER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButtonComponent() {
    renderElement(this._filmsListContainer, this._showMoreButtonComponent, RenderPosition.AFTEREND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderFilmsSectionComponent() {
    renderElement(this._mainContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);

    const filmsListsContainers = this._filmsSectionComponent.getElement().querySelectorAll(`.films-list__container`);
    const [filmsListContainer, topRatedFilmsContainer, mostCommentedFilmsContainer] = filmsListsContainers;

    this._filmsListContainer = filmsListContainer;
    this._topRatedFilmsContainer = topRatedFilmsContainer;
    this._mostCommentedFilmsContainer = mostCommentedFilmsContainer;
  }

  _renderNoFilmsTextComponent() {
    renderElement(this._mainContainer, this._noFilmsTextComponent, RenderPosition.BEFOREEND);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.RATING:
      case SortType.DATE:
        this._films = sortFilmsBy(sortType, this._films);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearMainFilmsComponent();
    this._renderMainFilmsComponent();
  }

  _renderSortComponent() {
    renderElement(this._mainContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderMainFilmsComponent() {
    this._renderFilms(0, Math.min(this._films.length, FILMS_AMOUNT_PER_STEP));

    if (this._films.length > FILMS_AMOUNT_PER_STEP) {
      this._renderShowMoreButtonComponent();
    }
  }

  _clearMainFilmsComponent() {
    Object.values(this._renderedFilms).forEach((film) => remove(film));
    this._renderedFilms = {};
    this._renderedFilmsCount = FILMS_AMOUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderStatsComponent() {
    // Рендер статистики
  }

  _renderMovieSection() {
    if (this._films.length === 0) {
      this._renderNoFilmsTextComponent();
      return;
    }

    this._renderSortComponent();
    this._renderFilmsSectionComponent();

    this._renderMainFilmsComponent();

    this._renderTopFilmsComponent(`rating`);
    this._renderTopFilmsComponent(`comments`);
  }
}
