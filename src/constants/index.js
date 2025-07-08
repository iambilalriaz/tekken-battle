import { APP_ROUTES } from './app-routes';

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const BATTLE_STATUSES = {
  REQUESTED: 'requested',
  IN_MATCH: 'in-match',
  FINISHED: 'finished',
  REJECTED: 'rejected',
};

export const NON_AUTHORIZED_PAGES = [APP_ROUTES.LOGIN, APP_ROUTES.SIGNUP];
