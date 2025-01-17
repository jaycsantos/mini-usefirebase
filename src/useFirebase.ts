import { WithFirebaseApp } from '@/types';
import { FirebaseApp } from '@firebase/app-compat';
import { createContext, useCallback, useContext } from 'react';

export type FirebaseAppContextType = {
  app: FirebaseApp;
};

/**
 * React Context for providing Firebase application instance throughout the component tree.
 * This context should be used with a Provider component to make the Firebase app instance
 * available to all child components.
 *
 * @group Firebase
 * @category React.Context
 * @type {React.Context<{app: FirebaseApp} | null>}
 *
 * @example
 * ```tsx
 * // Wrap your components with the provider and no longer worry about passing the app instance each time
 * function App() {
 *   const app = initializeApp(config); // Initialize your Firebase app
 *   return (
 *     <FirebaseAppContext.Provider value={{ app }}>
 *       <YourComponents />
 *     </FirebaseAppContext.Provider>
 *   );
 * }
 * ```
 *
 * @see {@link useFirebase} - Hook consumes this context
 */
export const FirebaseAppContext = createContext<WithFirebaseApp | null>(null);

/**
 *
 * A custom hook that provides access to the Firebase application context.
 * This hook must be used within a component that is wrapped by a FirebaseAppContext.Provider.
 *
 * This is used as fallback for firebase hooks if app is not explicitly provided.
 *
 * @returns A function that returns the Firebase app instance.
 *
 * @throws {Error} If return function is called and hook was used outside of a FirebaseProvider context.
 *
 * @example
 * ```tsx
 * function App() {
 *   return (<FirebaseAppContext.Provider value={{ app }}>
 *     <MyComponent />
 *   </FirebaseAppContext.Provider>);
 * }
 * ```
 *
 * Uses useFirebase internally to get the app instance automatically
 * ```tsx
 * function MyComponent() {
 *   const { snapshot, isLoading } = useDoc('post/1');
 *
 *   // or pass the app explicitly
 *   const { snapshot, isLoading } = useDoc('post/2', { app });
 * }
 * ```
 *
 * or pass the app explicitly
 * ```tsx
 * function MyComponent() {
 *   const getApp = useFirebase();
 *   const app = getApp();
 *
 *   const { snapshot, isLoading } = useDoc('post/2', { app });
 *   //...
 * }
 * ```
 *
 * @group Firebase
 * @category Hooks
 */

export function useFirebase(): () => FirebaseApp {
  const appData = useContext(FirebaseAppContext);

  const getApp = useCallback(() => {
    if (!appData)
      throw new Error(
        'useFirebaseApp must be used within a FirebaseProvider or pass the app explicitly'
      );
    return appData.app;
  }, [appData]);

  return getApp;
}
