import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Signup() {
    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [favColor, setFavColor] = useState("");
    const [accountType, setAccountType] = useState("private");
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/register/', { username, name, email, password, favColor, accountType })
            .then(result => {
                console.log(result);
                navigate('/login');
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.message) {
                    setErrorMessage(error.response.data.message); // Set error message state
                } else {
                    console.error("Error occurred during registration:", error);
                    setErrorMessage("An error occurred during registration. Please try again later."); // Set generic error message
                }
            });
    }

    const messageBoxStyle = {
        backgroundColor: '#FFCCCC',
        color: '#CC0000',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px'
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-#673147 vh-100" style={{ backgroundColor: "#7EBFB3" }}>
            <div className="bg-white p-4 rounded w-25">
                <h2 className="align-items-center d-flex justify-content-center" style={{ color: "#194759" }}>Register</h2>
                {errorMessage && (
                    <div style={messageBoxStyle}>{errorMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="username">
                            <strong style={{ color: "#194759" }}>Username</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            autoComplete="off"
                            name="username"
                            className="form-control rounded-0"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name">
                            <strong style={{ color: "#194759" }}>Name</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter name"
                            autoComplete="off"
                            name="name"
                            className="form-control rounded-0"
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">
                            <strong style={{ color: "#194759" }}>Email</strong>
                        </label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            autoComplete="off"
                            name="email"
                            className="form-control rounded-0"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password">
                            <strong style={{ color: "#194759" }}>Password</strong>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            className="form-control rounded-0"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="favColor">
                            <strong style={{ color: "#194759" }}>Your favourite color?</strong>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your favourite color"
                            name="favColor"
                            className="form-control rounded-0"
                            onChange={(e) => setFavColor(e.target.value)}
                        />
                        <p className="bg-light" style={{ color: 'grey' }}>
                            Can be used if you forget the password.
                        </p>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="accountType">
                            <strong style={{ color: "#194759" }}>Account Type</strong>
                        </label>
                        <select
                            className="form-select rounded-0"
                            onChange={(e) => setAccountType(e.target.value)}
                            value={accountType}
                        >
                            <option value="private">Private</option>
                            <option value="public">Public</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-30" style={{ backgroundColor: "#194759", color: 'white' }}>Register</button>
                </form>
                <Link to="/login" className="bg-light rounded-60 text-decoration-none" style={{ color: 'grey' }}>Already have an account? Login here!</Link>
            </div>
        </div>
    );
}

export default Signup;

