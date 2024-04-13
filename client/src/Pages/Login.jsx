import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/login', { email, password })
            .then(result => {
                console.log(result);
                if (result.data.success) {
                    localStorage.setItem("isLoggedIn", true);
                    localStorage.setItem("userData", JSON.stringify(result.data.user));
                    navigate('/home');
                } else {
                    setErrorMessage(result.data.message);
                }
            })
            .catch(error => {
                console.error("Error during login:", error);
                setErrorMessage("An error occurred during login. Please try again.");
            });
    };

    const userData = JSON.parse(localStorage.getItem("userData"));

    const messageBoxStyle = {
        backgroundColor: '#FFCCCC',
        color: '#CC0000',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px'
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-#673147 vh-100"
            style={{ backgroundColor: "#7EBFB3" }}>
            <div className="bg-white p-4 rounded w-25">
                <h2 className="align-items-center d-flex justify-content-center" style={{ color: "#194759" }}>Login</h2>
                {errorMessage && (
                    <div style={messageBoxStyle}>{errorMessage}</div>
                )}
                <form onSubmit={handleSubmit}>
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
                        <label htmlFor="email">
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
                    <button type="Submit"
                        className="btn p-2 btn-success w-100 rounded-20"
                        style={{ backgroundColor: "#194759", color: 'white' }}>
                        Login
                    </button>
                </form>
                <Link to="/register"
                    className="bg-light rounded-60 text-decoration-none"
                    style={{ color: 'grey', display: 'block' }}>
                    Don't have an Account? Register Here
                </Link>
                <Link to="/ForgetPassword"
                    className="bg-light rounded-60 text-decoration-none"
                    style={{ color: 'grey' }}>
                    Forget your password?
                </Link>
            </div>
        </div>
    );
}

export default Login;
