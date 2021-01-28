import {FilterType} from "../const.js";

export const filter = {
  [FilterType.ALL]: (films) => {
    return films;
  },
  [FilterType.WATCHLIST]: (films) => {
    return films.filter((film) => film.isInWatchlist);
  },
  [FilterType.HISTORY]: (films) => {
    return films.filter((film) => film.isWatched);
  },
  [FilterType.FAVORITES]: (films) => {
    return films.filter((film) => film.isFavorite);
  }
};
