<script lang="ts">
  import { getUsers} from './db'
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
  </div>
</main>
