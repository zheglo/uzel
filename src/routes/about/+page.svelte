<script lang="ts">
  import AboutCard from '#lib/components/AboutCard.svelte';
  import closeIcon from '#lib/assets/close_b.svg';
  import image1 from '#lib/assets/about/partola_card.webp';
  import image2 from '#lib/assets/about/segal_card.webp';
  import image3 from '#lib/assets/about/zheglo_card.webp';
  import image4 from '#lib/assets/about/nikita_card.webp';
  // import image5 from '#lib/assets/about/card-5.webp';
  // import image6 from '#lib/assets/about/card-6.webp';
  // import image7 from '#lib/assets/about/card-7.webp';
  import { createAboutCardTransition } from '#lib/motion/about/card.ts';

  const initialCards = [
    { id: 'card-1', title: 'Алексей Партола', description: 'управление кросс-функциональными командами', image: image1, imageAlt: 'Алексей Партола' },
    { id: 'card-2', title: 'Матвей Сегал', description: 'аниматор', image: image2, imageAlt: 'Матвей Сегал' },
    { id: 'card-3', title: 'Сергей Юрьевич Жегло', description: 'маргинальный мэтр отечественного дизайна', image: image3, imageAlt: 'Сергей Жегло' },
    { id: 'card-4', title: 'Никита Скрябин', description: 'отец-основатель, главный начальник', image: image4, imageAlt: 'Никита Скрябин' },
    { id: 'card-5', title: 'Заголовок 5', description: 'Описание 5', image: '', imageAlt: '' },
    { id: 'card-6', title: 'Заголовок 6', description: 'Описание 6', image: '', imageAlt: '' },
    { id: 'card-7', title: 'Заголовок 7', description: 'Описание 7', image: '', imageAlt: '' }
  ];

  const transition = createAboutCardTransition();

  let cards = $state.raw(initialCards);
  let activeId = $state<string | null>(null);

  let panel: HTMLElement | undefined;
  let markBox: HTMLElement | undefined;

  let leftPart: HTMLElement | undefined;
  let rightPart: HTMLElement | undefined;

  function shuffle<T>(items: readonly T[]): T[] {
    const result = [...items];

    for (let index = result.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }

    return result;
  }

  function shuffleWhenHidden(section: HTMLElement) {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        transition.reset();
        activeId = null;
        cards = shuffle(cards);
      }
    });

    observer.observe(section);

    return () => observer.disconnect();
  }

  async function closeCard() {
    await transition.close();
    activeId = null;
  }

  function selectCard(id: string, item: HTMLElement) {
    if (activeId || !panel || !markBox || !leftPart || !rightPart) return;

    if (transition.open(item, { panel, markBox, leftPart, rightPart })) {
      activeId = id;
    }
  }
</script>

<section
  id="about"
  class="about relative h-dvh overflow-hidden"
  {@attach shuffleWhenHidden}
>
  <div bind:this={leftPart} class="absolute inset-y-0 left-0 w-[60%] bg-[#D0D3D0]">
    <!-- Левый текст -->

    <div
      bind:this={panel}
      class="absolute inset-x-0 bottom-0 bg-white"
      style="top: var(--cards-top); clip-path: inset(0 0 0 100%);"
    ></div>

    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-[var(--screen-line-width)] bg-black"
    >
      <button
        bind:this={markBox}
        type="button"
        inert
        aria-label="Закрыть"
        class="pointer-events-auto absolute left-0 z-40 m-0 block cursor-pointer overflow-hidden border-0 bg-transparent p-0"
        style="width: var(--screen-line-width); height: var(--screen-line-width);"
        onclick={closeCard}
      >
        <span
          data-line-mark
          class="block size-full"
          style="transform: translateY(-100%);"
        >
          <img src={closeIcon} alt="" class="block size-full" />
        </span>
      </button>
    </div>
  </div>

  <div bind:this={rightPart} class="absolute inset-y-0 right-0 w-[40%] bg-[#D0D3D0]">
    <div
      class="absolute inset-x-0 bottom-0 [container-type:inline-size]"
      style="top: var(--cards-top);"
    >
      <ul
        class="cards m-0 box-border flex h-full list-none flex-col gap-[var(--card-gap)] p-0 pb-[var(--card-side)] px-[var(--card-side)]"
      >
        {#each cards as card (card.id)}
          <li
            class="relative h-[var(--card-height)] flex-none"
            onclick={(event) => selectCard(card.id, event.currentTarget)}
          >
            <div data-card-shell class="absolute inset-y-0 right-0 left-0">
              <div
                data-card-plate
                class="absolute inset-y-0 right-0 left-0 -z-10 bg-white"
              ></div>
              <AboutCard
                title={card.title}
                description={card.description}
                image={card.image}
                imageAlt={card.imageAlt}
              />
            </div>
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
</style>