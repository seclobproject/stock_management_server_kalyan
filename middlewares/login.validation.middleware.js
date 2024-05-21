export function loginValidator(req, res, next) {
  // check if the "user" collection is present in the request body
  if (req.body) {
    let { email, password } = req.body;
    if (!email) {
      res.send({ message: "email is required" });
      return;
    }
    if (!password) {
      res.send({ message: "password is required" });
      return;
    }
  }
  next();
}
