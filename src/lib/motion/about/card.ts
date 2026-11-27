import { animate } from 'motion';

const DURATION = 0.6;
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Какие экраны считаются узкими.
const NARROW_QUERY = '(max-width: 767px)';

const PLATE_LEFT =
  'calc(-1 * (var(--card-side) + var(--screen-line-width)))';
// Плашка не оставляет полоски на линии, когда правая часть уходит за экран.
const PLATE_RETRACT = 'calc(-1 * var(--card-side))';

const PANEL_HIDDEN = 'inset(0 0 0 100%)';
const PANEL_VISIBLE = 'inset(0 0 0 0)';

const MARK_HIDDEN = 'translateY(-100%)';
const MARK_VISIBLE = 'translateY(0%)';

const LEFT_WIDTH = '60%';
const LEFT_WIDTH_FULL = '100%';

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

export function createAboutCardTransition() {
  let active: ActiveCard | null = null;
  let closing = false;
  let extended = false;
  let revision = 0;

  const animations: Array<{ cancel: () => void }> = [];

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

  function restore(card: ActiveCard) {
    card.shell.style.removeProperty('z-index');
    card.plate.style.removeProperty('left');
    card.leftPart.style.removeProperty('width');
    card.rightPart.style.removeProperty('transform');
    card.rightPart.style.removeProperty('visibility');
    card.rightPart.inert = false;
    card.panel.style.clipPath = PANEL_HIDDEN;
    card.mark.style.transform = MARK_HIDDEN;
    card.markBox.inert = true;
    extended = false;
  }

  function applyExtended(card: ActiveCard) {
    extended = true;
    card.leftPart.style.width = LEFT_WIDTH_FULL;
    card.rightPart.style.transform = 'translateX(100%)';
    card.rightPart.style.visibility = 'hidden';
    card.rightPart.inert = true;
    card.plate.style.left = PLATE_RETRACT;
  }

  async function extend(card: ActiveCard, token: number) {
    const options = { duration: DURATION, ease: EASE };

    extended = true;
    card.leftPart.style.width = LEFT_WIDTH_FULL;
    card.rightPart.style.transform = 'translateX(100%)';
    card.plate.style.left = PLATE_RETRACT;

    const running = [
      animate(card.leftPart, { width: [LEFT_WIDTH, LEFT_WIDTH_FULL] }, options),
      animate(card.rightPart, { transform: ['translateX(0%)', 'translateX(100%)'] }, options),
      animate(card.plate, { left: [PLATE_LEFT, PLATE_RETRACT] }, options)
    ];

    animations.push(...running);

    await Promise.all(running);

    if (token !== revision) return;

    card.rightPart.style.visibility = 'hidden';
    card.rightPart.inert = true;
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

    markBox.style.top = `${top}px`;
    markBox.inert = false;

    shell.style.zIndex = '30';
    plate.style.left = PLATE_LEFT;
    panel.style.clipPath = PANEL_VISIBLE;
    mark.style.transform = MARK_VISIBLE;

    const isNarrow = narrow();

    if (reducedMotion()) {
      if (isNarrow) applyExtended(card);
      return true;
    }

    const options = { duration: DURATION, ease: EASE };

    const running = [
      animate(plate, { left: ['0px', PLATE_LEFT] }, options),
      animate(panel, { clipPath: [PANEL_HIDDEN, PANEL_VISIBLE] }, options),
      animate(mark, { transform: [MARK_HIDDEN, MARK_VISIBLE] }, options)
    ];

    animations.push(...running);

    if (isNarrow) {
      const token = revision;

      void Promise.all(running).then(() => {
        if (token !== revision) return;
        void extend(card, token);
      });
    }

    return true;
  }

  async function close() {
    const card = active;

    if (!card || closing) return;

    closing = true;
    card.markBox.inert = true;

    const wasExtended = extended;
    const options = { duration: DURATION, ease: EASE };

    // Фактическое состояние сохраняем до отмены анимаций.
    const fromExtended = {
      width: getComputedStyle(card.leftPart).width,
      transform: getComputedStyle(card.rightPart).transform,
      left: getComputedStyle(card.plate).left
    };

    stop();

    let token = revision;

    if (wasExtended && !reducedMotion()) {
      card.rightPart.style.removeProperty('visibility');
      card.rightPart.inert = false;
      card.leftPart.style.width = LEFT_WIDTH;
      card.rightPart.style.transform = 'translateX(0%)';
      card.plate.style.left = PLATE_LEFT;

      const retract = [
        animate(card.leftPart, { width: [fromExtended.width, LEFT_WIDTH] }, options),
        animate(card.rightPart, { transform: [fromExtended.transform, 'translateX(0%)'] }, options),
        animate(card.plate, { left: [fromExtended.left, PLATE_LEFT] }, options)
      ];

      animations.push(...retract);

      await Promise.all(retract);

      if (token !== revision) return;
    } else if (wasExtended) {
      card.rightPart.style.removeProperty('visibility');
      card.rightPart.inert = false;
    }

    // Состояние для второй фазы читаем после первой.
    const from = {
      left: getComputedStyle(card.plate).left,
      clip: getComputedStyle(card.panel).clipPath,
      transform: getComputedStyle(card.mark).transform
    };

    if (!reducedMotion()) {
      stop();
      token = revision;

      card.plate.style.left = '0px';
      card.panel.style.clipPath = PANEL_HIDDEN;
      card.mark.style.transform = MARK_HIDDEN;

      const running = [
        animate(card.plate, { left: [from.left, '0px'] }, options),
        animate(card.panel, { clipPath: [from.clip, PANEL_HIDDEN] }, options),
        animate(card.mark, { transform: [from.transform, MARK_HIDDEN] }, options)
      ];

      animations.push(...running);

      await Promise.all(running);

      if (token !== revision) return;
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