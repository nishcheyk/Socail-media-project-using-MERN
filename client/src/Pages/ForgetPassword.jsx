import { useState } from "react";
import{Link}from"react-router-dom";
import axios from 'axios';
import {useNavigate}  from 'react-router-dom'



function ForgetPassword(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [favColor, setFavColor] = useState("");
    const navigate=useNavigate()

    const handleSubmit= async(e)=>{
        e.preventDefault()
        axios.post('http://localhost:3001/ForgetPassword',{email,favColor,password})
        .then(result =>{
          console.log(result)

          if(result.data ==="Password changed successfully."){
            navigate('/login')
          }})

    .catch(err=> console.log(err))
    }

    return(
        <div className="d-flex justify-content-center align-items-center bg-#673147 vh-100"
             style={{ backgroundColor: "#7EBFB3"}}>
        <div className="bg-white p-4 rounded w-25">
        <h2  className="align-items-center d-flex justify-content-center" style={{ color: "#194759"}}>Forget Password</h2>
        <form onSubmit={handleSubmit}>

        <div className="mb-3">
        <label htmlFor="email">
        <strong style={{ color: "#194759"}}>email</strong>
        </label>
        <input
        type="email"
        placeholder="Enter Email"
        name="email"
        className="form-control rounded-0"

        onChange={(e) => setEmail(e.target.value)}
        />
        </div>


        <div className="mb-3">
        <label htmlFor="email">
        <strong style={{ color: "#194759"}}>Enter  your favourite color</strong>
        </label>
        <input
        type="text"
        placeholder="Enter your favourite  colour "
        autoComplete="off"
        name="favcolor"
        className="form-control rounded-0"
        onChange={(e)=>setFavColor(e.target.value)}
        />
        </div>


        <div className="mb-3">
        <label htmlFor="email">
        <strong style={{ color: "#194759"}}> New Password</strong>
        </label>

        <input
        type="password"
        placeholder="Enter  new Password"
        name="password"
        className="form-control rounded-0"
        onChange={(e)=>setPassword(e.target.value)}
        />
        </div>

        <button type="Submit"
        className="btn p-2 btn-success w-100 rounded-20"
        style={{ backgroundColor: "#194759", color: 'white' }}>
        Reset Password
        </button>
        </form>
        <Link to="/login"
        className="bg-light rounded-60 text-decoration-none"
        style={{ color: 'grey' }}>
        Remembered the password login?
        </Link>




        </div>
        </div>
        );
        }
export default ForgetPassword;





