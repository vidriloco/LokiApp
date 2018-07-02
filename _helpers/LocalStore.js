import store from 'react-native-simple-store';

class LocalStore {

	static valueForKey(key) {
		return store.get(key).then(value => {
			if(value != null && typeof value !== 'undefined') {
				return value;
			}
		}).catch(error => {
			console.log(error);
		});
	}


	static store(key, value) {
		store.save(key, value);
	}
	
	// API for local store
	
	static currentUserToken() {
		return LocalStore.valueForKey(StoreKey.currentUser).then(result => {
			return result;
		});
	}
	
	static setCurrentUserToken(token) {
		LocalStore.store(StoreKey.currentUser, token);
	}
}

class StoreKey {
	static currentUser = "currentUser:authToken";
}

export default LocalStore;