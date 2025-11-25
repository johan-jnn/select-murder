import type { EntityTable } from 'dexie';
import database from './main';

type RowValue =
  | {
      value: string;
      named_value?: string;
    }
  | {
      value: Date;
    };

export type Row = {
  key: string;
  label: string;
} & RowValue;
/**
 * Serialize the rows and keys for the front-end
 * 1. Remove the ids
 * 2.
 */
export async function serialize(row: { [key: string]: string }): Promise<{ [key: string]: Row }> {
  const serializedRow: { [key: string]: Row } = {};
  for (const key in row) {
    if (key === 'id') continue;

    const date = new Date(row[key]);
    const value: RowValue = isNaN(+date)
      ? {
          value: row[key]
        }
      : {
          value: date
        };

    const serialized: Row = {
      key,
      label: key.replaceAll('_id', '').replaceAll('_', ' '),
      ...value
    };
    if (key.endsWith('_id')) {
      const table = key.replace('_id', '') + 's';
      //@ts-ignore
      const entity = await (database[table] as EntityTable<{ [key: string]: string }>)
        .where('id')
        .equals(row[key])
        .first();

      serialized.value = entity?.name ?? entity?.object ?? row[key];
    }

    serializedRow[key] = serialized;
  }
  return serializedRow;
}
