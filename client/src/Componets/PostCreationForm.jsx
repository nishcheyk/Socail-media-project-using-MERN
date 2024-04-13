import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostCreationForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Retrieve user data from localStorage
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (!userData || !userData._id || !userData.accountType) {
                throw new Error('User data not found or incomplete in localStorage');
            }

            // Send post data to the server
            const response = await axios.post('http://localhost:3001/posts', {
                title,
                content,
                userId: userData._id, // Pass the userId along with the post data
                userName: userData.name, // Pass the userName along with the post data
                accountType: userData.accountType // Pass the account type from user data
                // Add more fields if needed
            });
            console.log(userData.accountType);
            // Redirect to home page after successful post creation
            navigate('/home', { replace: true });

            // Trigger a refresh of the public posts data
            window.location.reload();
        } catch (error) {
            console.error('Error creating post:', error);
            // Handle error
        }
    };

    return (
        <div className="post-creation-form">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
}

export default PostCreationForm;
