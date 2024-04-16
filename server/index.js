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


app.get('/public/posts', async (req, res) => {
    try {
        const posts = await PostModel.find({ accountType: 'public' });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching public posts:', error);
        res.status(500).json({ message: 'Error fetching public posts' });
    }
});

// Post like/dislike
app.post('/posts/:postId/like', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.body.userId;

    try {
        // Find the post by ID
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        // Check if the user has already liked the post
        const index = post.likes.indexOf(userId);
        if (index !== -1) { // User already liked the post
            // Remove user from likes array and decrement likes count
            post.likes.splice(index, 1);
            post.likesCount -= 1;
        } else {
            // Add user to likes array and increment likes count
            post.likes.push(userId);
            post.likesCount += 1;
        }
        // Save the updated post
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Error liking/disliking post:', error);
        res.status(500).json({ message: 'Error liking/disliking post' });
    }
});

//disliked
//dislike
app.post('/posts/:postId/dislike', async (req, res) => {
    const postId = req.params.postId;
    const userId = req.body.userId;

    try {
        // Find the post by ID
        const post = await PostModel.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the user has already liked the post
        if (!post.likes.includes(userId)) {
            return res.status(400).json({ message: 'You have not liked this post yet' });
        }

        // Remove user from likes array and decrement likes count
        const index = post.likes.indexOf(userId);
        post.likes.splice(index, 1);
        post.likesCount -= 1;

        // Save the updated post
        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error('Error disliking post:', error);
        res.status(500).json({ message: 'Error disliking post' });
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


        const searchResults = await UserModel.find({ username: { $regex: query, $options: 'i' } });

        // Return the search results as JSON response
        res.status(200).json(searchResults);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ message: "Error searching users" });
    }
});


app.post('/follow/:userId', async (req, res) => {
    const { userId } = req.params;
    const { followerId } = req.body;

    try {
        // Update the follower's following list
        await UserModel.findByIdAndUpdate(followerId, { $addToSet: { following: userId } });

        // Update the user's followers list
        await UserModel.findByIdAndUpdate(userId, { $addToSet: { followers: followerId } });

        res.status(200).json({ message: 'User followed successfully.' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Unfollow route
app.post('/unfollow/:userId', async (req, res) => {
    const { userId } = req.params;
    const { followerId } = req.body;

    try {
        // Update the follower's following list
        await UserModel.findByIdAndUpdate(followerId, { $pull: { following: userId } });

        // Update the user's followers list
        await UserModel.findByIdAndUpdate(userId, { $pull: { followers: followerId } });

        res.status(200).json({ message: 'User unfollowed successfully.' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




//following post

app.get('/users/:userId/following', async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId).populate('following', '_id name');
        res.json(user.following);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch following users', error });
    }
});

app.get('/users/:userId/posts', async (req, res) => {
    try {
        const posts = await PostModel.find({ userId: req.params.userId });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user posts', error });
    }
});

app.listen(3001,()=>{
    console.log("server is running")
})