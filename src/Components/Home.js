import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { useNavigate, Navigate } from "react-router-dom"; 
import axios from 'axios';
import TaskCard from "./TaskCard";
import jwt_decode from 'jwt-decode';
export default function Home({}){
    const baseURL = 'https://node-api-for-todo-app.onrender.com'
    const [user, setUser, tasks, setTasks] = useContext(UserContext);
    const [taskTitle, setTaskTitle] = useState('')
    const [name, setName] = useState('')
    const navigate = useNavigate()
    const logOut = async () =>{
        localStorage.removeItem('refreshToken')
        setUser({})
        return navigate('/login')
    }
    useEffect(()=>{
        const grabToken = async() =>{
            const refreshTok = localStorage.getItem('refreshToken')
            try{
                const res = await axios.post(baseURL + '/access_token_recovery', {refreshToken: refreshTok})
                const {accessToken, refreshToken, tasks, username} = res.data
                console.log('HOME COMPONENT',res.data)
                setUser({accessToken, username})
                setTasks(tasks)
                localStorage.setItem('refreshToken', refreshToken)
                return navigate("/")
            }catch(err){
              console.log(err)
              setUser({accessToken: ''})
            }
        }
        grabToken()
        if(!user.accessToken || user.accessToken === ''){
            console.log('user', user)
            return navigate('login')
        }
    }, [])
    // console.log(tasks)
    const createTask = async ()=>{
        let currentTime = new Date()
        const decoded = jwt_decode(user.accessToken)
        if((decoded.exp * 1000) - 1000 < currentTime.getTime()){
            try{
                const refresh = localStorage.getItem('refreshToken')
                const res = await axios.post(baseURL + '/access_token_recovery', {refreshToken: refresh})
                console.log(res.data)
                const {accessToken, refreshToken} = res.data
                setUser({accessToken: accessToken})
                localStorage.setItem("refreshToken", refreshToken)
                const createRes = await axios.post(baseURL + '/tasks', {title: taskTitle}, {
                    headers: {authorization: `Bearer ${accessToken}`}
                })
                console.log(createRes.data)
                const {tasks} = createRes.data
                setTaskTitle('')
                setTasks(tasks)
            }catch(err){
                console.log(err)
                setTaskTitle('')
            }
        }else{
            try{
                const createRes = await axios.post(baseURL + '/tasks', {title: taskTitle}, {headers: {authorization: `Bearer ${user.accessToken}`}})
                console.log(createRes.data)
                const {tasks} = createRes.data
                setTaskTitle('')
                setTasks(tasks)
            }catch(err){
                setTaskTitle('')
                console.log(err)
            }
        }
    }
    let TaskElements = tasks.map(item => {
        return <TaskCard key={item._id} title={item.title} isCompleted={item.isCompleted} taskId = {item._id}/>
    })
    return(
        <div className="homePage">
            <header>
                <div className="username">
                    <h2>{user.username}</h2>
                </div>
                <div className="nav">
                    <div className="inputbox">
                        <input
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required="required"
                        type="text"/>
                        <span>Type you task</span>
                        <i></i>
                    </div>
                    <button onClick={createTask} className="shadow__btn">
                        Add task
                    </button>
                </div>
                <div className="logout">
                    <button onClick={logOut}>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span> Log out
                    </button>
                </div>
            </header>

            <main>
                <div className="tasks-container">
                    {TaskElements}
                </div>
            </main>
        </div>
    )
}
