<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import type { Collection } from 'dexie';
  import type { Component } from 'svelte';

  export class GroupBuilder extends Buildable<GroupByCard, null> {
    COMPONENT = import('./group.svelte').then((c) => c.default as Component);
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
    builder: GroupBuilder;
    table: TableCard;
    stack: Buildable<QRCard>[];
  } = $props();
</script>
