import { PlaywrightTestConfig } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

const config: PlaywrightTestConfig = {
	use: {
		baseURL: process.env.BASE_URL,
		headless: true,
		ignoreHTTPSErrors: true,
	},
	workers: 1,
	timeout: 80000,
	retries: 0,
	expect: { timeout: 25000 },
}
export default config