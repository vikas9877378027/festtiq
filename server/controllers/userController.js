import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Register user
export const register = async (req, res) => {  
  try {
    const { name, email, phone, password } = req.body; 
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res
        .status(400)
        .json({ message: "Email already exists", success: false });
    }

    // Check if phone already exists
    const existingUserByPhone = await User.findOne({ phone });
    if (existingUserByPhone) {
      return res
        .status(400)
        .json({ message: "Phone number already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {       
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict", // Prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time (7 days)
    });
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist", success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Logged in successfull",
      success: true,
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check auth : /api/user/is-auth
export const isAuth = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// logout user: /api/user/logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all users (admin only): /api/user/list
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users, exclude password field
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error" 
    });
  }
};

// update user profile: /api/user/update-profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user; // From authUser middleware
    const { name, email, phone } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields"
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if email is being changed and if it already exists
    if (email !== user.email) {
      const existingUserByEmail = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUserByEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already exists"
        });
      }
    }

    // Check if phone is being changed and if it already exists
    if (phone !== user.phone) {
      const existingUserByPhone = await User.findOne({ phone, _id: { $ne: userId } });
      if (existingUserByPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already exists"
        });
      }
    }

    // Update user
    user.name = name;
    user.email = email;
    user.phone = phone;

    // Handle avatar upload if provided
    if (req.file) {
      // Create URL for the uploaded avatar
      const base = process.env.STATIC_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
      user.avatar = `${base}/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// get user favorites: /api/user/favorites
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).select("favorites");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      favorites: user.favorites || []
    });
  } catch (error) {
    console.error("Error in getFavorites:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// add to favorites: /api/user/favorites/add
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user;
    const { venueId } = req.body;

    if (!venueId) {
      return res.status(400).json({
        success: false,
        message: "Venue ID is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if already in favorites
    if (user.favorites.includes(venueId)) {
      return res.status(400).json({
        success: false,
        message: "Venue already in favorites"
      });
    }

    user.favorites.push(venueId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to favorites",
      favorites: user.favorites
    });
  } catch (error) {
    console.error("Error in addFavorite:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// remove from favorites: /api/user/favorites/remove
export const removeFavorite = async (req, res) => {
  try {
    const userId = req.user;
    const { venueId } = req.body;

    if (!venueId) {
      return res.status(400).json({
        success: false,
        message: "Venue ID is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.favorites = user.favorites.filter(id => id !== venueId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from favorites",
      favorites: user.favorites
    });
  } catch (error) {
    console.error("Error in removeFavorite:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// toggle favorite: /api/user/favorites/toggle
export const toggleFavorite = async (req, res) => {
  try {
    const userId = req.user;
    const { venueId } = req.body;

    if (!venueId) {
      return res.status(400).json({
        success: false,
        message: "Venue ID is required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const index = user.favorites.indexOf(venueId);
    let action;

    if (index > -1) {
      // Remove from favorites
      user.favorites.splice(index, 1);
      action = "removed";
    } else {
      // Add to favorites
      user.favorites.push(venueId);
      action = "added";
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Venue ${action} ${action === "added" ? "to" : "from"} favorites`,
      favorites: user.favorites,
      action
    });
  } catch (error) {
    console.error("Error in toggleFavorite:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// OAuth Login (Google, Facebook, Apple)
export const oauthLogin = async (req, res) => {
  try {
    const { name, email, uid, photoURL, provider } = req.body;

    if (!email || !uid || !provider) {
      return res.status(400).json({
        success: false,
        message: "Missing required OAuth data"
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user - hash the uid as password
      const hashedPassword = await bcrypt.hash(uid, 10);
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        phone: undefined, // Don't set phone for OAuth users
        password: hashedPassword, // Hash the OAuth UID
        oauthProvider: provider,
        oauthUid: uid,
        avatar: photoURL || ''
      });
    } else {
      // Update existing user with OAuth info if not already set
      if (!user.oauthProvider) {
        user.oauthProvider = provider;
        user.oauthUid = uid;
        if (photoURL) user.avatar = photoURL;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      message: "OAuth login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error("Error in oauthLogin:", error);
    res.status(500).json({
      success: false,
      message: "OAuth login failed"
    });
  }
};