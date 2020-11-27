import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

export const copyFilmsArray = (filmsArray) => {
  const copiedArray = JSON.parse(JSON.stringify(filmsArray));
  for (let film of copiedArray) {
    film.releaseDate = dayjs(film.releaseDate);
    film.duration = dayjs.extend(duration).duration(film.duration);
  }
  return copiedArray;
};
