<script lang="ts" module>
  import { Buildable } from '$lib/buildable';
  import type { Collection } from 'dexie';
  import type { Component } from 'svelte';

  export class JoinBuilder extends Buildable<TableJoinCard, null> {
    COMPONENT = import('./join.svelte').then((c) => c.default as Component);
    PRIORITY: number = 0;
    binded = null;
    build(query: {[key: string]: string}[]): {[key: string]: string}[] {
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
    table: TableCard;
    stack: Buildable<QRCard>[];
  } = $props();
</script>
