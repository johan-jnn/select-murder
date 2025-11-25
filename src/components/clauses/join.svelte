<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import type { Collection } from 'dexie';
  import type { Component } from 'svelte';

  export class JoinBuilder extends Buildable<TableJoinCard, null> {
    COMPONENT = import('./join.svelte').then((c) => c.default as Component);
    binded = null;
    build(query: Collection): Collection {
      // todo
      return query;
    }
  }
</script>

<script lang="ts">
  let {
    builder
  }: {
    builder: JoinBuilder;
  } = $props();
</script>
