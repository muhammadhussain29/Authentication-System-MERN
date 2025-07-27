import userModel from "../model/userModel.js";

// return user details
export const getDetails = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.json({ success: false, msg: "Authentication required. Please log in." });
  }
  try {
    const user = await userModel.findById(user_id);
    if (!user) {
      return res.json({ success: false, msg: "User not found." });
    }

    return res.json({
      success: true,
      userData: {
        name: user.name,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, msg: error.message });
  }
};
