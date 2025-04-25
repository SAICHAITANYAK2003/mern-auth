import userModel from "../models/userModel.js";

//get user data
export const userDetails = async (request, response) => {
  try {
    const userId = request.userId;

    const user = await userModel.findById(userId);

    if (!user) {
      return response.json({ success: false, message: "User not found" });
    }

    response.send({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return response.json({ success: false, message: error.message });
  }
};
