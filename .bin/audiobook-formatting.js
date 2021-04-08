#!/usr/bin/env node

const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const { program } = require('commander');
const ffmetadata = require('ffmetadata');

program.version('0.0.1');

program
  .requiredOption('-i, --input <type>', 'relative path to audiobook root folder')
  .option('-a, --album <type>', 'album name, might be needed if audiobook is still imported as separate files');

program.parse(process.argv);

const options = program.opts();

async function* getFiles(dir) {
  const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = path.resolve(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else if (!/ds_store/i.test(dirent.name)) {
      yield res;
    }
  }
}

const directoryPath = path.join(process.cwd(), options.input);


const writeMeta = promisify(ffmetadata.write);
const readMeta = promisify(ffmetadata.read);

async function updateMeta() {
    const coverPath = `/tmp/${Math.random().toString(36).substr(2, 9)}.png`;

    let coverExists = false;
    let i = 1;
    for await (let file of getFiles(directoryPath)) {
      if (i === 1) {
        // only to save cover
        await readMeta(file, { coverPath });
        coverExists = fs.existsSync(coverPath);
      }

      await writeMeta(file, {
        track: i,
          ...(options.album ? { album: options.album } : {}),
        }, (coverExists ? {
          attachments: [coverPath],
        } : {}));
      i++;
    }
 
    await fs.promises.unlink(coverPath);
}

updateMeta();

