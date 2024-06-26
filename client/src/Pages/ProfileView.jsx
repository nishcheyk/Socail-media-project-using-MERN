import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileView({ userId, loggedInUserId }) {
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
            if (userData.accountType === 'private') {
                // If account type is private, send follow request
                await axios.post(`http://localhost:3001/follow-request/${userId}`, { followerId: loggedInUserId ,username:lo});
            } else {
                // If account type is not private, directly follow
                await axios.post(`http://localhost:3001/follow/${userId}`, { followerId: loggedInUserId });
                setUserData(prevUserData => ({
                    ...prevUserData,
                    followers: [...prevUserData.followers, loggedInUserId]
                }));
            }
            setIsFollowing(true); // Update UI
        } catch (error) {
            console.error('Error following user:', error);
        }
    };

    const handleUnfollow = async () => {
        try {
            await axios.post(`http://localhost:3001/unfollow/${userId}`, { followerId: loggedInUserId })
            .then(response => {
                console.log(response.data); // Handle the response
            })
            .catch(error => {
                console.error('Error unfollowing user:', error); // Handle errors
            });
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
            <h2>Profile Viw</h2>
            <div>
                <p>Name: {userData.name}</p>
                <p>Email: {userData.email}</p>
                <p>Followers: {userData.followers.length}</p>
            <p>Following: {userData.following.length}</p>
            <p> abcd: { userData.accountType}</p>
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
            </div>
        </div>
    );
}

export default ProfileView;
