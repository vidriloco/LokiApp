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
		console.disableYellowBox = true;
		
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

function configureRouter(initialRoute) {	
	return StackNavigator({
	  LandingScreen: { screen: LandingScreen },
		LoginScreen: { screen: LoginScreen },
		SignupScreen: { screen: SignupScreen },
		RouteListScreen: { screen: RouteListScreen, navigationOptions:  {
	    	headerLeft: null 
			} 
		},
		MapViewScreen: { screen: MapViewScreen }
	}, {
		initialRouteName: initialRoute,
		transitionConfig: () => ({
			screenInterpolator: (props) => {
				return fade(props)
			}
    })
	});
}

const RouterStack = configureRouter("LandingScreen");