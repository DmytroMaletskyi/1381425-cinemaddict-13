import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export const RenderPosition = {
  AFTEREND: `afterend`,
  BEFOREEND: `beforeend`
};

export const renderElement = (container, element, place) => {
  container.insertAdjacentElement(place, element);
};

export const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const copyFilmsArray = (filmsArray) => {
  const copiedArray = JSON.parse(JSON.stringify(filmsArray));
  for (let film of copiedArray) {
    film.releaseDate = dayjs(film.releaseDate);
    film.duration = dayjs.extend(duration).duration(film.duration);
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
