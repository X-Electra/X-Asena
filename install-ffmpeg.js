import fs from 'fs';
import https from 'https';
import { execSync } from 'child_process';

if (!fs.existsSync('./ffmpeg')) {
  console.log('Downloading static FFmpeg build for bot...');
  const file = fs.createWriteStream('ffmpeg.tar.xz');
  https.get('https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz', function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log('Extracting FFmpeg...');
      execSync('mkdir -p ffmpeg && tar -xf ffmpeg.tar.xz -C ffmpeg --strip-components 1');
      // Add local ffmpeg folder to system PATH for the current process
      process.env.PATH = `${process.cwd()}/ffmpeg:${process.env.PATH}`;
      console.log('FFmpeg is ready locally!');
    });
  });
}
