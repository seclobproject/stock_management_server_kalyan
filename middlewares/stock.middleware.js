export function stockValidator(req, res, next) {
  if (req.body) {
    let { product, quantity, franchise } = req.body;

    if (!product) {
      res.send({ message: "product is required" });
      return;
    }
    if (!franchise) {
      res.send({ message: "franchise is required" });
      return;
    }
    if (!quantity) {
      res.send({ message: "quantity is required" });
      return;
    }
  }
  next();
}
