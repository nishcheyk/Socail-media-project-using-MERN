// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ProfileView from '../Componets/ProfileView';

function ProfilePage({ userId, loggedInUserId }) {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profileResponse = await axios.get(`http://localhost:3001/profile/${userId}`);
                const userProfile = profileResponse.data;
                setUserData(userProfile);
                setIsFollowing(userProfile.followers.includes(loggedInUserId));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user profile:', error);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [userId]);

    const handleFollow = async () => {
        try {
            await axios.post(`http://localhost:3001/follow/${userId}`, { followerId: loggedInUserId });
            setIsFollowing(true);
            setUserData(prevUserData => ({
                ...prevUserData,
                followers: [...prevUserData.followers, loggedInUserId]
            }));
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await axios.post(`http://localhost:3001/unfollow/${userId}`, { followerId: loggedInUserId });
            setIsFollowing(false);
            setUserData(prevUserData => ({
                ...prevUserData,
                followers: prevUserData.followers.filter(id => id !== loggedInUserId)
            }));
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
            <h2>Profile View</h2>
            <ProfileView userData={userData} loggedInUserId={loggedInUserId} />
            {/* Render follow/unfollow button */}
            {loggedInUserId !== userId && (
                <div>
                    {isFollowing ? (
                        <button onClick={handleUnfollow}>Unfollow</button>
                    ) : (
                        <button onClick={handleFollow}>Follow</button>
                    )}
                </div>
            )}
            <Link to="/">Go back to Home</Link>
        </div>
    );
}

export default ProfilePage;
