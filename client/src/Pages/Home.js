import { useState, useEffect} from "react";
import { Link ,useNavigate} from "react-router-dom";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn")); // Initialize isLoggedIn state with local storage value

  const navigate =useNavigate()


  const handleLogout = () => {
    // Set isLoggedIn to false and remove from local storage
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
    // Redirect to login page
    navigate('/home')
  };

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div className="header">
      <h1>My App</h1>
      <nav>
        <Link to="/login" onClick={handleLogout} className="bg-light rounded-60 text-decoration-none"style={{ color: 'grey' }}>
Logout
</Link>
      </nav>
    </div>
  );
}

export default Header;