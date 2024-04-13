import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserPosts() {
    const [userPosts, setUserPosts] = useState([]);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                // Fetch all public posts
                const response = await axios.get('http://localhost:3001/public');
                setUserPosts(response.data);

            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, []);

    return (
        <div className="user-posts">
            <h2>Public Posts</h2>
            {userPosts.map(post => (
                <div key={post._id} className="post">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <p>Posted by: {post.userName}</p> {/* Display the username */}
                </div>
            ))}
        </div>
    );
}

export default UserPosts;
