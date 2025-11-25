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

  let finish = $state(false);
  let table = $state<TableCard | DeleteCard | null>(null);
  let show_qr = $state(false);

  let askFor = $state<null | 'table' | 'builder'>(null);
  let qrmsg = $state('');

  const builder_limit = parseInt(settings.get('game.max-card-per-query')!);

  function reset() {
    finish = false;
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
  <button type="button" onclick={() => (askFor = 'table')}>Start your query</button>
{:else if askFor === 'table'}
  <Scanner
    oncancel={() => (askFor = null)}
    onscanned={(data) => verifyQR('table', data) && (askFor = 'builder')}
    title="Scan your table's card"
  >
    {#snippet message()}
      {#if qrmsg}
        <p>{qrmsg}</p>
      {/if}
    {/snippet}
  </Scanner>
{:else if builders.length < builder_limit && !finish}
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

  <h1>{builders.length} card of {builder_limit} scanned.</h1>

  {#each builders as builder (builder.id)}
    {#await builder.COMPONENT then Component}
      <Component {builder} />
    {/await}
  {/each}

  <button type="button" onclick={() => (show_qr = true)}>Scan your next card</button>
  <button type="button" onclick={() => (finish = true)}>Get the result</button>
  <button type="button" onclick={reset}>Cancel</button>
{:else}
  <h1>The query is ready !</h1>
  {JSON.stringify(builders)}
  <button type="button" onclick={() => props.onbuildable(table!, builders)}>See the result</button>
  <button type="button" onclick={reset}>Cancel</button>
{/if}
