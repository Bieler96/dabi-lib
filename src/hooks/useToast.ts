import { toast } from 'sonner';

export function useToast(): { toast: typeof toast } {
	return {
		toast,
	};
}