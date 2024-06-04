import styles from './App.Module.css';
import Header from '../src/components/Header'
import './index.css';
import Container from 'react-bootstrap/Container'
import {Route,Switch} from 'react-router-dom'
import '../src/api/axiosDefaults'
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';

function App() {
  return (
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
  );
}

export default App;