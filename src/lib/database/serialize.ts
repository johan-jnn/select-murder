import type { EntityTable } from 'dexie';
import { DBKeyer } from './keyer';
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

export function getEntityName(entity: {
  [key: string]: string | number | Date;
}): string | undefined {
  return (entity.name ?? entity.object).toString();
}

/**
 * Serialize the rows and keys for the front-end
 * 1. Remove the ids
 * 2. Pre-fetch data if needed
 */
export async function serialize(row: { [key: string]: string }): Promise<{ [key: string]: Row }> {
  const serializedRow: { [key: string]: Row } = {};
  for (const key in row) {
    const { table, column } = DBKeyer.from_key(key);

    if (column === 'id') continue;
    if (
      (table as Tables) === 'crime_scenes' &&
      ['difficulty', 'guilty_suspect_id', 'details'].includes(column)
    )
      continue;
    const value: RowValue = /^\d{4}-\d{1,2}-\d{1,2}.*/.test(row[key])
      ? {
          value: new Date(row[key])
        }
      : {
          value: row[key] ?? '<NULL>'
        };

    const serialized: Row = {
      key,
      label: DBKeyer.get_label(key.replaceAll('_id', '').replaceAll('_', ' ')),
      original_value: row[key],
      ...value
    };

    if (column.endsWith('_id') && row[key]) {
      const foreign_table = column.replace('_id', '') + 's';

      //@ts-ignore
      const entity = await (database[foreign_table] as EntityTable<{ [key: string]: string }>)
        .where('id')
        .equals(row[key])
        .first();

      serialized.value = entity ? (getEntityName(entity) ?? value.value) : value.value;
    }

    serializedRow[key] = serialized;
  }
  return serializedRow;
}
