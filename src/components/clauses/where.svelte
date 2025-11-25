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
          values: [];
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
    } satisfies WhereBinds;
    constructor(card: WhereCard) {
      super(card);
      this.binded.where = (
        card.data.type === 'in' || card.data.type === 'between'
          ? { type: card.data.type, values: [] }
          : { type: 'eq', value: '' }
      ) as typeof this.binded.where;
    }
    build(query: Collection): Collection {
      // todo
      return query;
    }
  }
</script>

<script lang="ts">
  import database from '$lib/database/main';

  let {
    builder
  }: {
    builder: WhereBuilder;
  } = $props();

  let where = $state(builder.binded.where);
  let table = $state('');
  let column = $state('');
  $effect(() => {
    builder.binded = { where, table, column };

    console.log(builder.binded);
  });

  const whereType = builder.QRData.data.type;
</script>

<select
  onchange={(e) => {
    [table, column] = e.currentTarget.value.split('.').map((v) => v.trim());
  }}
>
  {#each database.tables as table}
    <optgroup label={table.name}>
      {#each table.schema.indexes.filter((i) => !i.name.includes('id')) as idx}
        <option value="{table.name}.{idx.name}">{idx.name}</option>
      {/each}
    </optgroup>
  {/each}
</select>

{#if whereType === null}
  <select>
    <option value="=">Equals</option>
    <option value="=">Is Lower Than</option>
    <option value="=">Is Greater Than</option>
  </select>

  <input type="text" placeholder="Leave blank to set NULL" />
{/if}

{#if whereType === 'between'}
  <input type="text" />
  AND
  <input type="text" />
{/if}

{#if whereType === 'like'}
  <p>
    The <code>%</code> character is for any characters, of any length.
  </p>
  <p>
    The<code>*</code> character is for any characters (single).
  </p>
  <input type="text" />
{/if}
