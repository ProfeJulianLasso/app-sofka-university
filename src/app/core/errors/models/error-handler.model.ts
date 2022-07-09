export interface ErrorHandler {
  component: string;
  message: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  error: Object;
}
