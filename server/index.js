const express = require("express")
const mongoose= require('mongoose')
const cors = require("cors")

const UserModel= require('./models/Employee')
const PostModel = require('./models/Post');

const app = express()
app.use(express.json())
app.use(cors())



mongoose.connect("mongodb://localhost:27017/thapar-link");

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
app.post("/register", async (req, res) => {
    const { username, email } = req.body;

    try {
        // Check if the username is already taken
        const existingUsername = await UserModel.findOne({ username: username });
        if (existingUsername) {
            return res.status(400).json({ message: "Username is already taken. Please choose a different username." });
        }

        // Check if the email is already taken
        const existingEmail = await UserModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ message: "Email is already registered. Please use a different email address." });
        }

        // Create the new user
        const newUser = await UserModel.create(req.body);

        // Automatically follow the new user (self-follow)
        newUser.followers.push(newUser._id);
        newUser.followerNo += 1;
        await newUser.save();

        // Update the logged-in user's following list
        const loggedInUser = await UserModel.findById(newUser._id);
        if (loggedInUser) {
            loggedInUser.following.push(newUser._id);
            loggedInUser.followingNo += 1;
            await loggedInUser.save();
        }

        res.json({ message: "User created successfully.", newUser });
    } catch (error) {
        console.error("Error occurred while registering user:", error);
        res.status(500).json({ message: "Error occurred while registering user.", error: error });
    }
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

//fOLLOW  REQUEST
app.post('/follow-request/:userId', async (req, res) => {
    const { userId } = req.params;
    const { followerId, username } = req.body;

    try {
        console.log('Received followerId:', followerId);

        // Check if userId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'Invalid user ID.' });
        }

        // If not exists, add the follow request
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                $addToSet: {
                    followRequests: {
                        userId: followerId, // Save followerId as ObjectId
                        username
                    }
                }
            },
            { new: true } // To return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.status(200).json({ message: 'Follow request sent successfully.' });
    } catch (error) {
        console.error('Error sending follow request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
//find follow request
app.get('/follow-requests/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await UserModel.findById(userId).populate('followRequests.userId', 'username');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followRequests = user.followRequests;
        res.status(200).json(followRequests);
    } catch (error) {
        console.error('Error fetching follow requests:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST endpoint to cancel a follow request
app.post('/cancel-follow-request/:requestId', async (req, res) => {
    const requestId = req.params.requestId;

    try {
        // Find the logged-in user and remove the follow request
        const user = await UserModel.findOneAndUpdate(
            { 'followRequests._id': requestId },
            { $pull: { followRequests: { _id: requestId } } },
            { new: true }
        );

        res.status(200).json({ message: 'Follow request canceled successfully' });
    } catch (error) {
        console.error('Error canceling follow request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

//accept a follow request
app.post('/accept-follow-request/:requestId', async (req, res) => {
    const requestId = req.params.requestId;

    try {
        // Retrieve the logged-in user's ID from the request body
        const loggedInUserId = req.body.loggedInUserId; // Assuming this is provided in the request body

        // Find the logged-in user in the database
        const loggedInUser = await UserModel.findById(loggedInUserId);
        console.log("loggedInUserId:", loggedInUserId);
        if (!loggedInUser) {
            return res.status(405).json({ message: 'Logged-in user not found.' });
        }

        // Find the follow request in the logged-in user's followRequests array
        const followRequestIndex = loggedInUser.followRequests.findIndex(request => request._id == requestId);
        if (followRequestIndex === -1) {
            return res.status(404).json({ message: 'Follow request not found.' });
        }

        // Get the user ID of the requester from the follow request
        const requesterUserId = loggedInUser.followRequests[followRequestIndex].userId;

        // Add the requester to the logged-in user's followers list
        loggedInUser.followers.push(requesterUserId);
        loggedInUser.followerNo += 1;

        // Remove the follow request from the logged-in user's followRequests array
        loggedInUser.followRequests.splice(followRequestIndex, 1);

        // Save the updated logged-in user in the database
        await loggedInUser.save();

        // Find the user who sent the follow request (requester) and add the logged-in user to their following list
        const requesterUser = await UserModel.findById(requesterUserId);
        if (!requesterUser) {
            return res.status(406).json({ message: 'Requester user not found.' });
        }

        // Add the logged-in user to the requester's following list
        requesterUser.following.push(loggedInUserId);
        requesterUser.followingNo += 1;

        // Save the updated requester user in the database
        await requesterUser.save();

        // Respond with a success message
        res.json({ message: 'Follow request accepted successfully.' });
    } catch (error) {
        console.error('Error accepting follow request:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});




//following a user
app.post("/follow/:userId", (req, res) => {
    const userId = req.params.userId;
    const loggedInUserId = req.body.loggedInUserId;
    console.log("loggedInUserId:", loggedInUserId);

    // Check whether the logged in user is
    // Check if the user exists
    UserModel.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            // Check if the logged-in user is already following the user
            if (user.followers.includes(loggedInUserId)) {
                return res.status(400).json({ message: "You are already following this user." });
            }

            // Add the logged-in user to the user's followers list
            user.followers.push(loggedInUserId);
            user.followerNo += 1;
            user.save();

            // Add the user to the logged-in user's following list
            UserModel.findById(loggedInUserId)
                .then(loggedInUser => {
                    loggedInUser.following.push(userId);
                    loggedInUser.followingNo += 1;
                    loggedInUser.save();
                    res.json({ message: "You are now following the user." });
                })
                .catch(err => res.status(500).json({ message: "Error occurred while updating following list.", error: err }));
        })
        .catch(err => res.status(500).json({ message: "Error occurred while following the user.", error: err }));
});

// Route for unfollowing a user
app.post("/unfollow/:userId", (req, res) => {
    const userId = req.params.userId;
    const loggedInUserId = req.body.loggedInUserId; // Assuming you pass the logged-in user's ID in the request body
    // Check if the user exists
    console.log("loggedInUserId:", loggedInUserId);
    console.log("nUserId:", userId);

    UserModel.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }

            // Check if the logged-in user is already following the user
            if (!user.followers.includes(loggedInUserId)) {
                return res.status(400).json({ message: "You are not following this user." });
            }

            // Remove the logged-in user from the user's followers list
            user.followers.pop(loggedInUserId);
            user.followerNo -= 1;
            user.save();

            // Remove the user from the logged-in user's following list


            UserModel.findById(loggedInUserId)
            .then(loggedInUser => {
                loggedInUser.following.pop(userId);
                loggedInUser.followingNo -= 1;
                loggedInUser.save();
                res.json({ message: "You are now following the user." });
            })
            .catch(err => res.status(500).json({ message: "Error occurred while updating following list.", error: err }));
    })

        .catch(err => res.status(500).json({ message: "Error occurred while unfollowing the user.", error: err }));
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