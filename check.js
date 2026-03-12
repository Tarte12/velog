require('dotenv').config();

const VELOG_ENDPOINT = 'https://api.velog.io/graphql';
const ACCESS_TOKEN = process.env.VELOG_ACCESS_TOKEN;

async function checkSchema() {
  const query = `
    query {
      __type(name: "Query") {
        fields {
          name
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
  console.log(JSON.stringify(result, null, 2));
}

checkSchema().catch(console.error);
