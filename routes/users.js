const express = require("express");
const router = express.Router();

router.post("/update-article", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let articleId = req.body.articleId;

  db.none("UPDATE articles SET title = $1, body = $2 WHERE articleid = $3", [
    title,
    body,
    articleId,
  ]).then(() => {
    res.redirect("/users/articles");
  });
});

router.get("/articles/edit/:articleId", (req, res) => {
  let articleId = req.params.articleId;
  db.one("SELECT articleid,title,body FROM articles WHERE articleid =$1", [
    articleId,
  ]).then((article) => {
    res.render("edit-article", article);
  });
});

router.get("/articles", (req, res) => {
  userId = req.session.user.userId;

  db.any("SELECT articleid,title,body FROM articles WHERE userid = $1", [
    userId,
  ]).then((articles) => {
    res.render("articles", { articles: articles });
  });
});

router.post("/add-article", (req, res) => {
  let title = req.body.title;
  let body = req.body.body;
  let userId = req.session.user.userId;

  db.none("INSERT INTO articles(title,body,userid) VALUES($1,$2,$3)", [
    title,
    body,
    userId,
  ]).then(() => {
    res.redirect("/users/articles");
  });
});

router.get("/add-article", (req, res) => {
  res.render("add-article");
});

router.post("/delete-article", (req, res) => {
  let articleId = req.body.articleId;
  db.none("DELETE FROM articles WHERE articleid = $1", [articleId]).then(() => {
    res.redirect("/users/articles");
  });
});

module.exports = router;
