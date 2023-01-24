import './App.css';
import {createContext, useState, useEffect} from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';
import axios from 'axios';
export const UserContext = createContext([]) 
function App() {
  const baseURL = 'http://localhost:5000'
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([])
  useEffect(() =>{
    const grabToken = async () =>{
      const refreshTok = localStorage.getItem('refreshToken')
      try{
        const res = await axios.post(baseURL + '/access_token_recovery', {refreshToken: refreshTok})
        const {accessToken, refreshToken} = res.data
        console.log('APP COMPONENT',res.data)
        setUser({accessToken})
        localStorage.setItem('refreshToken', refreshToken)
        setTasks(res.data.tasks)
      }catch(err){
        console.log(err)
        localStorage.removeItem('refreshToken')
        setUser({accessToken: ''})
      }
    }
    // grabToken();
  }, [])

  return (
    <BrowserRouter>
    
    <UserContext.Provider value={[user, setUser, tasks, setTasks]}>
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/register'element={<Register/>}/>
        <Route path='/admin' element={<div>admin page</div>}/>
        <Route path='/login' element={<Login/>}/>
      </Routes>
    </div>
    </UserContext.Provider>

    </BrowserRouter>
  );
}

export default App;
