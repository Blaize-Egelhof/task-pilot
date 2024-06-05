import styles from './App.Module.css';
import Header from '../src/components/Header'
import './index.css';
import Container from 'react-bootstrap/Container'
import {Route,Switch} from 'react-router-dom'
import '../src/api/axiosDefaults'
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

function App() {

  const [currentUser,setCurrentUser] = useState(null)

  const handleMount = async () => {
    try{
      const {data} = await axios.get('dj-rest-auth/user/')
      setCurrentUser(data)

    }catch(err){
      console.log(err)
    }
  }

  useEffect(() =>{
    handleMount()
  },{})

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        <div className={styles.App}>
        <Header />
        <Container className={styles.Main}>
          <Switch>
            <Route exact path="/" render= {()=><SignInForm />} />
            <Route exact path="/sign-up" render= {()=><SignUpForm />} />
            <Route render= {()=><p>Page Not Found!</p>} /> 
          </Switch>
        </Container>
        </div>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;