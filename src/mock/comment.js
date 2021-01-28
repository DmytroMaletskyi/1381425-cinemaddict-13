import dayjs from "dayjs";
import {generateId} from "../utils/common.js";

const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];
const AUTHOR_NAMES = [`Ann`, `Bob`, `John`, `Jane`, `Gil`, `Max`, `Nick`, `Liam`, `Oliver`, `William`];
const AUTHOR_SURNAMES = [`Black`, `White`, `Green`, `Smith`, `Stalone`, `Lee`, `McAdams`, `Pitt`, `Pickles`];
const COMMENTS_TEXTS = [`Awesome`, `Best film ever`, `Good actors play`, `Disgusting`, `The worst film I've ever seen`, `I want to forget it to watch it one more time`, `Boooring`, `Don't watch it!`];
const COMMENTS_MAX = 5;

const randomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

const getRandomElement = (elementsList) => {
  return elementsList[randomInt(elementsList.length - 1)];
};

const generateCommentDate = () => {
  const daysGap = randomInt(1000);
  const hoursGap = randomInt(24);
  const minutesGap = randomInt(60);
  return dayjs().subtract(daysGap, `day`).subtract(hoursGap, `hour`).subtract(minutesGap, `minute`);
};

const generateComment = () => {
  return {
    id: generateId(),
    text: getRandomElement(COMMENTS_TEXTS),
    emotion: getRandomElement(EMOTIONS),
    author: `${getRandomElement(AUTHOR_NAMES)} ${getRandomElement(AUTHOR_SURNAMES)}`,
    date: generateCommentDate()
  };
};

export const generateCommentsList = (commentsAmount = randomInt(COMMENTS_MAX)) => {
  const commentsList = [];
  for (let i = 0; i < commentsAmount; i++) {
    commentsList.push(generateComment());
  }
  return commentsList;
};
