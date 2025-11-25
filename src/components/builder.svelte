<script lang="ts">
  import { type Buildable } from '$lib/buildable';
  import settings from '$lib/settings';
  import { GroupBuilder } from './clauses/group.svelte';
  import { JoinBuilder } from './clauses/join.svelte';
  import { LimitBuilder } from './clauses/limit.svelte';
  import { OrderByBuilder } from './clauses/orderby.svelte';
  import { WhereBuilder } from './clauses/where.svelte';
  import Scanner from './qrcode/scanner.svelte';

  const props: {
    onbuildable: (table: TableCard | DeleteCard, buildables: Buildable<ModifierCard>[]) => void;
  } = $props();

  let builders = $state<Buildable<ModifierCard>[]>([]);

  let table = $state<TableCard | DeleteCard | null>(null);
  let show_qr = $state(false);

  let askFor = $state<null | 'table' | 'builder'>(null);
  let qrmsg = $state('');
  // svelte-ignore non_reactive_update - The form is just used when a button is triggered (no auto-action when it changes)
  let form: HTMLFormElement;

  const builder_limit = parseInt(settings.get('game.max-card-per-query')!);

  function reset() {
    builders = [];
    table = null;
    show_qr = false;
    askFor = null;
    qrmsg = '';
  }

  function verifyQR(type: 'table' | 'builder', data: string): boolean {
    qrmsg = '';
    try {
      var json = JSON.parse(data);
    } catch (error) {
      qrmsg = 'The QRCode is not valid';
      return false;
    }
    if (!('type' in json && 'group' in json && 'data' in json)) {
      qrmsg = "The QRCode is not a game's qrcode.";
      return false;
    }

    if (type === 'table') {
      if (!(json.type === 'table' || json.type === 'suspicion')) {
        qrmsg = 'Please scan a table card';
        return false;
      }

      table = json;
    } else {
      if (!(json.group === 'modifier' || json.type === 'table-join')) {
        qrmsg = 'Please scan a modifier card or a join card.';
        return false;
      }

      let builder;
      switch (json.type) {
        case 'limit': {
          builder = LimitBuilder;
          break;
        }
        case 'where':
          builder = WhereBuilder;
          break;
        case 'table-join':
          builder = JoinBuilder;
          break;
        case 'group-by':
          builder = GroupBuilder;
          break;
        case 'order-by':
          builder = OrderByBuilder;
          break;
        default: {
          qrmsg = 'The qr-code data is not valid.';
          return false;
        }
      }

      builders.push(new builder(json));
    }
    return true;
  }
</script>

{#if askFor === null}
  <div class="center-screen">
    <div class="card">
      <h2 class="card-title bg-primary-light tx-center">Let's go !</h2>
      <div class="card-body bg-white tx-primary">
        <p>You have formed a query with the cards in your hand?</p>

        <button class="card-cta" type="button" onclick={() => (askFor = 'table')}
          >Start your query</button
        >
      </div>
    </div>
  </div>
{:else if askFor === 'table'}
  <Scanner
    oncancel={reset}
    onscanned={(data) => verifyQR('table', data) && (askFor = 'builder')}
    title="Scan your table's card"
  >
    {#snippet message()}
      {#if qrmsg}
        <p>{qrmsg}</p>
      {/if}
    {/snippet}
  </Scanner>
{:else}
  {#if show_qr}
    <Scanner
      oncancel={() => (show_qr = false)}
      onscanned={(data) => verifyQR('builder', data) && (show_qr = false)}
      title="Scan a modifier card."
    >
      {#snippet message()}
        {#if qrmsg}
          <p>{qrmsg}</p>
        {/if}
      {/snippet}
    </Scanner>
  {/if}
  <div>
    <h1>{builders.length} card of {builder_limit} scanned.</h1>

    {@render builder(builders)}

  <form method="dialog" bind:this={form}>
    {@render builder(builders)}
  </form>

  {#if builders.length < builder_limit}
    <button type="button" onclick={() => (show_qr = true)}>Scan your next card</button>
  {/if}
  <button
    type="button"
    onclick={() => {
      form.reportValidity() && props.onbuildable(table!, builders);
    }}>Get the result</button
  >
  <button type="button" onclick={reset}>Cancel</button>
{/if}

{#snippet builder(builds: Buildable<QRCard>[])}
  <ul class="builders">
    {#each builds as build (build.id)}
      <li id="build-{build.id}">
        <div class="view">
          {#await build.COMPONENT then Component}
            <Component builder={build} stack={builders} {table} />
          {/await}
        </div>
        <button
          type="button"
          onclick={() => (builders = builders.filter((b) => b.id !== build.id))}
        >
          Remove
        </button>
      </li>
    {/each}
  </ul>
{/snippet}

<style lang="scss">
  h1 {
    font-size: 1.8rem;
    padding-top: 2rem;
  }

  button {
    width: 100%;
    margin-top: 1em;
  }

  .builders {
    display: grid;
    grid-template-rows: auto;
    grid-template-columns: 1fr;
    max-height: 80vh;
    // overflow-y: scroll;
    padding: 0.25em;
    gap: 1em;

    li {
      display: flex;
      align-items: center;
      background-color: var(--color-primary-light);
      padding: 0.5em;
      border-radius: 0.5em;
      gap: 10px;
      .view {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 10px;
        :global(input),
        :global(select) {
          border-radius: 6px;
          padding: 6px;
          font-size: 1.1rem;
        }
      }
      button {
        background-color: var(--color-primary);
        color: var(--color-white);
        margin: 0;
        height: fit-content;
        width: fit-content;
        padding: 1em;
      }
    }
  }
</style>
