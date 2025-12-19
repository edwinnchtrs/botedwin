
import { fetchMediaData } from './src/services/mediaDownloader';

const testUrl = 'https://www.tiktok.com/@inilahcom/video/7581611938732412176?is_from_webapp=1&sender_device=pc';

async function test() {
    try {
        console.log('Testing URL:', testUrl);
        const data = await fetchMediaData(testUrl);
        console.log('Result:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

test();
