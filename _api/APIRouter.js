class APIRouter {
	static backendURL = "http://localhost:3000";
	
	static handleErrors(response) {
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    return response;
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
	}
}

export default APIRouter;  