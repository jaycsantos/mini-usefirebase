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

export type ChildOptions = Prettify<
  DatabaseOptions & {
    onError: (e: unknown) => void;
    onAdd?: (snapshot: DataSnapshot, previousChildName?: string | null) => void;
    onChange?: (snapshot: DataSnapshot, previousChildName?: string | null) => void;
    onMove?: (snapshot: DataSnapshot, previousChildName?: string | null) => void;
    onRemove?: (snapshot: DataSnapshot) => void;
  }
>;

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
