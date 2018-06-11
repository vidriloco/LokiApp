import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Icon, Button, Body, Title, List, ListItem, Thumbnail, Content, Left, Right } from 'native-base';
import APIRouter from '../_api/APIRouter';

export default class RouteListScreen extends React.Component {
  constructor(props) {
      super(props);
			
			this.state = { routes: [] };
  }
	
	static navigationOptions = {
		title: 'Rutas disponibles'
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
		var {url, body} = APIRouter.availableRoutesForCurrentUser();
		
		return fetch(url, body)
			.then(APIRouter.handleErrors)
			.then(response => {				
				this.setState({ routes: response.routes });
	    }).catch(error => {
				error.json().then(errorJSON => {
					// Error
			});
		});
	}
	
	componentWillMount() {
		this.fetchRoutes();
	}
	
  render() {
		const { navigate } = this.props.navigation;

    return (
			<View style={{ flex: 1, backgroundColor: '#CAE8FF' }}>
				<Content>
					<List dataArray={this.state.routes}
            renderRow={(item) =>

              <ListItem onPress={() => navigate('MapViewScreen', { routeId: item.id, route: { segments: item.paths, color: item.color, stroke: item.stroke } })} style={{flex: 1, flexDirection: 'column'}}>
	              <View style={{flex: 1, flexDirection: 'row'}}>
				          <Thumbnail square size={80} source={{ uri: item.imageUrl }} resizeMode="contain" />
				          <Body style={{ marginLeft: 10 }}>
										<Text>
				            	<Text style={ styles.listItemTitle }>{ item.name }</Text>{"\n"}
				            	<Text style={ styles.listItemDetails }>{ item.subtitle }</Text>
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