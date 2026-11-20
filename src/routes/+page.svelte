<script lang="ts">
  import Hero from './hero/+page.svelte';
  import About from './about/+page.svelte';
  import Works from './works/+page.svelte';
  import Contacts from './contacts/+page.svelte';
</script>

<div
  data-navigation-screen="hero"
  class="snap-start [scroll-snap-stop:always]"
>
  <Hero />
</div>

<div
  data-navigation-screen="about"
  class="snap-start [scroll-snap-stop:always]"
>
  <About />
</div>

<div
  data-navigation-screen="works"
  class="snap-start [scroll-snap-stop:always]"
>
  <Works />
</div>

<div
  data-navigation-screen="contacts"
  class="snap-start [scroll-snap-stop:always]"
>
  <Contacts />
</div>

<style>
  :global(html) {
    scroll-snap-type: y mandatory;
    scroll-behavior: smooth;
  }

  @media (prefers-reduced-motion: reduce) {
    :global(html) {
      scroll-behavior: auto;
    }
  }
</style>