import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserPosts() {
    const [userPosts, setUserPosts] = useState([]);
    const userName = JSON.parse(localStorage.getItem('userData')).userName;

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/p?username=${userName}`);
                setUserPosts(response.data);
                console.info('done')
            } catch (error) {
                console.error('Error fetching user posts:', error);
            }
        };

        fetchUserPosts();
    }, [userName]);

    return (
        <div className="user-posts">
            <h2>Your Posts</h2>
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
