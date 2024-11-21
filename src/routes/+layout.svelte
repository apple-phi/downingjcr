<script lang="ts">
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	import { beforeNavigate, pushState } from '$app/navigation';
	import { page, updated } from '$app/stores';
	import { searchStore } from '$lib/components/Search';
	data.searchIndex.then(searchStore.set);

	import { isMacOs, newsStore, navStore, officeStore } from '$lib';
	data.allNews.then((x) => x && newsStore.set(x));
	data.topLevelNavItems.then((x) => x && navStore.set(x));
	data.committeeOffices.then((x) => x && officeStore.set(x));

	import '../app.postcss';
	import '@fortawesome/fontawesome-free/css/fontawesome.css';
	import '@fortawesome/fontawesome-free/css/brands.css';
	import '@fortawesome/fontawesome-free/css/solid.css';
	import {
		AppShell,
		AppBar,
		Modal,
		type ModalComponent,
		initializeStores,
		getDrawerStore,
		getModalStore,
		setInitialClassState,
		LightSwitch,
		Toast
	} from '@skeletonlabs/skeleton';
	import { storePopup } from '$lib/components/Popup';
	initializeStores();
	const modalStore = getModalStore();
	const drawerStore = getDrawerStore();

	import SearchModal from './SearchModal.svelte';
	import NavBarDropdown from './NavBarDropdown.svelte';
	import NavBarDrawer from './NavBarDrawer.svelte';
	import Footer from './Footer.svelte';

	function openDrawer(): void {
		pushState('', { showDrawer: true });
		drawerStore.open({ position: 'right', width: 'w-11/12 md:w-1/2 lg:w-1/3' });
	}
	function openSearchModal(): void {
		modalStore.trigger({
			type: 'component',
			component: 'SearchModal',
			backdropClasses: '!bg-transparent backdrop-blur-sm dark:!bg-surface-500/30'
		});
	}
	const modalRegistry: Record<string, ModalComponent> = {
		SearchModal: { ref: SearchModal }
	};

	// Keyboard shortcut (Ctrl / ⌘+K) for search modal
	function onWindowKeydown(e: KeyboardEvent): void {
		if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
			e.preventDefault(); // Prevent default browser behavior of focusing URL bar
			$modalStore.length ? modalStore.close() : openSearchModal();
		}
	}

	// Pop-ups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });

	beforeNavigate(({ willUnload, to }) => {
		if ($updated && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});
</script>

<!-- Make sure mode is the same after page reload -->
<svelte:head>{@html '<script>(' + setInitialClassState.toString() + ')();</script>'}</svelte:head>
<!-- Use stopPropagation to override Chrome for Windows search shortcut -->
<svelte:window on:keydown|stopPropagation={onWindowKeydown} />
<Modal components={modalRegistry} />
<Toast zIndex="z-[1000]" />
<NavBarDrawer />
<AppShell
	regionPage="scroll-smooth"
	shadow="shadow-none"
	slotTrail="!space-x-2"
	slotSidebarLeft="bg-surface-50 dark:bg-surface-900 {$page.url.pathname === '/'
		? 'w-0'
		: 'w-0 lg:w-64'}"
