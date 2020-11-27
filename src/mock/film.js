import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {generateCommentsList} from "./comment.js";

const FILMS_NAMES = [`Made for each other`, `Popeye meets Sindbad`, `Sagebrush Trail`, `Santa Claus Conquers the Marthians`, `The Dance of Life`, `The Great Flamarion`, `The man with the golden arm`];
const POSTERS = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const NAMES = [`Ann`, `Bob`, `John`, `Jane`, `Gil`, `Max`, `Nick`, `Liam`, `Oliver`, `William`];
const SURNAMES = [`Black`, `White`, `Green`, `Smith`, `Stalone`, `Lee`, `McAdams`, `Pitt`, `Pickles`];
const COUNTRIES = [`USA`, `Canada`, `Great Britain`, `Russia`, `China`, `Ukraine`];
const GENRES = [`Horror`, `Comedy`, `Action`, `Detective`, `Drama`];
const DESCRIPTIONS = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`.split(`.`);
const ACTORS_MAX = 5;
const GENRES_MAX = 3;
const FILMS_MAX = 20;

const random = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElement = (elementsList) => {
  return elementsList[randomInt(elementsList.length - 1)];
};

const generateActorsList = (actorsAmount = randomInt(1, ACTORS_MAX)) => {
  const actorsList = [];
  for (let i = 0; i < actorsAmount; i++) {
    actorsList.push(`${getRandomElement(NAMES)} ${getRandomElement(SURNAMES)}`);
  }
  return actorsList;
};

const generateGenresList = (genresAmount = randomInt(1, GENRES_MAX)) => {
  const genresList = [];
  for (let i = 0; i < genresAmount; i++) {
    genresList.push(getRandomElement(GENRES));
  }
  return genresList;
};

const generateDescription = (sentecesAmount = randomInt(1, 5)) => {
  let description = ``;
  for (let i = 0; i < sentecesAmount; i++) {
    description = `${description}${getRandomElement(DESCRIPTIONS)}`;
  }
  return description;
};

const generateReleaseDate = () => {
  const yearsGap = random(50);
  const daysGap = randomInt(360);
  return dayjs().subtract(yearsGap, `year`).subtract(daysGap, `day`);
};

const generateFilm = () => {
  const filmName = getRandomElement(FILMS_NAMES);
  return {
    name: filmName,
    originalName: filmName,
    poster: getRandomElement(POSTERS),
    rating: random(10).toFixed(1),
    director: `${getRandomElement(NAMES)} ${getRandomElement(SURNAMES)}`,
    screenwriters: generateActorsList(),
    actors: generateActorsList(),
    releaseDate: generateReleaseDate(),
    duration: dayjs.extend(duration).duration(randomInt(60, 300), `minute`),
    country: getRandomElement(COUNTRIES),
    genre: generateGenresList(),
    description: generateDescription(),
    comments: generateCommentsList(),
    ageRating: (randomInt(16, 21)),
    isInWatchlist: Boolean(randomInt(0, 1)),
    isWatched: Boolean(randomInt(0, 1)),
    isFavorite: Boolean(randomInt(0, 1))
  };
};

export const generateFilmsList = (filmsAmount = FILMS_MAX) => {
  const filmsList = [];
  for (let i = 0; i < filmsAmount; i++) {
    filmsList.push(generateFilm());
  }
  return filmsList;
};
