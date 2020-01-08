import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import Header from './components/header/header.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user/user.actions';

class App extends React.Component {
  unSubscribeFromAuth = null;

  // when the component mounts
  componentDidMount() {
    // get access to setCurrentUser action from props
    const { setCurrentUser } = this.props;

    // if auth state changes
    this.unSubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {
      // if no existing user
      if (userAuth) {
        // create user profile
        const userRef = await createUserProfileDocument(userAuth);

        // when snapshot object returned, set the id to snapshot.id and the rest of the data
        userRef.onSnapshot(snapshot => {
          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          });
        });
      } else {
        // else if user exists, change current user
        setCurrentUser(userAuth);
      }
    });
  }

  // if unmounted, unsubscribe from auth function (no memory leaks)
  componentWillUnmount() {
    this.unSubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route
            exact
            path='/signin'
            render={() =>
              this.props.currentUser ? (
                <Redirect to='/' />
              ) : (
                <SignInAndSignUpPage />
              )
            }
          />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

// allows an action to change state...????
const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
