import { PlaywrightTestConfig } from '@playwright/test'

const config: PlaywrightTestConfig = {
  use: {
    baseURL: 'https://localhost:4200', // 'https://demo.shoutly.com',, //'https://test.gigs.shoutly.com',
    // baseURL: 'https://test.gigs.shoutly.com', // 'https://demo.shoutly.com', //
    headless: false,
    ignoreHTTPSErrors: true
  },
  globalSetup: require.resolve('./global-setup')
}
export default config