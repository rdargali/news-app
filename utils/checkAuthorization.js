function checkAuthorization(req, res, next) {
  if (req.session) {
    if (req.session.user) {
      res.locals.authenticated = true;
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
