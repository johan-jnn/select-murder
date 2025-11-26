<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import { DBKeyer } from '$lib/database/keyer';
  import database from '$lib/database/main';
  import type { Component } from 'svelte';

  export class JoinBuilder extends Buildable<TableJoinCard, null> {
    COMPONENT = import('./join.svelte').then((c) => c.default as Component);
    PRIORITY: number = 0;
    binded = null;
    async build(
      query: { [key: string]: string }[],
      init_table: TableCard
    ): Promise<{ [key: string]: string }[]> {
      const fromTables = [init_table.data.table];
      const { table: joinedTable } = this.QRData.data;

      let from_table: Tables | null = null;
      let foreign_key: string | null = null;
      let local_key: string | null = null;

      for (const table of fromTables) {
        for (const [from, to] of [
          [joinedTable, table],
          [table, joinedTable]
        ]) {
          // <table (no final 's')>_id
          const foreign = from.replace(/s$/, '') + '_id';
          if (foreign in database[to].schema.idxByName) {
            if (from === joinedTable) {
              from_table = to;

              foreign_key = foreign;
              local_key = 'id';
            } else {
              from_table = from;

              foreign_key = 'id';
              local_key = foreign;
            }
          }
        }
      }

      if (!(from_table && foreign_key && local_key)) return query;

      const joined_data: { [key: string]: any }[] = await database[joinedTable].toArray();

      return query
        .map((row) => {
          const merge_with = joined_data.filter(
            (joined_row) =>
              row[DBKeyer.get_key(from_table, foreign_key)].toString() ===
              joined_row[local_key].toString()
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
