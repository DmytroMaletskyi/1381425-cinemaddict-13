const filmToFilterMap = {
  all: (films) => {
    return films.length;
  },
  watchlist: (films) => {
    return films.filter((film) => film.isInWatchlist).length;
  },
  history: (films) => {
    return films.filter((film) => film.isWatched).length;
  },
  favorite: (films) => {
    return films.filter((film) => film.isFavorite).length;
  }
};

export const generateFilter = (films) => {
  return Object.fromEntries(Object.entries(filmToFilterMap).map(([filterName, countFilms]) => {
    return [
      filterName, countFilms(films)
    ];
  }));
};
