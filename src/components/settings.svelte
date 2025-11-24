<script lang="ts">
  import Settings from '$lib/settings';
  import { slide } from 'svelte/transition';

  const settings = Settings;
</script>

<div
  id="settings"
  transition:slide={{
    axis: 'y'
  }}
>
  <h1>Choose the game's settings</h1>

  <form>

  </form>
</div>

<style lang="scss">
  #settings {
    padding: 1em;
  }
</style>
