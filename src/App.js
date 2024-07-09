import styles from './App.module.css';
import Header from '../src/components/Header'
import './index.css';
import Container from 'react-bootstrap/Container'
import {Route,Switch,Redirect} from 'react-router-dom'
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import Four0Four from '../src/pages/Four0Four';
import { useCurrentUser } from './contexts/CurrentUserContext';
import HomePage from '../src/pages/HomePage';
import CreateTask from '../src/pages/CreateTask';
import EditTask from '../src/pages/EditTask';
import TaskView from '../src/pages/TaskView';
import ProfileView from '../src/pages/ProfileView';
import EditProfile from '../src/pages/EditProfile';

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
          <Route exact path="/" render={() => (
            currentUser ? <Redirect to="/home-page" /> : <SignInForm />
          )} />
          <Route exact path="/user-profile/:id" render={() => (
            currentUser ? <ProfileView /> : <Redirect to="/sign-in" />
          )} />
          <Route exact path="/edit-profile/:id" render={() => (
            currentUser ? <EditProfile /> : <Redirect to="/sign-in" />
          )} />
          <Route exact path="/sign-up" render={() => (
            currentUser ? <Redirect to="/home-page" /> : <SignUpForm />
          )} />
          <Route exact path="/home-page" render={() => (
            currentUser ? <HomePage /> : <Redirect to="/sign-in" />
          )} />
          <Route exact path="/create-task" render={() => (
            currentUser ? <CreateTask /> : <Redirect to="/sign-in" />
          )} />
          <Route exact path="/task-edit/:id" render={() => (
            currentUser ? <EditTask /> : <Redirect to="/sign-in" />
          )} />
          <Route exact path="/task-view/:id" render={() => (
            currentUser ? <TaskView /> : <Redirect to="/sign-in" />
          )} />
          <Route render={() => <Four0Four />} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;