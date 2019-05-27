/**
 * 路由集成 redux
 *  */
import React, { PureComponent } from 'react';
import { BackHandler } from 'react-native';
// import {
//   createReactNavigationReduxMiddleware,
//   createNavigationReducer,
//   createReduxContainer,
// } from 'react-navigation-redux-helpers';
// import { connect } from 'react-redux';
import AppContainer from './router';
import NavigationService from './NavigationService';
import { RNRootSiblings } from '../components';

// 额外router reducer
// export const routerReducer = createNavigationReducer(AppContainer);

// router middleware
// export const routerMiddleware = createReactNavigationReduxMiddleware(state => state.router, 'root');

// const App = createReduxContainer(AppContainer, 'root');

// const mapStateToProps = state => ({
//   state: state.router,
// });

// const AppWithNavigationState = connect(mapStateToProps)(App);

export default class App extends PureComponent {
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
    const isAlert = RNRootSiblings.backHandler();
    if (isAlert) {
      return isAlert;
    }
    return false;
  }

  render() {
    return (
      <AppContainer
          ref={(navigatorRef) => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
      />
    );
  }
}
