<script>
  import Scanner from '../../components/qrcode/scanner.svelte';

  let scanning = $state(false);
  let value = $state('');
</script>

<h1>Application is ready</h1>
<p>Now we just have to make all the fucking components</p>

{#if scanning}
  <Scanner
    oncancel={() => (scanning = false)}
    onscanned={(result) => ((value = result), (scanning = false))}
  />
{:else}
  <p>Value: {value}</p>
  <button type="button" onclick={() => (scanning = true)}>Scan</button>
{/if}
