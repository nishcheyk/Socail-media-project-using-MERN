const express = require("express")
const mongoose= require('mongoose')
const cors = require("cors")
const UserModel= require('./models/Employee')
const PostModel = require('./models/Post');

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://localhost/Register");

app.post("/Login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.status(401).json({ success: false, message: "No record existed for this email address." }); // Change marked here
            } else {
                if (user.password === password) {
                    res.status(200).json({ success: true, message: "Login successful", user: user }); // Change marked here
                } else {
                    res.status(401).json({ success: false, message: "Incorrect password." });
                }
            }
        })
        .catch(err => {
            console.error("Error during login:", err);
            res.status(500).json({ success: false, message: "Internal server error" }); // Change marked here
        });
});


app.post("/register", (req, res) => {
    const { username, email } = req.body;

    // Check if the username is already taken
    UserModel.findOne({ username: username })
        .then(existingUsername => {
            if (existingUsername) {
                return res.status(400).json({ message: "Username is already taken. Please choose a different username." });
            }

            // Check if the email is already taken
            UserModel.findOne({ email: email })
                .then(existingEmail => {
                    if (existingEmail) {
                        return res.status(400).json({ message: "Email is already registered. Please use a different email address." });
                    }


                    UserModel.create(req.body)
                        .then(newUser => res.json(newUser))
                        .catch(err => res.status(500).json({ message: "Error occurred while creating the user.", error: err }));
                })
                .catch(err => res.status(500).json({ message: "Error occurred while checking email availability.", error: err }));
        })
        .catch(err => res.status(500).json({ message: "Error occurred while checking username availability.", error: err }));
});


app.post("/ForgetPassword", (req, res) => {
    const { email, favColor, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (!user) {
                res.json("No record existed for this email address.");
            } else {
                if (user.favColor === favColor) {
                    user.password = password; // Change the password
                    user.save()
                        .then(() => {
                            res.json("Password changed successfully.");
                        })
                        .catch(err => {
                            res.status(500).json("Error occurred while changing new password.");
                        });
                } else {
                    return res.status(400).json({ message: "Favorite color does not match." });
                }
            }
        })
        .catch(err => {
            res.status(500).json("Error occurred while finding user.");
        });
});

app.post("/posts", async (req, res) => {
    try {
        const { title, content, userId } = req.body;

        // Retrieve user data from the database to get userName and accountType
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Create a new post
        const newPost = new PostModel({
            title,
            content,
            userId,
            userName: user.name, // Save the user's name along with the post
            accountType: user.accountType // Save the user's account type along with the post
        });

        // Save the post to the database
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Error creating post" });
    }
});
//posts for a specific user

app.get("/p", async (req, res) => {
    try {
        // Extract the username from the query parameters
        const username = req.query.username;

        // Retrieve posts for the specified user from the database
        const posts = await PostModel.find({ userName: username });

        // Respond with the retrieved posts
        res.status(200).json(posts);
    } catch (error) {
        // Handle errors
        console.error("Error fetching user posts:", error);
        res.status(500).json({ message: "Error fetching user posts" });
    }
});

app.get("/public", async (req, res) => {
    try {
        // Retrieve all posts with account type 'public' from the database
        const posts = await PostModel.find({ accountType: 'public' });

        // Respond with the retrieved posts
        res.status(200).json(posts);
    } catch (error) {
        // Handle errors
        console.error("Error fetching public posts:", error);
        res.status(500).json({ message: "Error fetching public posts" });
    }
});


//profile display
app.get("/profile/:userId", async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const userId = req.params.userId;

        // Retrieve the user's profile data from the database
        const user = await UserModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Respond with the user's profile data
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//search
// In your backend index.js or routes file

app.get("/search", async (req, res) => {
    try {
        const query = req.query.q; // Get the search query from the request parameters

        // Perform search query based on the received query parameter
        // This could involve querying your database or any other data source
        // For example, you can search for users by username or any other criteria
        const searchResults = await UserModel.find({ username: { $regex: query, $options: 'i' } });

        // Return the search results as JSON response
        res.status(200).json(searchResults);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Error searching users" });
    }
});



// Follow a user
app.post("/follow/:userId", async (req, res) => {
    const { userId } = req.params;
    const { followerId } = req.body;

    try {
        // Find the user to follow
        const userToFollow = await UserModel.findById(userId);
        if (!userToFollow) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the follower
        const follower = await UserModel.findById(followerId);
        if (!follower) {
            return res.status(404).json({ message: "Follower not found" });
        }

        // Check if the follower is already following the user
        if (follower.following.includes(userId)) {
            return res.status(400).json({ message: "User already followed" });
        }

        // Update the follower's following list and the user's followers list
        follower.following.push(userId);
        userToFollow.followers.push(followerId);

        // Save changes to the database
        await Promise.all([follower.save(), userToFollow.save()]);

        res.status(200).json({ message: "User followed successfully" });
    } catch (error) {
        console.error("Error following user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Unfollow a user
app.post("/unfollow/:userId", async (req, res) => {
    const { userId } = req.params;
    const { followerId } = req.body;

    try {
        // Find the user to unfollow
        const userToUnfollow = await UserModel.findById(userId);
        if (!userToUnfollow) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find the follower
        const follower = await UserModel.findById(followerId);
        if (!follower) {
            return res.status(404).json({ message: "Follower not found" });
        }

        // Check if the follower is already not following the user
        const followingIndex = follower.following.indexOf(userId);
        if (followingIndex === -1) {
            return res.status(400).json({ message: "User not followed" });
        }

        // Remove the user from the follower's following list and the follower from the user's followers list
        follower.following.splice(followingIndex, 1);
        const followerIndex = userToUnfollow.followers.indexOf(followerId);
        userToUnfollow.followers.splice(followerIndex, 1);

        // Save changes to the database
        await Promise.all([follower.save(), userToUnfollow.save()]);

        res.status(200).json({ message: "User unfollowed successfully" });
    } catch (error) {
        console.error("Error unfollowing user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


app.listen(3001,()=>{
    console.log("server is running")
})