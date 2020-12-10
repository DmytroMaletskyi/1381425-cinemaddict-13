import AbstractView from "./abstract.js";

const createFilmsCounterTemplate = (filmsAmount) => {
  return `<section class="footer__statistics">
    <p>${filmsAmount} movies inside</p>
  </section>`;
};

export default class FilmsCounterView extends AbstractView {
  constructor(filmsAmount) {
    super();
    this._filmsAmount = filmsAmount;
  }

  getTemplate() {
    return createFilmsCounterTemplate(this._filmsAmount);
  }
}
