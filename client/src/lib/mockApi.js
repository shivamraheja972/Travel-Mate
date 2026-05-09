export async function fetchMockData(type) {
  try {
    const response = await fetch(`/data/${type}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${type} data`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading mock ${type}:`, error);
    return [];
  }
}

export async function fetchFlights() {
  return fetchMockData('flights');
}

export async function fetchHotels() {
  return fetchMockData('hotels');
}

export async function fetchDeals() {
  return fetchMockData('deals');
}

export async function fetchBlogPosts() {
  return fetchMockData('blog');
}
