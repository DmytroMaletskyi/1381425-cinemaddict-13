export const createUserRankTemplate = (user) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${user.stats.rank}</p>
    <img class="profile__avatar" src="images/${user.avatar}@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
