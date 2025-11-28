<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import { DBKeyer } from '$lib/database/keyer';
  import database from '$lib/database/main';
  import type { Component } from 'svelte';

  export class JoinBuilder extends Buildable<TableJoinCard, null> {
    COMPONENT = import('./join.svelte').then((c) => c.default as Component);
    PRIORITY: number = 0;
    binded = null;
    /**
     * Get the relation informations between 2 tables
     * @param table_1
     * @param table_2
     * @returns `null` if the tables cannot be joined
     */
    private get_relation_info(
      table: Tables,
      joined: Tables
    ): null | {
      local_key: string;
      distant_key: string;
    } {
      for (const [local_table, distant_table] of [
        [table, joined],
        [joined, table]
      ]) {
        // Remove the "s" from the table's name and add "_id" (convention)
        const foreign_key = distant_table.replace(/s$/, '') + '_id';

        if (foreign_key in database[local_table].schema.idxByName) {
          return joined === distant_table
            ? {
                local_key: foreign_key,
                distant_key: 'id'
              }
            : {
                local_key: 'id',
                distant_key: foreign_key
              };
        } else if (
          'place_id' in database[table].schema.idxByName &&
          'place_id' in database[joined].schema.idxByName
        ) {
          return {
            local_key: 'place_id',
            distant_key: 'place_id'
          };
        }
      }

      return null;
    }
    async build(
      query: { [key: string]: string }[],
      init_table: TableCard,
      stack: Buildable<QRCard>[]
    ): Promise<{ [key: string]: string }[]> {
      const fromTables = [init_table.data.table];
      for (const buildable of stack) {
        if (buildable instanceof JoinBuilder) {
          fromTables.push(buildable.QRData.data.table);
        }
      }

      const { table: joinedTable } = this.QRData.data;

      let from_table: Tables | null = null;
      let from_key: string | null = null;
      let joined_key: string | null = null;

      for (const table of fromTables.filter((t) => t !== joinedTable)) {
        const has_relation = this.get_relation_info(table, joinedTable);
        if (has_relation) {
          from_table = table;
          from_key = has_relation.local_key;
          joined_key = has_relation.distant_key;
          break;
        }
      }
      if (!(from_table && from_key && joined_key)) return query;

      const joined_data: { [key: string]: any }[] = await database[joinedTable].toArray();

      return query
        .map((row) => {
          const merge_with = joined_data.filter(
            (joined_row) =>
              row[DBKeyer.get_key(from_table, from_key)]?.toString() ===
              joined_row[joined_key]?.toString()
          );
          console.log(row, merge_with);

          return merge_with.map((add) => ({
            ...row,
            ...DBKeyer.transform_row(add, joinedTable)
          }));
        })
        .reduce((pre, cur) => [...pre, ...cur], []);
    }
  }
</script>

<script lang="ts">
  let {
    builder
  }: {
    builder: JoinBuilder;
    table: TableCard;
    stack: Buildable<QRCard>[];
  } = $props();
</script>

<p>Join the {builder.QRData.data.table}'s table datas</p>
