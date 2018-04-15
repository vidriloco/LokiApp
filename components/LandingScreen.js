import React from 'react';
import { View, Image, Text } from 'react-native';
import { Icon, Button, Body, Title } from 'native-base';

export default class LandingScreen extends React.Component {
	static navigationOptions = {
		header: null
	}
	
  render() {
    return (
			<View style={{ flex: 1, backgroundColor: '#CAE8FF' }}>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 60, marginRight: 60 }}>
	    		<Image source={{uri: this.props.imageUrl }} style={{ height: 200, width: 200 }}/>
					<Text style={{fontWeight: 'bold', color: '#058AF3', fontSize: 25, marginTop: 20 }}>Loki</Text>
					<Text style={{fontWeight: 'bold', color: 'black', fontSize: 15, marginTop: 5 }}>Rutas colaborativas en tiempo real</Text>
				
					{/*<Text style={{color: 'black', fontSize: 13, marginTop: 30, textAlign: 'center' }}>Accede a servicios adicionales y a una experiencia de viaje personalizada</Text>
					<Button rounded style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 20, paddingRight: 20 }}>
	        	<Text style={{ color: 'white', textAlign: 'center' }}>Únete a Loki</Text>
	      	</Button> */}
					<Text style={{color: 'black', fontSize: 13, marginTop: 30, textAlign: 'center' }}>Ubicaciones en tiempo real compartidas anónimamente para mejorar la movilidad</Text>
					<Button rounded style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 20, paddingRight: 20 }} onPress={() => this.props.navigation.navigate('RouteListScreen')}>
	        	<Text style={{ color: 'white', textAlign: 'center' }}>Descubre rutas cercanas</Text>
	      	</Button>
					{/*<Button rounded bordered style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 20, paddingRight: 20 }}>
	        	<Text style={{ color: '#058AF3', textAlign: 'center' }}>O ve rutas cercanas a tí</Text>
	      	</Button>*/}
				</View>
			</View>
    );
  }
}


LandingScreen.defaultProps = {
   imageUrl: "https://s3.amazonaws.com/ionic-io-static/eZY17CDPQT2y2Lpypr0r_bungy-logo.png"
}