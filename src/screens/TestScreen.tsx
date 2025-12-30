import { useNavigation } from "../core/Router";
import { Button } from "../components/Button";

export const TestScreen = () => {
    const nav = useNavigation();
    
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">TestScreen Screen</h1>
            <p className="mb-4">Welcome to your new screen!</p>
            <Button variant="outlined" onClick={() => nav.popBackStack()}>
                Back
            </Button>
        </div>
    );
};
