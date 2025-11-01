const AUTH_KEY = 'lms_current_user';   // Key to store current user data in localStorage

const listeners = new Set();        // Set of subscribed listeners for auth state changes


// The authService object encapsulates all authentication-related operations
export const authService = {         

    // Simulate user login by storing user data in localStorage
    login(user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        listeners.forEach((l) => l(user));
    },
    
    // Simulate user logout by removing user data from localStorage
    logout() {
        localStorage.removeItem(AUTH_KEY);
        listeners.forEach((l) => l(null));
    },

    // Retrieve the currently logged-in user from localStorage
    getCurrentUser() {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    },

    // Subscribe to authentication state changes
    subscribe(listener){
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
};

