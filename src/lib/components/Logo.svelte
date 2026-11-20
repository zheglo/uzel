
<script lang="ts">
  import { getContext } from 'svelte';

  import {
    navigationIntroKey,
    type NavigationIntroState
  } from '#lib/motion/navigation/context.ts';

  const navigationIntro =
    getContext<NavigationIntroState>(navigationIntroKey);
</script>


<a
  data-navigation-logo
  class="hero-logo fixed left-[var(--hero-logo-left)] top-0 z-30 block h-[var(--hero-mark-size)] w-[var(--hero-mark-size)] transition-transform duration-200 ease-out motion-reduce:transition-none"
  class:logo-hover-enabled={!navigationIntro.heroVisible}
  style:transform={navigationIntro.logoVisible
    ? 'translateY(0)'
    : 'translateY(-100%)'}
  href="#hero"
  aria-label="Вернуться на главный экран"
  inert={navigationIntro.heroVisible || !navigationIntro.logoVisible}
>
  <svg
    class="block h-full w-full"
    xmlns="http://www.w3.org/2000/svg"
    width="128"
    height="128"
    viewBox="0 0 128 128"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M69,0v99c0-11,9-20,20-20s20,9,20,20-9,20-20,20-20-9-20-20v29h59V0h-59Z"
    />

    <rect width="59" height="128" />
  </svg>
</a>

<style>
  .hero-logo {
    color: #000;

    --hero-text-width: min(1150px, 54vw);
    --hero-logo-height: min(196px, 7.65625vw);
    --hero-text-height: calc(88dvh - var(--hero-logo-height));

    --hero-first-row-height: min(
      calc(var(--hero-text-width) * 116 / 1150),
      calc(var(--hero-text-height) / 9)
    );

    --hero-first-text-width: calc(
      var(--hero-first-row-height) * 614 / 116
    );

    --hero-first-text-left: calc(
      30vw + var(--hero-text-width) / 2
      - var(--hero-first-text-width)
    );

    /* Размер и зазор пропорциональны первой надписи */
    --hero-mark-size: calc(
      var(--hero-first-text-width) * 128 / 614
    );

    --hero-mark-gap: calc(
      var(--hero-first-text-width) * 46 / 614
    );

    --hero-logo-left: calc(
      var(--hero-first-text-left)
      - var(--hero-mark-gap)
      - var(--hero-mark-size)
    );
  }

  .hero-logo.logo-hover-enabled:hover,
  .hero-logo.logo-hover-enabled:focus-visible {
    color: #c1272d;
  }

  .hero-logo:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 4px;
  }

  @media (max-width: 600px) and (orientation: portrait) {
    .hero-logo {
      --hero-logo-height: calc(60vw * 196 / 902);

      --hero-first-row-height: min(
        calc(var(--hero-text-width) * 116 / 1150 * 1.3),
        calc(var(--hero-text-height) / 11)
      );

      --hero-first-text-width: min(
        var(--hero-text-width),
        calc(var(--hero-first-row-height) * 614 / 116)
      );
    }
  }
</style>