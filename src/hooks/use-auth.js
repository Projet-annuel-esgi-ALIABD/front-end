import { ref } from 'vue';
import { useRouter } from 'vue-router';

// Create a reactive authentication state that persists across component instances
const user = ref(null);
const isAuthenticated = ref(false);
const isLoading = ref(true);

// Initialize from localStorage if available
try {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
        user.value = JSON.parse(savedUser);
        isAuthenticated.value = true;
    }
} catch (error) {
    console.error('Error parsing user from localStorage', error);
}

isLoading.value = false;

export function useAuth() {
    const router = useRouter();

    const login = async (email, password) => {
        isLoading.value = true;
        try {
            // This would be an API call in a real application
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful login
            const mockUser = {
                id: '1',
                email,
                name: 'Demo User',
                role: 'user'
            };

            user.value = mockUser;
            isAuthenticated.value = true;

            // Save to localStorage for persistence
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('isAuthenticated', 'true');

            return { success: true };
        } catch (error) {
            return { success: false, error };
        } finally {
            isLoading.value = false;
        }
    };

    const register = async (userData) => {
        isLoading.value = true;
        try {
            // This would be an API call in a real application
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Mock successful registration
            const mockUser = {
                id: '1',
                email: userData.email,
                name: userData.name,
                role: 'user'
            };

            user.value = mockUser;
            isAuthenticated.value = true;

            // Save to localStorage for persistence
            localStorage.setItem('user', JSON.stringify(mockUser));
            localStorage.setItem('isAuthenticated', 'true');

            return { success: true };
        } catch (error) {
            return { success: false, error };
        } finally {
            isLoading.value = false;
        }
    };

    const logout = () => {
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        router.push('/auth');
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout
    };
}
