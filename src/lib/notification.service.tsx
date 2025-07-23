import toast from 'react-hot-toast';
import { WarningToast } from '../components/lib/WarningToast';

export const notificationService = {
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  warning: (message: string) => {
    toast.custom(() => <WarningToast message={message} />);
  },
};
