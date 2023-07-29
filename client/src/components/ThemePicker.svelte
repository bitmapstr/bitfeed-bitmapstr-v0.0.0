<script>
    import { writable } from 'svelte/store';
   export let themes = [
      { name: 'LIGHT PINK', value: 25 },
      { name: 'PINK-WHITE-RED', value: 75 },
      { name: 'PINK-RED', value: 100 },
      { name: 'LIGHT PINK', value: 150 },
      { name: 'ORANGY AUTUMN', value: 256 },
      { name: 'AQUA BLUES', value: 500 }

    ];

    let isOpen = false;
 
    export let selectedTheme = themes[0].value;
    console.log(selectedTheme)

     function toggleDropdown() {
      isOpen = !isOpen;
    }
  
    function selectTheme(theme) {
        
        selectedTheme =theme;       
        console.log(selectedTheme)      
        toggleDropdown();
    }
  
    function handleOutsideClick(event) {
      if (isOpen && !event.target.closest('.dropdown')) {
        toggleDropdown();
      }
    }
  </script>
  
  <div class="dropdown" class:open={isOpen}>
    <form on:submit|preventDefault={selectTheme}>
        <select bind:value={selectedTheme} on:change={() => selectTheme(selectedTheme)}>
            <option>Select ur Theme</option>
                {#each themes as theme, value}
                {console.log("{Theme:} " + theme.value)}
                    <option value={theme.name}>{theme.name}</option>
                {/each}
        </select>
    </form>
    <!-- <button on:click={toggleDropdown}>
      {selectedtheme || 'Select a theme'}
    </button>
    {#if isOpen}
      <ul>
        {#each themes as theme}
          <li  on:click={() => selectTheme(theme.name)}>{theme.name}</li>
        {/each}
      </ul>
    {/if} -->
  </div>
  
  <style>
    .dropdown {
      position: relative;
    }
    /* .dropdown button {
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
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
      background-color: #fff;
    } */
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
