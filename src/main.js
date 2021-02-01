import MovieListPresenter from "./presenter/movie-list.js";
import FilterPresenter from "./presenter/filter.js";
import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comments.js";
import FilterModel from "./model/filter.js";
import {UpdateType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic sDklfja3S342r3q2`;
const END_POINT = `https://13.ecmascript.pages.academy/cinemaddict/`;

const siteBodyElement = document.querySelector(`body`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

const api = new Api(END_POINT, AUTHORIZATION);

const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filtersModel = new FilterModel();

const movieListPresenter = new MovieListPresenter(siteBodyElement, siteMainElement, filmsModel, commentsModel, filtersModel, api);
const filterPresenter = new FilterPresenter(siteMainElement, filtersModel, filmsModel, movieListPresenter);
filterPresenter.init();
movieListPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.INIT, films);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });
