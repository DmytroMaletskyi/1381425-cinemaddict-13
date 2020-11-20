import {createUserRankTemplate} from "./view/user-rank.js";
import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilmsSectionTemplate} from "./view/films-section.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFilmsCounterTemplate} from "./view/films-counter.js";

const FILMS_AMOUNT = 5;
const EXTRA_FILMS_AMOUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const siteFooterElement = document.querySelector(`.footer`);

render(siteHeaderElement, createUserRankTemplate(), `beforeend`);
render(siteMainElement, createSiteMenuTemplate(), `beforeend`);
render(siteMainElement, createFilmsSectionTemplate(), `beforeend`);

const filmsSectionElement = document.querySelector(`.films`);
const filmsListsContainers = filmsSectionElement.querySelectorAll(`.films-list__container`);
const [filmsListContainer, topRatedFilmsContainer, mostCommentedFilmsContainer] = filmsListsContainers;

for (let i = 0; i < FILMS_AMOUNT; i++) {
  render(filmsListContainer, createFilmCardTemplate(), `beforeend`);
}

render(filmsListContainer, createShowMoreButtonTemplate(), `afterend`);

for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
  render(topRatedFilmsContainer, createFilmCardTemplate(), `beforeend`);
}

for (let i = 0; i < EXTRA_FILMS_AMOUNT; i++) {
  render(mostCommentedFilmsContainer, createFilmCardTemplate(), `beforeend`);
}

render(siteFooterElement, createFilmsCounterTemplate(), `beforeend`);

