import path from "path";
import { promises as fs } from "fs";
import Mustache from "mustache";
import config from "../../dev-tools.json";
import getRootDir from "../utils/getRootDir";
import getEnv from "../utils/getEnv";

interface TemplateVars {
  namespace: string;
  title: string;
  slug: string;
  textdomain: string;
  isStaticVariant: boolean;
  isDynamicVariant: boolean;
}

const { blocks: blockConfig } = config;

/**
 * Capitalizes the first letter in a string
 *
 * @param string - The string you want to return capitalized
 * @returns The capitalized string.
 * @since 0.1.0
 */
function capitalizeFirstLetter(string: string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Creates a capitalized title for the slug.
 *
 * @param slug - The slug of the block being created
 * @returns The new title string.
 *
 * @since 0.1.0
 */
function createTitle(slug: string) {
  return slug
    .split("-")
    .map((s) => capitalizeFirstLetter(s))
    .join(" ");
}

/**
 * Check if a directory exists
 *
 * @param {string} dir - The directory that you want to check
 * @returns bool
 *
 * @since 0.1.0
 */
async function dirExists(dir: string) {
  try {
    await fs.access(dir);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Creates the template files.
 *
 * @param {string} templateDir - The directory the template files reside
 * @param {string} outputDir - The directory to put the created files
 * @param {array} templates - Array of template file names
 * @param {array} templateVars - An object of the variables required for the templates
 * @returns void
 *
 * @since 0.1.0
 */
async function createTemplateFiles(
  templateDir: string,
  outputDir: string,
  templates: string[],
  templateVars: TemplateVars,
) {
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    const outputFilename = template.replace(".mustache", "");

    const templateContent = await fs.readFile(
      path.join(templateDir, template),
      "utf8",
    );

    const renderedTemplate = Mustache.render(templateContent, templateVars);

    if (renderedTemplate) {
      await fs.writeFile(
        path.join(outputDir, outputFilename),
        renderedTemplate,
        "utf8",
      );
    }
  }
}

/**
 * Creates the block.json file.
 *
 * @param {obj} data - The data to create the json.
 * @returns Promise<Object>  - The json object.
 *
 * @since 0.1.0
 */
async function createBlockJson({
  type,
  outputDir,
  namespace,
  title,
  slug,
}: {
  type: string;
  outputDir: string;
  namespace: string;
  title: string;
  slug: string;
}) {
  const json = {
    $schema: "https://schemas.wp.org/trunk/block.json",
    apiVersion: 3,
    name: `${namespace}/${slug}`,
    version: "0.1.0",
    title,
    category: "widgets",
    icon: "smiley",
    description: `Default description for ${title} block`,
    example: {},
    supports: {
      html: false,
    },
    attributes: {},
    editorScript: "file:./index.js",
    editorStyle: "file:./index.css",
    style: "file:./style-index.css",
    render: "file:./render.php",
    viewScript: "file:./view.js",
    ...blockConfig.createBlock.json,
  };

  if (type === "static") {
    delete (json as any).render;
  }

  await fs.writeFile(
    path.join(outputDir, "block.json"),
    JSON.stringify(json, null, 2),
    "utf8",
  );

  return json;
}

/**
 * Creates and writes the block files
 *
 * @since 0.1.0
 */
async function createBlock() {
  try {
    const args = process.argv.slice(2);
    const type = args[0];
    const slug = args[1];

    if (!type) {
      return console.log("Aborted: No block type provided to script");
    } else if (type !== "static" && type !== "dynamic") {
      return console.log(`Aborted: Unkown block type "${type}"`);
    } else if (!slug) {
      return console.log("Aborted: No slug provided to script");
    }

    const templateDir = path.join(__dirname, "templates");
    if (!(await dirExists(templateDir))) {
      throw new Error(`Template directory ${templateDir} doesn't exist`);
    }

    // specify the output dir in src/blocks/slug
    const outputDir = getRootDir(
      getEnv("WP_SOURCE_PATH", "src"),
      "blocks",
      slug,
    );

    // check if output directory exists if not make it else warn user and return
    if (!(await dirExists(outputDir))) {
      await fs.mkdir(outputDir, { recursive: true });
    } else {
      return console.error(
        `The block '${slug}' already exists in the blocks folder. To recreate you must first delete it.`,
      );
    }

    // create template info
    const title = createTitle(slug);
    const { namespace } = blockConfig.createBlock;
    const { textdomain } = blockConfig.createBlock.json;

    const templateVars: TemplateVars = {
      namespace,
      title,
      slug,
      textdomain,
      isStaticVariant: type === "static",
      isDynamicVariant: type === "dynamic",
    };

    // create block.json
    await createBlockJson({ type, outputDir, ...templateVars });

    // create templates
    const templates = await fs.readdir(path.join(templateDir));
    await createTemplateFiles(templateDir, outputDir, templates, templateVars);

    console.log(
      `New block "${slug}" created! To register your block add the block slug to BlockController::REGISTERED_BLOCKS array.`,
    );
  } catch (err) {
    console.log(err);
  }
}

createBlock();
