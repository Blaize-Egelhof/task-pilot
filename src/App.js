import styles from './App.Module.css';
import Header from '../src/components/Header'
import './index.css';
import Container from 'react-bootstrap/Container'
import {Route,Switch} from 'react-router-dom'
import '../src/api/axiosDefaults'
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import Four0Four from './components/Four0Four';

function App() {
  return (

        <div className={styles.App}>
        <Header />
        <Container className={styles.Main}>
          <Switch>
            <Route exact path="/" render= {()=><SignInForm />} />
            <Route exact path="/sign-up" render= {()=><SignUpForm />} />
            <Route exact path="/home-page" render={() => <p>Home Page</p>} />
            <Route render= {()=><Four0Four />} /> 
          </Switch>
        </Container>
        </div>
  );
}

export default App;