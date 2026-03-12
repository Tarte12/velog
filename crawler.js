const fs = require('fs');
const path = require('path');
require('dotenv').config();

const VELOG_ENDPOINT = 'https://api.velog.io/graphql';
const ACCESS_TOKEN = process.env.VELOG_ACCESS_TOKEN;

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(VELOG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `access_token=${ACCESS_TOKEN}`,
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    body: JSON.stringify({ query, variables })
  });
  const result = await response.json();
  if (result.errors) {
    console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
    throw new Error('GraphQL Errors');
  }
  return result.data;
}

async function getUsername() {
  const query = `
    query {
      me {
        username
      }
    }
  `;
  const data = await graphqlRequest(query);
  if (!data.me) throw new Error('Could not find user info. Check your VELOG_ACCESS_TOKEN.');
  return data.me.username;
}

async function getAllPosts(username) {
  let allPosts = [];
  let cursor = null;
  let hasMore = true;

  console.log('Fetching post list...');
  while (hasMore) {
    const query = `
      query Posts($username: String, $cursor: ID) {
        posts(username: $username, limit: 20, cursor: $cursor) {
          id
          title
          short_description
          released_at
          url_slug
          tags
        }
      }
    `;
    const data = await graphqlRequest(query, { username, cursor });
    const posts = data.posts;
    if (!posts || posts.length === 0) {
      hasMore = false;
    } else {
      allPosts = allPosts.concat(posts);
      cursor = posts[posts.length - 1].id;
      console.log(`Found ${allPosts.length} posts...`);
    }
  }
  return allPosts;
}

async function getPostDetail(username, url_slug) {
  const query = `
    query Post($username: String, $url_slug: String) {
      post(username: $username, url_slug: $url_slug) {
        id
        title
        body
        released_at
        tags
      }
    }
  `;
  const data = await graphqlRequest(query, { username, url_slug });
  return data.post;
}

async function run() {
  try {
    const username = 'emprimula';
    console.log(`Target User: ${username}`);
    
    const postsList = await getAllPosts(username);
    
    const postsDir = path.join(__dirname, 'posts');
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir);
    }

    console.log(`Starting to download ${postsList.length} posts...`);
    for (let i = 0; i < postsList.length; i++) {
      const p = postsList[i];
      console.log(`[${i + 1}/${postsList.length}] Downloading: ${p.title}`);
      
      const detail = await getPostDetail(username, p.url_slug);
      if (!detail) {
        console.error(`Failed to get detail for ${p.url_slug}`);
        continue;
      }

      const fileName = `${p.url_slug}.md`;
      const filePath = path.join(postsDir, fileName);
      
      const frontmatter = [
        '---',
        `title: '${detail.title.replace(/'/g, "''")}'`,
        `slug: ${p.url_slug}`,
        `date: ${detail.released_at}`,
        `tags: [${detail.tags.map(t => `'${t}'`).join(', ')}]`,
        '---',
        ''
      ].join('\n');

      const content = frontmatter + detail.body;
      fs.writeFileSync(filePath, content, 'utf8');
    }

    console.log('\nAll posts have been backed up to the "posts" directory!');
    console.log('You can now git add, commit, and push them.');
  } catch (err) {
    console.error('Error during backup:', err.message);
  }
}

run();
