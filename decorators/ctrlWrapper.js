const ctrlWrapper = (ctrl) => {
  const func = (req, res, next) => {
    try {
      ctrl(req, res, next);
    } catch (error) {
      next();
    }
  };
  return func;
};
export default ctrlWrapper;
