const BASE_URL = 'https://restcountries.eu/rest/v2/name';

export default function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}/${searchQuery}`).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw new Error(response.statusText)
  })
    .catch(error => console.log(error))
};