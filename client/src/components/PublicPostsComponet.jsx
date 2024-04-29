import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import '../css/PublicPostsComponent.css';

function PublicPostsComponent() {
    const [userPosts, setUserPosts] = useState([]);
    const userData = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get('http://localhost:3001/public/posts');
                setUserPosts(response.data);
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, []);

    const handleLike = async (postId) => {
        try {
            const postIndex = userPosts.findIndex(post => post._id === postId);
            const updatedPosts = [...userPosts];

            // Check if the user has already liked the post
            if (updatedPosts[postIndex].likes.includes(userData._id)) {
                await axios.post(`http://localhost:3001/posts/${postId}/dislike`, { userId: userData._id });
                updatedPosts[postIndex].likesCount -= 1;
                updatedPosts[postIndex].likes = updatedPosts[postIndex].likes.filter(userId => userId !== userData._id);
            } else {
                await axios.post(`http://localhost:3001/posts/${postId}/like`, { userId: userData._id });
                updatedPosts[postIndex].likesCount += 1;
                updatedPosts[postIndex].likes.push(userData._id);
            }

            // Update the state after modifying the post
            setUserPosts(updatedPosts);
        } catch (error) {
            console.error('Error liking/disliking post:', error);
        }
    };

    return (
        <div className="public-posts">
            <h2>Public Posts</h2>
            {userPosts.map(post => (
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

export default PublicPostsComponent;
