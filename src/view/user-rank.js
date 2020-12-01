import {createElement} from "../utils.js";

const createUserRankTemplate = (user) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${user.stats.rank}</p>
    <img class="profile__avatar" src="images/${user.avatar}@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView {
  constructor(user) {
    this._user = user;

    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate(this._user);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
