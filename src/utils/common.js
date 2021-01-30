import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {SortType} from "../const.js";

export const generateId = () => (Date.now() + parseInt(Math.random() * 10000, 10)).toString();

export const copyFilmsArray = (filmsArray) => {
  const copiedArray = JSON.parse(JSON.stringify(filmsArray));
  for (let film of copiedArray) {
    film.releaseDate = dayjs(film.releaseDate);
    film.duration = dayjs.extend(duration).duration(film.duration);
    for (let comment of film.comments) {
      comment.date = dayjs(comment.date);
    }
  }
  return copiedArray;
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
