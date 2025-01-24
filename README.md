# mini-usefirebase

Minimal firebase react hooks

## Features

- Least boilerplate code to integrate firebase hooks
- Minimal tree-shakeable interface
- Zero dependencies other than react and firebase
- Pure react hooks to simplify the handling of async firebase operations
- Firestore strategies that react to realtime updates and/or local cache

## Installation

```bash
npm install mini-usefirebase
```

## Usage

Initialize your firebase app

```typescript
import { initializeApp } from 'firebase/app';
//...
const app = initializeApp(firebaseConfig);
```

You can immediately use the hooks

```typescript
import { useDoc } from 'mini-usefirebase';
import { where } from 'firebase/firestore';

export function CityComponent({ id }) {
  const { data, isLoading, error } = useDoc(`cities/${id}`);
  //...
}
```

Note: This assumes that you don't set the app's name to something else and it will use fibase default `[DEFAULT]`.

### Multiple firebase instance or custom app name

If you have named your app or use multiple firebase app instances

```typescript
const app = initializeApp(firebaseConfig, 'myApp');
```

then you need to define it into context, so that the hooks can find it

```typescript
export function MyFirebaseProvider({children}){
  return (
    <FirebaseAppContext value={{app}}>
      {children}
    </FirebaseAppContext>
  );
}
```

or pass the firebase app as an option to the hook directly

```typescript
const { data: list, retry } = useColl('posts', where('published', '==', true), { app });
```

## API Reference

See [https://github.com/jaycsantos/mini-usefirebase/wiki/globals](https://github.com/jaycsantos/mini-usefirebase/wiki/globals)

## Feature Roadmap

- [x] useFirebase
- [x] useFirestore
- [x] useAuth
- [ ] useDatabase
- [ ] useFunctions
- [ ] useStorage
