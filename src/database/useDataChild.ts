import { Prettify } from '@/common/types';
import { noop } from '@/utils/noop';
import {
  DatabaseReference,
  DataSnapshot,
  onChildAdded,
  onChildChanged,
  onChildMoved,
  onChildRemoved,
  Query,
} from 'firebase/database';
import { useEffect } from 'react';
import { DatabaseOptions } from './types';
import { useDataRef } from './useDataRef';

/**
 * @ignore
 * @inline
 */
export type ChildOptions = Prettify<
  DatabaseOptions & {
    onError: (e: unknown) => void;
    onAdd?: (snapshot: DataSnapshot, previousChildName?: string | null) => void;
    onChange?: (snapshot: DataSnapshot, previousChildName?: string | null) => void;
    onMove?: (snapshot: DataSnapshot, previousChildName?: string | null) => void;
    onRemove?: (snapshot: DataSnapshot) => void;
  }
>;

/**
 * A hook to monitor child events on a Firebase Realtime Database reference.
 *
 * @param pathOrRef - The path string, DatabaseReference, or Query to listen to
 * @param options - Configuration object for child event callbacks
 * @param options.onAdd - Callback when a child is added
 * @param options.onChange - Callback when a child is changed
 * @param options.onMove - Callback when a child changes position
 * @param options.onRemove - Callback when a child is removed
 * @param options.onError - callback on error events
 * @param options.database - specific database instance to use or database url
 * @param options.app - specific Firebase app instance to use
 *
 * @example
 * ```typescript
 * useDataChild('users', {
 *   onAdd: (snapshot) => console.log('Child added:', snapshot.val()),
 *   onChange: (snapshot) => console.log('Child changed:', snapshot.val()),
 *   onRemove: (snapshot) => console.log('Child removed:', snapshot.val())
 * });
 * ```
 *
 * @group Database
 * @category Hooks
 */
export function useDataChild(
  pathOrRef: string | DatabaseReference | Query | null,
  options: ChildOptions
): void {
  const ref = useDataRef(pathOrRef, options);
  const onError = options?.onError;

  const { onAdd, onChange, onMove, onRemove } = options;

  useEffect(() => {
    if (!ref) return;
    const unsubs = [
      onAdd ? onChildAdded(ref, onAdd, onError) : noop,
      onChange ? onChildChanged(ref, onChange, onError) : noop,
      onMove ? onChildMoved(ref, onMove, onError) : noop,
      onRemove ? onChildRemoved(ref, onRemove, onError) : noop,
    ];
    return () => unsubs.forEach((fn) => fn());
  }, [ref, onError, onAdd, onChange, onMove, onRemove]);
}
