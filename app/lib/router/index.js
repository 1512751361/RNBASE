import React, { PureComponent } from 'react';
import {
  BackHandler,
} from 'react-native';
import {
  NavigationActions,
} from 'react-navigation';
import {
  reduxifyNavigator,
  createReactNavigationReduxMiddleware,
  createNavigationReducer,
} from 'react-navigation-redux-helpers';
import { connect } from 'react-redux';

import routerPath from './routerPath';
import bottomRouter from './bottomRouter';

import {
  setRouter,
  getActiveRouteName,
} from './router';

const AppNavigator = setRouter({ bottomRouter }, routerPath);

// 额外router reducer
export const routerReducer = createNavigationReducer(AppNavigator);

// router middleware
export const routerMiddleware = createReactNavigationReduxMiddleware('root', state => state.router);

const App = reduxifyNavigator(AppNavigator, 'root');

@connect(({ appNS, router }) => ({ appNS, router }))
class Router extends PureComponent {
  constructor(props) {
    super(props);
    this.backHandler = this.backHandler.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandler);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
  }

  backHandler = () => {
    const {
      router,
      dispatch,
    } = this.props;
    const currentScreen = getActiveRouteName(router);
    if (currentScreen === 'Login') {
      return true;
    }
    if (currentScreen !== 'Home') {
      dispatch(NavigationActions.back());
      return true;
    }
    return false;
  }

  render() {
    const { dispatch, router } = this.props;
    return <App dispatch={dispatch} state={router} />;
  }
}
export default Router;
