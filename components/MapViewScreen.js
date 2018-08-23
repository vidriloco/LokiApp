import React from 'react';
import { View, Image, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Icon, Button, Body, Title, List, ListItem, Thumbnail, Content, Left, Right } from 'native-base';

import MapView, { Marker, Polyline } from 'react-native-maps';
import APIRouter from '../_api/APIRouter';
import LocalStore from '../_helpers/LocalStore';

export default class MapViewScreen extends React.Component {
	
	static navigationOptions = {
		headerTitle: 'Mapa de ruta'
	};
	
	constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
      error: null,
			locationUpdating: false,
			currentRoute: this.props.navigation.state.params.route,
			currentRouteId: this.props.navigation.state.params.routeId,
			vehicles: [],
			userToken: null, 
			hasLoaded: false,
			updating: false,
			requestingChecking: false
    };
  }
		
	componentDidMount() {
		this.centerMapOnRouteLocation();
		if(this.state.currentRouteId == global.currentRouteId) {
			this.setState({ locationUpdating: true });
			// Updating of location should trigger the request on location updates
			this.startLoggingPositionForRouteSharing();
		}
	}
	
	componentWillMount() {
    LocalStore.currentUserToken().then((value) => {
			this.setState({ userToken: value, hasLoaded: true });
			this.fetchVehicles();
    }).done();
		
    LocalStore.currentUserRole().then((value) => {
			this.setState({ isDriver: (value !== "passenger") });
    }).done();
  }
	
  componentWillUnmount() {
		this.leaveCurrentRoute();
  }
	
	renderRouteSegments() {
		let segments = this.state.currentRoute.segments;
		let color = this.state.currentRoute.color;
		let stroke = this.state.currentRoute.stroke;
	  return segments.map(function(segment, i){
	    return(
				<Polyline
					key={i}
					coordinates={segment.coordinates}
					strokeColor={color}
					strokeWidth={stroke}
				/>
	    );
	  });
	}
	
  render() {
    return (
			<View style={styles.container} navigation={this.props.navigation}>
				<MapView style={styles.map}
					showsUserLocation
					ref={(ref) => { this.map = ref }}>
					{ this.renderRouteSegments() }
					{this.state.vehicles.map(marker => (
					    <Marker
								key={marker.id}
					      coordinate={marker.coordinate}
					      title={marker.identifier}
								image={require('../img/icon-bus.png')}
					      description={marker.description}
					    />
					  )) }
				</MapView>
				{ this.debugInfo() }
				<View style={styles.bottomContainer}>
					<View style={styles.bottomButtons}>
					  { this.renderRouteInfoOrJoin() }
						<Button rounded style={styles.locateMe} onPress={ () => { this.centerMapOnMyLocation() }}>
							<Image source={require('../img/locate-me-icon.png')} style={styles.icon} />
		      	</Button>
						<Button rounded warning style={styles.reload} onPress={ () => { this.fetchVehicles() }}>
						{ this.renderVehiclesReloadView() }
		      	</Button>
					</View>
				</View>
			</View>
    );
  }
	
	renderRouteInfoOrJoin() {
		if(!this.state.isDriver) {
			return this.renderCheckInButtonOrInProgressView();
		}

		if(this.state.locationUpdating || this.state.currentRouteId == global.currentRouteId) {
				return (<Button rounded  style={styles.leaveRoute} onPress={ () => { this.leaveCurrentRoute() }}>
        	<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Dejar esta ruta</Text>
			</Button>);
		} else {
				return (<Button rounded style={styles.joinRoute} onPress={ () => { this.joinCurrentRoute() }}>
        	<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Chofer de esta ruta</Text>
			</Button>);
		}
		
		// Disabled, for the moment, the tracking allowance check for users which have a role 'driver'
		/*if(!this.state.currentRoute.allowsTracking) {
				return (<Button rounded  style={styles.leaveRoute} onPress={ () => { this.askPermissionToJoinRoute() }}>
        	<Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Añadirme a ruta</Text>
			</Button>);
		}*/
	}
	
	checkInOnRoute() {
		this.setState({ requestingChecking: true });
		global.currentRouteId = this.state.currentRouteId;
		global.currentRouteProcessID = navigator.geolocation.getCurrentPosition(
      (position) => {
				if(this.state.latitude != position.coords.latitude && this.state.longitude != position.coords.longitude) {
	        this.setState({
	          latitude: position.coords.latitude,
	          longitude: position.coords.longitude,
	          error: null
	        });
					this.uploadDeviceLocation(true, function() {
						alert("Has hecho check-in!");
					});
					// We update the vehicles location on every location measurement
					this.fetchVehicles();
				}
				this.setState({ requestingChecking: false });
      },
      (error) => this.setState({ error: error.message, requestingChecking: false }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1 },
    );
		
	}
	
	renderVehiclesReloadView() {
		if(this.state.updating) {
			return <ActivityIndicator size="large" color="white" style={{ marginLeft: 10, marginRight: 10 }} />
		} else {
			return <Image source={require('../img/reload-icon.png')} style={styles.icon} />;
		}
	}
	
	renderCheckInButtonOrInProgressView() {
		if(this.state.requestingChecking) {
			return (<Button rounded style={styles.joinRoute} onPress={ () => { }}>
				<ActivityIndicator size="large" color="white" style={{ marginLeft: 10, marginRight: 10 }} />
			</Button>);
		} else {
			return (<Button rounded  style={styles.joinRoute} onPress={ () => { this.checkInOnRoute() }}>
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Hacer check-in</Text>
			</Button>);
		}
	}
	
	fetchVehicles() {
		if(!this.state.hasLoaded) {
			return
		}
		
		this.setState({ updating: true });
		
		var {url, body} = APIRouter.availableVehiclesForRoute(this.state.currentRouteId, this.state.userToken);
		return fetch(url, body)
			.then(APIRouter.handleErrors)
			.then(response => {				
				this.setState({ vehicles: response.vehicles, updating: false });
	    }).catch(error => {
				error.json().then(errorJSON => {
					// Error
			});
		});
	}
		
	uploadDeviceLocation(markAsCheckIn=false, callback={}) {
		if(!this.state.hasLoaded) {
			alert("Parece que no estás logeado");
			return
		}
		
		if(!this.isCoordinatePairValid(this.state.latitude, this.state.longitude)) {
			return
		}
		
		var {url, body} = APIRouter.updateRouteLocations(this.state.currentRouteId, this.state.latitude, this.state.longitude, this.state.userToken, markAsCheckIn);
		
		return fetch(url, body)
			.then(APIRouter.handleErrors)
			.then(response => {				
				callback(); 
	    }).catch(error => {
				error.json().then(errorJSON => {
			});
		});
	}
	
	askPermissionToJoinRoute() {
		if(!this.state.hasLoaded) {
			alert("Parece que no estás logeado");
			return
		}
		
		var {url, body} = APIRouter.requestPermissionForRoute(this.state.currentRouteId, this.state.userToken);
		
		return fetch(url, body)
			.then(APIRouter.handleErrors)
			.then(response => {				
				alert("Hemos recibido tu petición. Vuelve más tarde para comenzar a compartir tu ubicación.");
	    }).catch(error => {
				alert("Ya has iniciado una petición para unirte a esta ruta anteriormente. En breve podrás comenzar a compartir tu ubicación.");
				error.json().then(errorJSON => {
			});
		});
	}
	
	centerMapOnRouteLocation() {
		if(this.map && this.state.currentRoute.segments.length > 0) {
      this.map.animateToRegion({
        latitude: this.state.currentRoute.segments[0].coordinates[0].latitude,
        longitude: this.state.currentRoute.segments[0].coordinates[0].longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005
      })
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
				if(this.state.latitude != position.coords.latitude && this.state.longitude != position.coords.longitude) {
	        this.setState({
	          latitude: position.coords.latitude,
	          longitude: position.coords.longitude,
	          error: null
	        });
					this.uploadDeviceLocation();
					// We update the vehicles location on every location measurement
					this.fetchVehicles();
				}
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0, distanceFilter: 1 },
    );
		
		this.setState({ locationUpdating: true });
	}
	
	isCoordinatePairValid(lat, lng) {
		if(lat != null && lng != null && parseFloat(lat) != 0 && parseFloat(lng) != 0) {
			return true;
		}
		return false
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
	askPermissionToJoinRoute: {
		paddingLeft: 20, 
		paddingRight: 20,
		marginRight: 20,
		backgroundColor: 'blue',
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
	},
	reload: {
		paddingLeft: 10, 
		paddingRight: 10,
		marginLeft: 15
	}
});