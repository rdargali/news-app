function checkAuthorization(req, res, next) {
  if (req.session) {
    if (req.session.user) {
      next();
    } else {
      res.redirect("/login");
    }
  } else {
    console.log("middelware");
    console.log(req.session);
    res.redirect("/login");
  }
}

module.exports = checkAuthorization;
