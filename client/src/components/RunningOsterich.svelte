<script>
    import { onMount, afterUpdate } from "svelte";
  
    let position = -100;
    let interval;
    let currentFrame = 1;
    const totalFrames = 10;
  
    onMount(() => {
      interval = setInterval(moveCharacter, 200);
    });
  
    afterUpdate(() => {
      clearInterval(interval);
      interval = setInterval(moveCharacter, 200);
    });
  
    function moveCharacter() {
      position += 1;
      if (position >= window.innerWidth) {
        position = -100;
      }
  
      currentFrame = currentFrame === totalFrames ? 1 : currentFrame + 1;
    }
  </script>
  
  <div class="character" style="left: {position}px;">
    {#each Array.from({ length: totalFrames }, (_, i) => i + 1) as frame}
      {#if currentFrame === frame}
        <img src={`/img/osterich${frame}.svg`} alt={`Running Frame ${frame}`} class="running-animation" />
      {/if}
    {/each}
  </div>
  
  <style>
    .character {
      position: fixed;
      bottom: 0;
      width: 100px;
      height: 100px;
    }
  
    .running-animation {
      width: 100%;
      height: 100%;
    }
  </style>
  