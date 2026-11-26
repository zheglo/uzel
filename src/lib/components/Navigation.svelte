<script lang="ts">
  import { getContext } from 'svelte';

  import nav1 from '#lib/assets/navigation/nav1.svg';
  import nav2 from '#lib/assets/navigation/nav2.svg';
  import nav3 from '#lib/assets/navigation/nav3.svg';
  import nav4 from '#lib/assets/navigation/nav4.svg';

  import {
    createSectionTransition
  } from '#lib/motion/navigation/section-transition.ts';

  import {
    navigationIntroKey,
    type NavigationIntroState
  } from '#lib/motion/navigation/context.ts';

  const navigationIntro =
    getContext<NavigationIntroState>(navigationIntroKey);

  const navigation = [
    { href: '#about', src: nav1, label: 'О нас' },
    { href: '#works', src: nav2, label: 'Работы' },
    { href: '#contacts', src: nav3, label: 'Контакты' }
  ];

  let selectedHref = $state<string | null>(null);

  const sectionTransition = createSectionTransition({
    clearSelection: () => {
      selectedHref = null;
    }
  });

  $effect(() => {
    if (navigationIntro.heroVisible) {
      selectedHref = null;
    }
  });
</script>

<nav
  class="pointer-events-none fixed inset-y-0 right-0 z-20 w-[40%] [container-type:inline-size]"
  aria-label="Основная навигация"
  {@attach sectionTransition}
>
  <div
    data-navigation-backdrop
    class="pointer-events-none absolute inset-0 z-0 bg-black opacity-0"
    aria-hidden="true"
  ></div>

  <div
    data-navigation-position
    class="absolute left-1/2 top-[40%] z-[1] w-[calc(100cqw*430/488)] -translate-x-1/2 -translate-y-1/2"
    style:opacity={navigationIntro.opacity}
    inert={navigationIntro.opacity === 0}
  >
    <div
      id="navigation-menu"
      data-navigation-body
      class="navigation-body flex flex-col gap-[calc(100cqw*58/488)]"
    >
      {#each navigation as item (item.href)}
        <div
          data-navigation-slot
          class="navigation-slot aspect-[430/58] w-full flex-none"
        >
          <a
            class="navigation-underlay"
            href="#hero"
            aria-label="На главный экран"
          >
            <span
              class="navigation-hero-letters"
              style:mask-image={`url("${nav4}")`}
              aria-hidden="true"
            ></span>
          </a>

          <a
            data-navigation-link
            class="navigation-link pointer-events-auto block"
            class:is-selected={selectedHref === item.href}
            href={item.href}
            aria-label={item.label}
            onclick={() => {
              selectedHref = item.href;
            }}
          >
            <div class="navigation-clip">
              <span
                class="navigation-letters"
                style:mask-image={`url("${item.src}")`}
                aria-hidden="true"
              ></span>
            </div>
          </a>
        </div>
      {/each}
    </div>
  </div>
  <button
    data-navigation-toggle
    class="navigation-toggle"
    type="button"
    aria-label="Открыть меню"
    aria-expanded="false"
    aria-controls="navigation-menu"
    hidden
  ></button>

  <div
    class="navigation-heading-layer"
    style:opacity={navigationIntro.opacity}
    inert={navigationIntro.opacity === 0}
  >
    {#each navigation as item (item.href)}
      <a
        data-navigation-heading
        class="navigation-heading"
        href={item.href}
        aria-label={item.label}
        inert
      >
        <span
          class="navigation-heading-letters"
          style:mask-image={`url("${item.src}")`}
          aria-hidden="true"
        ></span>
      </a>
    {/each}
  </div>
</nav>

<style>
  .navigation-body {
    transform-origin: center;
  }

  .navigation-slot {
    position: relative;
    clip-path: inset(0% 0% 0% 0%);
  }

  .navigation-underlay {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: auto;
    background-color: #fff;
  }

  .navigation-link {
    position: absolute;
    inset: 0;
    z-index: 1;
  }

  .navigation-clip {
    position: absolute;
    inset: 0;
    background-color: #fff;
    clip-path: inset(0% 0% 0% 0%);
  }

  .navigation-letters,
  .navigation-hero-letters,
  .navigation-heading-letters {
    position: absolute;
    inset: 0;
    background-color: #d0d3d0;
    mask-repeat: no-repeat;
    mask-size: 100% 100%;
  }

  .navigation-link:hover .navigation-letters {
    background-color: #c1272d;
  }

  .navigation-link:active .navigation-letters,
  .navigation-link.is-selected .navigation-letters {
    background-color: #000;
  }

  .navigation-underlay:hover .navigation-hero-letters {
    background-color: #c1272d;
  }

  .navigation-underlay:active .navigation-hero-letters {
    background-color: #000;
  }

  .navigation-heading-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
  }

  .navigation-heading {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
    pointer-events: auto;
    background-color: #fff;
    transform-origin: top left;
  }

  .navigation-heading-letters {
    background-color: #000;
  }

  .navigation-toggle {
    position: absolute;
    left: 50%;
    top: 50%;
    z-index: 3;
    padding: 0;
    border: 0;
    background: transparent;
    cursor: pointer;
    pointer-events: auto;
    transform: translate(-50%, -50%);
  }

  .navigation-toggle[hidden] {
    display: none;
  }

  .navigation-toggle:focus-visible {
    outline: 2px solid #c1272d;
    outline-offset: 5px;
  }
</style>