import { Platform } from 'react-native';
import HabitModal from './habit-modal';
import HabitModalWeb from './habit-modal-web';

interface HabitModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function HabitModalWrapper(props: HabitModalProps) {
  if (Platform.OS === 'web') {
    return <HabitModalWeb isOpen={props.visible} onClose={props.onClose} />;
  }
  return <HabitModal {...props} />;
}
