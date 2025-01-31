# Change Log

## 0.4.0

- Rename firestore options to use `firestore` instead of `db`. -- **BREAKING CHANGE**. This is to disambiguate Firestore to Firebase Realtime Database
- hook path/ref are now nullable -- this effectively "stops" the hook which returns a "stopped" state eg. `{snapshot:null, isLoading:false, error:null}`

## 0.3.1

- added [RefCache](https://github.com/jaycsantos/mini-usefirebase/wiki/Enumeration.RefCache#enumeration-members) liveCache & liveCacheMetadata
- refactor firestore hooks to improve code

## 0.3.0

- [useFirebase](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useFirebase), [useFirestore](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useFirestore) & [useAuth](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useAuth) now directly return instances -- **BREAKING CHANGE**
- `options` are passed until [useFirebase](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useFirebase)
- `options.app` can now either be firebase instance or name string
- [useDoc](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useDoc) snapshot result is automatically memoized
- Added [useSnapshot](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useSnapshot) to memoize firestore snapshots. See doc for how to use with querysnapshot results.

## 0.2.1

- Updated useAsyncState to lessen setState calls
- Updated ref types & memoize implementation

## 0.2.0

- Changes to internal useAsyncState, now using useTransition to maintain loading state
- Added authentication hooks
  - [useAuth](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useAuth)
  - [useAuthUser](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useAuthUser)
  - [useAuthCallback](https://github.com/jaycsantos/mini-usefirebase/wiki/Function.useAuthCallback)

## 0.1.4

- Stable release of `mini-useFirestore`
- Docs deployed on [wiki](https://github.com/jaycsantos/mini-usefirebase/wiki/globals)
