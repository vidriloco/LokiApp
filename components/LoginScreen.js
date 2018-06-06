import React, { Component } from 'react';
import { View, Text, ActivityIndicator, Image, TextInput } from 'react-native';
import { Button } from 'native-base';
import _ from 'lodash';
import { connect } from 'react-redux';
import { loginChanged, passwordChanged, logIn } from '../_actions/';

class LoginScreen extends Component {
  constructor(props) {
      super(props);
  }
	
  onButtonSubmit() {
		this.props.logIn(this.props.users.login, this.props.users.password);
  }
	
  loginChanged(value) {
    this.props.loginChanged(value.trim());
  }
	
  passwordChanged(value) {
    this.props.passwordChanged(value.trim());
  }
	
  renderError() {
    if (this.props.error) {
      return (
        <Text
          style={{
          textAlign: 'center',
          fontSize: 20,
          color: '#cc3333'
        }}
        >Sorry authentication failed!</Text>
      );
    }
    return null;
  }

  renderButton() {
    if (this.props.users.saving) {
      return (
        <ActivityIndicator
          style={{ height: 80 }}
          size="large"
        />
      );
    }
    return (
		<View style={{flex: 1, flexDirection: 'column'}}>
			<Button rounded style={{ marginTop: 20, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 20, paddingRight: 20 }} onPress={() => this.onButtonSubmit() }>
      	<Text style={{ color: 'white', textAlign: 'center' }}>Iniciar Sesión</Text>
    	</Button>
			<View style={{flex: 1, flexDirection: 'column', marginTop: 50 }}>
				<Text style={{fontWeight: 'bold', color: '#058AF3', fontSize: 14 }}>No tienes cuenta aún?</Text>
				<Button rounded warning style={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 20, paddingRight: 20 }} onPress={() => this.props.navigation.navigate('SignupScreen') }>
	      	<Text style={{ color: 'white', textAlign: 'center' }}>Registrate</Text>
	    	</Button>
			</View>
		</View>
    );
  }

	componentDidUpdate() {
		if (this.props.users.authorized) {
			this.props.navigation.navigate({ routeName: 'RouteListScreen' });
		}
	}

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#CAE8FF' }}>
		<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 60, marginRight: 60 }}>
    		<Image source={{uri: this.props.imageUrl }} style={{ height: 100, width: 100, marginTop: 30 }}/>
				<Text style={{fontWeight: 'bold', color: '#058AF3', fontSize: 25, marginTop: 10 }}>Loki</Text>
				<Text style={{fontWeight: 'bold', fontSize: 15, marginTop: 30, textAlign: 'center', marginBottom: 10  }}>Inicia sesión para seguir y compartir rutas</Text>
        {this.renderError()}
				
	        <TextInput
						autoCapitalize = 'none'
			  		style={ styles.textInput }
			  		placeholder="Nombre de usuario o e-mail"
	          onChangeText={this.loginChanged.bind(this)}
	          value={this.props.login} />

	        <TextInput
						autoCapitalize = 'none'
			  		style={ styles.textInput }
	          placeholder="Contraseña"
	          onChangeText={this.passwordChanged.bind(this)}
	          value={this.props.password}
	          secureTextEntry />
		  
			{ this.renderButton() }
		</View>
      </View>
    );
  }
}

const styles = {
  viewStyle: {
    marginTop: 50,
    padding: 10,
  },
	textInput: {
		width: 250,
		padding: 10,
    margin: 5,
    fontSize: 16,
    backgroundColor: 'white'
	}
};

const mapStateToProps = (state, ownProps) => {	
	return Object.assign({}, state, {
    login: state.login,
    password: state.password,
    error: state.errorFlag,
    saving: state.saving,
		authorized: state.authorized
	});
};

export default connect(mapStateToProps, { loginChanged, passwordChanged, logIn })(LoginScreen);

LoginScreen.defaultProps = {
   imageUrl: "https://s3.amazonaws.com/ionic-io-static/eZY17CDPQT2y2Lpypr0r_bungy-logo.png"
}