import { useState } from 'react';
import './App.css';
import Social from './social-media'
import axios, { Axios } from 'axios';
import { useNavigate } from 'react-router';
function signup()
{
  const[name,Setname]=useState("");
  const[tel,Settel]=useState("");
  const[date,Setdate]=useState("");
  const[post,Setpost]=useState("");
  const[email,Setemail]=useState("");
  const[password,Setpassword]=useState("");

  const navigate = useNavigate(); 


  const AddUser=()=>{
    if(name&&tel&&date&&post&&email&&password)
    {
      const response=axios.post("https://localhost:7125/addUser",{name,post,tel,mydate:date,email,password,IsActive: true })
      .then(res=>res.data)
      console.log(response);
      navigate("/");
    }
  }


    return(
        <>
       <form action="#" className="sign-up-form">
            <h2 className="title">Sign up</h2>
            <div className="input-field">
              <i className="fas fa-user"></i>
              <input type="text" placeholder="Username"  autocomplete="username" onChange={(e)=>Setname(e.target.value)}/>
            </div>
            <div className="input-field" >
              <i className="fas fa-phone"></i>
              <input type="number" placeholder="Telephone" id='' maxLength="8" onChange={(e)=>Settel(e.target.value)}  />
            </div>
            <div className="input-field">
              <i></i>
              <input className="calender" type="date" onChange={(e)=>Setdate(e.target.value)} />
            </div>
            <div className="input-field">
              <i className="fas fa-id-card"></i>
              <select name="Post" className="selected" onChange={(e)=>Setpost(e.target.value)}>
              <option value="" disabled selected>Post</option>
              <option value="chef">Chef</option>
              <option value="developer">developer</option>
              </select>
            </div>
            <div className="input-field">
              <i className="fas fa-envelope"></i>
              <input type="email" placeholder="Email" autocomplete="username"  onChange={(e)=>Setemail(e.target.value)}/>
            </div>
            <div className="input-field">
              <i className="fas fa-lock"></i>
              <input type="password" placeholder="Password"  autocomplete="current-password" onChange={(e)=>Setpassword(e.target.value)}/>
            </div>
            <input type="submit" className="btni" value="Sign up" onClick={AddUser}  />
            <p className="social-text">Or Sign up with social platforms</p>
            <Social/>
           
          </form>
        </>
    )

    }
export default signup