<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import type { Collection } from 'dexie';
  import type { Component } from 'svelte';

  interface WhereBinds {
    table: string;
    column: string;
    where:
      | {
          type: 'like' | 'gt' | 'eq' | 'lt';
          value: string;
        }
      | {
          type: 'between' | 'in';
          values: string[];
        };
  }

  export class WhereBuilder extends Buildable<WhereCard, WhereBinds> {
    COMPONENT = import('./where.svelte').then((c) => c.default as Component);
    binded = {
      table: '',
      column: '',
      where: {
        type: 'eq',
        value: ''
      }
    } as WhereBinds;
    PRIORITY = 10;

    constructor(card: WhereCard) {
      super(card);
      this.binded.where = (
        card.data.type === 'in' || card.data.type === 'between'
          ? { type: card.data.type, values: [] }
          : { type: 'eq', value: '' }
      ) as typeof this.binded.where;
    }
    build(query: {[key: string]: string}[]): {[key: string]: string}[] {
      switch (this.binded.where.type) {
        case 'eq': {
          const { value } = this.binded.where;
          return query.filter((row) => row[this.binded.column]?.toLowerCase() == value?.toLowerCase());
        }
        case 'lt': {
          const { value } = this.binded.where;
          return query.filter((row) => row[this.binded.column] <= value);
        }
        case 'gt': {
          const { value } = this.binded.where;
          return query.filter((row) => row[this.binded.column] >= value);
        }
        case 'between': {
          const { values } = this.binded.where;
          return query.filter(
            (row) => row[this.binded.column] >= values[0] && row[this.binded.column] <= values[1]
          );
        }
        case 'in': {
          const { values } = this.binded.where;
          return query.filter((row) => values.includes(row[this.binded.column]));
        }
        case 'like': {
          const { value } = this.binded.where;
          const reg = new RegExp(
            Array.from(value)
              .map((character) =>
                character === '*'
                  ? '.'
                  : character === '%'
                    ? '.*'
                    : '\\()[].+/{}^$'.includes(character)
                      ? `\\${character}`
                      : character
              )
              .join('')
          );

          return query.filter((row) => reg.test(row[this.binded.column]));
        }

        default:
          break;
      }
      return query;
    }
  }
</script>

<script lang="ts">
  import database from '$lib/database/main';

  let {
    builder,
    table: init_table,
    stack
  }: {
    builder: WhereBuilder;
    table: TableCard;
    stack: Buildable<QRCard>[];
  } = $props();

  const whereType = builder.QRData.data.type;
  let where = $state(builder.binded.where as WhereBinds['where']);
  let table = $state('');
  let column = $state('');

  let include_tables: string[] = $state([]);
  let values: string[] = $state([]);

  $effect(() => {
    include_tables = [init_table.data.table];
    stack.forEach((build) => {
      if (build.QRData.type === 'table-join') {
        include_tables.push(build.QRData.data.table);
      }
    });

    builder.binded = { where, table, column };
    $inspect(builder.binded);
  });
  $effect(() => {
    if (whereType === null) {
      where = {
        type: values[0] as 'eq' | 'lt' | 'gt',
        value: values[1]
      };
    } else if (whereType === 'like') {
      where = {
        type: 'like',
        value: values[0]
      };
    } else if (whereType === 'between') {
      where = {
        type: 'between',
        values: [values[0], values[1]]
      };
    } else {
      where = {
        type: 'in',
        values
      };
    }
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

{#if whereType === null}
  <select bind:value={values[0]} required>
    <option value="eq">Equals</option>
    <option value="lt">Is Lower Than</option>
    <option value="gt">Is Greater Than</option>
  </select>

  <input type="text" placeholder="Leave blank to set NULL" bind:value={values[1]} />
{/if}

{#if whereType === 'between'}
  <input type="text" required bind:value={values[0]} />
  AND
  <input type="text" required bind:value={values[1]} />
{/if}

{#if whereType === 'like'}
  <p>
    The <code>%</code> character is for any characters, of any length.
  </p>
  <p>
    The<code>*</code> character is for any characters (single).
  </p>
  <input type="text" required bind:value={values[0]} />
{/if}
