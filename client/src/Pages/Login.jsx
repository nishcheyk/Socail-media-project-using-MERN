import {useState} from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import {useNavigate} from "react-router-dom"

function Login(){

    const[email,setEmail]=useState()
    const[password,setPassword]=useState()
    const navigate =useNavigate()

const handleSubmit= async(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/login',{email,password})
    .then(result =>{
      console.log(result)
      if(result.data ==="Success"){
        localStorage.setItem("isLoggedIn", true);
        navigate('/home')
      }})

.catch(err=> console.log(err))
}

   return(
<div className="d-flex justify-content-center align-items-center bg-#673147 vh-100" style={{ backgroundColor: "#5D303E"}}>
<div className="bg-white p-4 rounded w-25">
<h2  className="align-items-center d-flex justify-content-center">Login</h2>
<form onSubmit={handleSubmit}>
<div className="mb-3">
<label htmlFor="email">
<strong>Email</strong>
</label>
<input
type="email"
placeholder="Enter Email"
autoComplete="off"
name="email"
className="form-control rounded-0"
onChange={(e)=>setEmail(e.target.value)}
/>
</div>


<div className="mb-3">
<label htmlFor="email">
<strong>Password</strong>
</label>
<input
type="password"
placeholder="Enter Password"
name="password"
className="form-control rounded-0"
onChange={(e)=>setPassword(e.target.value)}
/>
</div>

<button type="Submit" className="btn p-2 btn-success w-100 rounded-20" style={{ backgroundColor: "#874C62", color: 'white' }}>
Login
</button>
</form>
<Link to="/register" className="bg-light rounded-60 text-decoration-none"style={{ color: 'grey' }}>
Don't have a Account? Register Here
</Link>


</div>
</div>
   );

}
export default Login;

