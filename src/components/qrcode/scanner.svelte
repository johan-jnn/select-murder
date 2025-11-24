<script lang="ts">
  import { Settings } from '$lib/settings';
  import QrScanner from 'qr-scanner';
  import { onMount } from 'svelte';

  const preferedCamera = new Settings(window.sessionStorage).binded('prefered-camera');

  let video: HTMLVideoElement;
  let scanner: QrScanner;
  let camera: QrScanner.FacingMode =
    (preferedCamera.get() as QrScanner.FacingMode | null) ?? 'user';

  const { oncancel = () => {}, onscanned = () => {} } = $props<{
    oncancel?: () => any;
    onscanned?: (content: string) => any;
  }>();

  function switchCam() {
    camera = camera === 'environment' ? 'user' : 'environment';
    preferedCamera.set(camera);
    scanner.setCamera(camera);
  }

  onMount(() => {
    scanner = new QrScanner(video, (result) => {
      onscanned(result);
      scanner.stop();
    });
    scanner.setCamera(camera);
    scanner.start().catch(() => {
      alert('Your camera seems to be offline.');
      oncancel();
    });
  });
</script>

<div
  id="qrscanner"
  aria-label="If this element is present, the app will ask you for your camera to properly scan the QR-code"
>
  <div class="overlay">
    <header>
      <h2>Scan your card's QR-Code</h2>
    </header>

    <div class="actions">
      <button type="button" onclick={switchCam}>Change camera</button>
      <button type="button" onclick={() => oncancel()}>Cancel</button>
    </div>
  </div>
  <video bind:this={video} aria-hidden="true"></video>
</div>

<style lang="scss">
  #qrscanner {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);

    video {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: -1;
    }

    .overlay {
      width: 100%;
      height: 100%;
      border: 4px solid white;
      display: grid;
      grid-template-rows: auto auto;
      grid-template-columns: 1fr;
      place-content: space-between;

      header {
        padding: 2em;
        backdrop-filter: blur(5px);
        text-align: center;
      }

      button {
      }
    }
  }
</style>
