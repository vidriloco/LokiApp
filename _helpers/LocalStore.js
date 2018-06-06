import { AsyncStorage } from 'react-native';

class LocalStore {

	static valueForKey(key) {
		AsyncStorage.getItem(key).then(value => {
			if(value != null && typeof value !== 'undefined') {
				return value;
			}
		}).catch(error => {
			console.log(error);
		})
		return null;
	}

	static applyForKeyValue(key, block) {
		var value = LocalStore.valueForKey(key);
		return block(value);
	}
	
	static store(key, value) {
		AsyncStorage.setItem(key, value);
	}
	
	// API for local store
	
	static currentUserToken() {
		return LocalStore.valueForKey(StoreKey.currentUser);
	}
	
	static setCurrentUserToken(token) {
		LocalStore.store(StoreKey.currentUser, token);
	}
}

class StoreKey {
	static currentUser = "currentUser:authToken";
}

export default LocalStore;