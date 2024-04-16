const refresh = async (req, res) => {
  const { email, name } = req.user;
  res.json({
    name,
    email,
  });
};

export default refresh;
