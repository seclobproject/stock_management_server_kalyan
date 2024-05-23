export function productValidator(req, res, next) {
  if (req.body) {
    let { name, price, productCode, category } = req.body;

    if (!name) {
      res.send({ message: "product name is required" });
      return;
    }
    if (!productCode) {
      res.send({ message: "product code is required" });
      return;
    }
    if (!category) {
      res.send({ message: "category is required" });
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
      res.send({ message: "price is required" });
      return;
    }
  }
  next();
}
