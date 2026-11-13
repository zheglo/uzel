import { animate, motionValue } from 'motion';
import type { Attachment } from 'svelte/attachments';

export function createHeroIntro(
	onProgress: (value: number) => void
): Attachment<HTMLElement> {
	return () => {
		const progress = motionValue(0);

		onProgress(0);

		const unsubscribe = progress.on('change', (value) => {
			onProgress(Math.min(1, Math.max(0, value)));
		});

		const animation = animate([
			[progress, [0, 1], { at: 0, duration: 5, ease: 'linear' }]
		]);

		return () => {
			unsubscribe();
			animation.cancel();
			progress.destroy();
		};
	};
}