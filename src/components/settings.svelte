<script lang="ts">
  import Settings from '$lib/settings';
  import { slide } from 'svelte/transition';

  const settings = Settings;

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

<div
  id="settings"
  transition:slide={{
    axis: 'y'
  }}
>
  <h1>Choose the game's settings</h1>

  <form onsubmit={formSubmit}>
    <div>
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
    </div>

    <button type="submit">Start the game</button>
  </form>
</div>

<style lang="scss">
  #settings {
    display: flex;
    flex-direction: column;
    gap: 1em;
    padding: 1em;
    height: 100svh;

    form {
      display: grid;
      grid-template-rows: 1fr auto;
      grid-template-areas: 1fr;
      height: 100%;
      > div {
        overflow-y: scroll;
      }

      label {
        margin: 2em 0;
        display: block;
      }
      input {
        display: block;
        width: 100%;
        margin: 0.5em 0;
      }
    }
  }
</style>
