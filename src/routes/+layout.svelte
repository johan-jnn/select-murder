<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import database from '$lib/database/main';
  let { children } = $props();

  //@ts-ignore
  if (import.meta.env.DEV) globalThis.db = database;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="container">
  {@render children()}
</div>
