import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const publicDir = path.join(__dirname, 'public');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory data store for persistent experience
const users = [
  {
    id: 'usr_1',
    username: 'CodeMaster',
    email: 'developer@codeguide.dev',
    password: 'password123',
    role: 'Admin',
    fullName: 'Alex Morgan',
    title: 'Senior Full-Stack Engineer',
    bio: 'Passionate software engineer, open-source contributor, and mentor helping thousands learn clean code.',
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    streakDays: 14,
    xp: 2850,
    level: 7,
    completedTopics: ['python-basics', 'js-es6', 'react-hooks', 'dsa-trees', 'git-workflow'],
    savedBookmarks: ['python-django', 'docker-k8s', 'dynamic-programming'],
    createdAt: new Date('2024-01-15')
  }
];

const feedbackList = [
  { id: 1, category: 'UI', rating: 5, comment: 'The interactive code runner and visual roadmaps are game-changing!', user: 'Sarah K.', date: '2024-10-12' },
  { id: 2, category: 'Performance', rating: 5, comment: 'Pyodide execution runs right in the browser, lightning fast!', user: 'DevDavid', date: '2024-11-01' },
  { id: 3, category: 'Content', rating: 4, comment: 'Would love more system design scenarios and microservices guides.', user: 'Elena R.', date: '2024-11-20' }
];

const communityPosts = [
  {
    id: 1,
    title: 'How do you structure React state in large-scale Next.js apps?',
    category: 'Frontend',
    author: 'CodeMaster',
    authorRole: 'Admin',
    avatar: 'imag/profile.png',
    timeAgo: '2 hours ago',
    content: 'When scaling React applications with SSR, what do you prefer: Zustand, Redux Toolkit, or React Query + Context? Here is how we benchmark performance in production.',
    upvotes: 42,
    hasUpvoted: false,
    tags: ['React', 'Next.js', 'State Management'],
    comments: [
      { id: 101, author: 'Liam Chen', text: 'Zustand + TanStack Query is our gold standard. Keeps boilerplate near zero!', timeAgo: '1 hour ago' },
      { id: 102, author: 'Emma Watson', text: 'Server components drastically reduced our need for global client state.', timeAgo: '45 mins ago' }
    ]
  },
  {
    id: 2,
    title: 'Visualizing Dijkstra vs A* Algorithm with Interactive Graphs',
    category: 'Algorithms',
    author: 'AlgorithmAce',
    authorRole: 'Pro Member',
    avatar: 'imag/profile.png',
    timeAgo: '5 hours ago',
    content: 'I built an interactive visualizer for graph pathfinding algorithms. Check out the complexity trade-offs between heuristic-driven A* and standard BFS/Dijkstra.',
    upvotes: 89,
    hasUpvoted: false,
    tags: ['DSA', 'Graph Theory', 'Python'],
    comments: [
      { id: 201, author: 'DevDavid', text: 'Incredible breakdown! The heuristic visualization makes it click immediately.', timeAgo: '3 hours ago' }
    ]
  },
  {
    id: 3,
    title: 'Git Rebase Interactive vs Merge: Best practices for clean history',
    category: 'DevOps',
    author: 'GitGuru',
    authorRole: 'Developer',
    avatar: 'imag/profile.png',
    timeAgo: '1 day ago',
    content: 'A comprehensive guide on maintaining a linear Git commit history using interactive rebase, squash commits, and branch protections.',
    upvotes: 64,
    hasUpvoted: false,
    tags: ['Git', 'CI/CD', 'Workflows'],
    comments: [
      { id: 301, author: 'Alex Morgan', text: 'Always rebase feature branches before creating the PR. Keeps bisecting trivial.', timeAgo: '18 hours ago' }
    ]
  }
];

const topicsIndex = [
  { id: 'python', title: 'Python Programming', category: 'Backend & Data Science', level: 'Beginner to Advanced', icon: '🐍', url: 'explore.html?topic=python' },
  { id: 'javascript', title: 'Modern JavaScript (ES6+)', category: 'Web Development', level: 'Fundamental', icon: '⚡', url: 'explore.html?topic=javascript' },
  { id: 'react', title: 'React 18 & Ecosystem', category: 'Frontend', level: 'Intermediate', icon: '⚛️', url: 'explore.html?topic=react' },
  { id: 'nodejs', title: 'Node.js & Express REST APIs', category: 'Backend', level: 'Intermediate', icon: '🟢', url: 'api-development.html' },
  { id: 'dsa', title: 'Data Structures & Algorithms', category: 'Computer Science', level: 'All Levels', icon: '🧠', url: 'data-structures-algorithms.html' },
  { id: 'git', title: 'Git & Version Control', category: 'DevOps & Collaboration', level: 'Essential', icon: '🌿', url: 'version-control-git.html' },
  { id: 'cpp', title: 'C++ Systems & Competitive Coding', category: 'Systems', level: 'Advanced', icon: '⚙️', url: 'code-runner.html?lang=cpp' },
  { id: 'mobile', title: 'Mobile App Development (React Native / Flutter)', category: 'Mobile', level: 'Intermediate', icon: '📱', url: 'app-development.html' },
  { id: 'roadmaps', title: 'Role-Based Developer Roadmaps', category: 'Career Paths', level: 'Curated', icon: '🗺️', url: 'roadmap.html' },
  { id: 'runner', title: 'Interactive Code Playground', category: 'Tooling', level: 'Hands-on', icon: '🚀', url: 'code-runner.html' }
];

