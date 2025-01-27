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

Initialize your firebase app normally

```typescript
import { initializeApp } from 'firebase/app';
//...
initializeApp(firebaseConfig);
```

Now use the hooks. That easy

```typescript
import { useDoc } from 'mini-usefirebase';
import { where } from 'firebase/firestore';

export function CityComponent({ id }) {
  const { data, isLoading, error } = useDoc(`cities/${id}`);
  //...
}
```

Note: This assumes that you don't set the app's name to something else and it will use fibase default `[DEFAULT]`.

### Multiple firebase instance and/or custom app name

If you have named your firebase app differently or use multiple firebase app instances, you have these options

```typescript
const app = initializeApp(firebaseConfig, 'myApp');
```

Define it into context, so that the hooks can find it up the hierarchy

```typescript
export function OtherFirebaseProvider({children}){
  return (
    <FirebaseAppContext value={{app}}>
      {children}
    </FirebaseAppContext>
  );
}
```

Or pass the firebase app as an option to the hook directly

```typescript
import { app } from '@/firebase';
//...
const { data: list, retry } = useColl('posts', where('published', '==', true), { app });
```

Or pass the firebase app name used

```typescript
const { data: list, retry } = useColl('users', [], { app: 'custom-firebase' });
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
