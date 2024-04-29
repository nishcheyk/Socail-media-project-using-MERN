import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import '../css/PublicPostsComponent.css';

function FollowingPostsComponent() {
    const [followingPosts, setFollowingPosts] = useState([]);
    const userData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const fetchFollowingPosts = async () => {
            try {
                const followingResponse = await axios.get(`http://localhost:3001/users/${userData._id}/following`);
                const followingUsers = followingResponse.data;

                const postsPromises = followingUsers.map(async (user) => {
                    const userPostsResponse = await axios.get(`http://localhost:3001/users/${user._id}/posts`);
                    return userPostsResponse.data;
                });

                const postsArrays = await Promise.all(postsPromises);
                const mergedPosts = [].concat(...postsArrays);
                setFollowingPosts(mergedPosts);
            } catch (error) {
                console.error('Error fetching following posts:', error);
            }
        };

        fetchFollowingPosts();
    }, [userData._id]);

    const handleLike = async (postId) => {
        try {
            const updatedPosts = followingPosts.map(post => {
                if (post._id === postId) {
                    if (post.likes.includes(userData._id)) {
                        // User has already liked the post, perform dislike
                        axios.post(`http://localhost:3001/posts/${postId}/dislike`, { userId: userData._id });
                        return {
                            ...post,
                            likesCount: post.likesCount - 1,
                            likes: post.likes.filter(userId => userId !== userData._id)
                        };
                    } else {
                        // User hasn't liked the post, perform like
                        axios.post(`http://localhost:3001/posts/${postId}/like`, { userId: userData._id });
                        return {
                            ...post,
                            likesCount: post.likesCount + 1,
                            likes: [...post.likes, userData._id]
                        };
                    }
                }
                return post;
            });

            // Update the state with the modified posts array
            setFollowingPosts(updatedPosts);
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };

    return (
        <div className="following-posts">
            <h2>Following Posts</h2>
            {followingPosts.map(post => (
                <div key={post._id} className="post">
                    <div className="post-header">
                        <p className="post-username">Posted by: {post.userName}</p>
                        <p className="post-likes">Likes: {post.likesCount}</p>
                    </div>
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-content">{post.content}</p>
                    <div className="post-icons">
                        {post.likes.includes(userData._id) ? (
                            <ThumbDownIcon className="icon" onClick={() => handleLike(post._id)} />
                        ) : (
                            <ThumbUpIcon className="icon" onClick={() => handleLike(post._id)} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FollowingPostsComponent;
