import youtubedl from 'youtube-dl-exec';
import nexo from 'nexo-aio-downloader';
import fs from 'fs';
const test = async (url) => {
  const quality = 3;
  const bitrateList = 9;
  const bitList = await nexo.youtube(url, 160);
  // const youtube = await nexo.youtube(url, quality);
  // const customAudio = await nexo.youtube(url, 150);
  // console.log(customAudio);
  fs.writeFile('tes.mp3', bitList.data.result, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('sukses');
    }
  });
  console.log(bitList.data);
};
test('https://youtu.be/jia3fhBQ8qI?si=dtHQyQkNgKvzSSHY');
