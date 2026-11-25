// Initial / Persisted Blog Posts State
let blogPosts = JSON.parse(localStorage.getItem('blogPosts')) || [
  { id: 1, title: "Building Modern UIs with React Components", category: "React", date: "Oct 10, 2026", excerpt: "Explore component reusability and state management in modern single-page apps." },
  { id: 2, title: "Understanding JavaScript ES6+ Features", category: "JavaScript", date: "Oct 05, 2026", excerpt: "A deep dive into arrow functions, async/await patterns, and modern array methods." },
  { id: 3, title: "UI/UX Design Principles for Developers", category: "Design", date: "Sep 28, 2026", excerpt: "Simple rules for improving spacing, contrast, and typography in your web projects." }
];

let currentCategory = 'All';
let searchQuery = '';

document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  // Toggle mobile navigation menu
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    navToggle.classList.toggle("active");
  });

  renderAllViews();
});

// View Switcher Utility
function switchView(viewName) {
  document.querySelectorAll('.view-section').forEach(section => {
    section.classList.remove('active');
  });
  document.getElementById(`view-${viewName}`).classList.add('active');

  // Update active navigation link styles
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
  });
  
  // Close mobile menu if expanded
  document.getElementById('navMenu').classList.remove('active');
  document.getElementById('navToggle').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle Add Post Form Visibility
function toggleAddPostForm() {
  const card = document.getElementById('addPostFormCard');
  card.style.display = card.style.display === 'none' ? 'block' : 'none';
}

// Handle New Post Submission
function handleAddNewPost(e) {
  e.preventDefault();
  const title = document.getElementById('postTitle').value.trim();
  const category = document.getElementById('postCategory').value;
  const excerpt = document.getElementById('postExcerpt').value.trim();

  const newPost = {
    id: Date.now(),
    title,
    category,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    excerpt
  };

  blogPosts.unshift(newPost);
  localStorage.setItem('blogPosts', JSON.stringify(blogPosts));

  // Reset form & hide
  e.target.reset();
  toggleAddPostForm();

  // Re-render
  renderAllViews();
}

// Delete Blog Post
function deleteBlogPost(id) {
  if (confirm("Are you sure you want to delete this article?")) {
    blogPosts = blogPosts.filter(post => post.id !== id);
    localStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    renderAllViews();
  }
}

// Search and Filter Handling
function handleSearch() {
  searchQuery = document.getElementById('blogSearchInput').value.toLowerCase();
  renderBlogPostsGrid();
}

function filterByCategory(category, btnElement) {
  currentCategory = category;
  
  // Update active button state
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');

  renderBlogPostsGrid();
}

// Render Everything
function renderAllViews() {
  renderRecentPosts();
  renderBlogPostsGrid();
}

// Render Recent 2 Posts on Home View
function renderRecentPosts() {
  const grid = document.getElementById('recentPostsGrid');
  if (!blogPosts.length) {
    grid.innerHTML = `<p class="no-posts">No articles available yet.</p>`;
    return;
  }

  const recent = blogPosts.slice(0, 2);
  grid.innerHTML = recent.map(post => `
    <div class="post-card">
      <div>
        <div class="post-card-top">
          <span class="post-meta">${post.date}</span>
          <span class="category-badge">${post.category}</span>
        </div>
        <h3 class="post-card-title">${post.title}</h3>
        <p class="post-card-excerpt">${post.excerpt}</p>
      </div>
      <div class="post-card-footer">
        <span class="post-meta" style="color: #2563eb; font-weight: 600; cursor: pointer;" onclick="switchView('blog')">Read article</span>
        <button class="icon-btn" onclick="switchView('blog')" title="View Article">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </button>
      </div>
    </div>
  `).join('');
}

// Render Blog Posts Grid with Search & Category Filters
function renderBlogPostsGrid() {
  const grid = document.getElementById('blogPostsGrid');
  
  let filtered = blogPosts.filter(post => {
    const matchesCategory = currentCategory === 'All' || post.category === currentCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery) || post.excerpt.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (!filtered.length) {
    grid.innerHTML = `<p class="no-posts">No matching blog posts found.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(post => `
    <div class="post-card">
      <div>
        <div class="post-card-top">
          <span class="post-meta">${post.date}</span>
          <span class="category-badge">${post.category}</span>
        </div>
        <h3 class="post-card-title">${post.title}</h3>
        <p class="post-card-excerpt">${post.excerpt}</p>
      </div>
      <div class="post-card-footer">
        <button class="btn btn-danger" onclick="deleteBlogPost(${post.id})">Delete</button>
        <button class="icon-btn" onclick="switchView('blog')" title="View Article">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
        </button>
      </div>
    </div>
  `).join('');
}