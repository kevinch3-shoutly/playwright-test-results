import { PlaywrightTestConfig } from '@playwright/test'
import * as dotenv from 'dotenv'
dotenv.config()

const config: PlaywrightTestConfig = {
	use: {
		baseURL: process.env.BASE_URL,
		headless: true,
		ignoreHTTPSErrors: true,
	},
	timeout: 160000,
	retries: 3,
	expect: { timeout: 25000 }
}
export default config