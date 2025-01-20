# mini-usefirebase

Minimal firebase react hooks

## Features

- Least boilerplate code to integrate firebase hooks
- Firestore strategies that leverage realtime updates and/or local cache
- Zero dependencies other than react and firebase

## Installation

```bash
npm install mini-usefirebase
```

## API Reference

See [https://github.com/jaycsantos/mini-usefirebase/wiki/globals](https://github.com/jaycsantos/mini-usefirebase/wiki/globals)

## Usage

```typescript
import { FirebaseAppContext, useDoc, useColl } from 'mini-usefirebase';
import { initializeApp } from 'firebase/app';
import { where } from 'firebase/firestore';
import firebaseConfig from '../firebase';

// init firebase
const app = initializeApp(firebaseConfig);

// recommended setup, add firebase app into context
export default function App(){
  return (
    <FirebaseAppContext value={{app}}>
      <MyComponent />
    </FirebaseAppContext>
  );
}

function MyComponent(){
  // with firebase app in context, simply use the hooks
  const {data, isLoading, error} = useDoc('cities/manila');

  // or explicitly pass the firebase app
  const {data: list, retry} = useColl('posts', where('published','==',true), {app});

  //...
}
```

### Feature Roadmap

- [x] useFirebase
- [x] useFirestore
- [ ] useAuth
- [ ] useDatabase
- [ ] useFunctions
- [ ] useStorage
