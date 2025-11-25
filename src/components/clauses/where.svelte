<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import type { Collection } from 'dexie';
  import type { Component } from 'svelte';

  export class WhereBuilder extends Buildable<
    WhereCard,
    {
      value: string | string[];
    }
  > {
    COMPONENT = import('./where.svelte').then((c) => c.default as Component);
    binded = {
      value: '',
      table: '',
      column: ''
    };
    constructor(card: WhereCard) {
      super(card);
      this.binded.value = (
        card.data.type === 'in' || card.data.type === 'between' ? [] : ''
      ) as typeof this.binded.value;
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

  let value = $state(builder.binded.value);
  let table = $state('');
  let column = $state('');
  $effect(() => {
    builder.binded = { value, table, column };
  });

  const whereType = builder.QRData.data.type;
</script>

<select>
  {#each database.tables as table}
    <optgroup label={table.name}>
      {#each table.schema.indexes.filter((i) => !i.name.includes('id')) as idx}
        <option value={idx.name}>{idx.name}</option>
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
