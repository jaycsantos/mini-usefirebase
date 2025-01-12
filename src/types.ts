/**
 * Specifies the source from which Firestore data should be retrieved
 *
 * @enum {string}
 * @description Controls data fetching strategy for Firestore operations
 *
 * @example
 * ```typescript
 * const { data } = useDoc('posts/1', { source: FirestoreSource.serverOnly });
 * ```
 */
export enum FirestoreSource {
  /**
   * Attempts to fetch from server first, falls back to cache if server unavailable
   * Default behavior for most Firestore operations
   */
  serverOrCache = 'server-or-cache',

  /**
   * Attempts to fetch from cache first, falls back to server only if cache miss
   * Useful for optimizing read performance
   */
  cacheOrServer = 'cache-or-server',

  /**
   * Fetches from both cache and server. Uses cache data first then updates with server data.
   * Useful for performant UIs that need to display cached data immediately
   */
  cacheAndServer = 'cache-and-server',

  /**
   * Only fetches from cache, error if data not in cache
   * Useful for offline-only applications
   */
  cacheOnly = 'cache-only',

  /**
   * Only fetches from server, error if server unreachable
   * Useful when fresh data is critical
   */
  serverOnly = 'server-only',
}
