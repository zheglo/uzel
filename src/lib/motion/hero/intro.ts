import { animate, motionValue } from 'motion';
import type { Attachment } from 'svelte/attachments';

export function createHeroIntro(
	onProgress: (value: number) => void,
	onMoveProgress: (value: number) => void,
	onLoadingProgress: (value: number) => void,
	onFinishProgress: (value: number) => void
): Attachment<HTMLElement> {
	return () => {
		const progress = motionValue(0);
		const moveProgress = motionValue(0);
		const loadingProgress = motionValue(0);
		const finishProgress = motionValue(0);

		onProgress(0);
		onMoveProgress(0);
		onLoadingProgress(0);
		onFinishProgress(0);

		const unsubscribeProgress = progress.on('change', (value) => {
			onProgress(Math.min(1, Math.max(0, value)));
		});

		const unsubscribeMoveProgress = moveProgress.on('change', (value) => {
			onMoveProgress(Math.min(1, Math.max(0, value)));
		});

		const unsubscribeLoadingProgress = loadingProgress.on('change', (value) => {
			onLoadingProgress(Math.min(1, Math.max(0, value)));
		});

		const unsubscribeFinishProgress = finishProgress.on('change', (value) => {
			onFinishProgress(Math.min(1, Math.max(0, value)));
		});

		const animation = animate([
			[
				progress,
				[0, 1],
				{
					at: 0,
					duration: 5,
					ease: 'linear'
				}
			],
			[
				moveProgress,
				[0, 1],
				{
					at: 5,
					duration: 0.5,
					ease: 'easeInOut'
				}
			],
			[
				loadingProgress,
				[0, 1],
				{
					at: 5.5,
					duration: 3.5,
					ease: 'linear'
				}
			],
			[
				finishProgress,
				[0, 1],
				{
					at: 9,
					duration: 2.6,
					ease: 'linear'
				}
			]
		]);

		return () => {
			unsubscribeProgress();
			unsubscribeMoveProgress();
			unsubscribeLoadingProgress();
			unsubscribeFinishProgress();

			animation.cancel();

			progress.destroy();
			moveProgress.destroy();
			loadingProgress.destroy();
			finishProgress.destroy();
		};
	};
}
