const jwt = require("jsonwebtoken");
const secretKey = "your_secret_key";
const User = require("../../models/driver/index");
const bcrypt = require("bcrypt");

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email },
    secretKey,
    {
      // expiresIn: '1h',
    }
  );
};

// Route for user login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Password is valid, generate a JWT token
    const token = generateToken(user);
    const userID = user._id;
    const test = "deployed";
    res.json({ token, userID, test });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// Route for user login
exports.getEmail = async (req, res) => {
  const { email } = req.body;
  try {
    // Find the user in the database by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Email not found" });
    }
    res.json({ email });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "An error occurred during login" });
  }
};

// Route for user registration
exports.driver_register = async (req, res) => {
  const {
    name,
    surname,
    email,
    number,
    password,
    account_type,
    district,
    id_number,
    license_id,
    license_type,
  } = req.body;
  // Check if all required fields are present in the request body
  if (
    !name ||
    !email ||
    !number ||
    !surname ||
    !password ||
    !account_type ||
    !district ||
    !id_number ||
    !license_id ||
    !license_type
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if the user already exists in the database
    const existingUser_email = await User.findOne({ email });
    const existingUser_number = await User.findOne({ number });

    if (existingUser_email) {
      return res
        .status(409)
        .json({ message: "This is email is already registered" });
    }

    if (existingUser_number) {
      return res
        .status(409)
        .json({ message: "This is number is already registered" });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      name,
      surname,
      email,
      number,
      password: hashedPassword,
      account_type,
      district,
      id_number,
      license_id,
      license_type,
    });

    // Save the user data to the database
    const savedUser = await newUser.save();

    // Generate a JWT token
    const token = generateToken(savedUser);

    res.json({ newUser });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "An error occurred during registration" });
  }
};
