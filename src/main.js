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

const renderFilmsSection = () => {
  renderElement(siteMainElement, new FilmsSectionView().getElement(), RenderPosition.BEFOREEND);

  const filmsSectionElement = document.querySelector(`.films`);
  const filmsListsContainers = filmsSectionElement.querySelectorAll(`.films-list__container`);
  const [filmsListContainer, topRatedFilmsContainer, mostCommentedFilmsContainer] = filmsListsContainers;

  for (let i = 0; i < Math.min(notDisplayedFilms.length, FILMS_AMOUNT_PER_STEP); i++) {
    renderElement(filmsListContainer, new FilmCardView(notDisplayedFilms.shift()).getElement(), RenderPosition.BEFOREEND);
  }

  if (notDisplayedFilms.length > 0) {
    const ShowMoreButtonComponent = new ShowMoreButtonView();

    renderElement(filmsListContainer, ShowMoreButtonComponent.getElement(), RenderPosition.AFTEREND);

    ShowMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();
      if (notDisplayedFilms.length > FILMS_AMOUNT_PER_STEP) {
        for (let i = 0; i < FILMS_AMOUNT_PER_STEP; i++) {
          renderElement(filmsListContainer, new FilmCardView(notDisplayedFilms.shift()).getElement(), RenderPosition.BEFOREEND);
        }
      } else {
        const filmsAmount = notDisplayedFilms.length;
        for (let i = 0; i < filmsAmount; i++) {
          renderElement(filmsListContainer, new FilmCardView(notDisplayedFilms.shift()).getElement(), RenderPosition.BEFOREEND);
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
    renderElement(topRatedFilmsContainer, new FilmCardView(filmsSortedByRating[i]).getElement(), RenderPosition.BEFOREEND);
  }

  const filmsSortedByComments = sortFilmsBy(`comments`, films);
  for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
    renderElement(mostCommentedFilmsContainer, new FilmCardView(filmsSortedByComments[i]).getElement(), RenderPosition.BEFOREEND);
  }
};

renderHeader();
// renderElement(siteMainElement, new StatsSectionView(user).getElement(), RenderPosition.BEFOREEND);
renderElement(siteMainElement, new SortView().getElement(), RenderPosition.BEFOREEND);

renderFilmsSection();

renderElement(siteFooterElement, new FilmsCounterView(films.length).getElement(), RenderPosition.BEFOREEND);

// siteBodyElement.classList.add(`hide-overflow`);
// renderElement(siteBodyElement, new PopupView(films[0]).getElement(), RenderPosition.BEFOREEND);
