import * as React from 'react';
import Route from './src/Route';
import NavigationService from './src/Components/NavigationService';

export default class App extends React.Component{
  render(){
    return<Route
    ref={navigatorRef => {
      NavigationService.setTopLevelNavigator(navigatorRef);
    }}>
    </Route>
  }
}