<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import { DBKeyer } from '$lib/database/keyer';
  import database from '$lib/database/main';
  import type { Component } from 'svelte';

  export class OrderByBuilder extends Buildable<
    OrderByCard,
    {
      table: string;
      column: string;
      reverse: boolean;
    }
  > {
    COMPONENT = import('./orderby.svelte').then((c) => c.default as Component);
    PRIORITY: number = 1;
    binded = {
      table: '',
      column: '',
      reverse: false
    };
    build(query: { [key: string]: string }[]): { [key: string]: string }[] {
      const key = DBKeyer.get_key(this.binded.table, this.binded.column);

      query.sort((a, b) => {
        if (this.binded.reverse) {
          [b, a] = [a, b];
        }
        const [a_val, b_val] = [a, b].map((c) => c[key]);

        return a_val === b_val ? 0 : a_val < b_val ? -1 : 1;
      });
      return query;
    }
  }
</script>

<script lang="ts">
  let {
    builder,
    table: init_table,
    stack
  }: {
    builder: OrderByBuilder;
    table: TableCard;
    stack: Buildable<QRCard>[];
  } = $props();

  let table = $state('');
  let column = $state('');
  let reverse = $state(false);

  let include_tables: string[] = $state([]);
  $effect(() => {
    include_tables = [init_table.data.table];
    stack.forEach((build) => {
      if (build.QRData.type === 'table-join') {
        include_tables.push(build.QRData.data.table);
      }
    });

    builder.binded = { reverse, table, column };
    $inspect(builder.binded);
  });
</script>

<select
  onchange={(e) => {
    [table, column] = e.currentTarget.value.split('.').map((v) => v.trim());
  }}
  required
>
  <option disabled selected>Select a column</option>
  {#each database.tables.filter((t) => include_tables.includes(t.name)) as table}
    <optgroup label={table.name}>
      {#each table.schema.indexes.filter((i) => !i.name.includes('id')) as idx}
        <option value="{table.name}.{idx.name}">{idx.name}</option>
      {/each}
    </optgroup>
  {/each}
</select>

<select required onchange={(e) => (reverse = e.currentTarget.value === '1')}>
  <option value="0">Ascending</option>
  <option value="1">Descending</option>
</select>
