import UserRankView from "./view/user-rank.js";
import SiteMenuView from "./view/site-menu.js";
import SortView from "./view/film-sort.js";
import StatsSectionView from "./view/stats-section.js";
import FilmsSectionView from "./view/films-section.js";
import FilmCardView from "./view/film-card.js";
import ShowMoreButtonView from "./view/show-more-button.js";
import FilmsCounterView from "./view/films-counter.js";
import {generateFilmsList} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateUser} from "./mock/user.js";
import PopupView from "./view/film-details-popup.js";
import {RenderPosition, renderElement, copyFilmsArray, sortFilmsBy} from "./utils.js";

const FILMS_AMOUNT_PER_STEP = 5;
const EXTRA_FILMS_AMOUNT = 2;

const films = generateFilmsList();
const notDisplayedFilms = copyFilmsArray(films);
const filters = generateFilter(films);
const user = generateUser(films);

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

const renderHeader = () => {
  renderElement(siteHeaderElement, new UserRankView(user).getElement(), RenderPosition.BEFOREEND);
  renderElement(siteMainElement, new SiteMenuView(filters).getElement(), RenderPosition.BEFOREEND);
};

const renderFilmCard = (filmsListContainer, film) => {
  const filmComponent = new FilmCardView(film);
  const popupComponent = new PopupView(film);

  const popupCloseHandler = () => {
    siteBodyElement.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, onEscKeyDown);
    popupComponent.getElement().remove();
    popupComponent.removeElement();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      popupCloseHandler();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const popupOpenHandler = () => {
    siteBodyElement.classList.add(`hide-overflow`);
    renderElement(siteBodyElement, popupComponent.getElement(), RenderPosition.BEFOREEND);

    popupComponent.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, popupCloseHandler);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  filmComponent.getElement().querySelector(`.film-card__title`).addEventListener(`click`, popupOpenHandler);
  filmComponent.getElement().querySelector(`.film-card__poster`).addEventListener(`click`, popupOpenHandler);
  filmComponent.getElement().querySelector(`.film-card__comments`).addEventListener(`click`, popupOpenHandler);

  renderElement(filmsListContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmsSection = () => {
  renderElement(siteMainElement, new FilmsSectionView().getElement(), RenderPosition.BEFOREEND);

  const filmsSectionElement = document.querySelector(`.films`);
  const filmsListsContainers = filmsSectionElement.querySelectorAll(`.films-list__container`);
  const [filmsListContainer, topRatedFilmsContainer, mostCommentedFilmsContainer] = filmsListsContainers;

  for (let i = 0; i < Math.min(notDisplayedFilms.length, FILMS_AMOUNT_PER_STEP); i++) {
    renderFilmCard(filmsListContainer, notDisplayedFilms.shift());
  }

  if (notDisplayedFilms.length > 0) {
    const ShowMoreButtonComponent = new ShowMoreButtonView();

    renderElement(filmsListContainer, ShowMoreButtonComponent.getElement(), RenderPosition.AFTEREND);

    ShowMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (notDisplayedFilms.length > FILMS_AMOUNT_PER_STEP) {
        for (let i = 0; i < FILMS_AMOUNT_PER_STEP; i++) {
          renderFilmCard(filmsListContainer, notDisplayedFilms.shift());
        }
      } else {
        const filmsAmount = notDisplayedFilms.length;
        for (let i = 0; i < filmsAmount; i++) {
          renderFilmCard(filmsListContainer, notDisplayedFilms.shift());
        }
      }

      if (notDisplayedFilms.length === 0) {
        ShowMoreButtonComponent.getElement().remove();
        ShowMoreButtonComponent.removeElement();
      }
    });
  }

  const filmsSortedByRating = sortFilmsBy(`rating`, films);
  for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
    renderFilmCard(topRatedFilmsContainer, filmsSortedByRating[i]);
  }

  const filmsSortedByComments = sortFilmsBy(`comments`, films);
  for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
    renderFilmCard(mostCommentedFilmsContainer, filmsSortedByComments[i]);
  }
};

renderHeader();
// renderElement(siteMainElement, new StatsSectionView(user).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

renderFilmsSection();

renderElement(siteFooterElement, new FilmsCounterView(films.length).getElement(), RenderPosition.BEFOREEND);
