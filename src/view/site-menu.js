import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  return (
    `<a
    href="#${type}"
    class="main-navigation__item
    ${type === currentFilterType ? `main-navigation__item--active` : ``}"
    data-filter-type="${type}" data-menu-type="${MenuItem.FILMS}">
    ${name}
    ${type === `all` ? `` : `<span class="main-navigation__item-count" data-filter-type="${type}" data-menu-type="${MenuItem.FILMS}">${count}</span>`}
    </a>`
  );
};

const createSiteMenuTemplate = (filters, currentFilterType, currentMenuItem) => {
  currentFilterType = currentMenuItem === MenuItem.FILMS ? currentFilterType : ``;
  const filterItemsTemplate = filters
  .map((filter) => createFilterItemTemplate(filter, currentFilterType))
  .join(``);

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional ${currentMenuItem === MenuItem.STATISTICS ? `main-navigation__additional--active` : ``}" data-menu-type="${MenuItem.STATISTICS}">Stats</a>
  </nav>`;
};

export default class SiteMenuView extends AbstractView {
  constructor(filters, currentFilterType, currentMenuItem) {
    super();
    this._filters = filters;
    this._currentMenuItem = currentMenuItem;
    this._currentFilter = currentFilterType;

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilter, this._currentMenuItem);
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName === `A` || evt.target.tagName === `SPAN`) {
      this._callback.menuClick(evt.target.dataset.menuType, evt.target.dataset.filterType);
    }
  }

  setMenuClickHandler(menuClickCallback, filterTypeChangeCallback) {
    this._callback.menuClick = menuClickCallback;
    this._callback.filterTypeChange = filterTypeChangeCallback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }
}
