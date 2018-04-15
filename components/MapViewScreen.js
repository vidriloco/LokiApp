import React from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import { Icon, Button, Body, Title, List, ListItem, Thumbnail, Content, Left, Right } from 'native-base';

import MapView from 'react-native-maps';

export default class MapViewScreen extends React.Component {
	
	static navigationOptions = {
		title: 'Mapa de ruta'
	}
	
	constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
			locationUpdating: false,
			currentRouteId: this.props.navigation.state.params.routeId
    };
  }
		
	componentDidMount() {
		this.centerMapOnMyLocation();
		if(this.state.currentRouteId == global.currentRouteId) {
			this.setState({ locationUpdating: true });
		}
	}
	
  render() {
    return (
			<View style={styles.container} navigation={this.props.navigation}>
				<MapView style={styles.map}
					showsUserLocation
					ref={(ref) => { this.map = ref }}
			  />
				{ this.debugInfo() }
				<View style={styles.bottomContainer}>
					<View style={styles.bottomButtons}>
					  { this.routeInfoOrJoin() }
						<Button rounded style={styles.locateMe} onPress={ () => { this.centerMapOnMyLocation() }}>
							<Image source={require('../img/locate-me-icon.png')} style={styles.icon} />
		      	</Button>
					</View>
				</View>
			</View>
    );
  }
	
	routeInfoOrJoin() {
		if(this.state.locationUpdating || this.state.currentRouteId == global.currentRouteId) {
				return (<Button rounded  style={styles.leaveRoute} onPress={ () => { this.leaveCurrentRoute() }}>
        	<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Abandonar esta ruta</Text>
      	</Button>)
		} else {
				return (<Button rounded style={styles.joinRoute} onPress={ () => { this.joinCurrentRoute() }}>
        	<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Unirme a esta ruta</Text>
      	</Button>)
		}
	}
	
	centerMapOnMyLocation(instance) {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
				if(this.map) {
	        this.map.animateToRegion({
	          latitude: coords.latitude,
	          longitude: coords.longitude,
	          latitudeDelta: 0.005,
	          longitudeDelta: 0.005
	        })
				}
      },
      (error) => alert('Activa compartir tu ubicación, pues al parecer, no la tienes activada'),
      { enableHighAccuracy: true }
    )
	}
	
	leaveCurrentRoute() {
    navigator.geolocation.clearWatch(global.currentRouteProcessID);
    this.setState({ locationUpdating: false });
		global.currentRouteProcessID = null;
		global.currentRouteId = null;
	}
	
	joinCurrentRoute() {
		if(typeof global.currentRouteId !== 'undefined' && global.currentRouteId !== null && global.currentRouteId != this.state.currentRouteId) {
			Alert.alert(
			  'Cambiar de ruta',
			  'Actualmente, eres parte de una ruta diferente. Deseas unirte a una nueva?',
			  [
			    {text: 'No', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			    {text: 'Si, cambiar ruta', onPress: () => this.startLoggingPositionForRouteSharing() },
			  ],
			  { cancelable: false }
			)
		} else {
			this.startLoggingPositionForRouteSharing();
		}
	}
	
	startLoggingPositionForRouteSharing() {
		global.currentRouteId = this.state.currentRouteId;
		global.currentRouteProcessID = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
    );
		
		this.setState({ locationUpdating: true });
	}
	
  componentWillUnmount() {
    //this.leaveCurrentRoute();
  }
	
	debugInfo() {
		let locationUpdating = this.state.locationUpdating ? "Yes" : "No";
		
		return (<View style={styles.topContainer}>
					<Text>
						<Text style={{fontWeight: 'bold'}}>Location updating:</Text> { locationUpdating }{"\n"}
						<Text style={{fontWeight: 'bold'}}>CurrentRoute:</Text> { this.state.currentRouteId }{"\n"}
						<Text style={{fontWeight: 'bold'}}>GlobalRoute:</Text> { global.currentRouteId }{"\n"}
						<Text style={{fontWeight: 'bold'}}>Coords:</Text> ({ this.state.longitude },{ this.state.latitude })
					</Text>
				</View>)
	}
}

const styles = StyleSheet.create({
	joinRoute: {
		paddingLeft: 20, 
		paddingRight: 20,
		marginRight: 20,
	},
	leaveRoute: {
		paddingLeft: 20, 
		paddingRight: 20,
		marginRight: 20,
		backgroundColor: 'red',
	},
	locateMe: {
		paddingLeft: 10, 
		paddingRight: 10,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	topContainer: {
		position: 'absolute',
		top: 0,
		right: 0,
		left: 0,
		flex: 1,
		justifyContent: 'center',
		margin: 5,
	},
	bottomContainer: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
		flex: 1,
		justifyContent: 'center',
		marginBottom: 10,
	},
	bottomButtons: {
		marginLeft: 'auto',
		marginRight: 'auto',
		flexWrap: 'wrap', 
    alignItems: 'flex-start',
		flexDirection:'row',
	},
	icon: {
		width: 30,
		height: 30,
	}
});