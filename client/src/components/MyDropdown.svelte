<script>
    let isOpen = false;
    let selectedTheme = '';
    const themes = ['LIGHT PINK', 'AQUA BLUES', 'PINK', 'PINK-RED', 'PINK-WHITE-RED'];

  
    function toggleDropdown() {
      isOpen = !isOpen;
    }
  
    function selectTheme(Theme) {
      selectedTheme = Theme;

      //  widthGLsizei  = 256
        // heightGLsizei = 256
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
  </script>
  <h3>Themes</h3>
  <div class="dropdown" class:open={isOpen}>
    <button class="dropdown" on:click={toggleDropdown}>
      {selectedTheme || 'Select a theme'}
    </button>
    {#if isOpen}
      <ul>
        {#each themes as theme}
          <li on:click={() => selectTheme(theme)}>{theme}</li>
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
  