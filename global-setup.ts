// import { chromium, FullConfig } from '@playwright/test'
// import { AuthPage } from './src/PageObjects/AuthPage'

// async function globalSetup(config: FullConfig) {

// 	// let's pick agency as the org type to get both types of organization
// 	const org_type = 'agency'
  
// 	const { baseURL } = config.projects[0].use
// 	const browser = await chromium.launch({ 
// 		headless: false, 
// 		slowMo: 30
// 	})
  
// 	const context = await browser.newContext({ ignoreHTTPSErrors: true })
// 	const page = await context.newPage()
  
// 	const authPage = new AuthPage(page, baseURL || '')

// 	await authPage.signup(org_type)
// 	await authPage.onboard(page, org_type)
  
// 	await authPage.page.context().storageState({ path: 'auth-state.json' })

// 	await browser.close()
// }


// export default globalSetup