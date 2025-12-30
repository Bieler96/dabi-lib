import { useNavigation, type Guard } from '../core/Router';
import { Button } from '../components/Button';

// Simple mock auth guard
export const authGuard: Guard = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        // In a real app, you might redirect to login here
        // window.location.hash = '#/login'; // or use navigate if we had access to it, 
        // but guards are pure functions here. 
        // We could return a UrlTree equivalent or redirection instruction in the future.
        alert("Access Denied: You must be logged in to view this page.");
        return false;
    }
    return true;
};

// Guard that prevents leaving locally (always fails for demo purposes implies "locked")
// Or cleaner: checks a confirm dialog
export const confirmExitGuard: Guard = async () => {
    // Note: window.confirm stops execution, checking if it works with our async handling
    // It blocks the main thread, so async promise resolves immediately after user clicks.
    return window.confirm("Are you sure you want to leave? (Guard Check)");
};

export const GuardDemoScreen = () => {
    const nav = useNavigation();

    const login = () => {
        localStorage.setItem('isAuthenticated', 'true');
        alert("Logged In!");
    };

    const logout = () => {
        localStorage.setItem('isAuthenticated', 'false');
        alert("Logged Out!");
    };

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-3xl font-bold">Router Guards Demo</h1>
            <div className="flex gap-4">
                <Button variant="filled" onClick={login}>Simulate Login</Button>
                <Button variant="outlined" onClick={logout}>Simulate Logout</Button>
            </div>

            <div className="mt-8 space-y-2">
                <h3 className="text-xl font-semibold">Test Navigation</h3>
                <div className="flex gap-4">
                    <Button variant="tonal" onClick={() => nav.navigate('protected-page')}>
                        Go to Protected Page
                    </Button>
                    <Button variant="tonal" onClick={() => nav.navigate('dirty-page')}>
                        Go to Page with Exit Guard
                    </Button>
                </div>
            </div>

            <Button variant="ghost" onClick={() => nav.popBackStack()} className="mt-8">Back to Home</Button>
        </div>
    );
};

export const ProtectedPage = () => {
    const nav = useNavigation();
    return (
        <div className="p-8 bg-green-500/10 h-full">
            <h1 className="text-3xl font-bold text-green-700">Protected Page</h1>
            <p className="mt-4">You successfully passed the AuthGuard!</p>
            <Button className="mt-8" onClick={() => nav.popBackStack()}>Go Back</Button>
        </div>
    );
};

export const DirtyPage = () => {
    const nav = useNavigation();
    return (
        <div className="p-8 bg-orange-500/10 h-full">
            <h1 className="text-3xl font-bold text-orange-700">Exit Guard Page</h1>
            <p className="mt-4">Try to go back using the button below OR the browser back button.</p>
            <p className="text-sm">The <code>confirmExitGuard</code> will trigger.</p>
            <Button className="mt-8" onClick={() => nav.popBackStack()}>Go Back (Triggers Guard)</Button>
        </div>
    );
};
