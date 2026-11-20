<script lang="ts">
	import { createHeroIntro } from '#lib/motion/hero/intro.ts';
	import exclamatory from '#lib/assets/hero/exclamatory.svg';
	import heroText1 from '#lib/assets/hero/heroText1.svg';
	import heroText2 from '#lib/assets/hero/heroText2.svg';
	import heroText3 from '#lib/assets/hero/heroText3.svg';
	import heroText4 from '#lib/assets/hero/heroText4.svg';
	import heroText5 from '#lib/assets/hero/heroText5.svg';
	import heroText6 from '#lib/assets/hero/heroText6.svg';
	import heroText7 from '#lib/assets/hero/heroText7.svg';
	import heroText8 from '#lib/assets/hero/heroText8.svg';
	import heroText9 from '#lib/assets/hero/heroText9.svg';
	import heroText10 from '#lib/assets/hero/heroText10.svg';
	import heroText11 from '#lib/assets/hero/heroText11.svg';
	import { getContext } from 'svelte';
	import heroTextRight1 from '#lib/assets/hero/heroTextRight1.svg';
	import heroTextRight2 from '#lib/assets/hero/heroTextRight2.svg';
	import heroTextRight3 from '#lib/assets/hero/heroTextRight3.svg';

	import {
		navigationIntroKey,
		type NavigationIntroState
	} from '#lib/motion/navigation/context.ts';

	const heroTextRows = [
		[heroText1],
		[heroText2],
		[heroText3, heroText4],
		[heroText5],
		[heroText6, heroText7],
		[heroText8],
		[heroText9],
		[heroText10],
		[heroText11]
	];
	const rightTexts = [
		{ src: heroTextRight1, width: 535 },
		{ src: heroTextRight2, width: 163 },
		{ src: heroTextRight3, width: 421 }
	];

	let progress = $state(0);
	let moveProgress = $state(0);
	let loadingProgress = $state(0);
	let finishProgress = $state(0);

	let count = $derived(
		Math.min(100, Math.floor(progress * 50) * 2) +
			Math.min(78, Math.floor(loadingProgress * 39) * 2)
	);

	let counterColor = $derived(
		count === 148 ? '#000000' : '#C1272D'
	);

	let counterOpacity = $derived(
		Math.min(1, (progress * 5) / 0.3)
	);

	let rotation = $derived(
		(progress + loadingProgress) * 3600
	);

	let dashOffset = $derived(1 - progress);
	let loadingDashOffset = $derived(1 - loadingProgress);

	let circleTranslateX = $derived(-706 * moveProgress);

	const exclamationStart = (24 / 39) * 3.5;

	let exclamationReveal = $derived(
		Math.min(
			1,
			Math.max(
				0,
				(loadingProgress * 3.5 - exclamationStart) / 0.3
			)
		)
	);

	let additionalTextOpacity = $derived(
		Math.min(
			1,
			Math.max(0, (loadingProgress * 39 - 24) / 15)
		)
	);

	let finishTime = $derived(finishProgress * 2.6);

	let exclamationScale = $derived.by(() => {
		if (finishTime < 0.3) {
			return 1 + (finishTime / 0.3) * 2;
		}

		if (finishTime < 1.3) {
			return 3;
		}

		if (finishTime < 1.6) {
			return 3 - ((finishTime - 1.3) / 0.3) * 2;
		}

		return 1;
	});

	let showIndicators = $derived(finishProgress < 1);

	const navigationIntro =
  getContext<NavigationIntroState>(navigationIntroKey);

	const intro = createHeroIntro(
		(value) => {
			progress = value;
			navigationIntro.logoVisible = value >= 1;
		},
		(value) => {
			moveProgress = value;
		},
		(value) => {
			loadingProgress = value;
			navigationIntro.opacity = value;
		},
		(value) => {
			finishProgress = value;
		}
	);

	function trackHeroVisibility(element: HTMLElement) {
		navigationIntro.heroVisible = true;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return;

				navigationIntro.heroVisible =
					entry.isIntersecting && entry.intersectionRatio > 0.001;
			},
			{
				threshold: [0, 0.001]
			}
		);

		observer.observe(element);

		return () => {
			observer.disconnect();
			navigationIntro.heroVisible = false;
		};
	}
