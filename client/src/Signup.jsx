import { Password } from "@mui/icons-material";
import {useState} from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import {useNavigate} from "react-router-dom"

function Signup(){

    const[name,setName]=useState()
    const[email,setEmail]=useState()
    const[password,setPassword]=useState()
    const navigate =useNavigate()


const handleSubmit=(e)=>{
    e.preventDefault()
    axios.post('http://localhost:3001/register/',{name,email,password})
    .then(result =>console.log(result))
   navigate('/home')
    .catch(err=> console.log(err))
}

   return(
<div className="d-flex justify-content-center align-items-center bg-#673147 vh-100" style={{ backgroundColor: "#5D303E"}}>
<div className="bg-white p-4 rounded w-25">
<h2 className="align-items-center d-flex justify-content-center" >Register</h2>
<form onSubmit={handleSubmit}>
 <div className="mb-3">
     <label htmlFor="email">
        <strong>Name</strong>
     </label>
<input
type="text"
placeholder="Enter name"
autoComplete="off"
name="email"
className="form-control rounded-0"
onChange={(e)=>setName(e.target.value)}
/>
</div>


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

<button type="Submit" className="btn btn-success w-100 rounded-30" style={{ backgroundColor: "#874C62", color: 'white' }}>
Register
</button>
</form>

<Link to="/Login" className="bg-light rounded-60 text-decoration-none"style={{ color: 'grey' }}>
Already have a account. Login here!
</Link>

</div>
</div>
   );

}
export default Signup;

