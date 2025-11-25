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
</script>

<select>
  {#each database.tables as table}
    <optgroup label={table.name}>
      {#each table.schema.indexes as idx}
        <option value={idx.name}>{idx.name}</option>
      {/each}
    </optgroup>
  {/each}
</select>
