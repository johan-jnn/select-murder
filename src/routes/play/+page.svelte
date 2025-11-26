<script lang="ts">
  import type { Buildable } from '$lib/buildable';
  import { slide } from 'svelte/transition';
  import Builder from '../../components/builder.svelte';
  import Result from '../../components/result.svelte';
  import Settings from '../../components/settings.svelte';

  let show: 'settings' | 'playing' = $state('settings');

  let table: TableCard | DeleteCard | null = $state(null);
  let modifiers: Buildable<ModifierCard>[] = $state([]);
</script>

{#if show === 'settings'}
  <div
    transition:slide={{
      axis: 'y'
    }}
  >
    <Settings onsave={() => (show = 'playing')} />
  </div>
{:else if show === 'playing'}
  {#if table === null}
    <div
      transition:slide={{
        axis: 'y'
      }}
    >
      <Builder
        onbuildable={(_table, _modifier) => ((table = _table), (modifiers = _modifier))}
        onsettingsasked={() => (show = 'settings')}
      />
    </div>
  {:else}
    <div
      transition:slide={{
        axis: 'y'
      }}
    >
      <Result
        {table}
        {modifiers}
        oncloseasked={(solved) => {
          table = null;
          if (solved) show = 'settings';
        }}
      />
    </div>
  {/if}
{/if}
