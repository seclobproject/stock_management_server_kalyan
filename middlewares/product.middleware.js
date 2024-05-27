export function productValidator(req, res, next) {
  if (req.body) {
    let { name, price, productCode, category } = req.body;

    if (!name) {
      res.status(400).send({ message: "product name is required" });
      return;
    }
    if (!productCode) {
      res.status(400).send({ message: "product code is required" });
      return;
    }
    if (!category) {
      res.status(400).send({ message: "category is required" });
      return;
    }
    // if (!franchise) {
    //   res.send({ message: "franchise is required" });
    //   return;
    // }
    // if(!quantity){
    //    res.send({ message: "quantity is required" });
    //    return;
    // }

    if (!price) {
      res.status(400).send({ message: "price is required" });
      return;
    }
  }
  next();
}
