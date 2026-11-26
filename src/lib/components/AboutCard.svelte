<script lang="ts">
  interface Props {
    title: string;
    description: string;
    image: string;
    imageAlt: string;
  }

  let { title, description, image, imageAlt }: Props = $props();
</script>

<article
  class="group absolute inset-y-0 right-0 flex w-full items-center bg-white pl-[var(--card-height)]"
>
  <div
    class="absolute bottom-0 left-0 h-full w-[var(--card-height)] overflow-hidden transition-[height] duration-300 ease-out group-hover:h-[calc(100%+var(--head-room))]"
  >
    <img
      class="block h-auto w-full translate-y-[calc(var(--card-height)/4)] grayscale transition-[transform,filter] duration-300 ease-out group-hover:translate-y-0 group-hover:grayscale-0"
      src={image}
      alt={imageAlt}
    />
  </div>

  <div class="min-w-0">
    <h3 class="m-0">{title}</h3>
    <p class="m-0">{description}</p>
  </div>
</article>