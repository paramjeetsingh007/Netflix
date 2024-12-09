import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Update the Mongoose connection to use promises
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/myLoginRegisterDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process with failure
  }
};
connectDB();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  videoProgress: {
    type: Number,
    default: 0, // Default to start from the beginning
  },
});


const User = mongoose.model("User", userSchema);

app.post("/save-progress", async (req, res) => {
  const { email, videoProgress } = req.body;

  try {
    await User.findOneAndUpdate(
      { email: email },
      { videoProgress: videoProgress }
    );
    res.send({ message: "Progress saved successfully" });
  } catch (err) {
    res.status(500).send({ message: "Internal server error", error: err });
  }
});


// Routes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      if (password === user.password) {
        res.send({ message: "Login Successful", user: user });
      } else {
        res.send({ message: "Password didn't match" });
      }
    } else {
      res.send({ message: "User not registered" });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error", error: err });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.send({ message: "User already registered" });
    } else {
      const user = new User({
        name,
        email,
        password,
      });
      await user.save();
      res.send({ message: "Successfully Registered, Please login now." });
    }
  } catch (err) {
    res.status(500).send({ message: "Internal server error", error: err });
  }
});

app.listen(9002, () => {
  console.log("BE started at port 9002");
});
