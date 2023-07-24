<script>
export let value = 0

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
  <h3>Colors</h3>
  <!-- Slider input element -->
  <input 
   
    class="slider"
    type="range"
    min="0"
    max="100"
    
    bind:value
    on:input={handleChange}
  />
  <!-- Display current value of the slider -->
  <p>Value: {value}</p>
</div>
