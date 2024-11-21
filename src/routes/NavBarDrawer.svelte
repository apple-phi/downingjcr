<script lang="ts">
	import { page } from '$app/stores';
	import {
		Accordion,
		AccordionItem,
		getDrawerStore,
		Drawer,
		LightSwitch,
		TableOfContents
	} from '@skeletonlabs/skeleton';
	import { pathFromText, navStore, newsStore } from '$lib';
	const drawerStore = getDrawerStore();

	function handleToCAnchors(node: HTMLElement) {
		node.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
			a.addEventListener('click', drawerStore.close);
		});
	}

	function closeDrawer(): void {
		// drawerStore.close();
		history.back();
	}
	$: $drawerStore.open = $page.state.showDrawer;
</script>

<Drawer>
	<div class="w-full h-full p-3 bg-slate-50 dark:bg-surface-800">
		<div class="w-full flex items-center">
			<div class="grow"><LightSwitch class="m-3 bg-opacity-0" /></div>
			<button
				on:click={closeDrawer}
				class="hover:variant-soft-primary dark:hover:variant-soft-surface btn btn-sm size-10"
			>
				<i class="fa-solid fa-times text-xl" />
			</button>
		</div>
		<br />
		<Accordion hover="hover:bg-primary-hover-token dark:hover:!bg-surface-400/50">
			<!-- <AccordionItem open> -->
			<AccordionItem>
				<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
				<svelte:fragment slot="iconClosed"><i class="fa-solid fa-minus" /></svelte:fragment>
				<svelte:fragment slot="iconOpen"><i class="fa-solid fa-plus" /></svelte:fragment>
				<svelte:fragment slot="summary">
					<div class="text-xl font-heading-token">
						<a
							on:click={drawerStore.close}
							href="/news"
							class="focus:variant-soft-primary dark:focus:variant-soft-surface hover:text-primary-500 dark:hover:text-surface-100"
						>
							News
						</a>
					</div>
				</svelte:fragment>
				<svelte:fragment slot="content"
					><ol>
						{#each $newsStore.slice(0, 5) as newsItem, idx (newsItem.publishedAt)}
							<li class="w-full group">
								<a
									on:click={drawerStore.close}
									href={`/news/${$newsStore.length - idx}`}
									class="size-full"
								>
									<div
										class="size-full rounded-container-token hover:variant-soft-primary group-active:variant-ghost-primary px-4 py-3 group-last:pb-4"
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
							<li class="px-2">
								<h2 class="font-token text-md">No news yet</h2>
							</li>
						{/each}
					</ol></svelte:fragment
				>
			</AccordionItem>
			{#each $navStore as item (item.header)}
				<AccordionItem>
					<!-- <svelte:fragment slot="lead">(icon)</svelte:fragment> -->
					<svelte:fragment slot="iconClosed"><i class="fa-solid fa-minus" /></svelte:fragment>
					<svelte:fragment slot="iconOpen"><i class="fa-solid fa-plus" /></svelte:fragment>
					<svelte:fragment slot="summary">
						<div class="text-xl font-heading-token">
							<a
								on:click={item.pageNeeded ? drawerStore.close : undefined}
								href={item.pageNeeded ? '/' + item.prefix : ''}
								class="focus:variant-soft-primary dark:focus:variant-soft-surface hover:text-primary-500 dark:hover:text-surface-100"
							>
								{item.header}
							</a>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<nav class="divide-y-2">
							<ul>
								<li>
									<a
										on:click={drawerStore.close}
										href="/"
										class="font-normal px-2 focus:variant-soft-primary dark:focus:variant-soft-surface group transition duration-300 block hover:text-primary-500 dark:hover:text-surface-100"
									>
										<span>Committee</span>
										<span
											class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary-500 dark:bg-surface-100"
										></span>
									</a>
								</li>
							</ul>
							<ul>
								{#if item.navItems}
									{#each item.navItems as subItem (subItem.path)}
										<li class="py-1">
											<a
												on:click={drawerStore.close}
												href={subItem.path}
												class="font-normal px-2 focus:variant-soft-primary dark:focus:variant-soft-surface group transition duration-300 block hover:text-primary-500 dark:hover:text-surface-100"
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
										on:click={drawerStore.close}
										href="/"
										class="font-normal px-2 focus:variant-soft-primary dark:focus:variant-soft-surface group transition duration-300 block hover:text-primary-500 dark:hover:text-surface-100"
									>
										<span>DCAC</span>
										<span
											class="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-primary-500 dark:bg-surface-100"
										></span>
									</a>
								</li>
							</ul>
						</nav>
					</svelte:fragment>
				</AccordionItem>
			{/each}
			{#if $page.data.html}
				<div class="p-3">
					<hr />
				</div>
				<AccordionItem open>
					<svelte:fragment slot="iconClosed"><i class="fa-solid fa-minus" /></svelte:fragment>
					<svelte:fragment slot="iconOpen"><i class="fa-solid fa-plus" /></svelte:fragment>
					<svelte:fragment slot="summary">
						<div class="text-xl font-heading-token">
							<a
								on:click={drawerStore.close}
								href="#top"
								class="focus:variant-soft-primary dark:focus:variant-soft-surface hover:text-primary-500 dark:hover:text-surface-100"
							>
								On this Page
							</a>
						</div>
					</svelte:fragment>
					<svelte:fragment slot="content">
						<div use:handleToCAnchors>
							<TableOfContents
								regionList="!mt-0 px-2"
								inactive="!font-normal hover:opacity-100 hover:text-primary-500 dark:hover:text-primary-400"
								active="!font-normal text-primary-500 dark:text-primary-400"
								><div></div>
							</TableOfContents>
						</div>
					</svelte:fragment>
				</AccordionItem>
			{/if}
		</Accordion>
	</div>
</Drawer>
