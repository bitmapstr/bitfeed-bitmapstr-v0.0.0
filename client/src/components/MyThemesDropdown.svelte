<script>
import { writable } from 'svelte/store';
import { themes } from '../themes';
import { currentColor1, currentColor2, currentThemename, currentThemevalue, settingsBitmap } from '../stores';
import { onMount } from 'svelte';

    let isOpen = false;
    export let selectedThemename = writable(themes[0].name);
    export let selectedThemevalue = writable(themes[0].value);
    export let color1 = writable(currentColor1);
    export let color2 = writable(currentColor2);

     
    function selectTheme(name, value) {
      selectedThemename.set(name);
      currentThemename.set(name)
      selectedThemevalue.set(value);
      currentThemevalue.set(value)

      // console.log("currentColor1")
      // console.log($currentColor1)
      // console.log("currentColor2")
      // console.log($currentColor2)

      toggleDropdown();      
    }
    $: selectedThemename = selectedThemename; 
    $: selectedThemevalue = selectedThemevalue;

    $: color1 = color1; 
    $: color2 = color2;

    function toggleDropdown() {
      isOpen = !isOpen;
      
    }

    function handleOutsideClick(event) {
      if (isOpen && !event.target.closest('.dropdown')) {
        toggleDropdown();
      }
    }

    
    // Listen for clicks outside the dropdown to close it
    onMount(() => {
      document.addEventListener('click', handleOutsideClick);
      return () => {
        document.removeEventListener('click', handleOutsideClick);
      };
    });

    
     
  </script>
  <h3>Themes</h3>
  <div class="dropdown" class:open={isOpen} >

    {#if $settingsBitmap.showMyBitmap}

    <button class="dropdown" style="background-color: {$currentColor1}" on:click={toggleDropdown} >
      {$selectedThemename || 'Select a theme'}
    </button>
    {:else}
    <button class="dropdown" on:click={toggleDropdown} >
      {$selectedThemename || 'Select a theme'}
    </button>

    {/if}
    {#if isOpen}
      <ul>
        {#each themes as theme}
        <li style="background-color: {$currentColor1}" on:click={(e) => selectTheme(theme.name, theme.value)}>{theme.name}</li>
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
  