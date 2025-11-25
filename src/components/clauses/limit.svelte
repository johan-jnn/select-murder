<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import type { Collection } from 'dexie';
  import type { Component } from 'svelte';

  export class LimitBuilder extends Buildable<LimitCard, { max: number }> {
    binded: { max: number } = { max: 10 };
    COMPONENT = import('./limit.svelte').then((c) => c.default as Component);
    build(query: Collection): Collection {
      return query.limit(this.binded.max);
    }
  }
</script>

<script lang="ts">
  let {
    builder
  }: {
    builder: LimitBuilder;
    table: TableCard;
    stack: Buildable<QRCard>[];
  } = $props();

  let max = $state(builder.binded.max);
  $effect(() => {
    builder.binded.max = max;
  });
</script>

<label for="max-{builder.id}">
  Set the maximum returned rows ({max}):
  <input type="range" min="1" max="100" bind:value={max} id="max-{builder.id}" />
</label>
