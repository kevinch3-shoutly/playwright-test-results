import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
	use: {
		baseURL: 'https://localhost:4200',
		// baseUrl: 'https://test.gigs.shoutly.com',
		// baseURL: 'https://demo.shoutly.com',
		headless: true,
		ignoreHTTPSErrors: true,
	},
	timeout: 160000,
	retries: 3,
	expect: { timeout: 25000 }
}
export default config