import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

function ProfileView({ userId }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Get logged-in user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userData && userData._id) {
            setLoggedInUser(userData);
        }
    }, []);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileResponse = await axios.get(`http://localhost:3001/profile/${userId}`);
                const userProfile = profileResponse.data;
                setUserData(userProfile);
                setIsFollowing(userProfile.followers.includes(loggedInUser?._id));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, loggedInUser]);

    const handleFollow = async () => {
        try {
            if (userData.accountType === 'private') {
                await axios.post(`http://localhost:3001/follow-request/${userId}`, {
                    followerId: loggedInUser._id,
                    username: loggedInUser.username
                });
                setIsFollowing(true);
            } else {
                await axios.post(`http://localhost:3001/follow/${userId}`, { loggedInUserId: loggedInUser._id });

                setUserData(prevUserData => ({
                    ...prevUserData,
                    followers: [...prevUserData.followers, loggedInUser._id]
                }));

            }

        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await axios.post(`http://localhost:3001/unfollow/${userId}`, { loggedInUserId: loggedInUser._id });
            setIsFollowing(false);
            setUserData(prevUserData => ({
                ...prevUserData,
                followers: prevUserData.followers.filter(id => id !== loggedInUser._id)
            }));
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    const handleCloseProfile = () => {
        navigate('/home', { replace: true });

            // Trigger a refresh of the public posts data
            window.location.reload();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User not found.</div>;
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Profile View</h2>
                <IconButton onClick={handleCloseProfile}>
                    <CloseIcon /> {/* Close icon */}
                </IconButton>
            </div>
            <div>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
                <p>Followers: {userData.followers.length}</p>
                <p>Following: {userData.following.length}</p>
                <p>{loggedInUser._id}</p>
                <p>abcd{userData.accountType}</p>
                {loggedInUser._id !== userId && (
                    <div>
                        {isFollowing ? (
                            <button onClick={handleUnfollow}>Unfollow</button>
                        ) : (
                            <button onClick={handleFollow}>Follow</button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileView;
