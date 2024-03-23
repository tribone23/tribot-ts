
import axios from 'axios'

const options = {
 method: 'GET',
 url: 'https://anime-voice-waifu-ai-api.p.rapidapi.com/japaneseto',
 params: {
 text: 'HELLO WORLD '
 },
 headers: {
 'X-RapidAPI-Key': 'c53cdc7c40msh38af7848aa0c333p1efbbejsn700ef7f44774',
 'X-RapidAPI-Host': 'anime-voice-waifu-ai-api.p.rapidapi.com'
 }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}

import axios from 'axios'

const options = {
 method: 'GET',
 url: 'https://anime-voice-waifu-ai-api.p.rapidapi.com/japaneseto',
 params: {
 text: 'HELLO WORLD '
 },
 headers: {
 'X-RapidAPI-Key': 'c53cdc7c40msh38af7848aa0c333p1efbbejsn700ef7f44774',
 'X-RapidAPI-Host': 'anime-voice-waifu-ai-api.p.rapidapi.com'
 }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error.data);
}
