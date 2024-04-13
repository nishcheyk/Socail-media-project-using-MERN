import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileView({ userId, loggedInUserId }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Fetch user profile data
                const response = await axios.get(`http://localhost:3001/profile/${userId}`);
                setUserData(response.data);
                setLoading(false);

                // Check if logged-in user is following this user
                if (loggedInUserId) {
                    const followingResponse = await axios.get(`http://localhost:3001/following/${loggedInUserId}`);
                    const following = followingResponse.data;
                    setIsFollowing(following.includes(userId));
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId, loggedInUserId]);

    const handleFollow = async () => {
        try {
            await axios.post(`http://localhost:3001/follow/${userId}`, { followerId: loggedInUserId });
            setIsFollowing(true);
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await axios.post(`http://localhost:3001/unfollow/${userId}`, { followerId: loggedInUserId });
            setIsFollowing(false);
        } catch (error) {
            console.error('Error unfollowing user:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!userData) {
        return <div>User not found.</div>;
    }

    return (
        <div>
            <h1>Profile View</h1>
            <div>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
                {/* Add more profile information here */}
            </div>
            {userData.accountType === 'private' && (
                <div>
                    <p>This is a private account.</p>
                    {isFollowing ? (
                        <button onClick={handleUnfollow}>Unfollow</button>
                    ) : (
                        <button onClick={handleFollow}>Follow</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProfileView;
