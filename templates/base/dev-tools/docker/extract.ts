import { execSync } from 'child_process';
import ensureDistDir from '../utils/ensureDistDir';
import commandLinePrompt from '../utils/commandLinePrompt';

async function main() {
  try {
    const container = process.argv[2] ?? '';
    const outputDir = ensureDistDir();
    const resource = await commandLinePrompt(
      'Resource (relative wp-content): ',
    );

    const msg = execSync(
      `docker cp ${container}:/var/www/html/wp-content/${resource} ${outputDir}`,
    )
      .toString()
      .trim();

    if (msg) {
      console.log(msg);
    } else {
      console.log('Resource extracted to dist folder!');
    }
  } catch (err) {
    console.log((err as Error).message);
  }
}

main();
