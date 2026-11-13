<script lang="ts">
	import { createHeroIntro } from '#lib/motion/hero/intro.ts';

	let progress = $state(0);

	let count = $derived(
		Math.min(100, Math.floor(progress * 50) * 2)
	);

	let rotation = $derived(progress * 3600);
	let dashOffset = $derived(1 - progress);

	const intro = createHeroIntro((value) => {
		progress = value;
	});
</script>

<section
	class="relative h-[100dvh] w-full overflow-hidden"
	aria-label="Главный экран"
	{@attach intro}
>
	<div
		class="absolute inset-y-0 left-0 w-[60%] bg-[#D0D3D0]"
		style:opacity={progress}
		aria-hidden="true"
	></div>

	<div
		class="absolute inset-y-0 right-0 w-[40%] bg-[#D0D3D0]"
		style:opacity={progress}
		aria-hidden="true"
	></div>

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

				<!-- Подвижная окружность: пока полностью совмещена -->
				<path
					d="M 48 98 A 82 82 0 0 1 212 98 A 82 82 0 0 1 48 98"
					pathLength="1"
					stroke="#000000"
					stroke-width="32"
					stroke-linecap="butt"
					stroke-dasharray="1 1"
					stroke-dashoffset={dashOffset}
				/>
			</svg>

			<div class="counter-position">
				<span class="counter font-local text-[#C1272D]">
					{count}
				</span>
			</div>

			<div class="percent-position">
				<span
					class="percent font-local text-[#C1272D]"
					style:transform={`rotate(${rotation}deg)`}
				>
					%
				</span>
			</div>
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
		bottom: 10%;
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
		font-size: calc(100cqw * 48 / 902);
		font-weight: 400;
		line-height: 1;
		white-space: nowrap;
	}

	.percent-position {
		position: absolute;
		top: 50%;
		left: 100%;
		margin-left: calc(100cqw * 12 / 902);
		transform: translateY(-50%);
	}

	.percent {
		display: block;
		font-size: calc(100cqw * 50.666667 / 902);
		font-weight: 400;
		line-height: 1;
		white-space: nowrap;
		transform-origin: center;
	}
</style>