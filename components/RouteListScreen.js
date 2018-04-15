import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Icon, Button, Body, Title, List, ListItem, Thumbnail, Content, Left, Right } from 'native-base';

export default class RouteListScreen extends React.Component {
	static navigationOptions = {
		title: 'Rutas disponibles'
	}
	
	
  render() {
		const { navigate } = this.props.navigation;
		
	  var items = [
			{id: 1, name: 'Metrobús L5', subtitle: 'Río de los Remedios - Glorieta de Vaqueritos', url: "http://metro.cdmx.gob.mx/storage/app/media/uploaded-files/metrobus3.png"}, 
			{id: 2, name: 'Ruta hacia el ciclotón', subtitle: 'Ciudad Universitaria - Reforma', url: "http://bicitekas.org/wp/wp-content/uploads/2013/07/Logo-Bicitekas1.jpg"}];
		
    return (
			<View style={{ flex: 1, backgroundColor: '#CAE8FF' }}>
				<Content>
					<List dataArray={items}
            renderRow={(item) =>
              <ListItem onPress={() => navigate('MapViewScreen', { routeId: item.id })}>
	              <Thumbnail square size={80} source={{ uri: item.url }} />
	              <Body style={{ marginLeft: 10 }}>
									<Text>
	                	<Text style={ styles.listItemTitle }>{ item.name }</Text>{"\n"}
	                	<Text style={ styles.listItemDetails }>{ item.subtitle }</Text>
									</Text>
	              </Body>
	              <Right>
									<Button transparent onPress={() => navigate('MapViewScreen', { routeId: item.id })}>
				            <Text style={ styles.listButton }>Ver ruta</Text>
				          </Button>
	              </Right>
              </ListItem>
            }>
          </List>
				</Content>
			</View>
    );
  }
}

const styles = StyleSheet.create({
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
	}
});