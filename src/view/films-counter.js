import {createElement} from "../utils.js";

const createFilmsCounterTemplate = (filmsAmount) => {
  return `<section class="footer__statistics">
    <p>${filmsAmount} movies inside</p>
  </section>`;
};

export default class FilmsCounterView {
  constructor(filmsAmount) {
    this._filmsAmount = filmsAmount;

    this._element = null;
  }

  getTemplate() {
    return createFilmsCounterTemplate(this._filmsAmount);
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
