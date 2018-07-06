import React from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Icon, Button, Body, Title, List, ListItem, Thumbnail, Content, Left, Right } from 'native-base';
import APIRouter from '../_api/APIRouter';
import LocalStore from '../_helpers/LocalStore';

export default class RouteListScreen extends React.Component {
  constructor(props) {
      super(props);
			
			this.state = { routes: [], userToken: null, hasLoaded: false };
  }
	
	static navigationOptions = {
		title: 'Rutas disponibles'
	}
	
	componentWillMount() {
    LocalStore.currentUserToken().then((value) => {
			this.setState({ userToken: value, hasLoaded: true, updating: false });
			this.fetchRoutes();
    }).done();
  }
	
	isRouteGlobal(routeId) {
		if(routeId == global.currentRouteId) {
			return (
				<View style={ styles.routeFollowedSign }>
					<Text style={ styles.currentRouteText }>Eres parte de esta ruta</Text>
				</View>);
		}
	}
	
	fetchRoutes() {
		
		if(!this.state.hasLoaded) {
			return
		}
		
		this.setState({ updating: true });
		
		var {url, body} = APIRouter.availableRoutesForCurrentUser(this.state.userToken);
		
		return fetch(url, body)
			.then(APIRouter.handleErrors)
			.then(response => {				
				this.setState({ routes: response.routes, updating: false });
	    }).catch(error => {
				error.json().then(errorJSON => {
					// Error
			});
		});
	}
	
	thumbnailForRoute(route) {
		if(route.imageUrl.length == 0) {
			return (<Thumbnail square size={80} source={ require('../img/logo-placeholder.png') } resizeMode="contain" />);
		} else {
			return (<Thumbnail square size={80} source={{ uri: route.imageUrl }} resizeMode="contain" />);
		}
	}
	
	updateRoutesMessage() {
		if(this.state.updating) {
			return (<View style={{flex: 1, flexDirection: 'row'}}>
					<ActivityIndicator size="small" color="gray" style={{ marginLeft: 30 }}/>
					<Text style={ styles.updatingRoutesText }>Actualizando rutas</Text>
				</View>);
		} else {
			return (<View style={{flex: 1, flexDirection: 'row'}}>
					<Text style={ styles.updateRoutesText }>Actualizar rutas</Text>
				</View>);
		}
	}
	
  render() {
		const { navigate } = this.props.navigation;

    return (
			<View style={{ flex: 1, backgroundColor: '#CAE8FF' }}>
				<Content>
					<List dataArray={[1]}
		        renderRow={(item) =>

		          <ListItem onPress={() => this.fetchRoutes() } style={{ backgroundColor: '#F0CD3F', marginLeft: 0 }}>
		            <View style={{flex: 1, flexDirection: 'row'}}>
									{ this.updateRoutesMessage() }
								</View>
		          </ListItem>
		        }>
		      </List>
					<List dataArray={this.state.routes}
            renderRow={(item) =>

              <ListItem onPress={() => navigate('MapViewScreen', { routeId: item.id, route: { segments: item.paths, color: item.color, stroke: item.stroke, allowsTracking: item.allowsTracking } })} style={{flex: 1, flexDirection: 'column'}}>
	              <View style={{flex: 1, flexDirection: 'row'}}>
									{ this.thumbnailForRoute(item) }
				          <Body style={{ marginLeft: 10 }}>
										<Text>
				            	<Text style={ styles.listItemTitle }>{ item.name }</Text>{"\n"}
				            	<Text style={ styles.listItemDetails }>{ item.subtitle || "No hay más información" }</Text>
										</Text>
				          </Body>
				          <Right>
										<Text style={ styles.listButton }>Ver ruta</Text>
				          </Right>
								</View>
								{ this.isRouteGlobal(item.id) }
              </ListItem>
            }>
          </List>
				</Content>
			</View>
    );
  }
}

const styles = StyleSheet.create({
	updateRoutesText: {
		fontWeight: 'bold',
		color: '#2486F2',
		fontSize: 18,
		marginLeft: 30
	},
	updatingRoutesText: {
		fontWeight: 'bold',
		color: 'black',
		fontSize: 18,
		marginLeft: 10
	},
	routeFollowedSign: {
		backgroundColor: 'red', 
		alignSelf: 'stretch', 
		marginTop: 10
	},
  listItemTitle: {
		fontWeight: 'bold',
		fontSize: 17
  },
  listItemDetails: {
    fontSize: 14
  },
	listButton: {
		color: '#206CD7',
		fontWeight: 'bold'
	},
	currentRouteText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 14,
    textAlign: 'center'
	},
	container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "stretch"
  },
  cover: {
      flex: 1,
      width: null,
      height: null
  }
});