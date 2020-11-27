import {createUserRankTemplate} from "./view/user-rank.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createSortTemplate} from "./view/film-sort.js";
import {createStatsSectionTemplate} from "./view/stats-section.js";
import {createFilmsSectionTemplate} from "./view/films-section.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFilmsCounterTemplate} from "./view/films-counter.js";
import {generateFilmsList} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateUser} from "./mock/user.js";
import {createFilmsDetailsPopupTemplate} from "./view/film-details-popup.js";

const FILMS_AMOUNT = 5;
const EXTRA_FILMS_AMOUNT = 2;

const films = generateFilmsList();
const filters = generateFilter(films);
const user = generateUser(films);

console.log(user);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

render(siteHeaderElement, createUserRankTemplate(user), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(filters), `beforeend`);
render(siteMainElement, createStatsSectionTemplate(user), `beforeend`);
// render(siteMainElement, createSortTemplate(), `beforeend`);
// render(siteMainElement, createFilmsSectionTemplate(), `beforeend`);

// const filmsSectionElement = document.querySelector(`.films`);
// const filmsListsContainers = filmsSectionElement.querySelectorAll(`.films-list__container`);
// const [filmsListContainer, topRatedFilmsContainer, mostCommentedFilmsContainer] = filmsListsContainers;

// for (let i = 0; i < FILMS_AMOUNT; i++) {
//   render(filmsListContainer, createFilmCardTemplate(films[i]), `beforeend`);
// }

// render(filmsListContainer, createShowMoreButtonTemplate(), `afterend`);

// for (let i = FILMS_AMOUNT; i < FILMS_AMOUNT + EXTRA_FILMS_AMOUNT; i++) {
//   render(topRatedFilmsContainer, createFilmCardTemplate(films[i]), `beforeend`);
// }

// for (let i = FILMS_AMOUNT + EXTRA_FILMS_AMOUNT; i < FILMS_AMOUNT + 2 * EXTRA_FILMS_AMOUNT; i++) {
//   render(mostCommentedFilmsContainer, createFilmCardTemplate(films[i]), `beforeend`);
// }

render(siteFooterElement, createFilmsCounterTemplate(films.length), `beforeend`);

// siteBodyElement.classList.add(`hide-overflow`);
// render(siteBodyElement, createFilmsDetailsPopupTemplate(films[0]), `beforeend`);
