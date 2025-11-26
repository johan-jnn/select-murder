<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import { DBKeyer } from '$lib/database/keyer';
  import database from '$lib/database/main';
  import { getEntityName } from '$lib/database/serialize';
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
    async build(query: { [key: string]: string }[]): Promise<{ [key: string]: string }[]> {
      const key = DBKeyer.get_key(this.binded.table, this.binded.column);

      const relation_table = this.binded.column.endsWith('_id')
        ? database[(this.binded.column.replace(/_id$/i, '') + 's') as Tables]
        : null;

      if (relation_table) {
        query = await Promise.all(
          query.map(async (row) => {
            const relation = await relation_table?.get(parseInt(row[key]));
            if (relation) {
              const name = getEntityName(relation);
              if (name) row['__value'] = name;
            }

            row['__value'] ??= row[key];
            return row;
          })
        );
      }

      query.sort((a, b) => {
        if (this.binded.reverse) {
          [b, a] = [a, b];
        }
        const [a_val, b_val] = [a, b].map((c) => c.__value);

        return a_val === b_val ? 0 : a_val < b_val ? -1 : 1;
      });

      return query.map((row) => {
        if ('__value' in row) delete row['__value'];
        return row;
      });
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

  let included_tables = $derived.by(() => {
    const tables: string[] = [init_table.data.table];
    stack.forEach((build) => {
      if (build.QRData.type === 'table-join') {
        tables.push(build.QRData.data.table);
      }
    });

    return tables;
  });

  $effect(() => {
    builder.binded = { reverse, table, column };
  });
</script>

<select
  onchange={(e) => {
    [table, column] = e.currentTarget.value.split('.').map((v) => v.trim());
  }}
  required
>
  <option disabled selected>Select a column</option>
  {#each database.tables.filter((t) => included_tables.includes(t.name)) as table}
    <optgroup label={table.name}>
      {#each table.schema.indexes.filter((i) => i.name !== 'id') as idx}
        <option value="{table.name}{DBKeyer.SEPARATOR}{idx.name}">
          {idx.name.replace(/_id$/i, '')}
        </option>
      {/each}
    </optgroup>
  {/each}
</select>

<select required onchange={(e) => (reverse = e.currentTarget.value === '1')}>
  <option value="0">Ascending</option>
  <option value="1">Descending</option>
</select>
