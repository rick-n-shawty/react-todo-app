import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
import { Link } from "react-router-dom";
export default function Register(){
    const baseURL = 'https://node-api-for-todo-app.onrender.com'
    const [user, setUser] = useContext(UserContext);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    // useEffect(() =>{
    //     const grabToken = async () =>{
    //         const refreshTok = localStorage.getItem('refreshToken')
    //         try{
    //           const res = await axios.post(baseURL + '/access_token_recovery', {refreshToken: refreshTok})
    //           const {accessToken, refreshToken} = res.data
    //           setUser({accessToken})
    //           console.log('register')
    //           localStorage.setItem('refreshToken', refreshToken)
    //           return navigate("/")
    //         }catch(err){
    //           console.log(err)
    //           setUser({accessToken: ''})
    //         }
    //       }
    //       grabToken();
    // }, [])
    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
            const res = await axios.post(baseURL + '/register', {name, email, password}, {headers: {'Access-Control-Allow-Origin': true}})
            console.log(res.data)
            const {accessToken, refreshToken, username} = res.data
            setUser({accessToken})
            localStorage.setItem('refreshToken', refreshToken)
            localStorage.setItem('name', username)
            return navigate("/")
        }catch(err){
            console.log(err)
        }
    }
    return(
        <div className="Login-Container">
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>
            <div className="inputbox">
              <input value={name} onChange={(e) => setName(e.target.value)} required="required" type="text"/>
              <span>Name</span>
              <i></i>
            </div>
            <div className="inputbox">
              <input value={email} onChange={(e) => setEmail(e.target.value)} required="required" type="text"/>
              <span>Email</span>
              <i></i>
            </div>
            <div className="inputbox">
              <input value={password} onChange={(e)=> setPassword(e.target.value) } required="required" type="text"/>
              <span>Password</span>
              <i></i>
            </div>
            <h3>{err}</h3>
            <div className="buttons">
                <button>
                    Sign up
                 <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
               </button>

                <Link to={"/login"}>Already have account?</Link>
            </div>
        </form>
    </div>
    )
}
