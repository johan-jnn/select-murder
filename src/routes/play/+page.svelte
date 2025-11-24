<script lang="ts">
  import { slide } from 'svelte/transition';
  import Settings from '../../components/settings.svelte';

  let state = $state<'settings' | 'playing'>('settings');
</script>

{#if state === 'settings'}
  <div
    transition:slide={{
      axis: 'y'
    }}
  >
    <Settings onsave={() => (state = 'playing')} />
  </div>
{:else if state === 'playing'}
  <div
    transition:slide={{
      axis: 'y'
    }}
  >
    <h1>Not implemented yet.</h1>
  </div>
{/if}
