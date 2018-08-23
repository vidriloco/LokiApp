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
	
	static currentUserRole() {
		return LocalStore.valueForKey(StoreKey.currentUserRole).then(result => {
			return result;
		});
	}
	
	static setCurrentUserRole(role) {
		LocalStore.store(StoreKey.currentUserRole, role);
	}
}

class StoreKey {
	static currentUser = "currentUser:authToken";
	static currentUserRole = "currentUser:role";
}

export default LocalStore;