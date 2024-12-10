const apiURL = 'https://api.github.com/search/repositories';
const searchInput = document.querySelector('#search');
const autocompleteList = document.querySelector('#autocomplete_list');
const repList = document.querySelector('#rep_list');

const debounce = (fn, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => fn(...args), delay);
  };
};

const fetchRepositories = async (query) => {
  if (!query) return [];
  try {
    const response = await fetch(`${apiURL}?q=${query}&per_page=5`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return [];
  }
};

const renderAutocomplete = (repositories) => {
  autocompleteList.innerHTML = '';
  repositories.forEach((rep) => {
    const item = document.createElement('div');
    item.classList.add('container__autocomplete_item');
    item.textContent = rep.name;
    item.addEventListener('click', () => addRepository(rep));
    autocompleteList.appendChild(item);
  });
};

const addRepository = (rep) => {
  const listItem = document.createElement('li');
  listItem.classList.add('container__rep_item');
  listItem.innerHTML = `
      <p>Name: ${rep.name}<br>
      Owner: ${rep.owner.login}<br>
      Stars: ${rep.stargazers_count}</p>
      <button class="container__remove_btn"></button>
    `;
  listItem
    .querySelector('.container__remove_btn')
    .addEventListener('click', () => listItem.remove());
  repList.appendChild(listItem);
  searchInput.value = '';
  autocompleteList.innerHTML = '';
};

const inputChange = debounce(async (event) => {
  const query = event.target.value.trim();
  const repositories = await fetchRepositories(query);
  renderAutocomplete(repositories);
}, 300);

searchInput.addEventListener('input', inputChange);
