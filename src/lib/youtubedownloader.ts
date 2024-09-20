import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path, { resolve } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { Stream } from 'mongodb';

type Result = {
  status: boolean;
  path?: string;
  message?: string;
  error?: unknown;
};

const resolusi = [
  '160', // 144p
  '134', // 360p
  '135', // 480p
  ['302', '136', '247'], // 720p
  ['303', '248'], // 1080p
  ['308', '271'], // 1440p
  ['315', '313'], // 2160p
  'highestaudio',
  'highestvideo',
];

export const downloadAudio = async (url: string): Promise<Result> => {
  const info = await ytdl.getInfo(url);
  try {
    const audioStram: any = ytdl.downloadFromInfo(info, {
      quality: resolusi[7],
    });
    const audioFile = path.resolve('laguonly.mp3');
    await streamToFile(audioStram, audioFile);
    return {
      status: true,
      path: audioFile,
      message: 'tes',
    };
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
};
export const downloadVideo = async (
  url: string,
  kualitas?: string,
): Promise<Result> => {
  // const audioStream = ytdl(url, {
  //   filter: 'audioonly',
  //   quality: 'highestaudio',
  // });
  const resolusine = kualitas ? kualitas : resolusi[2];
  const info = await ytdl.getInfo(url);
  const audioStream: any = ytdl.downloadFromInfo(info, {
    quality: 'highestaudio',
  });
  const videoStream: any = ytdl.downloadFromInfo(info, {
    quality: resolusine,
  });
  const result: string = path.resolve('hasil.mp4');
  const filelagu: string = path.resolve('lagu.mp3');
  const filevideo: string = path.resolve('video.mp4');
  try {
    await Promise.all([
      await streamToFile(audioStream, filelagu),
      await streamToFile(videoStream, filevideo),
    ]);
    console.log('berhasil menyimpan');
    await mergeFile(filelagu, filevideo, result);
    console.log('berhasil menyimpan gabungan');
    return {
      status: true,
    };
  } catch (error) {
    console.log(error);
    return {
      status: true,
      error: error,
    };
  }

  // console.log(filelagu, filevideo);
};
const streamToFile = async (stream: Stream, path: string) => {
  return new Promise<void>(async (resolve, reject) => {
    const file = fs.createWriteStream(path);
    stream.pipe(file);
    stream.on('end', () => {
      console.log('berhasil dibuat ', path);
      resolve();
    });
    stream.on('error', (error) => {
      console.log('gagal', error);
      reject(error);
    });
  });
};

const mergeFile = async (
  pathAudio: string,
  pathVideo: string,
  result: string,
) => {
  return new Promise((rejects, resolve) => {
    ffmpeg()
      .addInput(pathAudio)
      .addInput(pathVideo)
      .outputOptions('-c:v copy')
      .outputOptions('-c:a aac')
      .outputOptions('-strict experimental')
      .on('error', (error: any) => {
        console.log(error);
        rejects(error);
      })
      .on('end', () => {
        console.log(' finished !');
        resolve();
      })
      .saveToFile(result);
  });
};
