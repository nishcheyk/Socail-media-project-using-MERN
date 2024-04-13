import React, { useState } from 'react';
import axios from 'axios';

function EditProfileForm({ user, onClose }) {
    const [profilePicture, setProfilePicture] = useState(user.profilePicture || '');
    const [bio, setBio] = useState(user.bio || '');

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.value);
    };

    const handleBioChange = (e) => {
        setBio(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(`/updateUser/${user._id}`, {
                profilePicture,
                bio
            });
            console.log('User updated:', response.data);
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Profile Picture:
                <input type="text" value={profilePicture} onChange={handleProfilePictureChange} />
            </label>
            <label>
                Bio:
                <textarea value={bio} onChange={handleBioChange} />
            </label>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
        </form>
    );
}

export default EditProfileForm;
