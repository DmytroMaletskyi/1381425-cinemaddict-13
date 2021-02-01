import SiteMenuView from "../view/site-menu.js";
import StatSectionView from "../view/stats-section.js";
import {renderElement, RenderPosition, replace, remove} from "../utils/render.js";
import {filter} from "../utils/filter.js";
import {FilterType, FilterName, UpdateType, MenuItem} from "../const.js";

export default class Filter {
  constructor(mainContainer, filterModel, filmsModel, movieListPresenter) {
    this._mainContainer = mainContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._movieListPresenter = movieListPresenter;
    this._currentFilter = null;
    this._currentMenuItem = MenuItem.FILMS;

    this._menuComponent = null;
    this._statSectionComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleSiteMenuClick = this._handleSiteMenuClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const filters = this._getFilters();
    const prevFilterComponent = this._menuComponent;

    this._menuComponent = new SiteMenuView(filters, this._currentFilter, this._currentMenuItem);
    this._menuComponent.setMenuClickHandler(this._handleSiteMenuClick, this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      renderElement(this._mainContainer, this._menuComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._menuComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MINOR, filterType);
  }

  _handleSiteMenuClick(menuItem, filterType) {
    const resetScreen = this._currentMenuItem === menuItem ? false : true;
    this._currentMenuItem = menuItem;
    this.init();
    switch (menuItem) {
      case MenuItem.FILMS:
        this._handleFilterTypeChange(filterType);
        remove(this._statSectionComponent);
        if (resetScreen) {
          this._movieListPresenter.init();
        }
        break;
      case MenuItem.STATISTICS:
        this._prevFilterType = this._currentFilter;
        this._currentFilter = ``;
        this._movieListPresenter.destroy();
        this._statSectionComponent = new StatSectionView(this._filmsModel.getFilms());
        renderElement(this._mainContainer, this._statSectionComponent, RenderPosition.BEFOREEND);
        break;
    }
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return [
      {
        type: FilterType.ALL,
        name: FilterName.ALL,
        count: filter[FilterType.ALL](films).length
      },
      {
        type: FilterType.WATCHLIST,
        name: FilterName.WATCHLIST,
        count: filter[FilterType.WATCHLIST](films).length
      },
      {
        type: FilterType.HISTORY,
        name: FilterName.HISTORY,
        count: filter[FilterType.HISTORY](films).length
      },
      {
        type: FilterType.FAVORITES,
        name: FilterName.FAVORITES,
        count: filter[FilterType.FAVORITES](films).length
      }
    ];
  }
}
