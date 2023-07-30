<script>
  import { writable } from 'svelte/store';
  import { themes } from '../themes.js';

  // Create the writable store for selectedTheme
  const selectedThemeStore = writable(themes[0].value);

  export let selectedTheme; // Export the selectedTheme as a prop
  $: selectedTheme = $selectedThemeStore; 
  function changeTheme(theme) {
    selectedTheme.set(theme);
    console.log(theme)
    // document.body.style.backgroundColor = `hsl(0, 100%, ${theme}%)`; // Adjust the background color based on the theme value
  }

  let isOpen = false;
  function toggleDropdown() {
      isOpen = !isOpen;
    }
   
</script>

<h3>Themes</h3>
<div class="dropdown" class:open={isOpen}>
  <button class="dropdown" on:click={toggleDropdown}>
    {selectedTheme.name || 'Select a theme'}
  </button>
  {#if isOpen}
    <ul>
      {#each themes as theme}
        <li on:click={() => changeTheme(theme.value)}>{theme.name}</li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dropdown {
    position: relative;
  }
  .dropdown button {
    background-color: var(--palette-good);
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
  }
  .dropdown ul {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1;
    list-style: none;
    padding: 0;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color:var(--palette-good);
  }
  .dropdown ul li {
    padding: 5px 10px;
    cursor: pointer;
  }
  .dropdown ul li:hover {
    background-color: #f1f1f1;
  }
  .open .dropdown ul {
    display: block;
  }
</style>

