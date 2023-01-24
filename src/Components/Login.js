import { UserContext } from "../App";
import { useContext, useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import axios from "axios";
export default function Login(){
    const baseURL = 'https://node-api-for-todo-app.onrender.com'
    const [user, setUser, tasks, setTasks] = useContext(UserContext);
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('')
    const navigate = useNavigate()
    useEffect(() =>{
        const grabToken = async() =>{
            const refreshTok = localStorage.getItem('refreshToken')
            try{
                const res = await axios.post(baseURL + '/access_token_recovery', {refreshToken: refreshTok})
                const {accessToken, refreshToken, tasks, username} = res.data
                console.log(res.data)
                setUser({accessToken, username})
                setTasks(tasks)
                localStorage.setItem('refreshToken', refreshToken)
                return navigate("/")
            }catch(err){
              console.log(err)
              setUser({accessToken: ''})
            }
        }
        // grabToken()
    }, [])

        const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            const res = await axios.post(baseURL + '/login', {email, password})
            const {accessToken, refreshToken, username} = res.data
            console.log(res)
            if(refreshToken && accessToken){
                localStorage.setItem('refreshToken', refreshToken)
                setUser({accessToken: accessToken})
                setErr('')
                localStorage.setItem('name', username)
                return navigate('/')
            }else{
                localStorage.removeItem('refreshToken')
                setUser({})
                setErr('something went wrong')
            }
        }catch(err){
            setErr(err.response.data.err)
            setUser({})
        }
    }
    return(
    <div className="Login-Container">
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
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
                    Login
                 <div className="arrow-wrapper">
                  <div className="arrow"></div>
                </div>
               </button>

                <a href="/register">Don't have account?</a>
            </div>
        </form>
    </div>
    )
}
