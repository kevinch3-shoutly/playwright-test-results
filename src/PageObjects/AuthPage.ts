import { Locator, Page } from '@playwright/test'
import { signupOrgFromEmail } from '../../tests/auth/functions'

export class AuthPage {

	page: Page
	authMethodEmailButton: Locator
	baseURL: string | undefined

	constructor(page: Page, baseURL: string | undefined) {
		this.page = page
		this.baseURL = baseURL
	}

	async signup(org_type: string){
		const page = this.page

		await page.goto(this.baseURL + '/auth/signup')
		await signupOrgFromEmail(page, org_type)
    
	}

	async onboardEmployer(page: Page) {
		const firstName = 'Testie'
		const lastName = 'Employer'

		await page.waitForURL('**/settings/onboard/employer')

		// first step: Personal information
		await page.locator('input[formcontrolname="first_name"]').fill(firstName)
		await page.locator('input[formcontrolname="last_name"]').fill(lastName)

		await page.locator('app-name-form button[type="submit"]').click()  

		await page.locator('.action.right button.mat-warn').click()

		// second step: Company and Billing info
		await page.waitForResponse(response => response.url().includes('data/currencies'))
		await page.locator('mat-select[formcontrolname="currency"]').click()
		await page.locator('#org_currency_SEK').click()

		await page.locator('input[formcontrolname="name"]').fill('Test Company')
    
		await page.locator('input[formcontrolname="email"]').fill('e2etest@shoutlymail.com')
    
		await page.locator('input[formcontrolname="vat_number"]').fill('SE559219259401')

		await page.locator('mat-select[formcontrolname="country"]').click()
		await page.locator('#org_country_SE').click()

		await page.locator('input[formcontrolname="city"]').fill('Stockholm')

		await page.locator('input[formcontrolname="address1"]').fill('123 Test Street')

		await page.locator('#button_select_org_billing_type_2').click()

		await page.locator('.stepper-footer .action.right button').click()
	}

	async onboardAgency(page: Page) {
		const firstName = 'Testie'
		const lastName = 'Agency'
  
		// Go to onboarding for agency page
		await page.waitForURL('**/settings/onboard/agency')
  
		// Fill first_name
		await page.locator('input[formcontrolname="first_name"]').fill(firstName)

		// Fill last_name
		await page.locator('input[formcontrolname="last_name"]').fill(lastName)
  
    
		await page.locator('app-name-form button[type="submit"]').click()  
  
		await page.locator('.action.right button.mat-warn').click()

		// second step: Company and Billing info
		await page.waitForResponse(response => response.url().includes('data/currencies'))
		await page.locator('mat-select[formcontrolname="currency"]').click()
		await page.locator('#org_currency_SEK').click()
  
		await page.locator('input[formcontrolname="name"]').fill('Test Company')
    
		await page.locator('input[formcontrolname="email"]').fill('e2etest@shoutlymail.com')
    
		await page.locator('input[formcontrolname="vat_number"]').fill('SE559219259401')
  
		await page.locator('mat-select[formcontrolname="country"]').click()
		await page.locator('#org_country_SE').click()
  
		await page.locator('input[formcontrolname="city"]').fill('Stockholm')
  
		await page.locator('input[formcontrolname="address1"]').fill('123 Test Street')
  
		await page.locator('#button_select_org_billing_type_2').click()
  
		await page.locator('.stepper-footer .action.right button').click()
  
		// third step: Payment info
		await page.locator('input[formcontrolname="postcode"]').fill('123456')
  
		await page.locator('.mat-expansion-panel.paypal').click()
  
		await page.locator('input[formcontrolname="paypal_email"]').fill('e2etest@shoutlymail.com')
    
		await page.locator('.stepper-footer .action.right button').click()
  
		// fourth step: Position
		await page.locator('input[formcontrolname="position"]').fill('CEO')
  
		await page.locator('.stepper-footer .action.right button').click()
  
		await page.waitForURL('**/dashboard?onboardvideo=true')
	}

}