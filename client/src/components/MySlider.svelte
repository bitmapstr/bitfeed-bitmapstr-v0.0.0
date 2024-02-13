<script>
export let value = 0
export let sliderName

function handleChange(event) {
    value = event.target.value;
   
  }
</script>

<style>
  .slider {
    width: 100%;
  }
</style>

<div>
  <!-- Slider input element -->
  <input 
   
    class="slider"
    type="range"
    min="0"
    max="1000"
    
    bind:value
    on:input={handleChange}
  />
  <!-- Display current value of the slider -->
  <p>{sliderName}</p>
  <p>Value: {value}</p>
</div>
