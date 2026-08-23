import { ZipArchive } from 'archiver';
import fs from 'fs';
import path from 'path';
import packageJson from '../../package.json';
import config from '../../dev-tools.json';
import commandLinePrompt from '../utils/commandLinePrompt';
import ensureDistDir from '../utils/ensureDistDir';
import getRootDir from '../utils/getRootDir';
import getVersion from './getVersion';

type ArchiveType = 'dev' | 'dist';

const { includedDist, includedDev } = config.archive;
const archiveType: ArchiveType = process.argv[2] === 'dev' ? 'dev' : 'dist';

/**
 * Creates the package archive.
 *
 * Output will be placed in the outputDir defined in the config.js file.
 *
 * @since 0.1.0
 */
async function main() {
  try {
    const outputDir = ensureDistDir();
    const rootDir = getRootDir();

    const version = await getVersion();
    const shouldProceed = await commandLinePrompt(
      `\nCurrent stated version ${version}\nIs this correct? (y/n) `,
    );

    if (shouldProceed.toLowerCase() !== 'y') {
      console.log('Aborting.');
      return;
    }

    const archiveName =
      archiveType === 'dev'
        ? `${packageJson.name}-dev.${version}.zip`
        : `${packageJson.name}.${version}.zip`;

    const includedItems =
      process.argv[2] === 'dev' ? includedDev : includedDist;

    const outputPath = path.join(outputDir, archiveName);

    // create a file to stream archive data to.
    const outputStream = fs.createWriteStream(outputPath);

    // create the archiver
    const archive = new ZipArchive({
      zlib: { level: 9 }, // Sets the compression level.
    });

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    outputStream.on('close', function() {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized.');
    });

    // This event is fired when the data source is drained no matter what was the data source.
    // It is not part of this library but rather from the NodeJS Stream API.
    // @see: https://nodejs.org/api/stream.html#stream_event_end
    outputStream.on('end', function() {
      console.log('Data has been drained');
    });

    // good practice to catch warnings (ie stat failures and other non-blocking errors)
    archive.on('warning', function(err) {
      if (err.code === 'ENOENT') {
        // log warning
      } else {
        // throw error
        throw err;
      }
    });

    // good practice to catch this error explicitly
    archive.on('error', function(err) {
      throw err;
    });

    // pipe archive data to the file
    archive.pipe(outputStream);

    // loop through directory items and add them to archive
    const dirItems = await fs.promises.readdir(rootDir);

    if (dirItems.length === 0) {
      return;
    }

    for (let i = 0; i < dirItems.length; i++) {
      const dirItem = dirItems[i];

      // include any items that are in the includedItems array
      if (!includedItems.includes(dirItem)) {
        continue;
      }

      const stat = await fs.promises.stat(dirItem);

      if (stat.isFile()) {
        archive.file(dirItem, { name: dirItem });
      } else if (stat.isDirectory()) {
        archive.directory(dirItem, path.basename(dirItem));
      }
    }

    // finalize the archive
    await archive.finalize();
  } catch (err) {
    console.error(err);
  }
}

main();
