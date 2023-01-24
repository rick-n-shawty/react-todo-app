import {useState} from 'react';
import axios from 'axios';
import { UserContext } from '../App';
import { useContext } from 'react';
import jwt_decode from 'jwt-decode';
export default function TaskCard({title, isCompleted, taskId}){
    const baseURL = 'http://localhost:5000'
    const [isChecked, setIsChecked] = useState(isCompleted)
    const [user, setUser, tasks, setTasks] = useContext(UserContext)
    const [isEditing, setIsEditing] = useState(false)
    const [taskTitle, setTaskTitle] = useState('')
    const [err, setErr] = useState('')
    const deleteTask = async () =>{
        let currentTime = new Date()
        const decoded = jwt_decode(user.accessToken)
        if((decoded.exp * 1000) - 1000 < currentTime.getTime()){
            try{
                const refresh = localStorage.getItem('refreshToken')
                const resToken = await axios.post(baseURL + '/access_token_recovery', {refreshToken: refresh})
                console.log(resToken.data)
                const {accessToken, refreshToken} = resToken.data
                setUser({accessToken: accessToken})
                localStorage.setItem('refreshToken', refreshToken)
                const res = await axios.delete(baseURL + '/tasks' + `/${taskId}`, {headers: {authorization: `Bearer ${accessToken}`}})
                const {tasks} = res.data
                setTasks(tasks)
                console.log(res.data)
            }catch(err){
                console.log(err)
            }
        }else{
            try{
                const res = await axios.delete(baseURL + '/tasks' + `/${taskId}`, {headers: {authorization: `Bearer ${user.accessToken}`}})
                const {tasks} = res.data
                setTasks(tasks)
            }catch(err){

            }
        }
    }

    const editTask = async () =>{
        if(isEditing === false){
            setIsEditing(!isEditing);
        }else{
            setIsEditing(!isEditing)
            // CHECK IF TOKEN IS EXPIRED 
            let currentTime = new Date()
            const decoded = jwt_decode(user.accessToken)
            console.log(decoded, currentTime.getTime())
                if(!taskTitle){
                    setErr('please provde some value for the task')
                    return
                }
                if((decoded.exp * 1000) - 1000 < currentTime.getTime()){
                    const refresh = localStorage.getItem('refreshToken')
                    try{
                        const res = await axios.post(baseURL + '/access_token_recovery', {refreshToken: refresh})
                        const {accessToken, refreshToken, tasks} = res.data
                        setUser({accessToken})
                        localStorage.setItem('refreshToken', refreshToken); 
                        const patchRes = await axios.patch(baseURL + '/tasks' + `/${taskId}`, 
                        {title: taskTitle}, {headers: {authorization: `Bearer ${accessToken}`}})
                        console.log(patchRes)
                    }catch(err){
                        console.log(err)
                    }
                }else{
                    try{
                        const patchRes = await axios.patch(baseURL + '/tasks' + `/${taskId}`, 
                        {title: taskTitle}, {headers: {authorization: `Bearer ${user.accessToken}`}})
                        console.log(patchRes)
                    }catch(err){
                        console.log(err)
                    }

                }
        }
    }
    const editTitle = (e) =>{
        setTaskTitle(e.target.textContent);
    }

    const completeTask = async (e) =>{
        setIsChecked(!isChecked)
        try{
            const res = await axios.patch(baseURL + '/tasks' + `/${taskId}`, {isCompleted: !isChecked}, {
                headers: {authorization: `Bearer ${user.accessToken}`}
            })
            console.log(res.data)
        }catch(err){
            console.log(err)
        }
    }
        return(
        <div className="taskCard">
            <div className='left-part'>
                <div className="checkbox">
                    <label className="container">
                        <input type="checkbox" checked={isChecked} onChange={completeTask}/>
                        <div className="checkmark"></div>
                    </label>
                </div>
                <div className="titleContainer">
                    <div 
                    contentEditable={isEditing ? true : false}
                    suppressContentEditableWarning={true}
                    onInput={editTitle} className='title'>{title}</div>
                </div>
            </div>
            <div className="buttons right-part">
                <button className='edit button' onClick={editTask}>
                    {isEditing ? 'SAVE': "EDIT"}
                </button>
                <button className='delete' onClick={deleteTask}>
                    <p>DELETE</p>
                </button>
            </div>
        </div>
    )
}