import { animate } from 'motion';

const DURATION = 0.6;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Какие экраны считаются узкими.
const NARROW_QUERY = '(max-width: 767px)';

const PLATE_LEFT =
  'calc(-1 * (var(--card-side) + var(--screen-line-width)))';

const PANEL_HIDDEN = 'inset(0 0 0 100%)';
const PANEL_VISIBLE = 'inset(0 0 0 0)';

const MARK_HIDDEN = 'translateY(-100%)';
const MARK_VISIBLE = 'translateY(0%)';

const LEFT_WIDTH = '60%';
const LEFT_WIDTH_FULL = '100%';

const RIGHT_SHIFT = 'translateX(100%)';
const RIGHT_HOME = 'translateX(0%)';

interface AboutCardElements {
  panel: HTMLElement;
  markBox: HTMLElement;
  leftPart: HTMLElement;
  rightPart: HTMLElement;
}

interface ActiveCard extends AboutCardElements {
  shell: HTMLElement;
  plate: HTMLElement;
  mark: HTMLElement;
}

// 0 — закрыто, 1 — плашка, 2 — панель и ×, 3 — левая часть расширена.
type Stage = 0 | 1 | 2 | 3;

function lockPageScroll(panel: HTMLElement) {
  const block = (event: Event) => {
    if (event.target instanceof Node && panel.contains(event.target)) return;
    event.preventDefault();
  };

  window.addEventListener('wheel', block, { passive: false });
  window.addEventListener('touchmove', block, { passive: false });

  return () => {
    window.removeEventListener('wheel', block);
    window.removeEventListener('touchmove', block);
  };
}

