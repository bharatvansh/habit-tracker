import { Platform } from 'react-native';
import ReminderModal from './reminder-modal';
import ReminderModalWeb from './reminder-modal-web';
import { Reminder } from '../../store/reminder-store';

interface ReminderModalProps {
  visible: boolean;
  onClose: () => void;
  editId?: string;
  existingReminder?: Reminder;
}

export default function ReminderModalWrapper(props: ReminderModalProps) {
  if (Platform.OS === 'web') {
    return <ReminderModalWeb isOpen={props.visible} onClose={props.onClose} editId={props.editId} existingReminder={props.existingReminder} />;
  }
  return <ReminderModal {...props} />;
}
