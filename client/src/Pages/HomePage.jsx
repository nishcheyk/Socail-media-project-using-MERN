import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

import FiSearch from '@mui/icons-material/Search';
import FiLogOut from '@mui/icons-material/Logout';
import FiAccountCircle from '@mui/icons-material/AccountCircle'; // Import the head icon

import PostCreationForm from '../components/PostCreationForm';
import FollowingPost from '../components/FollowingPost';
import PublicPost from '../components/PublicPostsComponet';
import ProfileView from '../components/ProfileView'; // Import the ProfileView component
import FollowRequests from '../components/FollowRequests'; // Import the FollowRequests component

import '../css/HomePage.css'; // Import the CSS file

function HomePage() {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query
    const [recommendations, setRecommendations] = useState([]); // State to hold search recommendations
    const [loggedInUser, setLoggedInUser] = useState(null); // State to hold details of logged-in user
    const [showProfileView, setShowProfileView] = useState(false); // State to toggle visibility of the profile view
    const [showProfileOptions, setShowProfileOptions] = useState(false); // State to toggle visibility of profile options

    useEffect(() => {
        // Get logged-in user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userData && userData._id) {
            setLoggedInUser(userData);
        }
    }, []);

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

        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const openProfileView = () => {
        setShowProfileView(true);
        // Close the profile options when profile view is opened
        setShowProfileOptions(false);
    };

    const toggleProfileOptions = () => {
        setShowProfileOptions(!showProfileOptions);
    };

    return (
        <div className=''>
            {/* Left side header section */}
            <header className="left-header">
                <div className="left-header-content">
                    {loggedInUser && (
                        <div className="user-details">
                            <p><strong>Name:</strong> {loggedInUser.name}</p>
                            <p><strong>Username:</strong> {loggedInUser.username}</p>
                            <p><strong>Username:</strong> {loggedInUser._id}</p>
                            {/* Add more details if needed */}
                        </div>
                    )}
                    <div className="searcar">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="search-button" onClick={handleSearch}><FiSearch /></button>
                        {/* Display search results */}
                        {searchResults.map(user => (
                            <div key={user._id} onClick={() => handleSelectUser(user)}>
                                <p>  {user.username}  </p>
                            </div>
                        ))}
                        {/* Display selected user's profile */}
                        {selectedUser && <ProfileView userId={selectedUser._id} />}
                    </div>
                    {/* Display follow requests */}

                    {loggedInUser && <FollowRequests loggedInUserId={loggedInUser._id} />}
                </div>
            </header>

            {/* Profile view */}
            {showProfileView && (
                <div className="profile-view">
                    <ProfileView userId={loggedInUser._id} />
                </div>
            )}

            {/* Main content section */}
            <div className="main-content">
                <div className="public-posts-panel">
                    {/* Component to display public posts */}
                    <PublicPost refresh={refresh} />
                </div>
                <div className="user-posts-panel">
                    {/* Component to display user's posts */}
                    <FollowingPost refresh={refresh} />
                </div>
                <div className="post-creation-panel">
                    {/* Component for creating new posts */}
                    <PostCreationForm onPostCreation={handlePostCreation} />
                    {/* Display search recommendations */}

                </div>
            </div>

            {/* Right side header section */}
            <header className="right-header">
                <div className="right-header-content">
                    {/* Button with head icon */}
                    <button className="head-button" onClick={toggleProfileOptions}><FiAccountCircle /></button>
                    {/* Profile options */}
                    {showProfileOptions && (
                        <div className="profile-options">
                            {/* Add profile options */}
                            <button onClick={openProfileView}>View Profile</button>
                            {/* Add more options if needed */}
                        </div>
                    )}
                </div>
                {/* Add other options if needed */}
                <div className="logout-container">
                    <button className="logout-button" onClick={handleLogout}><FiLogOut /></button>
                </div>
            </header>
        </div>
    );
}

export default HomePage;
