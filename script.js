// script.js

const API_KEY = 'c4b68dbc31a54019a6f6dae430ad8cdc'; // Replace with your NewsAPI key
const API_URL = 'https://newsapi.org/v2/top-headlines';
let currentCategory = 'general';
let currentPage = 1;
let isLoading = false;

const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const loader = document.getElementById('loader');

// Fetch news articles
async function fetchNews(category, query = '', page = 1) {
    isLoading = true;
    loader.classList.remove('hidden');

    const url = `${API_URL}?apiKey=${API_KEY}&category=${category}&q=${query}&page=${page}&pageSize=10`;
    const response = await fetch(url);
    const data = await response.json();

    loader.classList.add('hidden');
    isLoading = false;

    return data.articles;
}

// Render news articles
function renderNews(articles) {
    articles.forEach(article => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('news-card');

        newsCard.innerHTML = `
      <img src="${article.urlToImage || 'https://via.placeholder.com/300x200'}" alt="${article.title}">
      <div class="news-card-content">
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank">Read More</a>
      </div>
    `;

        newsContainer.appendChild(newsCard);
    });
}

// Load news by category
async function loadCategoryNews(category) {
    currentCategory = category;
    currentPage = 1;
    newsContainer.innerHTML = '';

    const articles = await fetchNews(category);
    renderNews(articles);
}

// Infinite scrolling
window.addEventListener('scroll', async () => {
    if (isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
        currentPage++;
        const articles = await fetchNews(currentCategory, '', currentPage);
        renderNews(articles);
    }
});

// Search functionality
searchBtn.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (!query) return;

    currentCategory = '';
    newsContainer.innerHTML = '';
    const articles = await fetchNews('', query);
    renderNews(articles);
});

// Category button event listeners
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadCategoryNews(btn.dataset.category);
    });
});

// Initial load
loadCategoryNews(currentCategory);
