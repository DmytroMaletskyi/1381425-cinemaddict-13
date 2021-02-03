import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {SortType} from "../const.js";

export const copyFilmsArray = (films) => {
  const copiedFilms = JSON.parse(JSON.stringify(films));
  for (const film of copiedFilms) {
    film.releaseDate = dayjs(film.releaseDate);
    film.duration = dayjs.extend(duration).duration(film.duration);
    for (const comment of film.comments) {
      comment.date = dayjs(comment.date);
    }
  }
  return copiedFilms;
};

export const sortFilmsBy = (sortType = SortType.RATING, films) => {
  const copiedArray = copyFilmsArray(films);

  switch (sortType) {
    case SortType.RATING:
      copiedArray.sort((filmA, filmB) => filmB.rating - filmA.rating);
      break;
    case SortType.COMMENTS:
      copiedArray.sort((filmA, filmB) => filmB.comments.length - filmA.comments.length);
      break;
    case SortType.DATE:
      copiedArray.sort((filmA, filmB) => filmB.releaseDate - filmA.releaseDate);
      break;
  }

  return copiedArray;
};

export const sortFilmsByRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export const sortFilmsByDate = (filmA, filmB) => {
  return filmB.releaseDate - filmA.releaseDate;
};

export const sortFilmsByComments = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};

export const updateItem = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];
};

export const verifyEqualRating = (films) => {
  const firstFilmRating = films[0].rating;
  let isEqual = true;
  for (const film of films) {
    if (film.rating !== firstFilmRating) {
      isEqual = false;
      break;
    }
  }

  return isEqual;
};

export const verifyEqualCommentsAmount = (films) => {
  const firstFilmCommentsAmount = films[0].comments.length;
  let isEqual = true;
  for (const film of films) {
    if (film.comments.length !== firstFilmCommentsAmount) {
      isEqual = false;
      break;
    }
  }
  return isEqual;
};

export const getRandomFilms = (films, amount) => {
  const randomFilms = [];
  for (let i = 0; i < amount; i++) {
    randomFilms.push(films[Math.floor(Math.random() * films.length)]);
  }
  return randomFilms;
};
