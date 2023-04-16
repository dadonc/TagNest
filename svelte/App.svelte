<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import {createUser, getUsers} from './db'
  //import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  let users =  getUsers()
</script>

<main>
  <div>
    {#await users}
	    <p>...waiting</p>
    {:then users}
      {#each users as user}
        <p>{user.name}</p>
      {/each}
    {:catch error}
      <p style="color: red">{error.message}</p>
    {/await}


    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>Vite + Svelte</h1>

  <div class="card">
    <Counter />
    <button on:click={async () => {
      await createUser()
      users = getUsers()
      }}>CREATE TEST USER</button>
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
