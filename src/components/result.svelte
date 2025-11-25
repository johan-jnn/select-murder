<script lang="ts">
  import type { Buildable } from '$lib/buildable';
  import database from '$lib/database/main';
  import { serialize, type Row } from '$lib/database/serialize';
  import type { Collection, IndexableType } from 'dexie';

  const data: {
    table: TableCard | DeleteCard;
    modifiers: Buildable<ModifierCard>[];
    oncloseasked: () => any;
  } = $props();

  $inspect('Table:', data.table, 'Modifiers:', data.modifiers);

  type Rows = { [key: string]: Row }[];
  let rows = $state<Promise<Rows>>();

  if (data.table.type === 'table') {
    let collection: Collection<any, IndexableType, any> =
      database[data.table.data.table].toCollection();

    for (const modifer of data.modifiers) {
      collection = modifer.build(collection, data.modifiers);
    }

    rows = collection
      .toArray()
      .then((rows) => Promise.all(rows.map(serialize)))
      .catch((err) => {
        console.error(err);
        return [];
      });
  }
</script>

{#snippet table(rows: Rows)}
  {$inspect(rows)}
  <table>
    <thead>
      <tr>
        {#each Object.values(rows[0]) as column}
          <th>{column.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row}
        <tr>
          {#each Object.values(row) as value}
            <td>{value.value?.toString()}</td>
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

<button type="button" onclick={data.oncloseasked}>Close</button>
