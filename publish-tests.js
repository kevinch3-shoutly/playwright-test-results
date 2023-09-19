import { exec } from 'child_process';
import * as dotenv from 'dotenv'
dotenv.config()

const directoryPath = './test-html-report';
const githubToken = process.env.GITHUB_PAGES_TOKEN; // Asegúrese de establecer esta variable de entorno

const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.warn(`Error: ${error}`);
        return reject(error);
      }
      if(stdout){
        console.log(`stdout: ${stdout}`);
      }
      if(stderr){
        console.error(`stderr: ${stderr}`);
      }
      resolve(stdout.trim());
    });
  });
};

const deploy = async () => {
  try {
    if (!githubToken) {
      throw new Error('Github token not defined.');
    }

    console.log('Config remote repository URL to use GitHub token...');
    await runCommand(`git remote set-url origin https://${githubToken}@github.com/kevinch3-shoutly/playwright-test-results.git`);

    console.log(`Changing dir: ${directoryPath}`);
    process.chdir(directoryPath);

    console.log('Publishing into GitHub Pages...');
    await runCommand('gh-pages -d .');

    console.log('Successful deployment.');
  } catch (error) {
    console.error(`Error deployment: ${error}`);
  }
};

deploy();