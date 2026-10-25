import { animate } from 'motion';
import type { Attachment } from 'svelte/attachments';

export const heroO: Attachment<HTMLElement> = (root) => {
  const circle = root.querySelector('circle');
  const paths = root.querySelectorAll('path');

  if (!circle || !paths.length) return;

    const sequence = [
    // Рисуем круг через pathLength вместо strokeDashoffset
    [circle, { pathLength: [0, 1] }, { duration: 5 }],

  ];

  const controls = animate(sequence);

  // teardown: отменяем анимацию при анмаунте/перезапуске
  return () => controls.cancel();
};

}