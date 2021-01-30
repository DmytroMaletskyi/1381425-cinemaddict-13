import Observer from "../utils/observer.js";
import dayjs from "dayjs";

export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = {};
  }

  setComments(filmId, comments) {
    this._comments[filmId] = comments;
  }

  getComments() {
    return this._comments;
  }

  getFilmComments(filmId) {
    return this._comments[filmId];
  }

  addComment(updateType, filmId, update) {
    this._comments[filmId] = [
      ...this._comments[filmId],
      update
    ];

    this._notify(updateType, update, filmId);
  }

  deleteComment(updateType, filmId, commentId) {
    const index = this._comments[filmId].findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error(`Can't delete unexisting comment`);
    }

    this._comments[filmId] = [
      ...this._comments[filmId].slice(0, index),
      ...this._comments[filmId].slice(index + 1)
    ];

    this._notify(updateType, commentId, filmId);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          text: comment.comment,
          date: dayjs(comment.date)
        }
    );

    delete adaptedComment.comment;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          "comment": comment.text,
          "date": dayjs(comment.date).toISOString()
        }
    );

    delete adaptedComment.text;

    return adaptedComment;
  }
}
