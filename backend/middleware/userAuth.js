import jwt from "jsonwebtoken";

const userAuth = async (request, response, next) => {
  const { token } = request.cookies;

  if (!token) {
    return response.json({
      success: true,
      message: "Token Not Found - User not authorized",
    });
  }

  try {
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    if (verifyToken.id) {
      request.userId = verifyToken.id;
    } else {
      return response.json({
        success: false,
        message: "Token Not Found - User not authorized",
      });
    }

    next();
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};

export default userAuth;
