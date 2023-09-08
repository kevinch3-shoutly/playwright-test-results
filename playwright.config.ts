import { PlaywrightTestConfig, ReporterDescription } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

let reporter: ReporterDescription[] = [
	['junit', { 
		outputFile: 'test-results/test-results.xml' 
	}]
]

if (process.argv.includes('--slack-reporter')) {
	reporter.push([
		'./node_modules/playwright-slack-report/dist/src/SlackReporter.js',
		{
			channels: ['bugs'],
			sendResults: 'always',
			slackOAuthToken: process.env.SLACK_BOT_USER_OAUTH_TOKEN
		}
	])
}

const config: PlaywrightTestConfig = {
	use: {
		baseURL: process.env.BASE_URL,
		headless: true,
		ignoreHTTPSErrors: true,
		viewport: { width: 1920, height: 1080 },
		video: {
			mode: 'on',
			size: { width: 1920, height: 1080 },
		},
		launchOptions: {
			slowMo: 30,
		},
	},
	workers: 1,
	timeout: parseInt(process.env.TIMEOUT ?? '30000'),
	retries: parseInt(process.env.RETRIES ?? '0'),
	expect: { timeout: 25000 },
	reporter
}

export default config