</script>

<section
	id="hero"
	class="relative h-[100dvh] w-full overflow-hidden"
	aria-label="Главный экран"
	{@attach intro}
	{@attach trackHeroVisibility}
>
	<div
		class="hero-left absolute inset-y-0 left-0 w-[60%] bg-[#D0D3D0]"
		style:opacity={progress}
	>
		<div class="hero-text-wrapper">
			{#each heroTextRows as row, rowIndex (rowIndex)}
				<div class="hero-text-row">
					{#each row as src (src)}
						<img
							class="hero-text-word"
							{src}
							alt=""
							draggable="false"
						/>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<div
		class="absolute inset-y-0 right-0 w-[40%] bg-[#D0D3D0]"
		style:opacity={progress}
		aria-hidden="true"
	></div>

	<div
		class="pointer-events-none absolute inset-y-0 left-0 w-[60%]"
		 style:opacity={additionalTextOpacity}
		aria-hidden="true"
	>
		<div
			class="absolute left-1/2 top-[40%] flex w-[min(430px,36vw)] -translate-x-1/2 -translate-y-1/2 flex-col gap-[min(58px,calc(36vw*58/430))]"
		>
			{#each rightTexts as item (item.src)}
				<div class="relative aspect-[430/58] w-full flex-none">
					<img
						class="absolute left-1/2 top-1/2 block h-auto max-w-none -translate-x-1/2 -translate-y-1/2"
						style:width={`${(item.width / 430) * 100}%`}
						src={item.src}
						alt=""
						draggable="false"
					/>
				</div>
			{/each}
		</div>
	</div>

	<div class="composition" aria-hidden="true">
		<div
			class="line"
			style:transform={`scaleY(${progress})`}
		></div>

		<div class="circle-group">
			<svg
				class="circles"
				width="228"
				height="196"
				viewBox="0 0 228 196"
				fill="none"
			>
				<!-- Неподвижная окружность -->
				<path
					d="M 48 98 A 82 82 0 0 1 212 98 A 82 82 0 0 1 48 98"
					pathLength="1"
					stroke="#000000"
					stroke-width="32"
					stroke-linecap="butt"
					stroke-dasharray="1 1"
					stroke-dashoffset={dashOffset}
				/>

				<!-- Окружность, перемещающаяся влево -->
				<path
					d="M 48 98 A 82 82 0 0 1 212 98 A 82 82 0 0 1 48 98"
					pathLength="1"
					stroke="#000000"
					stroke-width="32"
					stroke-linecap="butt"
					stroke-dasharray="1 1"
					stroke-dashoffset={dashOffset}
					transform={`translate(${circleTranslateX} 0)`}
				/>

				<!-- Центральный индикатор «С» -->
				<path
					d="M 187.982756 155.982756
						A 82 82 0 1 1 187.982756 40.017244"
					transform="translate(-353 0)"
					pathLength="1"
					stroke="#000000"
					stroke-width="32"
					stroke-linecap="butt"
					stroke-dasharray="1 1"
					stroke-dashoffset={loadingDashOffset}
					opacity={loadingProgress > 0 ? 1 : 0}
				/>
			</svg>

			{#if showIndicators}
				<div class="counter-position">
					<span
						class="counter font-local"
						style:color={counterColor}
						style:opacity={counterOpacity}
					>
						{count}
					</span>
				</div>

				<div class="percent-position">
					<span
						class="percent font-local text-[#C1272D]"
						style:transform={`rotate(${rotation}deg)`}
            style:opacity={counterOpacity}
					>
						%
					</span>

					<div
						class="exclamation"
						style:transform={`scale(${exclamationScale})`}
					>
						<div
							class="exclamation-reveal"
							style:clip-path={`inset(${(1 - exclamationReveal) * 100}% 0 0 0)`}
						>
							<img
								class="exclamation-image"
								src={exclamatory}
								width="12"
								height="40"
								alt=""
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<style>
	.composition {
		position: absolute;
		inset-block: 0;
		left: 50%;
		width: min(902px, 35.234375vw);
		transform: translateX(-50%);
		container-type: inline-size;
		pointer-events: none;
	}

	.line {
		position: absolute;
		inset-block: 0;
		left: calc(674 / 902 * 100%);
		width: calc(32 / 902 * 100%);
		background-color: #000000;
		transform-origin: center bottom;
	}

	.circle-group {
		position: absolute;
		bottom: 5%;
		left: calc(674 / 902 * 100%);
		width: calc(228 / 902 * 100%);
		aspect-ratio: 228 / 196;
	}

	.circles {
		display: block;
		width: 100%;
		height: 100%;
		overflow: visible;
	}

	.counter-position {
		position: absolute;
		top: 50%;
		left: calc(130 / 228 * 100%);
		transform: translate(-50%, -50%);
	}

	.counter {
		display: block;
		font-size: calc(100cqw * 48 / 902 * 0.8);
		font-weight: 400;
		line-height: 1;
		white-space: nowrap;
		text-box: trim-both cap alphabetic;
		translate: 0 0.05em;
	}

	.percent-position {
		position: absolute;
		top: 50%;
		left: 100%;
		display: flex;
		align-items: flex-end;
		gap: calc(100cqw * 12 / 902);
		margin-left: calc(100cqw * 12 / 902);
		transform: translateY(-50%);
		text-box: trim-both cap alphabetic;
	}

	.percent {
		display: block;
		flex: none;
		font-size: calc(100cqw * 50.666667 / 902);
		font-weight: 400;
		line-height: 1;
		white-space: nowrap;
		transform-origin: center;
	}

	.exclamation {
		flex: none;
		width: calc(100cqw * 18 / 902);
		height: calc(100cqw * 60 / 902);
		transform-origin: center bottom;
	}

	.exclamation-reveal {
		width: 100%;
		height: 100%;
	}

	.exclamation-image {
		display: block;
		width: 100%;
		height: 100%;
	}

	.hero-left {
		/*
		* По текущей геометрии:
		* ширина composition = min(902px, 35.234375vw);
		* высота окружностей = ширина composition × 196 / 902.
		*/
		--hero-logo-height: min(196px, 7.65625vw);
		--hero-text-logo-gap: 3dvh;

		container-type: inline-size;
	}

	.hero-text-wrapper {
		position: absolute;
		top: 4%;
		bottom: calc(
			5% + var(--hero-logo-height) + var(--hero-text-logo-gap)
		);
		left: 50%;

		width: min(1150px, 90%);
		transform: translateX(-50%);

		container-type: size;

		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0;
	}

	.hero-text-row {
		display: flex;
		flex: none;

		/*
		* Исходная пропорция: высота строки 116 при ширине стены 1150.
		* Второе значение не позволяет девяти строкам
		* превысить доступную высоту.
		*/
		height: min(
			calc(100cqw * 116 / 1150),
			calc(100cqh / 9)
		);

		min-height: 0;
		justify-content: flex-end;
		align-items: stretch;
		gap: 0;
	}

	.hero-text-word {
		display: block;
		flex: none;
		width: auto;
		height: 100%;
		max-width: none;
	}

	@media (max-width: 600px) and (orientation: portrait) {
		.composition {
			width: 60vw;
		}

		.hero-left {
			/*
			* Новая высота лого:
			* ширина композиции × 196 / 902.
			* Используется для отступа текста над лого.
			*/
			--hero-logo-height: calc(60vw * 196 / 902);
		}

		.hero-text-row {
			display: contents;
		}

		.hero-text-word {
			align-self: flex-end;

			height: min(
				calc(100cqw * 116 / 1150 * 1.3),
				calc(100cqh / 11)
			);

			width: auto;
			max-width: 100%;
			object-fit: contain;
			object-position: right center;
		}
	}
</style>