>
	<!-- <svelte:fragment ">
		<div slot="sidebarLeft class="size-full bg-slate-50 dark:bg-surface-900">
			<div class="p-6">
				<h1 id="sidebar-left" class="hidden lg:block text-lg font-heading-token">Sidebar</h1>
				<hr />
			</div>
		</div>
	</svelte:fragment> -->
	<svelte:fragment slot="header">
		<AppBar class="shadow-none !bg-slate-50 dark:!bg-surface-900 !p-3">
			<svelte:fragment slot="lead">
				<a href="/" class="flex items-center space-x-4">
					<div
						class="bg-primary-900 border-primary-900 dark:bg-tertiary-50 dark:border-tertiary-50 border-2"
					>
						<svg
							class="fill-slate-50 dark:fill-surface-900"
							viewBox="0 0 1200 1200"
							width="2.5rem"
							height="2.5rem"
						>
							<use xlink:href="/favicon.svg#logoNotInverted" />
						</svg>
					</div>
					<!-- <img src={logo} alt="Downing JCR Logo" class="dark:bg-white md:w-10 md:h-10" /> -->
					<h1 class="inline-block text-xl lg:text-2xl h1 whitespace-nowrap font-bold">
						Downing JCR
					</h1>
					<!-- <p class="md:inline-block lg:hidden text-2xl h1 whitespace-nowrap">DowJCR</p> -->
				</a>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<div class="flex items-center lg:space-x-2 text-slate-950 dark:text-tertiary-50">
					<NavBarDropdown navHeader={{ header: 'News', prefix: 'news', pageNeeded: true }}>
						<nav class="card shadow-lg w-[20em] overflow-hidden bg-slate-50 dark:bg-surface-800">
							<div class="px-4 pt-3 pb-1">
								<a href="/news">
									<h1
										class="font-heading-token text-md font-bold text-primary-900 dark:text-primary-400"
									>
										Recent
									</h1>
								</a>
							</div>
							<ol>
								{#each $newsStore.slice(0, 5) as newsItem, idx (newsItem.publishedAt)}
									<li class="w-full group">
										<a href={`/news/${$newsStore.length - idx}`} class="size-full">
											<div
												class="size-full hover:variant-soft-primary group-active:variant-ghost-primary px-4 py-3 group-last:pb-4"
											>
												<h2 class="font-heading-token text-md">{newsItem.title}</h2>
												<h3 class="text-xs">
													By <span class="font-bold"
														>{newsItem.lastEditedByNames || 'Unknown author'}</span
													>
													· {newsItem.lastEditedByTitle}
												</h3>
											</div>
										</a>
									</li>
								{:else}
									<li class="w-full">
										<div class="px-4 py-3">
											<h2 class="font-heading-token text-md">No news yet</h2>
										</div>
									</li>
								{/each}
							</ol>
						</nav>
					</NavBarDropdown>
					{#each $navStore as item (item.header)}
						<NavBarDropdown navHeader={item}>
							<nav
								class="card divide-y-2 shadow-lg rounded-lg w-60 overflow-hidden bg-slate-50 dark:bg-surface-800"
							>
								<ul>
									<li>
										<a
											href="https://google.com"
											class="font-normal px-4 py-2 focus:variant-soft-primary dark:focus:variant-soft-surface group transition duration-300 block text-sm hover:text-primary-500 dark:hover:text-surface-100"
										>
											<span>Google</span>
											<span
												class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary-500 dark:bg-surface-100"
											></span>
										</a>
									</li>
								</ul>
								<ul>
									{#if item.navItems}
										{#each item.navItems as subItem (subItem.path)}
											<li>
												<a
													href={subItem.path}
													rel="noreferrer"
													target={subItem.path.startsWith('/') ? '_self' : '_blank'}
													class="font-normal px-4 py-2 focus:variant-soft-primary dark:focus:variant-soft-surface group transition duration-300 block text-sm hover:text-primary-500 dark:hover:text-surface-100"
												>
													<span>{subItem.label}</span>
													<span
														class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary-500 dark:bg-surface-100"
													></span>
												</a>
											</li>
										{/each}
									{/if}
								</ul>
								<ul>
									<li>
										<a
											href="https://google.com"
											class="font-normal px-4 py-2 focus:variant-soft-primary dark:focus:variant-soft-surface group transition duration-300 block text-sm hover:text-primary-500 dark:hover:text-surface-100"
										>
											<span>Google</span>
											<span
												class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary-500 dark:bg-surface-100"
											></span>
										</a>
									</li>
								</ul>
							</nav>
						</NavBarDropdown>
					{/each}
					<!-- {/await} -->
					<div class="md:inline md:mx-4">
						<button
							on:click={openSearchModal}
							class="btn space-x-4 md:variant-soft hover:variant-soft-primary dark:hover:variant-soft-surface"
						>
							<i class="fa-solid fa-magnifying-glass md:text-sm" />
							<small class="hidden md:inline-block font-mono font-bold"
								>{isMacOs ? '⌘' : 'Ctrl'}+K</small
							>
						</button>
					</div>
					<button
						on:click={openDrawer}
						class="md:hidden hover:variant-soft-primary dark:hover:variant-soft-surface btn btn-sm size-10"
					>
						<i class="fa-solid fa-bars text-xl" />
					</button>
					<div class="px-2 hidden md:inline-block">
						<LightSwitch class="bg-opacity-0" />
					</div>
				</div>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
	<svelte:fragment slot="pageFooter">
		<Footer />
	</svelte:fragment>
</AppShell>
