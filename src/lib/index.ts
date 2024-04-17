import type { Writable } from 'svelte/store';
import { localStorageStore } from '@skeletonlabs/skeleton';
import type { ReturnNavHeader, ReturnNewsItem, Office } from '$lib/cms.types';
import { browser } from '$app/environment';

export let isMacOs = browser && navigator.userAgent.search('Mac') !== -1;

export const newsStore: Writable<ReturnNewsItem[]> = localStorageStore('newsStore', []);
export const navStore: Writable<ReturnNavHeader[]> = localStorageStore('navStore', [
	{ header: 'News', navitems: [] },
	{ header: 'Welfare', navitems: [] },
	{ header: 'Services', navitems: [] },
	{ header: 'About', navitems: [] }
]);

export const officeStore: Writable<Office[]> = localStorageStore('officeStore', [
	{ title: 'President', email: 'president@jcr.dow.cam.ac.uk' },
	{ title: 'Internet Officer', email: 'internet@jcr.dow.cam.ac.uk' }
]);

export function stripHtmlTags(input: string): string {
	return input
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s\s+/g, ' ')
		.trim();
}

export function extractH1AndContent(text: string) {
	const h1Match = text.match(/<h1>(.*?)<\/h1>/i);
	const h1Content = h1Match ? h1Match[1] : null;
	const restContent = text.replace(/<h1>.*?<\/h1>/i, '');
	return { h1Content, restContent };
}

export function headerPathFromName(name: string): string {
	return '/' + name.toLowerCase().replaceAll(' ', '-');
}

export function initialsFromName(name: string): string {
	return name
		.split(' ')
		.map((word) => word[0])
		.join('')
		.toUpperCase();
}

/**
 * Extracts and truncates the content of the first paragraph from an HTML string.
 * @param {string} html - The HTML string to extract the first paragraph from.
 * @returns {string | null} The truncated content of the first paragraph or null if no paragraph is found.
 */
export function makeSubtitle(html: string): string | null {
	const firstParagraph = /<p[^>]*>(?<firstP>.*?)<\/p>/gi.exec(html)?.groups?.firstP?.trim();
	if (!firstParagraph) {
		return null;
	}
	return firstParagraph.length > 100 ? firstParagraph.slice(0, 100).trim() + '...' : firstParagraph;
}
