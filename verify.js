require('dotenv').config();

const VELOG_ENDPOINT = 'https://api.velog.io/graphql';
const ACCESS_TOKEN = process.env.VELOG_ACCESS_TOKEN;

async function verify() {
  const query = `
    query {
      me {
        username
        profile {
            display_name
        }
      }
    }
  `;

  const response = await fetch(VELOG_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `access_token=${ACCESS_TOKEN}`
    },
    body: JSON.stringify({ query })
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(JSON.stringify(result.errors, null, 2));
  }
  return result.data.me;
}

verify()
  .then(user => {
    if (user) {
        console.log(`Verified! Welcome, ${user.profile.display_name} (@${user.username})`);
    } else {
        console.log('User not found. Check your token.');
    }
  })
  .catch(err => {
    console.error('Error:', err.message);
  });
