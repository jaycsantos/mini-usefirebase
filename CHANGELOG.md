# Change Log

## 0.3.0

- [useFirebase](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useFirebase), [useFirestore](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useFirestore) & [useAuth](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useAuth) now directly return instances -- **BREAKING CHANGE**
- `options` are passed until [useFirebase](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useFirebase)
- `options.app` can now either be firebase instance or name string
- [useDoc](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useDoc) snapshot result is automatically memoized
- Added [useSnapshot](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useSnapshot) to memoize firestore snapshots. See doc for how to use with querysnapshot results.

## 0.2.1

- Updated useAsyncState to lessen setState calls
- Updated ref types & memoize implementation

## 0.2.0

- Changes to internal useAsyncState, now using useTransition to maintain loading state
- Added authentication hooks
  - [useAuth](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useAuth)
  - [useAuthUser](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useAuthUser)
  - [useAuthCallback](https://github.com/jaycsantos/mini-usefirebase/wiki/Functions.useAuthCallback)

## 0.1.4

- Stable release of `mini-useFirestore`
- Docs deployed on [wiki](https://github.com/jaycsantos/mini-usefirebase/wiki/globals)
