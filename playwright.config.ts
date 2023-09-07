import { PlaywrightTestConfig } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

const config: PlaywrightTestConfig = {
	use: {
		baseURL: process.env.BASE_URL ?? 'https://localhost:4200/',
		headless: true,
		ignoreHTTPSErrors: true,
		viewport: { width: 1920, height: 1080 },
		video: {
			mode: 'on',
			size: { width: 1920, height: 1080 }
		},
        launchOptions: {
            slowMo: 30, // slow down by N ms, based on the SLOWMO env variable
        },
	},
	reporter: [['junit', { outputFile: 'test-results/test-results.xml' }]],
	workers: 1,
	timeout: parseInt(process.env.TIMEOUT ?? '30000'),
	retries: parseInt(process.env.RETRIES ?? '0'),
	expect: { timeout: 25000 },
}

export default config