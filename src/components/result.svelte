<script lang="ts">
  import type { Buildable } from '$lib/buildable';
  import database from '$lib/database/main';
  import { serialize, type Row } from '$lib/database/serialize';
  import settings from '$lib/settings';
  import type { Collection, IndexableType } from 'dexie';
  import { onDestroy } from 'svelte';

  const data: {
    table: TableCard | DeleteCard;
    modifiers: Buildable<ModifierCard>[];
    oncloseasked: () => any;
  } = $props();

  const timeout = parseInt(settings.get('game.result-ms-timeout')!);
  const tm_id = setTimeout(() => {
    data.oncloseasked();
  }, timeout);

  $inspect('Table:', data.table, 'Modifiers:', data.modifiers);

  type Rows = { [key: string]: Row }[];
  let rows = $state<Promise<Rows>>();

  if (data.table.type === 'table') {
    let collection: Collection<any, IndexableType, any> =
      database[data.table.data.table].toCollection();

    for (const modifer of data.modifiers) {
      console.debug('--------------------------');
      console.debug('Modifying query with', modifer);
      console.debug('Before:', collection);
      collection = modifer.build(collection, data.modifiers);
      console.debug('After:', collection);
    }

    console.log('All modifiers has modified the query.');

    rows = collection
      .toArray()
      .then((rows) => Promise.all(rows.map(serialize)))
      .catch((err) => {
        console.error(err);
        return [];
      });
  }

  onDestroy(() => {
    clearTimeout(tm_id);
  });
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

<div class="tab">
  {#if data.table.type === 'table'}
    <main id="table" style="--tm: {timeout}ms">
      <h1>Here is your result :</h1>

      {#await rows}
        <p>Querying your result...</p>
      {:then rows}
        {#if !rows?.length}
          <p>No data from the query</p>
        {:else}
          <div class="table-wrapper">
            {@render table(rows)}
          </div>
        {/if}
      {/await}
    </main>
  {/if}

  <button type="button" onclick={data.oncloseasked}>Close</button>
</div>

<style lang="scss">
  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
  @keyframes appear {
    from {
      filter: blur(15px);
      opacity: 0;
      font-weight: 900;
      scale: 0.75;
    }
    to {
      filter: blur(0);
      font-weight: 700;
      scale: 1;
      opacity: 1;
    }
  }
  .tab {
    padding: 1em;
    height: 100svh;
    display: grid;
    grid-template-rows: 90% auto;
    grid-template-columns: auto;
    gap: 1em;

    > main {
      height: 100%;

      &#table {
        display: grid;
        grid-template-rows: auto 1fr;
        position: relative;

        &::before {
          content: 'Hurry up !';
          position: absolute;
          top: 50%;
          left: 50%;
          translate: -50% -50%;

          font-size: 10vw;
          text-transform: uppercase;
          font-family: 'Fire Sans', sans-serif;
          width: 100%;
          text-align: center;
          color: var(--color-secondary);

          animation: appear var(--tm) ease-in forwards;
        }
      }
    }
    .table-wrapper {
      height: 100%;
      overflow-y: scroll;
      opacity: 0;
      animation: fadeout var(--tm) cubic-bezier(1, 1, 1, 0) forwards;
    }
  }
</style>
