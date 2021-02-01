import SmartView from "./smart.js";
import {defineRank, getWatchedFilms} from "../utils/statistic.js";

const createUserRankTemplate = (films) => {
  const watchedFilms = getWatchedFilms(films);
  const userRank = defineRank(watchedFilms.length);

  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView extends SmartView {
  constructor(films) {
    super();
    this._data = films;
  }

  getTemplate() {
    return createUserRankTemplate(this._data);
  }
}
