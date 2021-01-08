import MovieListPresenter from "./presenter/movie-list.js";
import UserRankView from "./view/user-rank.js";
import SiteMenuView from "./view/site-menu.js";
import FilmsCounterView from "./view/films-counter.js";
import {RenderPosition, renderElement} from "./utils/render.js";
import {generateFilmsList} from "./mock/film.js";
import {generateFilter} from "./mock/filter.js";
import {generateUser} from "./mock/user.js";

const films = generateFilmsList();
const filters = generateFilter(films);
const user = generateUser(films);

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

const movieListPresenter = new MovieListPresenter(siteBodyElement, siteMainElement);

if (films.length > 0) {
  renderElement(siteHeaderElement, new UserRankView(user), RenderPosition.BEFOREEND);
}
renderElement(siteMainElement, new SiteMenuView(filters), RenderPosition.BEFOREEND);

movieListPresenter.init(films);

renderElement(siteFooterElement, new FilmsCounterView(films.length), RenderPosition.BEFOREEND);
