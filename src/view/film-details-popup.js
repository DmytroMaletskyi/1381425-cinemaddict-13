import SmartView from "./smart.js";
import {createElement} from "../utils/render.js";
import dayjs from "dayjs";
import he from "he";

const ENTER_KEY_CODE = 13;

const renderGenres = (genres) => {
  let genresList = ``;
  for (const genre of genres) {
    genresList = `${genresList}<span class="film-details__genre">${he.encode(genre)}</span>`;
  }
  return genresList;
};

const renderDeleteButton = (comment, isDeleting, disabledId) => {
  const disabled = isDeleting && comment.id === disabledId ? `disabled` : ``;
  const deleteText = isDeleting && comment.id === disabledId ? `Deleting...` : `Delete`;
  return `<button class="film-details__comment-delete" data-comment-id="${he.encode(comment.id)}" ${disabled}>${deleteText}</button>`;
};

const renderComments = (comments, isDisabled = false, disabledId = ``) => {
  let commentsList = ``;
  for (const comment of comments) {
    commentsList = `${commentsList}
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${he.encode(comment.emotion)}.png" width="55" height="55" alt="${he.encode(comment.emotion)}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.text)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${he.encode(comment.author)}</span>
          <span class="film-details__comment-day">${he.encode(comment.date.format(`YYYY/M/D H:m`))}</span>
          ${renderDeleteButton(comment, isDisabled, disabledId)}
        </p>
      </div>
    </li>`;
  }
  return commentsList;
};

const createFilmsDetailsPopupTemplate = (film, comments, disabledId = ``) => {
  const disableForm = film.isSubmitting ? `disabled` : ``;
  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${he.encode(film.poster)}" alt="">

            <p class="film-details__age">${he.encode(film.ageRating.toString())}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${he.encode(film.name)}</h3>
                <p class="film-details__title-original">Original: ${he.encode(film.originalName)}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${he.encode(film.rating.toString())}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${he.encode(film.director)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${he.encode(film.screenwriters.join(`, `))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${he.encode(film.actors.join(`, `))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${he.encode(film.releaseDate.format(`DD MMMM YYYY`))}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${he.encode(film.duration.$d.hours.toString())}h ${he.encode(film.duration.$d.minutes.toString())}m</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${he.encode(film.country)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">${film.genre.length === 1 ? `Genre` : `Genres`}</td>
                <td class="film-details__cell">
                  ${renderGenres(film.genre)}
              </tr>
            </table>

            <p class="film-details__film-description">
              ${he.encode(film.description)};
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${film.isInWatchlist ? `checked` : ``}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${film.isWatched ? `checked` : ``}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${film.isFavorite ? `checked` : ``}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${renderComments(comments, film.isDeleting, disabledId)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label"></div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${disableForm}></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${disableForm}>
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${disableForm}>
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${disableForm}>
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${disableForm}>
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class PopupView extends SmartView {
  constructor(film, commentsModel) {
    super();

    this._data = film;
    this._commentsModel = commentsModel;
    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._addToWatchlistHandler = this._addToWatchlistHandler.bind(this);
    this._markAsWatchedHandler = this._markAsWatchedHandler.bind(this);
    this._addToFavoriteHandler = this._addToFavoriteHandler.bind(this);
    this._ctrlEnterKeyPressHandler = this._ctrlEnterKeyPressHandler.bind(this);
    this._escKeyPressHandler = this._escKeyPressHandler.bind(this);
    this._emojiClickHandler = this._emojiClickHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmsDetailsPopupTemplate(this._data, this._commentsModel.getFilmComments(this._data.id), this._deleteCommentId);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseButtonClickHandler(this._callback.clickCloseButton);
  }

  _setInnerHandlers() {
    this.getElement().querySelector(`.film-details__emoji-list`).addEventListener(`click`, this._emojiClickHandler);
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._addToWatchlistHandler);
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._markAsWatchedHandler);
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._addToFavoriteHandler);
    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((button) => button.addEventListener(`click`, this._deleteButtonClickHandler));
  }

  updateFilmData(newData) {
    this._data = newData;
  }

  _emojiClickHandler(evt) {
    if (evt.target.type !== `radio`) {
      return;
    }

    const emojiContainer = this.getElement().querySelector(`.film-details__add-emoji-label`);
    this._emoji = evt.target.value;
    emojiContainer.innerHTML = ``;
    const emojiImage = createElement(`<img src="./images/emoji/${this._emoji}.png" width="55" height="55" alt="${this._emoji}">`);
    emojiContainer.appendChild(emojiImage);
  }

  scrollToPopupBottom() {
    this.getElement().scroll(0, this.getElement().offsetHeight);
  }

  getNewComment() {
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);

    if (this._emoji && commentInput.value !== ``) {
      const newComment = {
        text: he.encode(commentInput.value),
        emotion: this._emoji,
        date: dayjs()
      };

      this._emoji = ``;
      return newComment;
    }
    return ``;
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._deleteCommentId = evt.target.dataset.commentId;
    this._callback.clickDeleteCommentButton(evt.target.dataset.commentId);
    this._deleteCommentId = ``;
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.clickDeleteCommentButton = callback;

    this.getElement().querySelectorAll(`.film-details__comment-delete`).forEach((button) => button.addEventListener(`click`, this._deleteButtonClickHandler));
  }

  _ctrlEnterKeyPressHandler(evt) {
    if (evt.ctrlKey && evt.keyCode === ENTER_KEY_CODE) {
      evt.preventDefault();
      this._callback.pressCtrlEnterKey(this._data);
    }
  }

  setCtrlEnterPressHandler(callback) {
    this._callback.pressCtrlEnterKey = callback;

    document.addEventListener(`keydown`, this._ctrlEnterKeyPressHandler);
  }

  removeCtrlEnterPressHandler() {
    document.removeEventListener(`keydown`, this._ctrlEnterKeyPressHandler);
  }

  _escKeyPressHandler(evt) {
    this._callback.pressEscKey(evt);
  }

  setEscPressHandler(callback) {
    this._callback.pressEscKey = callback;

    document.addEventListener(`keydown`, this._escKeyPressHandler);
  }

  removeEscPressHandler() {
    document.removeEventListener(`keydown`, this._escKeyPressHandler);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();

    this._callback.clickCloseButton();
  }

  setCloseButtonClickHandler(callback) {
    this._callback.clickCloseButton = callback;

    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, this._closeButtonClickHandler);
  }

  _addToWatchlistHandler() {
    this._callback.addToWatchList();
  }

  setAddtoWatchlistClickHandler(callback) {
    this._callback.addToWatchList = callback;

    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._addToWatchlistHandler);
  }

  _markAsWatchedHandler() {
    this._callback.markAsWatched();
  }

  setMarkAsWatchedClickHandler(callback) {
    this._callback.markAsWatched = callback;

    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._markAsWatchedHandler);
  }

  _addToFavoriteHandler() {
    this._callback.addToFavorite();
  }

  setAddToFavoriteClickHandler(callback) {
    this._callback.addToFavorite = callback;

    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._addToFavoriteHandler);
  }
}
