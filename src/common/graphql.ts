export function graphql<T>(
  url: string,
  headers: object,
  query: string,
  variables: object = {}
): Promise<T> {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    return response.json().then((json) => {
      if (json.errors) {
        throw new Error(JSON.stringify(json.errors));
      }
      return json.data;
    });
  });
}
