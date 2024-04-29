import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';



function FollowRequestsPage() {
    const [followRequests, setFollowRequests] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);


    useEffect(() => {
        // Get logged-in user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (userData && userData._id) {
            setLoggedInUser(userData);
        }
    }, []);

    useEffect(() => {
        // Get logged-in user data from localStorage
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData && userData._id) {
            setLoggedInUser(userData);
            fetchFollowRequests(userData._id); // Fetch follow requests for the logged-in user
        }
    }, []);

    const fetchFollowRequests = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:3001/follow-requests/${userId}`);
            setFollowRequests(response.data);
        } catch (error) {
            console.error('Error fetching follow requests:', error);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:3001/accept-follow-request/${requestId}`,{ loggedInUserId: loggedInUser._id });
            // Remove the accepted request from the list
            setFollowRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error accepting follow request:', error);
        }
    };

    const handleCancelRequest = async (requestId) => {
        try {
            await axios.post(`http://localhost:3001/cancel-follow-request/${requestId}`);
            // Remove the canceled request from the list
            setFollowRequests(prevRequests => prevRequests.filter(request => request._id !== requestId));
        } catch (error) {
            console.error('Error canceling follow request:', error);
        }
    };

    return (
        <div>
            <h2>Follow Requests</h2>
            {followRequests.length === 0 ? (
                <p>No pending follow requests.</p>
            ) : (
                <ul>
                    {followRequests.map(request => (
                        <li key={request._id}>
                            <p>{request.username} wants to follow you.</p>
                            <Button variant="contained" color="primary" onClick={() => handleAcceptRequest(request._id)}>
                                Accept
                            </Button>
                            <Button variant="contained" color="secondary" onClick={() => handleCancelRequest(request._id)}>
                                Cancel
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FollowRequestsPage;
