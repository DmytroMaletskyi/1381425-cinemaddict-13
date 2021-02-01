import SmartView from "./smart.js";
import {TimeRangeDuration, TimeRange} from "../const.js";
import {countWatchedFilmsDuration, defineRank, getWatchedFilms, filterWatchedFilmsInRange, countFilmsByGenre, defineTopGenre} from "../utils/statistic.js";
import dayjs from "dayjs";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

const BAR_HEIGHT = 50;

const renderWatchedFilmsChart = (filmCtx, watchedFilms) => {
  const genres = countFilmsByGenre(watchedFilms);
  const genreLabels = Object.keys(genres);
  filmCtx.height = BAR_HEIGHT * genreLabels.length;
  const genreValues = [];
  genreLabels.forEach((label) => {
    genreValues.push(genres[label]);
  });

  return new Chart(filmCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genreLabels,
      datasets: [{
        data: genreValues,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const createStatsSectionTemplate = (data) => {
  const watchedFilmsInRange = filterWatchedFilmsInRange(data);
  const watchedFilmsDuration = countWatchedFilmsDuration(watchedFilmsInRange);
  const filmsByGenre = countFilmsByGenre(watchedFilmsInRange);
  const topGenre = defineTopGenre(filmsByGenre);
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${defineRank(data.watchedFilms.length)}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${data.currentRange === TimeRange.ALL ? `checked` : ``}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${data.currentRange === TimeRange.TODAY ? `checked` : ``}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${data.currentRange === TimeRange.WEEK ? `checked` : ``}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${data.currentRange === TimeRange.MONTH ? `checked` : ``}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${data.currentRange === TimeRange.YEAR ? `checked` : ``}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsInRange.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${Math.floor(watchedFilmsDuration / 60) } <span class="statistic__item-description">h</span> ${watchedFilmsDuration % 60} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatsSectionView extends SmartView {
  constructor(films) {
    super();

    this._data = {
      currentRange: TimeRange.ALL,
      watchedFilms: getWatchedFilms(films),
      dateFrom: TimeRangeDuration.ALL,
      dateTo: dayjs().toDate()
    };
    this._filmsChart = null;

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setStatRange();
    this._setCharts();
  }

  removeElement() {
    super.removeElement();

    if (this._filmsChart !== null) {
      this._filmsChart = null;
    }
  }

  getTemplate() {
    return createStatsSectionTemplate(this._data);
  }

  restoreHandlers() {
    this._setCharts();
    this._setStatRange();
  }

  _dateChangeHandler(evt) {
    let dateFrom;
    switch (evt.target.value) {
      case `all-time`:
        this._data.currentRange = TimeRange.ALL;
        dateFrom = TimeRangeDuration.ALL;
        break;
      case `today`:
        this._data.currentRange = TimeRange.TODAY;
        dateFrom = dayjs().subtract(TimeRangeDuration.TODAY, `day`);
        break;
      case `week`:
        this._data.currentRange = TimeRange.WEEK;
        dateFrom = dayjs().subtract(TimeRangeDuration.WEEK, `day`);
        break;
      case `month`:
        this._data.currentRange = TimeRange.MONTH;
        dateFrom = dayjs().subtract(TimeRangeDuration.MONTH, `day`);
        break;
      case `year`:
        this._data.currentRange = TimeRange.YEAR;
        dateFrom = dayjs().subtract(TimeRangeDuration.YEAR, `day`);
        break;
    }
    this.updateData({
      dateFrom
    });
  }

  _setStatRange() {
    this.getElement().querySelector(`.statistic__filters`).addEventListener(`change`, this._dateChangeHandler);
  }

  _setCharts() {
    if (this._filmsChart !== null) {
      this._filmsChart = null;
    }

    const watchedFilmsInRange = filterWatchedFilmsInRange(this._data);
    const filmCtx = this.getElement().querySelector(`.statistic__chart`);

    this._filmsChart = renderWatchedFilmsChart(filmCtx, watchedFilmsInRange);
  }
}
