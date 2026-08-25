import fs from "fs";
import mustache from "mustache";
import path from "path";
import {
  promptAuthor,
  promptAuthorHandle,
  promptBoilerplateType,
  promptConfirm,
  promptDescription,
  promptInstallPath,
  promptInstallTests,
  promptPhpNamespace,
  promptPhpVersion,
  promptPrefix,
  promptSlug,
  promptTitle,
  promptWordpressVersion,
} from "./prompts";
import { TemplateVars } from "./types";
import getDirectoryFiles from "./utils/getDirectoryFiles";
import getRootDir from "./utils/getRootDir";

// Dont run these files through the mustache renderer output them raw
const excludeMustacheRender = [
  "dev-tools/createBlock/templates/edit.tsx.mustache",
  "dev-tools/createBlock/templates/editor.scss.mustache",
  "dev-tools/createBlock/templates/index.ts.mustache",
  "dev-tools/createBlock/templates/render.php.mustache",
  "dev-tools/createBlock/templates/save.tsx.mustache",
  "dev-tools/createBlock/templates/style.scss.mustache",
  "dev-tools/createBlock/templates/types.ts.mustache",
  "dev-tools/createBlock/templates/view.ts.mustache",
];

/**
 * Gets the latest wordpress version from api
 */
async function getWpData(): Promise<{
  version: string;
  phpVersion: string;
}> {
  const res = await fetch("https://api.wordpress.org/core/version-check/1.7/");

  if (res.status !== 200) {
    throw new Error(
      "Failed fetching wordpress version data. Please try again shortly.",
    );
  }
  const data = await res.json();

  return {
    version: data.offers[0].version,
    phpVersion: data.offers[0].php_version,
  };
}

/**
 * Gets the destination file path
 *
 * @param {string} destDir The destination directory
 * @param {string} fileName The name of the file relative to destDir
 * @param {boolean} isRenderableMustache Wether to render the mustache file or not
 * @param {TemplateVars} vars The template variables
 */
function getDestPath(
  destDir: string,
  fileName: string,
  isRenderableMustache: boolean,
  vars: TemplateVars,
): string {
  const parsed = path.parse(path.join(destDir, fileName));

  if (parsed.base.includes("[slug]")) {
    parsed.base = parsed.base.replace("[slug]", vars.slug);
    parsed.name = parsed.name.replace("[slug]", vars.slug);
  }

  if (isRenderableMustache) {
    return `${parsed.dir}/${parsed.name}`;
  }

  return `${parsed.dir}/${parsed.base}`;
}

/**
 * Render template files from directory
 *
 * @param srcDir The path of the template files
 * @param destDir The path to render to
 * @param vars The mustache template variables
 */
async function renderFiles(
  srcDir: string,
  destDir: string,
  vars: TemplateVars,
) {
  const files = getDirectoryFiles(srcDir);

  files.forEach((fileName) => {
    const isRenderableMustache =
      fileName.endsWith(".mustache") &&
      !excludeMustacheRender.includes(fileName);

    const srcPath = path.join(srcDir, fileName);
    const destPath = getDestPath(destDir, fileName, isRenderableMustache, vars);

    if (isRenderableMustache) {
      const fileContents = fs.readFileSync(srcPath, "utf8");
      const rendered = mustache.render(fileContents, vars);

      if (rendered) {
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.writeFileSync(destPath, rendered, "utf8");
      }
    } else {
      fs.cpSync(srcPath, destPath);
    }
  });
}

/**
 * Run the generator
 */
async function main() {
  try {
    const wpData = await getWpData();
    const type = await promptBoilerplateType();
    const title = await promptTitle();
    const author = await promptAuthor();
    const authorHandle = await promptAuthorHandle(author);
    const description = await promptDescription();
    const slug = await promptSlug(title);
    const prefix = await promptPrefix(title);
    const phpNamespace = await promptPhpNamespace(title);
    const wordpressVersion = await promptWordpressVersion(wpData.version);
    const phpVersion = await promptPhpVersion(wpData.phpVersion);
    const installPath = await promptInstallPath(slug);
    const installTests = await promptInstallTests();

    const [major, minor] = wordpressVersion.split(".");

    const templateVars: TemplateVars = {
      type,
      isPlugin: type === "plugin",
      isTheme: type === "theme",
      title,
      author,
      authorHandle,
      description,
      slug,
      prefix,
      phpNamespace,
      wordpressVersion,
      wordpressVersionMajorMinor: `${major}.${minor}`,
      phpVersion,
      installPath,
      installTests,
      wpContentLocation: type === "plugin" ? "plugins" : "themes",
    };

    await promptConfirm(templateVars);

    // Render base files
    renderFiles(getRootDir("templates", "base"), installPath, templateVars);

    // Render boilerplate specific files
    renderFiles(getRootDir("templates", type), installPath, templateVars);

    // Render tests if needed
    if (installTests) {
      renderFiles(getRootDir("templates", "tests"), installPath, templateVars);
    }

    const entryFileName = type === "plugin" ? `${slug}.php` : "style.css";

    console.log(`
Finished!
Go to readme.txt and ${entryFileName} to fill in any missing information.
`);
  } catch (err) {
    console.log((err as Error).message);
  }
}

main();
