import { GridConfiguration } from '@/types';

// Upload and Storage Constants
export const UPLOADCARE_PUBLIC_KEY = 'ad7300aff23461f09657';
export const IMAGE_QUALITY = 0.8;
export const IMAGE_TYPE = 'image/jpeg';

// Default URLs
export const DEFAULT_AVATAR_URL = 'https://ucarecdn.com/372dbec8-6008-4d2c-917a-b6c0da1b346b/-/scale_crop/300x300/';

// Task Management Constants
export const MAX_TASKS = 9;
export const TASK_INPUT_MAX_LENGTH = 100;

// Grid configurations for different task counts
export const GRID_CONFIGURATIONS: GridConfiguration[] = [
  { taskCount: 1, rows: 1, cols: 1 },
  { taskCount: 2, rows: 1, cols: 2 },
  { taskCount: 3, rows: 1, cols: 3 },
  { taskCount: 4, rows: 2, cols: 2 },
  { taskCount: 5, rows: 5, cols: 1 },
  { taskCount: 6, rows: 3, cols: 2 },
  { taskCount: 9, rows: 3, cols: 3 },
];

// UI Constants
export const POSTS_GRID_COLUMNS = 3;
export const AVATAR_SIZE = 40;
export const AVATAR_BORDER_RADIUS = 20;

// Username Generation Constants
export const USERNAME_SUFFIX_LENGTH = 4;
export const USERNAME_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// Button Colors
export const ACTIVE_BUTTON_COLOR = '#007BFF';
export const INACTIVE_BUTTON_COLOR = '#CCCCCC';