// Auth Endpoints
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (foundUser && foundUser.password === password) {
    return res.json({
      success: true,
      message: 'Login successful!',
      token: 'jwt_cg_demo_token_' + Date.now(),
      user: {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        fullName: foundUser.fullName,
        title: foundUser.title,
        bio: foundUser.bio,
        streakDays: foundUser.streakDays,
        xp: foundUser.xp,
        level: foundUser.level
      }
    });
  }

  // Demo fallback for instant guest login
  return res.json({
    success: true,
    message: 'Logged in as Explorer',
    token: 'jwt_cg_guest_token_' + Date.now(),
    user: {
      id: 'usr_guest',
      username: email.split('@')[0] || 'CodeExplorer',
      email: email,
      role: 'Student',
      fullName: 'Code Explorer',
      title: 'Aspiring Software Developer',
      bio: 'Exploring computer science, mastering full stack development, and building real-world projects.',
      streakDays: 3,
      xp: 450,
      level: 2
    }
  });
});

app.post('/api/register', (req, res) => {
  const { username, email, password, role, fullName } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All required fields must be filled.' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    username,
    email,
    password,
    role: role || 'Student',
    fullName: fullName || username,
    title: 'Software Developer',
    bio: 'Coding learner on Code Guide platform.',
    streakDays: 1,
    xp: 100,
    level: 1,
    completedTopics: [],
    savedBookmarks: [],
    createdAt: new Date()
  };

  users.push(newUser);

  return res.json({
    success: true,
    message: 'Account registered successfully! Welcome to Code Guide.',
    token: 'jwt_cg_new_token_' + Date.now(),
    user: newUser
  });
});

// Profile Endpoint
app.get('/api/profile', (req, res) => {
  res.json({
    user: users[0],
    stats: {
      totalHours: 48,
      completedCourses: 12,
      challengesSolved: 76,
      contributionsCount: 142,
      certifications: 3
    }
  });
});

app.post('/api/profile/update', (req, res) => {
  const { fullName, title, bio, github, linkedin } = req.body;
  if (fullName) users[0].fullName = fullName;
  if (title) users[0].title = title;
  if (bio) users[0].bio = bio;
  if (github) users[0].github = github;
  if (linkedin) users[0].linkedin = linkedin;

  res.json({ success: true, message: 'Profile updated successfully!', user: users[0] });
});

// AI Chatbot Assistant Endpoint
app.post('/api/chatbot/ask', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const query = message.toLowerCase().trim();
  let reply = "";
  let codeSnippet = "";

  if (query.includes('python') || query.includes('list comprehension') || query.includes('decorator')) {
    reply = "Python is a modern, high-level, expressive language. Here is how list comprehension and dictionary comprehension work efficiently in Python:";
    codeSnippet = `# Python List Comprehension Example\nnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\neven_squares = [n**2 for n in numbers if n % 2 == 0]\nprint("Even squares:", even_squares) # [4, 16, 36, 64, 100]\n\n# Dictionary mapping\nchar_map = {chr(65 + i): i + 1 for i in range(5)}\nprint("Char map:", char_map)`;
  } else if (query.includes('react') || query.includes('hook') || query.includes('usestate') || query.includes('useeffect')) {
    reply = "In React 18+, functional components use React Hooks for state and side effects. Here is a clean pattern for state management and async data fetching:";
    codeSnippet = `import React, { useState, useEffect } from 'react';\n\nfunction UserCounter() {\n  const [count, setCount] = useState(0);\n  const [data, setData] = useState(null);\n\n  useEffect(() => {\n    // Cleanup on unmount\n    const timer = setInterval(() => console.log('Tick'), 1000);\n    return () => clearInterval(timer);\n  }, []);\n\n  return (\n    <button onClick={() => setCount(c => c + 1)}>\n      Count is: {count}\n    </button>\n  );\n}`;
  } else if (query.includes('javascript') || query.includes('js') || query.includes('promise') || query.includes('async')) {
    reply = "Modern JavaScript features async/await, closures, destructuring, and event loop microtask queuing:";
    codeSnippet = `// Async/Await with error handling\nasync function fetchDeveloperData(userId) {\n  try {\n    const res = await fetch(\`/api/developers/\${userId}\`);\n    if (!res.ok) throw new Error('Failed to load');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Error:', err.message);\n    return null;\n  }\n}`;
  } else if (query.includes('dsa') || query.includes('binary search') || query.includes('quicksort') || query.includes('tree') || query.includes('graph')) {
    reply = "Binary Search achieves O(log n) time complexity on sorted arrays by repeatedly halving the search space:";
    codeSnippet = `function binarySearch(arr, target) {\n  let left = 0, right = arr.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (arr[mid] === target) return mid; // Found at index\n    if (arr[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1; // Not found\n}\n\nconsole.log(binarySearch([10, 20, 30, 40, 50], 30)); // Output: 2`;
  } else if (query.includes('git') || query.includes('rebase') || query.includes('merge') || query.includes('conflict')) {
    reply = "Git workflow best practice: Use `git fetch` and `git rebase` to keep a clean commit history:";
    codeSnippet = `# 1. Switch to your feature branch\ngit checkout -b feature/auth-flow\n\n# 2. Keep updated with main without merge bubbles\ngit checkout main\ngit pull origin main\ngit checkout feature/auth-flow\ngit rebase main\n\n# 3. Push cleanly\ngit push -u origin feature/auth-flow`;
  } else if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('start')) {
    reply = "Welcome to Code Guide AI! I'm your interactive coding assistant. You can ask me to explain any programming concept, debug code snippets, demonstrate DSA algorithms, or generate boilerplates for Python, JavaScript, React, C++, and Git.";
  } else {
    reply = `Great question regarding "${message}"! Code Guide offers structured tutorials, live code sandboxes, and interactive roadmaps. Would you like me to show you a practical code implementation, algorithmic breakdown, or best practice checklist?`;
  }

  return res.json({ response: reply, codeSnippet });
});

