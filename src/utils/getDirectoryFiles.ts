import fs from "fs";

/**
 * Gets the files from a directory.
 *
 * @param directory The directory to search
 */
export default function getDirectoryFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { recursive: true })
    .filter((item) => {
      if (fs.statSync(`${directory}/${item}`).isDirectory()) {
        return false;
      }

      return true;
    })
    .map((item) => {
      return `${item}`;
    });
}
