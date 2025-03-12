<script>
  import { Octokit } from "octokit";
  import { getListLanguage } from "../lib/index";
  import { onMount } from "svelte";

  let repo = null;
  let loading = false;
  let error = "";
  let pr = [];
  let key = "";
  let query = "stars:>0";
  let totalRepo = 0;
  onMount(async function () {
    const response = await fetch(
      "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
    );
    const data = await response.json();
    pr = data;
    return data;
  });

  function addKey(value) {
    if (value === "") {
      query = `stars:>0 language:${value}`;
      fetchRepo();
      return;
    }
    query = `stars:>0 language:${value}`;
    fetchRepo();
    return;
  }

  async function fetchRepo() {
    loading = true;
    error = "";
    repo = null;

    try {
      const octokit = new Octokit({
        auth: import.meta.env.OCTOAUTH,
      });
      const total = await octokit.rest.search.repos({
        q: query,
        sort: "no",
        order: "no",
        per_page: 1,
        page: 1,
      });
      totalRepo = total.data.total_count;
      if (totalRepo === 0) {
        error = "No repositories found for this language.";
        loading = false;
        return;
      }
      let maxPages = Math.min(Math.ceil(totalRepo / 1), 100);

      let randomPage = Math.floor(Math.random() * maxPages) + 1;

      const response = await octokit.rest.search.repos({
        q: query,
        sort: "no",
        order: "no",
        per_page: 1,
        page: randomPage,
      });

      if (response.data.items.length > 0) {
        repo = response.data.items[0];
      } else {
        error = "No repositories found.";
      }
    } catch (err) {
      error = "Failed to fetch repository.";
    } finally {
      loading = false;
    }
  }

  let value = "";
</script>

<div
  class="flex flex-col items-center justify-center gap-4 w-[412px] md:w-[512px] p-6 md:p-0"
>
  <div class="w-full box-border">
    <h1 class="text-2xl md:text-3xl font-bold text-center">
      GitHub Random Repository Finder
    </h1>
  </div>
  <div class="w-full box-border">
    <select
      id="countries"
      class="border border-white text-white text-sm rounded-lg focus:ring-white focus:border-white block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-white dark:focus:border-white"
      onchange={(e) => addKey(e.target.value)}
    >
      {#each pr as { value, title }}
        <option {value}>{title}</option>
      {/each}
    </select>
  </div>

  <div class="w-full box-border flex flex-col gap-4">
    <div
      class="flex border-2 border-white rounded-2xl flex-col md:p-5 p-3 backdrop-blur-2xl bg-opacity-50 bg-gray-400/10 w-full box-border"
    >
      {#if repo === null && loading === false && error === ""}
        <h1 class="text-center md:text-xl text-sm">Please select a language</h1>
      {/if}
      {#if loading}
        <p class="text-center md:text-xl text-sm">Loading, please wait...</p>
      {/if}
      {#if error}
        <div>
          <h1 class="text-white text-center md:text-xl text-sm">{error}</h1>
        </div>
      {/if}
      {#if repo}<div class="flex gap-2 items-center md:text-2xl text-lg">
          <img
            src={repo.owner.avatar_url}
            alt=""
            class="rounded-full w-9 h-9 border-2 border-gray-700"
          />
          <h2 class="text-ellipsis whitespace-nowrap overflow-hidden">
            {repo.owner.login}/
            <span class="font-bold">{repo.name}</span>
          </h2>
        </div>
        <p
          class="text-ellipsis text-sm md:text-lg whitespace-nowrap overflow-hidden"
        >
          {repo.description || "No description available."}
        </p>
        <span class="flex gap-2 items-center">
          <p>{repo.language}</p>
          <p class="flex items-center">
            <svg
              width="25"
              height="25"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 40.9046L116.693 81.5965L117.391 83.299L119.225 83.4481L162.648 86.9777L129.533 115.739L128.165 116.927L128.58 118.691L138.683 161.635L101.58 138.657L100 137.679L98.4205 138.657L61.3169 161.635L71.4203 118.691L71.8352 116.927L70.4672 115.739L37.3525 86.9777L80.775 83.4481L82.6091 83.299L83.3075 81.5965L100 40.9046Z"
                fill="none"
                stroke="white"
                stroke-width="6"
              />
            </svg>{repo.stargazers_count}
          </p>
          <p class="flex items-center">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g><g id="SVGRepo_iconCarrier">
                <path
                  d="M7 5C7 3.89543 7.89543 3 9 3C10.1046 3 11 3.89543 11 5C11 5.74028 10.5978 6.38663 10 6.73244V14.0396H11.7915C12.8961 14.0396 13.7915 13.1441 13.7915 12.0396V10.7838C13.1823 10.4411 12.7708 9.78837 12.7708 9.03955C12.7708 7.93498 13.6662 7.03955 14.7708 7.03955C15.8753 7.03955 16.7708 7.93498 16.7708 9.03955C16.7708 9.77123 16.3778 10.4111 15.7915 10.7598V12.0396C15.7915 14.2487 14.0006 16.0396 11.7915 16.0396H10V17.2676C10.5978 17.6134 11 18.2597 11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 18.2597 7.4022 17.6134 8 17.2676V6.73244C7.4022 6.38663 7 5.74028 7 5Z"
                  fill="none"
                  stroke="white"
                ></path>
              </g></svg
            >{repo.forks}
          </p>
        </span>
        <a
          href={repo.html_url}
          target="_blank"
          class="flex items-center hover:underline"
          >View on GitHub <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g><g id="SVGRepo_iconCarrier">
              <g id="Interface / External_Link">
                <path
                  id="Vector"
                  d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                  stroke="white"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  fill="none"
                ></path>
              </g>
            </g></svg
          ></a
        >
      {/if}
    </div>
    {#if repo}
      <div class="w-full box-border">
        <button
          onclick={fetchRepo}
          class="w-full text-lg md:text-xl rounded-2xl p-3 text-white bg-gray-950 hover:bg-gray-950/50 transition-all"
          >Refresh</button
        >
      </div>
    {/if}
    {#if error}
      <div class="w-full box-border">
        <button
          onclick={fetchRepo}
          class="w-full text-xl rounded-2xl p-3 text-white bg-red-600 hover:bg-red-600/50 transition-all"
          >Retry</button
        >
      </div>
    {/if}
  </div>
</div>
