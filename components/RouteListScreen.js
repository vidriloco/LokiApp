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
		const path = {
			"type": "FeatureCollection",
			"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
			"features": [
				{ "type": "Feature", "properties": { "Name": "Linea 5", "description": null, "timestamp": null, "begin": null, "end": null, "altitudeMode": null, "tessellate": 1, "extrude": 0, "visibility": -1, "drawOrder": null, "icon": null }, "geometry": { "type": "LineString", "coordinates": [ [ -99.085899031719791, 19.507204183017709, 0.0 ], [ -99.092984133749027, 19.49023665494256, 0.0 ], [ -99.09945429556484, 19.475066157072639, 0.0 ], [ -99.10504766958897, 19.461411199886459, 0.0 ], [ -99.108856515957754, 19.45208337154023, 0.0 ], [ -99.110237216634232, 19.450577816723271, 0.0 ], [ -99.11225812683351, 19.444355939766989, 0.0 ], [ -99.113547931526199, 19.44021707513711, 0.0 ], [ -99.115205125977752, 19.432901828589991, 0.0 ], [ -99.115269700268684, 19.429769607859331, 0.0 ], [ -99.113822356828379, 19.42874812297465, 0.0 ], [ -99.111853519781988, 19.427941848472781, 0.0 ], [ -99.111236322903807, 19.427198765864919, 0.0 ], [ -99.111954345028266, 19.421201923889939, 0.0 ], [ -99.113403194430035, 19.408327225154778, 0.0 ], [ -99.113880530473125, 19.403610638140691, 0.0 ], [ -99.113644245235392, 19.40045084102244, 0.0 ], [ -99.113431595450763, 19.398289901447171, 0.0 ], [ -99.113441313088657, 19.396347451694488, 0.0 ], [ -99.113479996056185, 19.394850266208099, 0.0 ], [ -99.113818667126793, 19.39363225183023, 0.0 ], [ -99.113761235854383, 19.392206185054491, 0.0 ], [ -99.112746143190591, 19.390299784996941, 0.0 ], [ -99.11225784712795, 19.388483553595432, 0.0 ], [ -99.110751089069126, 19.382016979610562, 0.0 ], [ -99.107629896084816, 19.3734950840011, 0.0 ], [ -99.107662736219808, 19.37224503064035, 0.0 ], [ -99.107905557324699, 19.371138613590851, 0.0 ], [ -99.109530283699513, 19.36442075232155, 0.0 ], [ -99.111447590004289, 19.356494594657558, 0.0 ], [ -99.111253049116996, 19.355300418012209, 0.0 ], [ -99.110901775086731, 19.354111705611381, 0.0 ], [ -99.111109273563088, 19.352591971806071, 0.0 ], [ -99.111287620471842, 19.35101098607937, 0.0 ], [ -99.110993749622082, 19.349791454250511, 0.0 ], [ -99.111734192421338, 19.34651835213462, 0.0 ], [ -99.113025928028151, 19.338867614272331, 0.0 ], [ -99.112968432228556, 19.336672915430199, 0.0 ], [ -99.11316157248919, 19.334783772317859, 0.0 ], [ -99.113684769637189, 19.32807146105344, 0.0 ], [ -99.114301666188908, 19.321878596697768, 0.0 ], [ -99.113747972307479, 19.320766877787801, 0.0 ], [ -99.111401175618198, 19.315793341369069, 0.0 ], [ -99.110536804264825, 19.313765935735091, 0.0 ], [ -99.110536293558013, 19.312531597297799, 0.0 ], [ -99.110845538563751, 19.310973971592571, 0.0 ], [ -99.114946039343877, 19.311739726039558, 0.0 ], [ -99.118861533881031, 19.312232550843699, 0.0 ], [ -99.120233492048669, 19.311612227309421, 0.0 ], [ -99.122648683717728, 19.311559043130021, 0.0 ], [ -99.124131374813288, 19.31118313573759, 0.0 ], [ -99.125703756964015, 19.292914609003709, 0.0 ], [ -99.126335830861535, 19.286258971669181, 0.0 ] ] } }
			]
		};
		
	  var items = [
			{id: 1, name: 'Metrobús L5', subtitle: 'Río de los Remedios - Glorieta de Vaqueritos', url: "http://metro.cdmx.gob.mx/storage/app/media/uploaded-files/metrobus3.png", path: path }, 
			{id: 2, name: 'Ruta hacia el ciclotón', subtitle: 'Ciudad Universitaria - Reforma', url: "http://bicitekas.org/wp/wp-content/uploads/2013/07/Logo-Bicitekas1.jpg", path: path }];
		
    return (
			<View style={{ flex: 1, backgroundColor: '#CAE8FF' }}>
				<Content>
					<List dataArray={items}
            renderRow={(item) =>
              <ListItem onPress={() => navigate('MapViewScreen', { routeId: item.id, routePath: item.path })} style={{flex: 1, flexDirection: 'column'}}>
	              <View style={{flex: 1, flexDirection: 'row'}}>
				          <Thumbnail square size={80} source={{ uri: item.url }} resizeMode="contain" />
				          <Body style={{ marginLeft: 10 }}>
										<Text>
				            	<Text style={ styles.listItemTitle }>{ item.name }</Text>{"\n"}
				            	<Text style={ styles.listItemDetails }>{ item.subtitle }</Text>
										</Text>
				          </Body>
				          <Right>
										<Button transparent onPress={() => navigate('MapViewScreen', { routeId: item.id, routePath: item.path })}>
					            <Text style={ styles.listButton }>Ver ruta</Text>
					          </Button>
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