import { SnackType } from '@utilities/enums/snack-type';

export interface SnackBarModel {
  message: string;
  action?: string;
  snackType: SnackType;
  click?: any;
}
