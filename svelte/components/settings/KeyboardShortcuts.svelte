<script lang="ts">
  import Kbd from "./KBD.svelte";
</script>

<div>
  <h2 class="mb-2 text-lg font-semibold">General</h2>
  <Kbd keys={["command", "b"]} description="Toggle left sidebar" />
  <Kbd keys={["command", "shift", "b"]} description="Toggle right sidebar" />
  <Kbd keys={["command", "s"]} description="Save changes" />
  <Kbd keys={["command", "+"]} description="Scale everything up" />
  <Kbd keys={["command", "-"]} description="Scale everything down" />
  <Kbd keys={["ESC"]} description="Close modal or return to main grid" />
  <Kbd keys={["command", ","]} description="Open settings" />
  <Kbd keys={["command", "r"]} description="Reload window" />
  <Kbd keys={["command", "j"]} description="Open developer tools" />
  <Kbd
    keys={["command", "shift", "i"]}
    description="Global: Open add item modal"
  />
  <Kbd keys={["command", "w"]} description="Close pinned item" />
  <Kbd keys={["command", "option", "↔️"]} description="Next/previous pin" />
  <Kbd keys={["command", "[1-9]"]} description="Jump to pin at position 1-9" />

  <h2 class="mt-8 mb-2 text-lg font-semibold">Main grid</h2>
  <Kbd
    keys={["command", "shift", "+"]}
    description="Decrease number of items in a row: items get larger"
  />
  <Kbd
    keys={["command", "shift", "-"]}
    description="Increase number of items in a row: items get smaller"
  />
  <Kbd keys={["command", "i"]} description="Edit selected item(s)" />
  <Kbd keys={["command", "shift", "s"]} description="Shuffle items" />
  <Kbd keys={["command", "a"]} description="Select all items" />
  <Kbd
    keys={["↕️", "↔️"]}
    combinator="or"
    description="Arrows: move selection"
  />
  <Kbd keys={["command", "click"]} description="Select multiple items" />
  <Kbd
    keys={["shift", "click"]}
    description="Select first and last item to select multiple items"
  />
  <Kbd keys={["enter"]} description="Open selected item" />
  <Kbd keys={["command", "f"]} description="Focus search input" />
  <Kbd keys={["command", "backspace"]} description="Delete selected item(s)" />
  <Kbd keys={["space"]} description="Show item preview" />

  <h2 class="mt-8 mb-2 text-lg font-semibold">Video</h2>
  <Kbd keys={["space"]} description="Play/pause" />
  <Kbd keys={["↔️"]} description="10s back/forward" />
  <Kbd keys={["↕️"]} description="60s back/forward" />
  <Kbd keys={["command", "↕️"]} description="5min back/forward" />
  <Kbd
    keys={["command", "d"]}
    description="Create video mark at current timestamp"
  />
  <Kbd
    keys={["command", "x"]}
    description="Delete video mark at current timestamp"
  />
  <Kbd keys={["command", "↔️"]} description="Jump to previous/next mark" />
  <Kbd keys={["f"]} description="Make fullscreen" />
</div>
