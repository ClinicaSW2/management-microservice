const endpoint = process.env.NEXT_PUBLIC_BUSSINESS_URL;

export function getEndpoint() {
    return endpoint;
}

export function fetchQuery(url) {
    return fetch(`${endpoint}/${url}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Accept': 'application/json'
        }
      });
}
