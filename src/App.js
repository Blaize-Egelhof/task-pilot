import styles from './App.Module.css';
import Header from '../src/components/Header'
import './index.css';
import Container from 'react-bootstrap/Container'
import {Route,Switch,Redirect} from 'react-router-dom'
import '../src/api/axiosDefaults'
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import Four0Four from './components/Four0Four';
import { useCurrentUser } from './contexts/CurrentUserContext';

function App() {
  const currentUser = useCurrentUser();
  return (
    <div className={styles.App}>
      <Header />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/sign-in" render={() => (
            currentUser ? <Redirect to="/home-page" /> : <SignInForm />
          )} />
          <Route exact path="/sign-up" render={() => (
            currentUser ? <Redirect to="/home-page" /> : <SignUpForm />
          )} />
          <Route exact path="/home-page" render={() => <p>Home Page</p>} />
          <Route render={() => <Four0Four />} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;