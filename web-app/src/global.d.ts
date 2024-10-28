
export {};

declare global {
  interface Window {
    loginGoogle: (response: any) => void;
  }
}