<script>
import { writable } from 'svelte/store';
import { themes } from '../themes';
import { currentColor1, currentColor2, currentThemename, currentThemevalue } from '../stores';

    let isOpen = false;
    export let selectedThemevalue = writable(themes[0].value);
    export let selectedThemename = writable(themes[0].name);
      console.log("MyThemesDropdown")
      console.log("selectedThemevalue")
      console.log($currentThemename)
      console.log("selectedThemename")
      console.log($currentThemevalue)

    function toggleDropdown() {
      isOpen = !isOpen;
    }
     
     function selectTheme(name, value) {
      const color1 = $currentColor1
      const color2 = $currentColor2

      selectedThemevalue.set(value);
      selectedThemename.set(name);

      console.log("currentThemename")
      console.log($currentThemename)
      console.log("currentThemevalue")
      console.log($currentThemevalue)
      console.log("color1")
      console.log(color1)
      console.log("color2")
      console.log(color2)

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

    $: selectedThemevalue = selectedThemevalue; 
    $: selectedThemename = selectedThemename; 
  </script>
  <h3>Themes</h3>
  <div class="dropdown" class:open={isOpen}>
    <button class="dropdown" on:click={toggleDropdown}>
      {$selectedThemename || 'Select a theme'}
    </button>
    {#if isOpen}
      <ul>
        {#each themes as theme}
          <li on:click={() => selectTheme(theme.name)}>{theme.name}</li>
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
  