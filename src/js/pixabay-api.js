import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '52775931-16083de2a094930dd1fb1c03d';

const defaultParams = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
	safesearch: true,
  per_page: 15,
};

export async function getImagesByQuery(query, page = 1) {
	try {
		const response = await axios.get(BASE_URL, {
			params: { ...defaultParams, q: query, page },
		});
	return response.data;
}
catch (error) {
	throw error;
}
}
