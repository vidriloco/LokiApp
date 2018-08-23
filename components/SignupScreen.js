import React, { Component } from 'react';
import { ScrollView, View, Text, ActivityIndicator, Image, TextInput } from 'react-native';
import { Button } from 'native-base';
import _ from 'lodash';
import { connect } from 'react-redux';
import { usernameChanged, emailChanged, passwordChanged, signUp } from '../_actions/';

class SignupScreen extends Component {
  constructor(props) {
      super(props);
  }
	
  onButtonSubmit() {
		this.props.signUp(this.props.users.username, this.props.users.email, this.props.users.password);
  }
	
  usernameChanged(value) {
    this.props.usernameChanged(value.trim());
  }
	
  emailChanged(value) {
    this.props.emailChanged(value.trim());
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
      	<Text style={{ color: 'white', textAlign: 'center' }}>Crear cuenta</Text>
    	</Button>
			<View style={{flex: 1, flexDirection: 'column', marginTop: 50 }}>
				<Text style={{fontWeight: 'bold', textAlign: 'center', color: '#058AF3', fontSize: 14 }}>Ya tienes cuenta?</Text>
				<Button rounded warning style={{ marginTop: 8, marginLeft: 'auto', marginRight: 'auto', paddingLeft: 20, paddingRight: 20 }} onPress={() => this.props.navigation.navigate('LoginScreen') }>
	      	<Text style={{ color: 'white', textAlign: 'center' }}>Inicia sesión</Text>
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
      <ScrollView style={{ flex: 1, backgroundColor: '#CAE8FF' }}>
				<View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginLeft: 60, marginRight: 60 }}>
	    		<Image source={{uri: this.props.imageUrl }} style={{ height: 100, width: 100, marginTop: 30 }}/>
					<Text style={{fontWeight: 'bold', color: '#058AF3', fontSize: 25, marginTop: 10 }}>Loki</Text>
					<Text style={{fontWeight: 'bold', fontSize: 15, marginTop: 30, textAlign: 'center', marginBottom: 10  }}>Registrate para seguir y compartir rutas</Text>
	        {this.renderError()}
				
		      <TextInput
						autoCapitalize = 'none'
			  		style={ styles.textInput }
			  		placeholder="Nombre de usuario"
		        onChangeText={this.usernameChanged.bind(this)}
		        value={this.props.username} />
				
	        <TextInput
						autoCapitalize = 'none'
			  		style={ styles.textInput }
			  		placeholder="E-mail"
	          onChangeText={this.emailChanged.bind(this)}
	          value={this.props.email} />

	        <TextInput
						autoCapitalize = 'none'
			  		style={ styles.textInput }
	          placeholder="Contraseña"
	          onChangeText={this.passwordChanged.bind(this)}
	          value={this.props.password}
	          secureTextEntry />
	  
						{ this.renderButton() }
				</View>
    	</ScrollView>
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
		username: state.username,
    email: state.email,
    error: state.errorFlag,
    saving: state.saving,
		authorized: state.authorized,
		authToken: state.authToken
	});
};

export default connect(mapStateToProps, { usernameChanged, emailChanged, passwordChanged, signUp })(SignupScreen);

SignupScreen.defaultProps = {
   imageUrl: "https://s3.amazonaws.com/ionic-io-static/eZY17CDPQT2y2Lpypr0r_bungy-logo.png"
}