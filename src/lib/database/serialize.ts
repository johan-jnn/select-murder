import type { EntityTable } from 'dexie';
import database from './main';

type RowValue =
  | {
      value: string;
      named_value?: string;
    }
  | {
      value: Date;
    }
  | {
      value: null;
    };

export type Row = {
  key: string;
  label: string;
  original_value: string;
} & RowValue;
/**
 * Serialize the rows and keys for the front-end
 * 1. Remove the ids
 * 2. Pre-fetch data if needed
 */
export async function serialize(row: { [key: string]: string }): Promise<{ [key: string]: Row }> {
  const serializedRow: { [key: string]: Row } = {};
  for (const key in row) {
    if (key === 'id') continue;

    const value: RowValue = /^\d{4}-\d{1,2}-\d{1,2}.*/.test(row[key])
      ? {
          value: new Date(row[key])
        }
      : {
          value: row[key] ?? "<NULL>"
        };

    const serialized: Row = {
      key,
      label: key.replaceAll('_id', '').replaceAll('_', ' '),
      original_value: row[key],
      ...value
    };

    if (key.endsWith('_id') && row[key]) {
      const table = key.replace('_id', '') + 's';

      //@ts-ignore
      const entity = await (database[table] as EntityTable<{ [key: string]: string }>)
        .where('id')
        .equals(row[key])
        .first();

      serialized.value = entity?.name ?? entity?.object ?? value.value;
    }

    serializedRow[key] = serialized;
  }
  return serializedRow;
}
