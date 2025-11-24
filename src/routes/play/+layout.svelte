<script lang="ts">
  import GameSeeder from '$lib/database/seeder';
  const { children } = $props();
</script>

{#if !GameSeeder.isSeeded}
  {#await GameSeeder.seed()}
    <h1>Initialisation</h1>
    <p>Please wait a minute while we're configuring the game.</p>
  {:then}
    {@render children()}
  {/await}
{:else}
  {@render children()}
{/if}
