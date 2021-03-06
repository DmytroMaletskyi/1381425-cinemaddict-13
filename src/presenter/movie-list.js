import SortView from "../view/film-sort.js";
import FilmsSectionView from "../view/films-section.js";
import NoFilmsTextView from "../view/no-films.js";
import FilmCardView from "../view/film-card.js";
import ShowMoreButtonView from "../view/show-more-button.js";
import PopupView from "../view/film-details-popup.js";
import LoadingView from "../view/loading.js";
import FilmsCounterView from "../view/films-counter.js";
import UserRankView from "../view/user-rank.js";
import {filter} from "../utils/filter.js";
import {RenderPosition, renderElement, remove, replace} from "../utils/render.js";
import {sortFilmsByRating, sortFilmsByDate, sortFilmsByComments, verifyEqualRating, verifyEqualCommentsAmount, getRandomFilms} from "../utils/common.js";
import {SortType, PopupState, UserAction, UpdateType} from "../const.js";
import dayjs from "dayjs";

const FILMS_AMOUNT_PER_STEP = 5;
const EXTRA_FILMS_AMOUNT = 2;
const ESCAPE_KEY = `Escape`;
const SHORT_ESCAPE_KEY = `Esc`;

export default class MovieList {
  constructor(page, mainContainer, filmsModel, commentsModel, filtersModel, api) {
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filtersModel = filtersModel;
    this._api = api;
    this._page = page;
    this._mainContainer = mainContainer;
    this._headerContainer = page.querySelector(`.header`);
    this._footerContainer = page.querySelector(`.footer`);
    this._renderedFilmsCount = FILMS_AMOUNT_PER_STEP;
    this._renderedFilms = {};
    this._renderedTopRatedFilms = {};
    this._renderedMostCommentedFilms = {};
    this._renderedFilmsData = {};
    this._openedPopup = ``;
    this._currentSortType = SortType.DEFAULT;
    this._isLoading = true;

    this._loadingComponent = new LoadingView();
    this._filmsSectionComponent = new FilmsSectionView();
    this._showMoreButtonComponent = null;
    this._noFilmsTextComponent = new NoFilmsTextView();
    this._sortComponent = null;
    this._filmsCounterComponent = new FilmsCounterView(0);
    this._userRankComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _getFilms(defaultFilter = false, sortType = this._currentSortType) {
    let films = this._filmsModel.getFilms().slice();

    films = !defaultFilter ? filter[this._filtersModel.getFilter()](films) : films;

    switch (sortType) {
      case SortType.RATING:
        return films.sort(sortFilmsByRating);
      case SortType.DATE:
        return films.sort(sortFilmsByDate);
      case SortType.COMMENTS:
        return films.sort(sortFilmsByComments);
    }

    return films;
  }

  init() {
    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filtersModel.addObserver(this._handleModelEvent);

    this._renderMovieSection();
  }

  destroy() {
    this._clearMovieSection({resetRenderedFilmsCount: true, resetSortType: true});

    remove(this._sortComponent);
    remove(this._filmsSectionComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
    this._filtersModel.removeObserver(this._handleModelEvent);
  }

  setViewState(state) {
    const resetViewState = () => {
      this._openedPopup.updateData({
        isSubmitting: false,
        isDeleting: false
      });
    };
    switch (state) {
      case PopupState.SUBMITTING:
        this._openedPopup.updateData({
          isSubmitting: true
        });
        break;
      case PopupState.DELETING:
        this._openedPopup.updateData({
          isDeleting: true
        });
        break;
      case PopupState.ABORTING:
        this._openedPopup.shake(resetViewState);
        break;
    }
  }

  _handleViewAction(actionType, updateType, update, filmId) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update)
        .then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this.setViewState(PopupState.SUBMITTING);
        this._api.addComment(this._filmsModel.getFilm(filmId), update).then((response) => {
          this._filmsModel.updateFilm(UpdateType.NONE, Object.assign(
              {},
              this._filmsModel.getFilm(filmId),
              {
                comments: [
                  ...this._filmsModel.getFilm(filmId).comments,
                  response.id
                ]
              }
          ));
          this._commentsModel.addComment(updateType, filmId, response);
        })
        .catch(() => {
          this.setViewState(PopupState.ABORTING);
        });
        break;
      case UserAction.DELETE_COMMENT:
        this.setViewState(PopupState.DELETING);
        this._api.deleteComment(update).then(() => {
          const index = this._filmsModel.getFilm(filmId).comments.findIndex((commentId) => commentId === update);
          this._filmsModel.updateFilm(UpdateType.NONE, Object.assign(
              {},
              this._filmsModel.getFilm(filmId),
              {
                comments: [
                  ...this._filmsModel.getFilm(filmId).comments.slice(0, index),
                  ...this._filmsModel.getFilm(filmId).comments.slice(index + 1)
                ]
              }
          ));
          this._commentsModel.deleteComment(updateType, filmId, update);
        })
        .catch(() => {
          this.setViewState(PopupState.ABORTING);
        });
        break;
    }
  }

  _updateFilmData(dataId) {
    const getFilm = (isDefaultFilter = false) => {
      return this._getFilms(isDefaultFilter)[this._getFilms(isDefaultFilter).findIndex((filmItem) => filmItem.id === dataId)];
    };

    this._renderedFilmsData[dataId] = getFilm() ? getFilm() : getFilm(true);

    if (this._renderedFilms[dataId]) {
      if (getFilm()) {
        this._renderedFilms[dataId].updateFilmData(this._renderedFilmsData[dataId]);
      } else {
        this._clearMovieSection({resetRenderedFilmsCount: false, resetSortType: false});
        delete this._renderedFilms[dataId];
        this._renderMainFilmsSection();
      }
    } else {
      if (getFilm()) {
        this._clearMovieSection({resetRenderedFilmsCount: false, resetSortType: false});
        this._renderMainFilmsSection(true);
      }
    }

    if (this._renderedTopRatedFilms[dataId]) {
      this._renderedTopRatedFilms[dataId].updateFilmData(this._renderedFilmsData[dataId]);
    }

    if (this._renderedMostCommentedFilms[dataId]) {
      this._renderedMostCommentedFilms[dataId].updateFilmData(this._renderedFilmsData[dataId]);
    }

    if (this._openedPopup) {
      this._openedPopup.updateFilmData(this._renderedFilmsData[dataId]);
    }
  }

  _handleModelEvent(updateType, data, filmId) {
    if (filmId) {
      this._updateFilmData(filmId);
    } else if (data) {
      this._updateFilmData(data.id);
    }

    switch (updateType) {
      case UpdateType.PATCH:

        if (this._renderedFilms[data.id]) {
          this._renderedFilms[data.id].updateElement();
        }

        if (this._renderedTopRatedFilms[data.id]) {
          this._renderedTopRatedFilms[data.id].updateElement();
        }

        if (this._renderedMostCommentedFilms[data.id]) {
          this._renderedMostCommentedFilms[data.id].updateElement();
        }

        if (this._openedPopup) {
          this._openedPopup.updateElement();
        }
        const newUserRankComponent = new UserRankView(this._getFilms(true));
        replace(newUserRankComponent, this._userRankComponent);
        this._userRankComponent = newUserRankComponent;
        break;

      case UpdateType.MINOR:
        this._clearMovieSection({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderMainFilmsSection();
        break;

      case UpdateType.MAJOR:
        this._clearMovieSection();
        this._clearMostCommentedSection();
        this._clearTopRatedSection();
        this._renderMainFilmsSection();
        this._renderTopFilmsComponent(`comments`);
        this._renderTopFilmsComponent(`rating`);
        if (this._openedPopup) {
          this._openedPopup.updateElement();
          this._openedPopup.scrollToPopupBottom();
        }
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        remove(this._filmsCounterComponent);
        this._renderMovieSection();
    }
  }

  _renderFilmCardComponent(container, film) {

    this._renderedFilmsData[film.id] = film;
    const filmComponent = new FilmCardView(this._renderedFilmsData[film.id], this._commentsModel);

    const updateFilmData = () => {
      film = this._getFilms()[this._getFilms().findIndex((filmItem) => filmItem.id === film.id)];
      filmComponent.updateFilmData(film);
    };

    const handleAddToWatchlistClick = () => {
      this._handleViewAction(
          UserAction.UPDATE_FILM,
          UpdateType.PATCH,
          Object.assign(
              {},
              this._renderedFilmsData[film.id],
              {
                isInWatchlist: !this._renderedFilmsData[film.id].isInWatchlist
              }
          )
      );
    };

    const handleMarkAsWatchedClick = () => {
      this._handleViewAction(
          UserAction.UPDATE_FILM,
          UpdateType.PATCH,
          Object.assign(
              {},
              this._renderedFilmsData[film.id],
              {
                watchingDate: !this._renderedFilmsData[film.id].isWatched ? dayjs() : null,
                isWatched: !this._renderedFilmsData[film.id].isWatched
              }
          )
      );
    };

    const handleAddToFavoriteClick = () => {
      this._handleViewAction(
          UserAction.UPDATE_FILM,
          UpdateType.PATCH,
          Object.assign(
              {},
              this._renderedFilmsData[film.id],
              {
                isFavorite: !this._renderedFilmsData[film.id].isFavorite
              }
          )
      );
    };

    const popupOpenHandler = () => {

      const popupCloseHandler = () => {
        this._page.classList.remove(`hide-overflow`);
        this._openedPopup.removeCtrlEnterPressHandler();
        this._openedPopup.removeEscPressHandler();
        remove(this._openedPopup);
        this._openedPopup = ``;
        updateFilmData();
      };

      if (this._openedPopup) {
        popupCloseHandler();
      }
      this._api.getComments(film.id)
        .then((comments) => {
          this._commentsModel.setComments(film.id, comments);
          this._page.classList.add(`hide-overflow`);
          this._openedPopup = new PopupView(this._renderedFilmsData[film.id], this._commentsModel);
          renderElement(this._page, this._openedPopup, RenderPosition.BEFOREEND);

          const handleCommentDelete = (commentId) => {
            this._handleViewAction(
                UserAction.DELETE_COMMENT,
                UpdateType.MAJOR,
                commentId,
                film.id
            );
          };

          const handleCommentSubmit = () => {
            const newComment = this._openedPopup.getNewComment();
            if (newComment) {
              this._handleViewAction(
                  UserAction.ADD_COMMENT,
                  UpdateType.MAJOR,
                  newComment,
                  film.id
              );
            }
          };

          const handleEscKeyPress = (evt) => {
            if (evt.key === ESCAPE_KEY || evt.key === SHORT_ESCAPE_KEY) {
              evt.preventDefault();
              popupCloseHandler();
            }
          };

          this._openedPopup.setAddtoWatchlistClickHandler(handleAddToWatchlistClick);
          this._openedPopup.setMarkAsWatchedClickHandler(handleMarkAsWatchedClick);
          this._openedPopup.setAddToFavoriteClickHandler(handleAddToFavoriteClick);
          this._openedPopup.setDeleteCommentClickHandler(handleCommentDelete);
          this._openedPopup.setCloseButtonClickHandler(popupCloseHandler);
          this._openedPopup.setCtrlEnterPressHandler(handleCommentSubmit);
          this._openedPopup.setEscPressHandler(handleEscKeyPress);
        });
    };

    filmComponent.setAddtoWatchlistClickHandler(handleAddToWatchlistClick);
    filmComponent.setMarkAsWatchedClickHandler(handleMarkAsWatchedClick);
    filmComponent.setAddToFavoriteClickHandler(handleAddToFavoriteClick);
    filmComponent.setPopupOpenHandlers(popupOpenHandler);

    renderElement(container, filmComponent, RenderPosition.BEFOREEND);

    if (container === this._filmsListContainer) {
      this._renderedFilms[film.id] = filmComponent;
    } else if (container === this._topRatedFilmsContainer) {
      this._renderedTopRatedFilms[film.id] = filmComponent;
    } else if (container === this._mostCommentedFilmsContainer) {
      this._renderedMostCommentedFilms[film.id] = filmComponent;
    }
  }

  _renderFilms(films) {
    films.forEach((film) => this._renderFilmCardComponent(this._filmsListContainer, film));
  }

  _renderTopFilmsComponent(topType) {
    let topFilmsContainer;
    let randomFilms = [];
    switch (topType) {
      case SortType.RATING:
        if (verifyEqualRating(this._getFilms(true))) {
          randomFilms = getRandomFilms(this._getFilms(true), EXTRA_FILMS_AMOUNT);
        }
        topFilmsContainer = this._topRatedFilmsContainer;
        break;
      case SortType.COMMENTS:
        if (verifyEqualCommentsAmount(this._getFilms(true))) {
          randomFilms = getRandomFilms(this._getFilms(true), EXTRA_FILMS_AMOUNT);
        }
        topFilmsContainer = this._mostCommentedFilmsContainer;
        break;
    }

    if (randomFilms.length !== 0) {
      for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
        this._renderFilmCardComponent(topFilmsContainer, randomFilms[i]);
      }
      return;
    }

    for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
      this._renderFilmCardComponent(topFilmsContainer, this._getFilms(true, topType)[i]);
    }
  }

  _handleShowMoreButtonClick() {
    const filmsCount = this._getFilms().length;
    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_AMOUNT_PER_STEP);
    const films = this._getFilms().slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(films);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButtonComponent() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    renderElement(this._filmsListContainer, this._showMoreButtonComponent, RenderPosition.AFTEREND);
  }

  _renderFilmsSectionComponent() {
    renderElement(this._mainContainer, this._filmsSectionComponent, RenderPosition.BEFOREEND);

    const filmsListsContainers = this._filmsSectionComponent.getElement().querySelectorAll(`.films-list__container`);
    const [filmsListContainer, topRatedFilmsContainer, mostCommentedFilmsContainer] = filmsListsContainers;

    this._filmsListContainer = filmsListContainer;
    this._topRatedFilmsContainer = topRatedFilmsContainer;
    this._mostCommentedFilmsContainer = mostCommentedFilmsContainer;
  }

  _renderUserComponent(films) {
    this._userRankComponent = new UserRankView(films);
    renderElement(this._headerContainer, this._userRankComponent, RenderPosition.BEFOREEND);
  }

  _renderNoFilmsTextComponent() {
    renderElement(this._mainContainer, this._noFilmsTextComponent, RenderPosition.BEFOREEND);
  }

  _renderLoadingComponent() {
    renderElement(this._mainContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsCounterComponent() {
    renderElement(this._footerContainer, this._filmsCounterComponent, RenderPosition.BEFOREEND);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearMovieSection();
    this._renderMainFilmsSection();
  }

  _renderSortComponent() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    renderElement(this._filmsSectionComponent, this._sortComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderFilmsListComponent(isAdding = false) {
    if (isAdding) {
      if (this._getFilms().length - this._renderedFilmsCount === 1) {
        if (this._getFilms().length % FILMS_AMOUNT_PER_STEP === 1) {
          this._renderFilms(this._getFilms().slice(0, Math.min(this._getFilms().length, this._renderedFilmsCount)));
          this._renderShowMoreButtonComponent();
          return;
        }
        this._renderFilms(this._getFilms());
        this._renderedFilmsCount += 1;
      } else {
        this._renderFilms(this._getFilms().slice(0, Math.min(this._getFilms().length, this._renderedFilmsCount)));

        if (this._getFilms().length > this._renderedFilmsCount) {
          this._renderShowMoreButtonComponent();
        }
      }
    } else {
      this._renderFilms(this._getFilms().slice(0, Math.min(this._getFilms().length, this._renderedFilmsCount)));

      if (this._getFilms().length > this._renderedFilmsCount) {
        this._renderShowMoreButtonComponent();
      }
    }
  }

  _renderMainFilmsSection(isAdding = false) {
    this._renderSortComponent();
    this._renderFilmsListComponent(isAdding);
  }

  _clearMovieSection({resetRenderedFilmsCount = true, resetSortType = false} = {}) {
    const filmsCount = this._getFilms().length;

    Object.values(this._renderedFilms).forEach((film) => remove(film));
    this._renderedFilms = {};

    remove(this._sortComponent);
    remove(this._noFilmsTextComponent);
    remove(this._showMoreButtonComponent);

    this._renderedFilmsCount = resetRenderedFilmsCount ? FILMS_AMOUNT_PER_STEP : Math.min(filmsCount, this._renderedFilmsCount);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _clearMostCommentedSection() {
    Array.from(this._mostCommentedFilmsContainer.children).forEach((child) => {
      child.remove();
    });
  }

  _clearTopRatedSection() {
    Array.from(this._topRatedFilmsContainer.children).forEach((child) => {
      child.remove();
    });
  }

  _renderMovieSection() {
    if (this._isLoading) {
      this._renderLoadingComponent();
      this._renderFilmsCounterComponent();
      return;
    }

    if (this._getFilms(true).length === 0) {
      this._renderNoFilmsTextComponent();
      return;
    }

    remove(this._userRankComponent);
    this._renderUserComponent(this._filmsModel.getFilms(true));

    this._renderFilmsSectionComponent();

    this._renderMainFilmsSection();

    this._renderTopFilmsComponent(`rating`);
    this._renderTopFilmsComponent(`comments`);

    remove(this._filmsCounterComponent);
    this._filmsCounterComponent = new FilmsCounterView(this._filmsModel.getFilms(true).length);
    this._renderFilmsCounterComponent();
  }
}
