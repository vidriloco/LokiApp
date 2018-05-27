import React from 'react';
import LandingScreen from './components/LandingScreen.js';
import RouteListScreen from './components/RouteListScreen.js';
import MapViewScreen from './components/MapViewScreen.js';
import LoginScreen from './components/LoginScreen.js';
import SignupScreen from './components/SignupScreen.js';

import { Provider } from 'react-redux';
import configureStore from './_store/configureStore';

import { StackNavigator } from 'react-navigation';

export default class App extends React.Component {		
	render() {
		const store = configureStore();
		
		return (
			<Provider store={store}>
        <RouterStack />
			</Provider>);
	}
}

import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'

const fade = (props) => {
    const {position, scene} = props

    const index = scene.index

    const translateX = 0
    const translateY = 0

    const opacity = position.interpolate({
        inputRange: [index - 0.7, index, index + 0.7],
        outputRange: [0.3, 1, 0.3]
    });

    return {
        opacity,
        transform: [{translateX}, {translateY}]
    }
}

const RouterStack = StackNavigator({
  LandingScreen: { screen: LandingScreen },
	LoginScreen: { screen: LoginScreen },
	SignupScreen: { screen: SignupScreen },
	RouteListScreen: { screen: RouteListScreen },
	MapViewScreen: { screen: MapViewScreen }
}, {
	transitionConfig: () => ({
	        screenInterpolator: (props) => {
	            return fade(props)
	        }
	    })
});