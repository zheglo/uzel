import { animate } from 'motion';
import type { Attachment } from 'svelte/attachments';

interface SectionTransitionOptions {
  clearSelection: () => void;
}

const CLOSE_DURATION = 0.4;
const OPEN_DURATION = 0.6;
const RAISE_DURATION = 1.0;
const DOCK_DURATION = 0.8;

const FULL = 'inset(0% 0% 0% 0%)';
const CLOSED = 'inset(50% 0% 50% 0%)';
const STRIP = 'inset(25% 0% 25% 0%)';

const LOGO_GAP = 0;
const HAMBURGER_TOP = 0;

const DOCK_REFERENCE_LOGO_SIZE = 128;
const DOCK_REFERENCE_HEADING_WIDTH = 430;
const LEFT_SCREEN_RATIO = 0.6;

type MenuState =
  | 'hero'
  | 'intro'
  | 'collapsed'
  | 'opening'
  | 'open'
  | 'closing';

export function createSectionTransition({
  clearSelection
}: SectionTransitionOptions): Attachment<HTMLElement> {
  return (navigation) => {
    const screens = Array.from(
      document.querySelectorAll<HTMLElement>(
        '[data-navigation-screen]'
      )
    );

    const body = navigation.querySelector<HTMLElement>(
      '[data-navigation-body]'
    );

    const toggleElement =
      navigation.querySelector<HTMLButtonElement>(
        '[data-navigation-toggle]'
      );

    const slots = Array.from(
      navigation.querySelectorAll<HTMLElement>(
        '[data-navigation-slot]'
      )
    );

    const links = Array.from(
      navigation.querySelectorAll<HTMLAnchorElement>(
        '[data-navigation-link]'
      )
    );

    const headings = Array.from(
      navigation.querySelectorAll<HTMLAnchorElement>(
        '[data-navigation-heading]'
      )
    );

    const letters = links.map((link) =>
      link.querySelector<HTMLElement>('.navigation-letters')
    );

    const allLetters = Array.from(
      body?.querySelectorAll<HTMLElement>(
        '.navigation-letters, .navigation-hero-letters'
      ) ?? []
    );

    const hero = screens.find(
      (screen) => screen.dataset.navigationScreen === 'hero'
    );

    const firstScreen = screens.find(
      (screen) => screen.dataset.navigationScreen === 'about'
    );

    if (
      !body ||
      !toggleElement ||
      !hero ||
      !firstScreen ||
      links.length !== 3 ||
      slots.length !== 3 ||
      headings.length !== 3
    ) {
      console.warn(
        'Navigation: не найдены необходимые элементы.'
      );
      return;
    }

    const menu = body;
    const toggle = toggleElement;

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    const visitedScreens = new Set<string>();

    const animations: Array<{ cancel: () => void }> = [];

    let pendingHref: string | null = null;
    let settledScreen = '';
    let currentIndex: number | null = null;
    let menuState: MenuState = 'hero';

    let screenGeometry:
      | ReturnType<typeof getGeometry>
      | null = null;

    let revision = 0;
    let frame = 0;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    function stopAnimations() {
      revision += 1;

      for (let index = animations.length - 1; index >= 0; index -= 1) {
        animations[index].cancel();
      }

      animations.length = 0;
    }

    function resetMenu() {
      menu.inert = false;
      menu.style.transform = 'translateY(0px) scale(1)';

      for (const slot of slots) {
        slot.style.clipPath = FULL;
      }

      for (const link of links) {
        link.style.removeProperty('visibility');
      }

      for (const element of allLetters) {
        element.style.removeProperty('opacity');
        element.style.removeProperty('background-color');
      }
    }

    function hideHeadings() {
      for (const heading of headings) {
        heading.inert = true;
        heading.style.visibility = 'hidden';
        heading.style.removeProperty('transform');
      }
    }

    function restoreHero() {
      stopAnimations();

      menuState = 'hero';
      screenGeometry = null;
      pendingHref = null;

      hideToggle();
      resetMenu();
      hideHeadings();

      currentIndex = null;
      clearSelection();
    }

    function getGeometry(index: number) {
      const slot = slots[index].getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();
      const navRect = navigation.getBoundingClientRect();

      const logo = document.querySelector<HTMLElement>(
        '[data-navigation-logo]'
      );

      const logoRect = logo?.getBoundingClientRect();

      const visibleHeight =
        menuRect.height - slot.height * 0.5;

      // Исходный масштаб сворачивания меню в гамбургер.
      const scale = slot.height / visibleHeight;

      const dockLeft = logoRect
        ? logoRect.right + LOGO_GAP
        : slot.left;

      const viewportWidth =
        document.documentElement.clientWidth;

      const availableWidth = Math.max(
        0,
        viewportWidth * LEFT_SCREEN_RATIO - dockLeft
      );

      // Размер закреплённой плашки пропорционален Logo.
      const preferredDockWidth = logoRect
        ? logoRect.width *
          DOCK_REFERENCE_HEADING_WIDTH /
          DOCK_REFERENCE_LOGO_SIZE
        : slot.width;

      const dockWidth = Math.min(
        preferredDockWidth,
        availableWidth
      );

      // Общий дополнительный масштаб плашки и гамбургера.
      const dockScale = slot.width > 0
        ? dockWidth / slot.width
        : 1;

      const hamburgerVisibleTop =
        menuRect.top +
        menuRect.height / 2 -
        slot.height * dockScale / 2;

      return {
        left: slot.left - navRect.left,
        startY: slot.top - navRect.top,
        endY: -navRect.top,
        width: slot.width,
        height: slot.height,
        scale,
        dockScale,

        dockX: dockLeft - slot.left,

        hamburgerY:
          HAMBURGER_TOP - hamburgerVisibleTop
      };
    }

    function hideMenuLetters() {
      for (const element of allLetters) {
        element.style.opacity = '0';
      }
    }

    function showMenuLetters() {
      for (const element of allLetters) {
        element.style.removeProperty('opacity');
        element.style.removeProperty('background-color');
      }
    }

    function hideToggle() {
      toggle.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    }

    function showToggle() {
      toggle.hidden = false;

      const parent = toggle.offsetParent;

      if (!(parent instanceof HTMLElement)) {
        toggle.hidden = true;
        return;
      }

      const parentRect = parent.getBoundingClientRect();
      const menuRect = menu.getBoundingClientRect();

      const firstSlot = slots[0].getBoundingClientRect();
      const lastSlot =
        slots[slots.length - 1].getBoundingClientRect();

      const visibleTop =
        firstSlot.top + firstSlot.height * 0.25;

      const visibleBottom =
        lastSlot.bottom - lastSlot.height * 0.25;

      toggle.style.left =
        `${menuRect.left - parentRect.left}px`;

      toggle.style.top =
        `${visibleTop - parentRect.top}px`;

      toggle.style.width =
        `${menuRect.width}px`;

      toggle.style.height =
        `${visibleBottom - visibleTop}px`;

      toggle.style.transform = 'none';

      toggle.setAttribute('aria-expanded', 'false');
    }

    function menuTransform(docked: boolean) {
      const geometry = screenGeometry;

      if (!geometry) {
        return 'translateY(0px) scale(1)';
      }

      const y = docked
        ? geometry.hamburgerY
        : 0;

      const scale = docked
        ? geometry.scale * geometry.dockScale
        : geometry.scale;

      return `translateY(${y}px) scale(${scale})`;
    }

    async function showScreen(
      index: number,
      immediately: boolean
    ) {
      stopAnimations();
      resetMenu();
      hideHeadings();

      menuState = 'intro';
      hideToggle();

      const token = revision;
      const heading = headings[index];
      const geometry = getGeometry(index);

      screenGeometry = geometry;
      currentIndex = index;

      heading.style.left = `${geometry.left}px`;
      heading.style.width = `${geometry.width}px`;
      heading.style.height = `${geometry.height}px`;
      heading.style.visibility = 'visible';
      heading.inert = false;

      links[index].style.visibility = 'hidden';

      clearSelection();

      menu.inert = true;

      const headingStart =
        `translate(0px, ${geometry.startY}px)`;

      const headingRaised =
        `translate(0px, ${geometry.endY}px)`;

      const headingDocked =
        `translate(${geometry.dockX}px, ${geometry.endY}px) scale(${geometry.dockScale})`;

      const menuExpanded =
        'translateY(0px) scale(1)';

      const menuCollapsed =
        `translateY(0px) scale(${geometry.scale})`;

      const menuDocked = menuTransform(true);

      if (immediately || reducedMotion.matches) {
        heading.style.transform = headingDocked;

        hideMenuLetters();

        for (const slot of slots) {
          slot.style.clipPath = STRIP;
        }

        menu.style.transform = menuDocked;

        menuState = 'collapsed';
        showToggle();

        return;
      }

      // Подъём выбранной строки.
      const raise = animate(
        heading,
        {
          transform: [headingStart, headingRaised]
        },
        {
          duration: RAISE_DURATION,
          ease: [0.22, 1, 0.36, 1]
        }
      );

      // Сворачивание начинается на полсекунды позже.
      const close = animate(
        slots,
        {
          clipPath: [FULL, CLOSED]
        },
        {
          delay: 0.5,
          duration: CLOSE_DURATION,
          ease: 'easeInOut'
        }
      );

      animations.push(raise, close);

      await close;

      if (token !== revision) return;

      hideMenuLetters();

      const open = animate(
        slots,
        {
          clipPath: [CLOSED, STRIP]
        },
        {
          duration: OPEN_DURATION,
          ease: 'easeInOut'
        }
      );

      const shrink = animate(
        menu,
        {
          transform: [menuExpanded, menuCollapsed]
        },
        {
          duration: OPEN_DURATION,
          ease: 'easeInOut'
        }
      );

      animations.push(open, shrink);

      await Promise.all([raise, open, shrink]);

      if (token !== revision) return;

      // Плашка едет к логотипу, гамбургер — вверх.
      const dockHeading = animate(
        heading,
        {
          transform: [headingRaised, headingDocked]
        },
        {
          duration: DOCK_DURATION,
          ease: [0.22, 1, 0.36, 1]
        }
      );

      const liftHamburger = animate(
        menu,
        {
          transform: [menuCollapsed, menuDocked]
        },
        {
          duration: DOCK_DURATION,
          ease: [0.22, 1, 0.36, 1]
        }
      );

      animations.push(dockHeading, liftHamburger);

      await Promise.all([dockHeading, liftHamburger]);

      if (token !== revision) return;

      menuState = 'collapsed';
      showToggle();
    }

    async function openMenu() {
      if (
        menuState !== 'collapsed' ||
        currentIndex === null ||
        !screenGeometry
      ) {
        return;
      }

      stopAnimations();

      const token = revision;

      menuState = 'opening';
      hideToggle();

      menu.inert = true;

      clearSelection();

      const collapsed = menuTransform(false);
      const docked = menuTransform(true);

      if (!reducedMotion.matches) {
        // Гамбургер возвращается в исходную область меню.
        const lower = animate(
          menu,
          {
            transform: [docked, collapsed]
          },
          {
            duration: DOCK_DURATION,
            ease: [0.22, 1, 0.36, 1]
          }
        );

        animations.push(lower);

        await lower;

        if (token !== revision) return;

        const closeStrips = animate(
          slots,
          {
            clipPath: [STRIP, CLOSED]
          },
          {
            duration: CLOSE_DURATION,
            ease: 'easeInOut'
          }
        );

        const grow = animate(
          menu,
          {
            transform: [
              collapsed,
              'translateY(0px) scale(1)'
            ]
          },
          {
            duration: OPEN_DURATION,
            ease: 'easeInOut'
          }
        );

        animations.push(closeStrips, grow);

        await closeStrips;

        if (token !== revision) return;

        showMenuLetters();

        const unfold = animate(
          slots,
          {
            clipPath: [CLOSED, FULL]
          },
          {
            duration: OPEN_DURATION,
            ease: 'easeInOut'
          }
        );

        animations.push(unfold);

        await Promise.all([grow, unfold]);

        if (token !== revision) return;
      } else {
        menu.style.transform =
          'translateY(0px) scale(1)';

        for (const slot of slots) {
          slot.style.clipPath = FULL;
        }

        showMenuLetters();
      }

      menuState = 'open';
      menu.inert = false;

      toggle.setAttribute('aria-expanded', 'true');

      // Вместо текущей строки доступна нижняя ссылка «хиро».
      slots[currentIndex]
        .querySelector<HTMLAnchorElement>(
          '.navigation-underlay'
        )
        ?.focus({ preventScroll: true });
    }

    async function revealHeroMenu() {
      const geometry = screenGeometry;

      if (!geometry) {
        restoreHero();
        return;
      }

      // Сохраняем фактическое состояние до отмены контроллеров.
      const startTransform =
        getComputedStyle(menu).transform;

      const startClips = slots.map(
        (slot) => getComputedStyle(slot).clipPath
      );

      const collapsed =
        `translateY(0px) scale(${geometry.scale})`;

      const expanded =
        'translateY(0px) scale(1)';

      stopAnimations();

      const token = revision;

      settledScreen = 'hero';
      menuState = 'opening';
      pendingHref = null;

      hideToggle();
      hideHeadings();
      hideMenuLetters();

      clearSelection();

      menu.inert = true;

      if (!reducedMotion.matches) {
        /*
        * Возвращаем полосы в исходную область меню.
        * Если они уже там, вертикального движения не будет.
        */
        const position = animate(
          menu,
          {
            transform: [startTransform, collapsed]
          },
          {
            duration: DOCK_DURATION,
            ease: [0.22, 1, 0.36, 1]
          }
        );

        const closeStrips = slots.map((slot, index) =>
          animate(
            slot,
            {
              clipPath: [startClips[index], CLOSED]
            },
            {
              duration: CLOSE_DURATION,
              ease: 'easeInOut'
            }
          )
        );

        animations.push(position, ...closeStrips);

        await Promise.all([position, ...closeStrips]);

        if (token !== revision) return;

        // На хиро возвращаются все три исходные строки.
        for (const link of links) {
          link.style.removeProperty('visibility');
        }

        showMenuLetters();

        const grow = animate(
          menu,
          {
            transform: [collapsed, expanded]
          },
          {
            duration: OPEN_DURATION,
            ease: 'easeInOut'
          }
        );

        const unfold = animate(
          slots,
          {
            clipPath: [CLOSED, FULL]
          },
          {
            duration: OPEN_DURATION,
            ease: 'easeInOut'
          }
        );

        animations.push(grow, unfold);

        await Promise.all([grow, unfold]);

        if (token !== revision) return;
      } else {
        resetMenu();
      }

      menuState = 'hero';
      currentIndex = null;
      screenGeometry = null;

      menu.inert = false;
    }

    async function closeMenuAndNavigate(href: string) {
      if (
        menuState !== 'open' ||
        !screenGeometry
      ) {
        return;
      }

      stopAnimations();

      const token = revision;

      menuState = 'closing';
      menu.inert = true;

      hideToggle();

      pendingHref = href;

      const destination = screens.find(
        (screen) =>
          `#${screen.dataset.navigationScreen}` === href
      );

      const destinationName =
        destination?.dataset.navigationScreen;

      // После выбора не повторяем вступление нового экрана.
      if (
        destinationName &&
        destinationName !== 'hero'
      ) {
        visitedScreens.add(destinationName);
      }

      if (!reducedMotion.matches) {
        const close = animate(
          slots,
          {
            clipPath: [FULL, CLOSED]
          },
          {
            duration: CLOSE_DURATION,
            ease: 'easeInOut'
          }
        );

        animations.push(close);

        await close;

        if (token !== revision) return;

        hideMenuLetters();

        const openStrips = animate(
          slots,
          {
            clipPath: [CLOSED, STRIP]
          },
          {
            duration: OPEN_DURATION,
            ease: 'easeInOut'
          }
        );

        const shrink = animate(
          menu,
          {
            transform: [
              'translateY(0px) scale(1)',
              menuTransform(false)
            ]
          },
          {
            duration: OPEN_DURATION,
            ease: 'easeInOut'
          }
        );

        animations.push(openStrips, shrink);

        await Promise.all([openStrips, shrink]);

        if (token !== revision) return;
      } else {
        hideMenuLetters();

        for (const slot of slots) {
          slot.style.clipPath = STRIP;
        }

        menu.style.transform = menuTransform(false);
      }

      // На хиро раскрываем меню в исходной области,
      // не отправляя гамбургер к верхнему краю.
      if (href === '#hero') {
        window.location.hash = href;

        await revealHeroMenu();
        return;
      }

      // Для остальных экранов сохраняем прежний подъём.
      window.location.hash = href;

      if (!reducedMotion.matches) {
        const lift = animate(
          menu,
          {
            transform: [
              menuTransform(false),
              menuTransform(true)
            ]
          },
          {
            duration: DOCK_DURATION,
            ease: [0.22, 1, 0.36, 1]
          }
        );

        animations.push(lift);

        await lift;

        if (token !== revision) return;
      } else {
        menu.style.transform = menuTransform(true);
      }

      menuState = 'collapsed';

      settledScreen = '';
      settle();
    }

    function updateScrollColor() {
      if (pendingHref || currentIndex !== null) return;

      const start =
        window.scrollY + hero!.getBoundingClientRect().top;

      const end =
        window.scrollY +
        firstScreen!.getBoundingClientRect().top;

      const distance = end - start;

      if (distance <= 0) return;

      const progress = Math.max(
        0,
        Math.min(1, (window.scrollY - start) / distance)
      );

      const element = letters[0];

      if (!element) return;

      if (progress === 0) {
        element.style.removeProperty('background-color');
        return;
      }

      const red = Math.round(208 * (1 - progress));
      const green = Math.round(211 * (1 - progress));
      const blue = Math.round(208 * (1 - progress));

      element.style.backgroundColor =
        `rgb(${red}, ${green}, ${blue})`;
    }

    function settle() {
      if (menuState === 'closing') return;

      const screen = screens.find(
        (element) =>
          Math.abs(element.getBoundingClientRect().top) <= 2
      );

      if (!screen) return;

      const name = screen.dataset.navigationScreen;

      if (!name || name === settledScreen) return;

      const index = links.findIndex(
        (link) => link.getAttribute('href') === `#${name}`
      );

      if (name !== 'hero' && index < 0) return;

      settledScreen = name;
      pendingHref = null;

      if (name === 'hero') {
        void revealHeroMenu();
        return;
      }

      const alreadyVisited = visitedScreens.has(name);

      visitedScreens.add(name);

      void showScreen(index, alreadyVisited);
    }

    function onScroll() {
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          updateScrollColor();
        });
      }

      clearTimeout(settleTimer);
      settleTimer = setTimeout(settle, 160);
    }

    function onScrollEnd() {
      clearTimeout(settleTimer);
      settle();
    }

    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) return;

      const toggleButton = target.closest(
        '[data-navigation-toggle]'
      );

      if (
        toggleButton &&
        navigation.contains(toggleButton)
      ) {
        event.preventDefault();
        void openMenu();
        return;
      }

      const link = target.closest<HTMLAnchorElement>(
        '[data-navigation-link], .navigation-underlay'
      );

      if (!link || !navigation.contains(link)) return;

      const href = link.getAttribute('href');

      if (!href) return;

      if (menuState === 'open') {
        event.preventDefault();
        void closeMenuAndNavigate(href);
        return;
      }

      // Обычный выбор пункта на хиро.
      pendingHref = href;

      for (const element of letters) {
        element?.style.removeProperty('background-color');
      }
    }

    function onResize() {
      if (
        menuState === 'opening' ||
        menuState === 'closing' ||
        menuState === 'intro'
      ) {
        return;
      }

      if (currentIndex !== null) {
        void showScreen(currentIndex, true);
      }
    }

    navigation.addEventListener('click', onClick);
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    document.addEventListener('scrollend', onScrollEnd);
    window.addEventListener('resize', onResize);

    const initialFrame = requestAnimationFrame(() => {
      updateScrollColor();
      settle();
    });

    return () => {
      stopAnimations();
      hideToggle();

      clearTimeout(settleTimer);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(initialFrame);

      navigation.removeEventListener('click', onClick);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('scrollend', onScrollEnd);
      window.removeEventListener('resize', onResize);

      resetMenu();
      hideHeadings();
    };
  };
}