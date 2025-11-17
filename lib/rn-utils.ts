import { Platform } from 'react-native';

// Platform-specific utilities
export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
export const isWindows = Platform.OS === 'windows';

// Generate unique ID for React Native
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format time for display
export function formatTime(time: string): string {
  if (!time) return 'No time set';
  
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  
  return `${displayHours}:${displayMinutes} ${period}`;
}

// Get relative time string
export function getRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 0) return 'Overdue';
  if (diffMins < 60) return `In ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  if (diffHours < 24) return `In ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  if (diffDays < 7) return `In ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  
  return formatDate(d);
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get color for priority
export function getPriorityColor(priority?: string): string {
  switch (priority) {
    case 'high': return '#f44336';
    case 'medium': return '#ffc107';
    case 'low': return '#4caf50';
    default: return '#666';
  }
}

// Get background color for priority
export function getPriorityBgColor(priority?: string): string {
  switch (priority) {
    case 'high': return 'rgba(244, 67, 54, 0.2)';
    case 'medium': return 'rgba(255, 193, 7, 0.2)';
    case 'low': return 'rgba(76, 175, 80, 0.2)';
    default: return 'rgba(102, 102, 102, 0.2)';
  }
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}