import Observer from "../utils/observer.js";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  getFilm(filmId) {
    return this._films[this._films.findIndex((filmItem) => filmItem.id === filmId)];
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          name: film.film_info.title,
          originalName: film.film_info.alternative_title,
          poster: film.film_info.poster,
          rating: film.film_info.total_rating,
          director: film.film_info.director,
          screenwriters: film.film_info.writers,
          actors: film.film_info.actors,
          releaseDate: dayjs(film.film_info.release.date),
          duration: dayjs.extend(duration).duration(film.film_info.runtime, `minute`),
          country: film.film_info.release.release_country,
          genre: film.film_info.genre,
          description: film.film_info.description,
          ageRating: film.film_info.age_rating,
          isInWatchlist: film.user_details.watchlist,
          isWatched: film.user_details.already_watched,
          isFavorite: film.user_details.favorite,
          watchingDate: film.user_details.watching_date ? dayjs(film.user_details.watching_date) : null
        }
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.user_details;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const adaptedFilm = Object.assign(
        {},
        film,
        {
          "film_info": {
            "title": film.name,
            "alternative_title": film.originalName,
            "total_rating": film.rating,
            "poster": film.poster,
            "age_rating": film.ageRating,
            "director": film.director,
            "writers": film.screenwriters,
            "actors": film.actors,
            "release": {
              "date": dayjs(film.releaseDate).toISOString(),
              "release_country": film.country
            },
            "runtime": film.duration.asMinutes(),
            "genre": film.genre,
            "description": film.description,
          },
          "user_details": {
            "watchlist": film.isInWatchlist,
            "already_watched": film.isWatched,
            "watching_date": film.watchingDate ? dayjs(film.watchingDate).toISOString() : null,
            "favorite": film.isFavorite
          }
        }
    );

    delete adaptedFilm.name;
    delete adaptedFilm.originalName;
    delete adaptedFilm.poster;
    delete adaptedFilm.rating;
    delete adaptedFilm.director;
    delete adaptedFilm.screenwriters;
    delete adaptedFilm.actors;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.duration;
    delete adaptedFilm.country;
    delete adaptedFilm.genre;
    delete adaptedFilm.description;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.isInWatchlist;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.watchingDate;

    return adaptedFilm;
  }
}