export function createAboutCardTransition() {
  let active: ActiveCard | null = null;
  let closing = false;
  let stage: Stage = 0;
  let revision = 0;
  let unlockScroll: (() => void) | null = null;

  const animations: Array<{ cancel: () => void }> = [];
  const options = { duration: DURATION, ease: EASE };

  const reducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const narrow = () => window.matchMedia(NARROW_QUERY).matches;

  function stop() {
    revision += 1;

    for (let index = animations.length - 1; index >= 0; index -= 1) {
      animations[index].cancel();
    }

    animations.length = 0;
  }

  async function play(list: Array<ReturnType<typeof animate>>) {
    animations.push(...list);
    await Promise.all(list);
  }

  function applyPlate(card: ActiveCard) {
    card.plate.style.left = PLATE_LEFT;
  }

  function applyPanel(card: ActiveCard) {
    card.panel.style.clipPath = PANEL_VISIBLE;
    card.mark.style.transform = MARK_VISIBLE;
  }

  function applyExtend(card: ActiveCard) {
    card.leftPart.style.width = LEFT_WIDTH_FULL;
    card.rightPart.style.transform = RIGHT_SHIFT;
    card.rightPart.inert = true;
  }

  function restore(card: ActiveCard) {
    unlockScroll?.();
    unlockScroll = null;

    card.shell.style.removeProperty('z-index');
    card.plate.style.removeProperty('left');
    card.leftPart.style.removeProperty('width');
    card.rightPart.style.removeProperty('transform');
    card.rightPart.inert = false;
    card.panel.style.clipPath = PANEL_HIDDEN;
    card.panel.scrollTop = 0;
    card.mark.style.transform = MARK_HIDDEN;
    card.markBox.inert = true;
    stage = 0;
  }

  async function openSequence(card: ActiveCard, token: number) {
    stage = 1;
    applyPlate(card);

    await play([
      animate(card.plate, { left: ['0px', PLATE_LEFT] }, options)
    ]);

    if (token !== revision) return;

    stage = 2;
    applyPanel(card);

    await play([
      animate(card.panel, { clipPath: [PANEL_HIDDEN, PANEL_VISIBLE] }, options),
      animate(card.mark, { transform: [MARK_HIDDEN, MARK_VISIBLE] }, options)
    ]);

    if (token !== revision) return;

    stage = 3;
    applyExtend(card);

    await play([
      animate(card.leftPart, { width: [LEFT_WIDTH, LEFT_WIDTH_FULL] }, options),
      animate(card.rightPart, { transform: [RIGHT_HOME, RIGHT_SHIFT] }, options)
    ]);
  }

  function open(item: HTMLElement, elements: AboutCardElements): boolean {
    if (active) return false;

    const { panel, markBox, leftPart, rightPart } = elements;
    const shell = item.querySelector<HTMLElement>('[data-card-shell]');
    const plate = item.querySelector<HTMLElement>('[data-card-plate]');
    const mark = markBox.querySelector<HTMLElement>('[data-line-mark]');
    const line = markBox.offsetParent;

    if (!shell || !plate || !mark || !(line instanceof HTMLElement)) {
      return false;
    }

    // × прилипает к верхнему краю нажатой карточки.
    const top =
      item.getBoundingClientRect().top - line.getBoundingClientRect().top;

    const card: ActiveCard = {
      shell,
      plate,
      mark,
      panel,
      markBox,
      leftPart,
      rightPart
    };

    active = card;
    unlockScroll = lockPageScroll(panel);

    markBox.style.top = `${top}px`;
    markBox.inert = false;
    shell.style.zIndex = '30';

    const isNarrow = narrow();

    if (reducedMotion()) {
      applyPlate(card);
      applyPanel(card);

      if (isNarrow) applyExtend(card);

      stage = isNarrow ? 3 : 2;
      return true;
    }

    if (isNarrow) {
      void openSequence(card, revision);
      return true;
    }

    stage = 2;
    applyPlate(card);
    applyPanel(card);

    animations.push(
      animate(plate, { left: ['0px', PLATE_LEFT] }, options),
      animate(panel, { clipPath: [PANEL_HIDDEN, PANEL_VISIBLE] }, options),
      animate(mark, { transform: [MARK_HIDDEN, MARK_VISIBLE] }, options)
    );

    return true;
  }

  async function close() {
    const card = active;

    if (!card || closing) return;

    closing = true;
    card.markBox.inert = true;

    const startStage = stage;

    // Фактическое состояние сохраняем до отмены анимаций.
    const now = {
      plate: getComputedStyle(card.plate).left,
      clip: getComputedStyle(card.panel).clipPath,
      mark: getComputedStyle(card.mark).transform,
      width: getComputedStyle(card.leftPart).width,
      right: getComputedStyle(card.rightPart).transform
    };

    stop();

    const token = revision;

    // Фиксируем фактические значения, чтобы не было скачков.
    card.plate.style.left = now.plate;
    card.panel.style.clipPath = now.clip;
    card.mark.style.transform = now.mark;
    card.leftPart.style.width = now.width;
    card.rightPart.style.transform = now.right;

    if (!reducedMotion()) {
      const reversePanel = () => {
        card.panel.style.clipPath = PANEL_HIDDEN;
        card.mark.style.transform = MARK_HIDDEN;

        return play([
          animate(card.panel, { clipPath: [now.clip, PANEL_HIDDEN] }, options),
          animate(card.mark, { transform: [now.mark, MARK_HIDDEN] }, options)
        ]);
      };

      const reversePlate = () => {
        card.plate.style.left = '0px';

        return play([
          animate(card.plate, { left: [now.plate, '0px'] }, options)
        ]);
      };

      const reverseExtend = () => {
        card.rightPart.inert = false;
        card.leftPart.style.width = LEFT_WIDTH;
        card.rightPart.style.transform = RIGHT_HOME;

        return play([
          animate(card.leftPart, { width: [now.width, LEFT_WIDTH] }, options),
          animate(card.rightPart, { transform: [now.right, RIGHT_HOME] }, options)
        ]);
      };

      if (startStage >= 3) {
        await reversePanel();
        if (token !== revision) return;

        await reverseExtend();
        if (token !== revision) return;

        await reversePlate();
        if (token !== revision) return;
      } else if (startStage === 2 && !narrow()) {
        await Promise.all([reversePanel(), reversePlate()]);
        if (token !== revision) return;
      } else {
        if (startStage >= 2) {
          await reversePanel();
          if (token !== revision) return;
        }

        await reversePlate();
        if (token !== revision) return;
      }
    }

    restore(card);
    active = null;
    closing = false;
  }

  // Мгновенный сброс без анимации.
  function reset() {
    stop();

    if (active) restore(active);

    active = null;
    closing = false;
  }

  return { open, close, reset };
}