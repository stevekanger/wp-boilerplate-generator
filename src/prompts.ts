import fs from "fs";
import { BoilerplateType, TemplateVars } from "./types";
import commandLinePrompt from "./utils/commandLinePrompt";
import getRootDir from "./utils/getRootDir";

/**
 * Prompts the user for the boilerplate type
 */
export async function promptBoilerplateType(): Promise<BoilerplateType> {
  const answer = await commandLinePrompt(
    "1: Theme\n2: Plugin\nEnter the number of what to generate?: ",
  );

  switch (answer) {
    case "1":
      return "theme";
    case "2":
      return "plugin";
    default:
      throw new Error(`Invalid selection ${answer}`);
  }
}

/**
 * Prompts the user for the title
 *
 * @param boilerplateType The type of boilerplate
 */
export async function promptTitle(): Promise<string> {
  const answer = await commandLinePrompt(`Title (eg. Super Cool Theme): `);

  if (!answer) {
    throw new Error(`A title is required.`);
  }

  return answer
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Prompts the user for the author
 */
export async function promptAuthor(): Promise<string> {
  const answer = await commandLinePrompt(`Author Full Name (eg. John Doe): `);

  if (!answer) {
    throw new Error(`An author full name is required.`);
  }

  return answer
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Prompts the user for the author handle
 */
export async function promptAuthorHandle(author: string): Promise<string> {
  const fromAuthor = author.toLowerCase().replaceAll(" ", "");

  const answer = await commandLinePrompt(
    `Author Handle (Default: ${fromAuthor}): `,
  );

  return answer || fromAuthor;
}

/**
 * Prompts the user for the description
 */
export async function promptDescription(): Promise<string> {
  const answer = await commandLinePrompt(`Description: (Default: ""): `);

  return answer || "";
}

/**
 * Prompts the user for the slug
 *
 * @param title The user specified title
 */
export async function promptSlug(title: string): Promise<string> {
  const fromTitle = title.toLowerCase().replaceAll(" ", "-");
  const answer = await commandLinePrompt(`Slug (Default: ${fromTitle}): `);

  return answer || fromTitle;
}

/**
 * Prompts the user for the prefix
 *
 * @param title The user specified title
 */
export async function promptPrefix(title: string): Promise<string> {
  const fromTitle = title.toLowerCase().replaceAll(" ", "_");
  const answer = await commandLinePrompt(`Prefix (Default: ${fromTitle}): `);

  return answer || fromTitle;
}

/**
 * Prompts the user for the php namespace
 *
 * @param title The user specified title
 */
export async function promptPhpNamespace(title: string): Promise<string> {
  const fromTitle = title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");

  const answer = await commandLinePrompt(
    `Php namespace (Default: ${fromTitle}): `,
  );

  return answer || fromTitle;
}

/**
 * Prompts the user for the target wordpress version
 *
 * @param latest The latest wordpress version
 */
export async function promptWordpressVersion(latest: string): Promise<string> {
  const answer = await commandLinePrompt(
    `Target wordpress version (Default: ${latest}): `,
  );

  return answer || latest;
}

/**
 * Prompts the user for the minimum php version
 *
 * @param recommended The wordpress recommended minimum php version
 */
export async function promptPhpVersion(minPhpVersion: string): Promise<string> {
  const answer = await commandLinePrompt(
    `Minimum php version: (Default: ${minPhpVersion}): `,
  );

  return answer || minPhpVersion;
}

/**
 * Prompt the user for the installation path
 *
 * @param slug The user specified slug
 */
export async function promptInstallPath(slug: string): Promise<string> {
  const defaultPath = getRootDir("dist", slug);
  const answer = await commandLinePrompt(
    `Install Path (Default: ${defaultPath}): `,
  );

  const selectedPath = answer || defaultPath;

  if (fs.existsSync(selectedPath)) {
    const confirmed = await commandLinePrompt(
      `\nThe directory at ${selectedPath} is not empty. Area you sure you want to overwrite the files. This action will replace the files currently in place. This cannot be undone.\n\nEnter "I understand" to proceed: `,
    );

    if (confirmed.toLowerCase() !== "i understand") {
      throw new Error("Aborting.");
    }
  }

  return selectedPath;
}

/**
 * Prompt the user whether to install tests
 */
export async function promptInstallTests(): Promise<boolean> {
  const answer = await commandLinePrompt(`Install Tests (y/n)(Default: n): `);

  return answer.toLowerCase() === "y" || answer.toLowerCase() === "yes";
}

/**
 * Prompts the user to confirm their choices
 *
 * @param boilerplateType The type of boilerplate
 * @param title The user specified title
 * @param author The user specified author
 * @param slug The user specified slug
 * @param prefix The user specified prefix
 * @param phpNamespace The user specified phpNamespace
 * @param wordrpessVersion The user specified wordpress version
 * @param location The user specified location
 */
export async function promptConfirm({
  type,
  title,
  author,
  authorHandle,
  description,
  slug,
  prefix,
  phpNamespace,
  wordpressVersion,
  phpVersion,
  installPath,
  installTests,
}: TemplateVars): Promise<string> {
  const answer = await commandLinePrompt(`
Your Data
-----------------------
Type: ${type}
Title: ${title}
Author: ${author}
Author Handle: ${authorHandle}
Description: ${description}
Slug: ${slug}
Prefix: ${prefix}
Php namespace: ${phpNamespace}
Wordpress version: ${wordpressVersion}
Php version: ${phpVersion}
Install Path: ${installPath}
Install Tests: ${installTests ? "Yes" : "No"}

is this correct? (y/n): `);

  if (answer !== "y") {
    throw new Error("Data not confirmed. Aborting.");
  }

  return answer;
}
