import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import isBetween from "dayjs/plugin/isBetween";
import {TimeRangeDuration, Rank, RanksRate} from "../const.js";

dayjs.extend(isBetween);
dayjs.extend(duration);

export const countWatchedFilmsDuration = (films) => {
  const totalWatchedDuration = films.reduce((totalDuration, film) => totalDuration.add(film.duration), dayjs.duration(0, `minute`));
  return totalWatchedDuration.asMinutes();
};

export const defineRank = (watchedFilmsAmount) => {
  if (watchedFilmsAmount > RanksRate.NEWBIE && watchedFilmsAmount <= RanksRate.NOVICE) {
    return Rank.NOVICE;
  } else if (watchedFilmsAmount > RanksRate.NOVICE && watchedFilmsAmount <= RanksRate.FAN) {
    return Rank.FAN;
  } else if (watchedFilmsAmount > RanksRate.FAN) {
    return Rank.MOVIE_BUFF;
  }

  return ``;
};

export const getWatchedFilms = (films) => {
  return films.filter((film) => film.isWatched);
};

export const filterWatchedFilmsInRange = (data) => {
  if (data.dateFrom === TimeRangeDuration.ALL) {
    return data.watchedFilms;
  }

  return data.watchedFilms.filter((film) => {
    return film.watchingDate.isSame(data.dateFrom) || film.watchingDate.isBetween(data.dateFrom, data.dateTo) || film.watchingDate.isSame(data.dateTo);
  });
};

export const countFilmsByGenre = (watchedFilms) => {
  const genresStatistic = {};
  for (let film of watchedFilms) {
    for (let genre of film.genre) {
      if (genre in genresStatistic) {
        genresStatistic[genre] += 1;
      } else {
        genresStatistic[genre] = 1;
      }
    }
  }

  return genresStatistic;
};

export const defineTopGenre = (filmsByGenre) => {
  let topGenre = ``;
  let topValue = 0;
  for (let key of Object.keys(filmsByGenre)) {
    if (filmsByGenre[key] > topValue) {
      topValue = filmsByGenre[key];
      topGenre = key;
    }
  }
  return topGenre;
};
