import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

const countWatchedFilmsDuration = (films) => {
  return films.filter((film) => film.isInWatchlist).reduce((totalDuration, film) => totalDuration.add(film.duration), dayjs.extend(duration).duration(0, `minute`));
};

const defineRank = (watchedFilmsAmount) => {
  if (watchedFilmsAmount > 0 && watchedFilmsAmount <= 10) {
    return `Novice`;
  } else if (watchedFilmsAmount > 10 && watchedFilmsAmount <= 20) {
    return `Fan`;
  } else if (watchedFilmsAmount > 20) {
    return `Movie Buff`;
  }

  return ``;
};

const countFilmsByGenre = (watchedFilms) => {
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

const defineTopGenre = (filmsByGenre) => {
  let topGenre = ``;
  let topValue = `0`;
  for (let key of Object.keys(filmsByGenre)) {
    if (filmsByGenre[key] > topValue) {
      topValue = filmsByGenre[key];
      topGenre = key;
    }
  }
  return topGenre;
};

export const generateUser = (films) => {
  const watchedFilms = films.filter((film) => film.isWatched);
  const filmsByGenre = countFilmsByGenre(watchedFilms);

  return {
    avatar: `bitmap`,
    stats: {
      watchedFilms: watchedFilms.length,
      watchedFilmsInGenres: filmsByGenre,
      topGenre: defineTopGenre(filmsByGenre),
      rank: defineRank(watchedFilms.length),
      watchedFilmsDuration: countWatchedFilmsDuration(films).asMinutes(),
    }
  };
};
