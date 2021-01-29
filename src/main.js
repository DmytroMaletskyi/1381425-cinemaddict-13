import MovieListPresenter from "./presenter/movie-list.js";
import FilterPresenter from "./presenter/filter.js";
import UserRankView from "./view/user-rank.js";
import FilmsCounterView from "./view/films-counter.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";
import {RenderPosition, renderElement} from "./utils/render.js";
import {generateFilmsList} from "./mock/film.js";
import {generateUser} from "./mock/user.js";

const films = generateFilmsList();
const user = generateUser(films);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filtersModel = new FilterModel();

filmsModel.setFilms(films);

filmsModel.getFilms().forEach((film) => {
  commentsModel.setComments(film.id, film.comments);
});

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);
const siteFooterElement = siteBodyElement.querySelector(`.footer`);

const movieListPresenter = new MovieListPresenter(siteBodyElement, siteMainElement, filmsModel, commentsModel, filtersModel);
const filterPresenter = new FilterPresenter(siteMainElement, filtersModel, filmsModel);

if (films.length > 0) {
  renderElement(siteHeaderElement, new UserRankView(user), RenderPosition.BEFOREEND);
}

filterPresenter.init();
movieListPresenter.init();

renderElement(siteFooterElement, new FilmsCounterView(films.length), RenderPosition.BEFOREEND);