// Community Feed Endpoints
app.get('/api/community/posts', (req, res) => {
  res.json({ posts: communityPosts });
});

app.post('/api/community/posts', (req, res) => {
  const { title, category, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const newPost = {
    id: communityPosts.length + 1,
    title,
    category: category || 'General',
    author: users[0].username,
    authorRole: users[0].role,
    avatar: 'imag/profile.png',
    timeAgo: 'Just now',
    content,
    upvotes: 1,
    hasUpvoted: true,
    tags: Array.isArray(tags) ? tags : ['Learning', 'Question'],
    comments: []
  };

  communityPosts.unshift(newPost);
  res.json({ success: true, message: 'Discussion posted successfully!', post: newPost });
});

app.post('/api/community/upvote', (req, res) => {
  const { postId } = req.body;
  const post = communityPosts.find(p => p.id === Number(postId));
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  if (post.hasUpvoted) {
    post.upvotes -= 1;
    post.hasUpvoted = false;
  } else {
    post.upvotes += 1;
    post.hasUpvoted = true;
  }

  res.json({ success: true, upvotes: post.upvotes, hasUpvoted: post.hasUpvoted });
});

app.post('/api/community/comment', (req, res) => {
  const { postId, text } = req.body;
  const post = communityPosts.find(p => p.id === Number(postId));
  if (!post) return res.status(404).json({ error: 'Post not found.' });
  if (!text) return res.status(400).json({ error: 'Comment text is required.' });

  const comment = {
    id: Date.now(),
    author: users[0].username,
    text,
    timeAgo: 'Just now'
  };

  post.comments.push(comment);
  res.json({ success: true, comment });
});

// Feedback & Improvement Endpoints
app.get('/api/improvements', (req, res) => {
  res.json({ feedback: feedbackList });
});

app.post('/api/improvements', (req, res) => {
  const { category, rating, comment, name } = req.body;
  if (!comment) return res.status(400).json({ error: 'Comment is required.' });

  const entry = {
    id: feedbackList.length + 1,
    category: category || 'General',
    rating: parseInt(rating, 10) || 5,
    comment,
    user: name || 'Community Member',
    date: new Date().toISOString().split('T')[0]
  };

  feedbackList.unshift(entry);
  return res.json({ success: true, message: 'Thank you! Your feedback helps elevate the platform for all developers.' });
});

// Search & Catalog Index
app.get('/api/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  if (!q) return res.json({ results: topicsIndex });

  const results = topicsIndex.filter(t => 
    t.title.toLowerCase().includes(q) || 
    t.category.toLowerCase().includes(q) ||
    t.level.toLowerCase().includes(q)
  );

  res.json({ results });
});

// Admin Stats
app.get('/api/admin/stats', (req, res) => {
  res.json({
    totalUsers: 1420 + users.length,
    activeLearnersToday: 328,
    codeExecutionsToday: 1890,
    totalTutorials: 85,
    systemStatus: 'Operational (100% Uptime)',
    recentFeedback: feedbackList.slice(0, 5),
    registeredUsersList: users
  });
});

// Serve static assets from public folder
app.use(express.static(publicDir));

// Route for root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, 'landing.html'));
});

// Fallback for HTML page routes without .html extension
app.get('/:page', (req, res, next) => {
  const pagePath = path.join(publicDir, `${req.params.page}.html`);
  res.sendFile(pagePath, (err) => {
    if (err) {
      next();
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Code Guide professional platform running on http://0.0.0.0:${PORT}`);
});
