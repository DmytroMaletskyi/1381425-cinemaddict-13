import AbstractView from "./abstract.js";

const createUserRankTemplate = (user) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${user.stats.rank}</p>
    <img class="profile__avatar" src="images/${user.avatar}@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRankView extends AbstractView {
  constructor(user) {
    super();
    this._user = user;
  }

  getTemplate() {
    return createUserRankTemplate(this._user);
  }
}
