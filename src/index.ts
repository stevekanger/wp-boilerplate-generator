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
 * Render template files from directory
 *
 * @param fromPath The path of the template files
 * @param toPath The path to render to
 * @param vars The mustache template variables
 */
async function renderFiles(
  fromPath: string,
  toPath: string,
  vars: TemplateVars,
) {
  const files = getDirectoryFiles(fromPath);

  files.forEach((fileName) => {
    const fileContents = fs.readFileSync(path.join(fromPath, fileName), "utf8");

    const basename = path.basename(fileName);

    if (basename.startsWith("[slug]")) {
      fileName = basename.replace("[slug]", vars.slug);
    }

    const isMustache = fileName.endsWith(".mustache");
    const filePath = path.join(toPath, fileName);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });

    if (isMustache && !excludeMustacheRender.includes(fileName)) {
      const rendered = mustache.render(fileContents, vars);

      fileName = fileName.slice(0, -".mustache".length);

      fs.writeFileSync(path.join(toPath, fileName), rendered, "utf8");
    } else {
      fs.writeFileSync(filePath, fileContents, "utf8");
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
