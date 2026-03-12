const fs = require('fs');
const path = require('path');
require('dotenv').config();

const VELOG_ENDPOINT = 'https://api.velog.io/graphql';
const ACCESS_TOKEN = process.env.VELOG_ACCESS_TOKEN;

async function velogPost(title, body, tags = [], isTemp = false) {
  const query = `
    mutation WritePost(
      $title: String,
      $body: String,
      $tags: [String],
      $is_temp: Boolean,
      $is_markdown: Boolean,
      $is_private: Boolean,
      $url_slug: String,
      $thumbnail: String,
      $meta: JSON,
      $series_id: ID
    ) {
      writePost(
        title: $title,
        body: $body,
        tags: $tags,
        is_temp: $is_temp,
        is_markdown: $is_markdown,
        is_private: $is_private,
        url_slug: $url_slug,
        thumbnail: $thumbnail,
        meta: $meta,
        series_id: $series_id
      ) {
        id
        url_slug
        user {
          username
        }
      }
    }
  `;

  const urlSlug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9가-힣-]/g, ''));

  const variables = {
    title,
    body,
    tags,
    is_temp: isTemp,
    is_markdown: true,
    is_private: false,
    url_slug: urlSlug,
    thumbnail: null,
    meta: null,
    series_id: null
  };

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
  if (!result.data || !result.data.writePost) {
    console.error('Mutation result is null. Full response:', JSON.stringify(result, null, 2));
    throw new Error('Mutation failed');
  }
  return result.data.writePost;
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log('Usage: node post.js <title> <file_path> [tags...]');
  process.exit(1);
}

const [title, filePath, ...tags] = args;
try {
  const content = fs.readFileSync(path.resolve(filePath), 'utf8');
  velogPost(title, content, tags)
    .then(post => {
      console.log(`Success! Post URL: https://velog.io/@${post.user.username}/${post.url_slug}`);
    })
    .catch(err => {
      console.error('Error posting to Velog:', err.message);
    });
} catch (err) {
  console.error('File Error:', err.message);
}
