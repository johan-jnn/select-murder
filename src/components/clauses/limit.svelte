<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import type { Collection } from 'dexie';
  import type { Component } from 'svelte';

  export class LimitBuilder extends Buildable<LimitCard, { max: number }> {
    binded: { max: number } = { max: 100 };
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
  } = $props();
</script>

<p>This is a limit</p>
