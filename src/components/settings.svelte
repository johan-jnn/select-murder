<script lang="ts">
  import database from '$lib/database/main';
  import GameSeeder from '$lib/database/seeder';
  import settings from '$lib/settings';
  import { slide } from 'svelte/transition';

  const props: {
    onsave?: () => any;
  } = $props();

  let maxCardPerQuery = $state(parseInt(settings.get('game.max-card-per-query') ?? '6'));
  let resultTimeout = $state(parseInt(settings.get('game.result-ms-timeout') ?? '40000'));

  function formSubmit(e: SubmitEvent & { currentTarget: HTMLFormElement }) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    data.entries().forEach(([key, getter]) => {
      settings.set(key, getter.toString());
      props.onsave?.();
    });
  }
</script>

<div class="center-screen">
  <div
    id="settings"
    class="card"
    transition:slide={{
      axis: 'y'
    }}
  >
    <h1 id="title-card" class="card-title bg-white tx-primary">Choose Settings</h1>

    <form onsubmit={formSubmit} class="card-body bg-primary-light tx-black">
      <label for="scannable-cards">
        Maximum amount of cards the player can scan in a query ({maxCardPerQuery})
        <input
          type="range"
          name="game.max-card-per-query"
          id="scannable-cards"
          min="2"
          max="8"
          bind:value={maxCardPerQuery}
        />
      </label>

      <label for="result-timeout">
        Maximum time the players will be able to see their query result ({Math.round(
          resultTimeout / 1e3
        )}s)
        <input
          type="range"
          name="game.result-ms-timeout"
          id="result-timeout"
          min="15000"
          max="60000"
          step="1000"
          bind:value={resultTimeout}
        />
      </label>

      <div class="actions">
        <button class="card-cta bg-white tx-primary" type="submit">Start the game</button>
        <button
          class="card-cta bg-white tx-primary"
          type="button"
          style="opacity:0.80;"
          onclick={() => {
            GameSeeder.forceRefreshOnNextPageLoad();
            location.reload();
          }}>Refresh datas</button
        >
      </div>
    </form>
  </div>
</div>

<style lang="scss">
  #settings {
    form {
      display: grid;
      grid-template-rows: 1fr auto;
      grid-template-areas: 1fr;
      height: 100%;
      > div {
        overflow-y: scroll;
      }

      label {
        margin: 0.6em 0 0;
        display: block;
        line-height: 1.8rem;
        font-size: 1rem;
        font-weight: 500;
      }
      input {
        display: block;
        width: 100%;
        margin: 0.5em 0;
        accent-color: var(--color-primary) !important;
        cursor: pointer;
      }

      .actions {
        width: 100%;
        display: grid;
        gap: 0.5em;
        button {
          width: 100%;
        }
      }
    }
  }
</style>
