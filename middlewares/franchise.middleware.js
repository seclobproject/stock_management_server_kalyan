export function franchiseValidator(req, res, next) {
  if (req.body) {
    let { franchiseName } = req.body;

    if (!franchiseName) {
      res.send({ message: "franchise name is required" });
      return;
    }
  }
  next();
}
