import { renderHook } from '@testing-library/react';
import { deleteApp, FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';
import { useDatabase } from '../../src/database/useDatabase';

describe('useDatabase', () => {
  beforeAll(() => {
    vi.mock('firebase/database', () => ({
      getDatabase: vi.fn(),
    }));
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(async () => {
    for (const app of getApps()) {
      await deleteApp(app);
    }
  });

  it('should return the default database instance when no options are provided', () => {
    initializeApp({ apiKey: 'mock', projectId: 'mock' });
    const { result } = renderHook(() => useDatabase());
    expect(getDatabase).toHaveBeenCalled();
    expect(result.current).toBe(getDatabase());
  });

  it('should return the database instance for the provided app', () => {
    const app = initializeApp({ apiKey: 'another', projectId: 'another' }, 'another');
    const { result } = renderHook(() => useDatabase({ app }));

    expect(getDatabase).toHaveBeenCalledWith(app, undefined);
    expect(result.current).toBe(getDatabase(app));
  });

  it('should return the database instance for the provided app name', () => {
    const name = 'namedApp';
    const app = initializeApp({ apiKey: name, projectId: name }, name);
    const { result } = renderHook(() => useDatabase({ app: name }));

    expect(getDatabase).toHaveBeenCalledWith(app, undefined);
    expect(result.current).toBe(getDatabase(app));
  });

  it('should return the database instance with custom database URL', () => {
    const app = initializeApp({ apiKey: 'mock', projectId: 'mock' });
    const dbUrl = 'https://my-custom-db.firebaseio.com';
    const { result } = renderHook(() => useDatabase({ database: dbUrl }));

    expect(getDatabase).toHaveBeenCalledWith(app, dbUrl);
    expect(result.current).toBe(getDatabase(app, dbUrl));
  });

  it('should return the provided database instance directly', () => {
    const mockApp = {} as FirebaseApp;
    const mockDb = {} as Database;
    const { result } = renderHook(() => useDatabase({ database: mockDb, app: mockApp }));

    expect(getDatabase).not.toHaveBeenCalled();
    expect(result.current).toBe(mockDb);
  });
});
