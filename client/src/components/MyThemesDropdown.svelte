<script>
import { writable } from 'svelte/store';
import { themes } from '../themes';
import { currentTheme } from '../stores';

    let isOpen = false;
    export let selectedTheme = writable(themes[0].name);
   
    function toggleDropdown() {
      isOpen = !isOpen;
    }
     
     function selectTheme(theme) {

      
      selectedTheme.set(theme);
      console.log(theme)

      console.log("currentTheme")
      console.log(currentTheme.set(theme))

      toggleDropdown();
      
    }


    function handleOutsideClick(event) {
      if (isOpen && !event.target.closest('.dropdown')) {
        toggleDropdown();
      }
    }
    // Listen for clicks outside the dropdown to close it
    // onMount(() => {
    //   document.addEventListener('click', handleOutsideClick);
    //   return () => {
    //     document.removeEventListener('click', handleOutsideClick);
    //   };
    // });

    $: selectedTheme = selectedTheme; 

  </script>
  <h3>Themes</h3>
  <div class="dropdown" class:open={isOpen}>
    <button class="dropdown" on:click={toggleDropdown}>
      {selectedTheme.value || 'Select a theme'}
    </button>
    {#if isOpen}
      <ul>
        {#each themes as theme}
          <li on:click={() => selectTheme(theme.value)}>{theme.name}</li>
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
  