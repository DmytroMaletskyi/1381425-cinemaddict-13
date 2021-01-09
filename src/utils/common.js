import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

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

export const sortFilmsBy = (sortType = `rating`, films) => {
  const copiedArray = copyFilmsArray(films);

  switch (sortType.toLowerCase()) {
    case `rating`:
      copiedArray.sort((filmA, filmB) => filmB.rating - filmA.rating);
      break;
    case `comments`:
      copiedArray.sort((filmA, filmB) => filmB.comments.length - filmA.comments.length);
      break;
  }

  return copiedArray;
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
