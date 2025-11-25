<script lang="ts">
    import type { Buildable } from "$lib/buildable";
    import database from "$lib/database/main";

  const data: {
    table: TableCard | DeleteCard;
    modifiers: Buildable<ModifierCard>[];
  } = $props();
</script>
