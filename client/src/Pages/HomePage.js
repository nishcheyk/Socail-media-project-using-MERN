import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

import PostCreationForm from '../Componets/PostCreationForm';
import PostsDisplay from '../Componets/PostDisplayComponent';
import PublicPost from '../Componets/PublicPostsComponet';
import ProfileView from '../Componets/ProfileView'; // Import the ProfileView component

function HomePage() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
    const [recommendations, setRecommendations] = useState([]); // State to hold search recommendations

    useEffect(() => {
        // Refresh data when the refresh state changes
        // You can add more dependencies if needed
        if (refresh) {
            // Refresh data for PostsDisplay component
            // For example, you can fetch user's posts again here
            console.log('Refreshing data...');
        }
    }, [refresh]);

    const handleLogout = () => {
        // Set isLoggedIn to false and delete userData from localStorage
        localStorage.setItem("isLoggedIn", false);
        localStorage.removeItem("userData");
        // Redirect to login page
        navigate('/login');
    };

    const handlePostCreation = () => {
        // Set refresh to true to trigger data refresh
        setRefresh(true);
    };

    const handleSearch = async () => { // Function to handle search
        try {
            // Perform search query to the backend
            const response = await axios.get(`http://localhost:3001/search?q=${searchQuery}`);
            setSearchResults(response.data);

            // Fetch recommendations
            const recommendationsResponse = await axios.get(`http://localhost:3001/recommendations?q=${searchQuery}`);
            setRecommendations(recommendationsResponse.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#7EBFB3', color: 'white' }}>
            <div style={{ ...panelStyle, backgroundColor: '#194759' }}> {/* Color: "#194759" */}
                {/* Component to display public posts */}
                <PublicPost refresh={refresh} />
            </div>
            <div style={{ ...panelStyle, backgroundColor: '#194759' }}> {/* Color: "#7EBFB3" */}
                {/* Component to display user's posts */}
                <PostsDisplay refresh={refresh} />
            </div>
            <div style={panelStyle}>
                {/* Logout button */}
                <button style={{ ...logoutButtonStyle, backgroundColor: '#f44336' }} onClick={handleLogout}>Logout</button> {/* Color: "#f44336" */}
                {/* Component for creating new posts */}
                <PostCreationForm onPostCreation={handlePostCreation} />
                {/* Search bar */}
                <div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button style={{ backgroundColor: '#194759', color: '#ffffff', border: 'none', borderRadius: '5px', padding: '8px 16px', cursor: 'pointer' }} onClick={handleSearch}>Search</button> {/* Color: "#194759" */}
                </div>
                {/* Display search recommendations */}
                {recommendations.map((recommendation, index) => (
                    <div key={index}>
                        <p>{recommendation}</p>
                    </div>
                ))}
                {/* Display search results */}
                {searchResults.map(user => (
                    <div key={user._id} onClick={() => handleSelectUser(user)}>
                        <p>{user.username}</p>
                    </div>
                ))}
                {/* Display selected user's profile */}
                {selectedUser && <ProfileView userId={selectedUser._id} />}
            </div>
        </div>
    );
}

// Inline styles for panels
const panelStyle = {
    width: '30%',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    margin: '10px'
};

// Inline styles for logout button
const logoutButtonStyle = {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginBottom: '10px'
};

export default HomePage;
