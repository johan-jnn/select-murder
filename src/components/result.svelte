<script lang="ts">
  import type { Buildable } from '$lib/buildable';
  import { DBKeyer } from '$lib/database/keyer';
  import database from '$lib/database/main';
  import { serialize, type Row } from '$lib/database/serialize';
  import settings from '$lib/settings';
  import { onDestroy } from 'svelte';

  const data: {
    table: TableCard | DeleteCard;
    modifiers: Buildable<ModifierCard>[];
    oncloseasked: (solved: boolean) => any;
  } = $props();

  $inspect('Table:', data.table, 'Modifiers:', data.modifiers);

  let timeout_id: number;
  type Rows = { [key: string]: Row }[];

  const timeout = parseInt(settings.get('game.result-ms-timeout')!);
  let rows = $state<Promise<Rows>>();

  if (data.table.type === 'table') {
    rows = database[data.table.data.table]
      .toArray()
      .then((rows: { [key: string]: any }[]) => {
        console.debug('Transforming keys...');
        rows = rows.map((row) => DBKeyer.transform_row(row, data.table.data?.table!));
        console.debug(`Done. Result:`, rows);

        for (const modifer of data.modifiers.toSorted((a, b) => b.PRIORITY - a.PRIORITY)) {
          console.debug('--------------------------');
          console.debug('Modifying query with', modifer);
          console.debug('Before:', rows);
          //@ts-ignore
          rows = modifer.build(rows, data.modifiers);
          console.debug('After:', rows);
        }
        console.log('All modifiers has modified the query.');

        return rows;
      })
      //@ts-ignore
      .then((rows) => Promise.all(rows.map(serialize)))
      .then((rows) => {
        console.debug('Final results:', rows);
        return rows;
      })
      .catch((err) => {
        console.error(err);
        return [];
      })
      .finally(() => {
        // Start the timer
        timeout_id = setTimeout(() => {
          data.oncloseasked(false);
        }, timeout);
      });
  }

  let suspicion_answer = $state<null | {
    suspect: { [key: string]: string | number | Date };
    answer: boolean;
  }>(null);
  async function validateSuspicionAnswer(suspect_id: number) {
    const suspect = (await database.suspects.get(suspect_id))!;
    suspicion_answer = {
      suspect,
      answer: suspect?.id === 19804
    };
  }

  onDestroy(() => {
    clearTimeout(timeout_id);
  });
</script>

{#snippet table(rows: Rows)}
  <div class="table-container">
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
              <td>
                {value.value
                  ? value.value instanceof Date
                    ? `${value.value.toDateString()} at ${value.value.toLocaleTimeString()}`
                    : value.value.toString()
                  : 'null'}</td
              >
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
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
  {:else}
    <main id="suspicion">
      <h1>Will the case be resolved ?</h1>
      {#if suspicion_answer === null}
        <form
          method="dialog"
          onsubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            validateSuspicionAnswer(parseInt(data.get('suspect')?.toString() ?? '-1'));
          }}
        >
          <label for="suspect">
            Select who you think the murderer is
            <select name="suspect" id="suspect" required>
              <option disabled selected>No selection</option>

              {#await database.suspects.orderBy('name').toArray() then suspects}
                {#each suspects as suspect}
                  <option value={suspect.id}>{suspect.name}</option>
                {/each}
              {/await}
            </select>
          </label>

          <button type="submit">Validate my answer</button>
        </form>
      {:else if suspicion_answer.answer}
        <h2>Congratulation !</h2>
        <p>You just found the murderer and resolved this case.</p>
      {:else}
        <p>Sorry, {suspicion_answer.suspect.name} was not the murderer.</p>
        <h2>What's next ?</h2>
        <p>
          If you have were under surveillance, the murderer kills you. <strong>You're out</strong>.
        </p>
        <p>
          Else, you are now under the surveillance of the murderer. Replace one of your card with
          the top card of the trash pack.
        </p>
      {/if}
    </main>
  {/if}

  <button
    class="close-btn bg-primary tx-white"
    type="button"
    onclick={() => data.oncloseasked(!!suspicion_answer?.answer)}
    >{suspicion_answer?.answer ? 'You can be proud of you !' : 'Close'}</button
  >
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
      width: 100%;

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

      &#suspicion {
        form {
          width: 100%;
          display: grid;
          place-content: center;
          gap: 2em;

          select {
            width: 100%;
          }
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
