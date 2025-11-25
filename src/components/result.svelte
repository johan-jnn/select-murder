<script lang="ts">
  import type { Buildable } from '$lib/buildable';
  import database from '$lib/database/main';
  import type { Collection, IndexableType, PromiseExtended } from 'dexie';

  const data: {
    table: TableCard | DeleteCard;
    modifiers: Buildable<ModifierCard>[];
  } = $props();

  let rows = $state<PromiseExtended<object[]>>();
  if (data.table.type === 'table') {
    let collection: Collection<any, IndexableType, any> =
      database[data.table.data.table].toCollection();

    for (const modifer of data.modifiers) {
      collection = modifer.build(collection);
    }
    rows = collection.toArray();
  }
</script>

{#snippet table(rows: object[])}
  <table>
    <thead>
      <tr>
        {#each Object.keys(rows[0]) as key}
          <th>{key}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each Object.values(row) as value}
            <td>{value}</td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
{/snippet}

{#if data.table.type === 'table'}
  <h1>Here is your result :</h1>
  {#await rows}
    <p>Querying your result...</p>
  {:then rows}
    {#if !rows?.length}
      <p>No data from the query</p>
    {:else}
      {@render table(rows)}
    {/if}
  {/await}
{/if}
