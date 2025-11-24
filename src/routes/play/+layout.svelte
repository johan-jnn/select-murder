<script lang="ts">
  import GameSeeder from '$lib/database/seeder';
  const { children } = $props();
</script>

{#if !GameSeeder.isSeeded}
  {#await GameSeeder.seed()}
    <div>
      <h1>Initialisation</h1>
      <p>Please wait a minute while we're configuring the game.</p>
    </div>
  {:then}
    {@render children()}
  {/await}
{:else}
  {@render children()}
{/if}

<style>
  div {
    padding: 2em;
  }
</style>
