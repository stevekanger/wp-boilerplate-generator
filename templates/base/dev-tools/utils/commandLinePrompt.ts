import readline from 'readline';

/**
 * Prompts a question in the command line
 *
 * @param {string} question - question you want to ask.
 * @returns string.
 *
 * @since 0.1.0
 */
export default async function commandLinePrompt(
  question: string,
): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const response: string = await new Promise((resolve) =>
      rl.question(question, resolve),
    );

    return response;
  } catch (err) {
    throw err;
  } finally {
    rl.close();
  }
}
