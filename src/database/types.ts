import { Prettify } from '@/common/types';
import { WithDatabase } from './useDatabase';
import { ListenOptions } from 'firebase/database';

export type DatabaseOptions = Prettify<WithDatabase & {}>;

export type DataOptions = Prettify<DatabaseOptions & ListenOptions>;
