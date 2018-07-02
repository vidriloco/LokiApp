
class APIRouter {
	static backendURL = "http://localhost:3000";
	
	static handleErrors(response) {		
    if (!response.ok) { throw response }
		return response.json(); 
	}
	
	static requestDetails(method, params) {		
		return {
			method: method,
			headers: {
		    Accept: 'application/json',
		    'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(params)
		}
	}
	
	// Users routes
	static userLogin(login, password) {
		return { 
			url: `${this.backendURL}/api/users/login`,
			body: this.requestDetails('POST', {
    		session: {
    			login: login,
					password: password
    		}
    	})
		};
	}
	
	static userRegistration(username, email, password) {
		return { 
			url: `${this.backendURL}/api/users/sign_up`,
			body: this.requestDetails('POST', {
	    	registration: {
	    		username: username,
					email: email,
					password: password
	    	}
	    })
		};
	};
	
	// Routes routes
	
	static availableRoutesForCurrentUser(token) {
		return {
			url: `${this.backendURL}/api/routes?auth_token=${token}`
		};
	}
	
	static availableVehiclesForRoute(routeId, token) {
		return {			
			url: `${this.backendURL}/api/routes/${routeId}/vehicles?auth_token=${token}`
		};
	}
	
	// User will submit the current location under the routeId given
	// TODO: In the future we might want to allow the user to select the vehicle he is traveling in
	// or to allow him to provide a plate number of the vehicle
	// For now, all users which have not been banned will be shown the submit location for a route:
	// If they were banned they will not be shown the share location dialog on the route view
	static updateRouteLocations(routeId, latitude, longitude, token) {
		return {			
			url: `${this.backendURL}/api/vehicles?auth_token=${token}`,
			body: this.requestDetails('POST', {
	    	vehicle: {
	    		latitude: latitude,
					longitude: longitude,
					// Vehicle Id will be null for now, user cannot change it at the moment
					identifier: null
	    	},
				route_id: routeId
	    })
		};
	}
}

export default APIRouter;  