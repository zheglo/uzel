<script lang="ts">
  import AboutCard from '#lib/components/AboutCard.svelte';
  import image1 from '#lib/assets/about/partola_card.webp';
  import image2 from '#lib/assets/about/segal_card.webp';
  import image3 from '#lib/assets/about/zheglo_card.webp';
  // import image4 from '#lib/assets/about/card-4.webp';
  // import image5 from '#lib/assets/about/card-5.webp';
  // import image6 from '#lib/assets/about/card-6.webp';
  // import image7 from '#lib/assets/about/card-7.webp';

  const cards = [
    { id: 'card-1', title: 'Алексей Партола', description: 'Описание 1', image: image1, imageAlt: 'Алексей Партола' },
    { id: 'card-2', title: 'Матвей Сегал', description: 'Описание 2', image: image2, imageAlt: 'Матвей Сегал' },
    { id: 'card-3', title: 'Сергей Юрьевич Жегло', description: 'Описание 3', image: image3, imageAlt: 'Сергей Жегло' },
    { id: 'card-4', title: 'Никита Скрябин', description: 'Описание 4', image: '', imageAlt: '' },
    { id: 'card-5', title: 'Заголовок 5', description: 'Описание 5', image: '', imageAlt: '' },
    { id: 'card-6', title: 'Заголовок 6', description: 'Описание 6', image: '', imageAlt: '' },
    { id: 'card-7', title: 'Заголовок 7', description: 'Описание 7', image: '', imageAlt: '' }
  ];
</script>

<section
  id="about"
  class="about relative h-dvh overflow-hidden">
  <div class="absolute inset-y-0 left-0 w-[60%] bg-[#D0D3D0]">
    <!-- Левый текст -->

    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-[var(--screen-line-width)] bg-black"
    ></div>
  </div>

  <div
    class="absolute inset-y-0 right-0 w-[40%] bg-[#D0D3D0]">
  >
    <div
      class="absolute inset-x-0 bottom-0 [container-type:inline-size]"
      style="top: var(--cards-top);"
    >
      <ul
        class="cards m-0 box-border flex h-full list-none flex-col gap-[var(--card-gap)] p-0 pb-[var(--card-side)] px-[var(--card-side)]"
      >
        {#each cards as card (card.id)}
          <li class="relative h-[var(--card-height)] flex-none">
            <AboutCard
              title={card.title}
              description={card.description}
              image={card.image}
              imageAlt={card.imageAlt}
            />
          </li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style>
  .about {
    --hamburger-size: var(--hamburger-height, calc(40vw * 58 / 488));
    --cards-space: calc(var(--hamburger-size) / 3);
    --cards-top: calc(var(--hamburger-size) + var(--cards-space));
    --cards-area: calc(100dvh - var(--cards-top));
  }

  .cards {
    --card-side: calc(100cqw * 29 / 488);
    --card-h1: calc((var(--cards-area) - var(--card-side)) / 10);
    --card-h2: calc((var(--cards-area) - 7 * var(--card-side)) / 7);
    --card-height: max(var(--card-h1), var(--card-h2));
    --card-gap: min(calc(var(--card-height) / 2), var(--card-side));
    --cards-bar: calc(var(--hamburger-size) / 9);
  }

  .cards li {
    --head-room: max(0px, calc(var(--card-gap) - var(--cards-space)));
  }

  .cards li:first-child {
    --head-room: max(0px, calc((var(--card-gap) - var(--cards-space))));
  }

</style>