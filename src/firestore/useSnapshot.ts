import useDistinct from '@/common/useDistinct';
import { DocumentSnapshot, QueryDocumentSnapshot, snapshotEqual } from 'firebase/firestore';

/**
 * Utility hook that compares Firestore document snapshots using the `snapshotEqual` function.
 * This hook helps prevent unnecessary re-renders when working with Firestore snapshots.
 *
 * @template T - DocumentSnapshot or QueryDocumentSnapshot
 *
 * @param snapshot - The Firestore document snapshot to compare
 * @returns A memoized version of the snapshot that only changes when the snapshot content changes
 *
 * @remarks If you are using {@link useDoc} hook, the snapshots are already memoized. However {@link useColl}
 * returns a QuerySnapshot which is a list of QueryDocumentSnapshot which is not memoized. And each
 * QueryDocumentSnapshot can only be efficiently memoized by something like `useSnapshot` when iterated.
 *
 * @example
 * ```typescript
 * const memoizedSnapshot = useSnapshot(documentSnapshot);
 * ```
 *
 * @example
 * A sample resuable component that memo-wraps the snapshot component. This makes it so that even if the
 * query result is updated, the component will only re-render if the snapshot content changes.
 * ```typescript
 * import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
 * import { useSnapshot } from 'mini-usefirebase';
 * import { JSX, useMemo } from 'react';
 *
 * export default function MemoSnapshot<
 *   T extends DocumentSnapshot | QueryDocumentSnapshot,
 * >({ snapshot, render }: { snapshot: T; render: (snapshot: T) => JSX.Element }) {
 *   const msnap = useSnapshot(snapshot);
 *   return useMemo(() => render(msnap), [msnap]);
 * }
 * ```
 * to use
 * ```typescript
 * {querySnapshot.docs.map((snap) => (
 *   <MemoSnapshot key={snap.id} snapshot={snap} render={(memoSnap) => (
 *     <ItemComponent snapshot={memoSnap} />
 *   )} />
 * ))}
 * ```
 * ItemComponent only re-renders when the snapshot content changes even if querySnapshot changes.
 */
export function useSnapshot<T extends DocumentSnapshot | QueryDocumentSnapshot>(snapshot: T): T {
  return useDistinct(snapshot, snapshotEqual);
}
