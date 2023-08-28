import { faker } from '@faker-js/faker'
import { expect, Page } from '@playwright/test'
import { handleAgreementAcceptance } from '../helpers'
import * as dotenv from 'dotenv'
dotenv.config()

export interface TestUser{
    email?: string,
    password?: string,
    phoneNumber?: string,
    orgType?: string
}

export const TEST_USERS: TestUser[] = [
	{
		email: 'lindberg.nicklas@shoutlymail.com',
		password: process.env.DEMO_USER_PASSWORD,
		orgType: 'gigger'
	},
	{
		email: 'jonsson.isabella@shoutlymail.com',
		password: process.env.DEMO_USER_PASSWORD,
		orgType: 'employer'
	}
]

const phoneNumber = '7123456789'
const otpCode= '123456'

export function generateOrganization() {
	return {
		id: faker.datatype.number(),
		name: faker.name.fullName(),
		city: faker.address.cityName(),
		sync: false,
		email: faker.internet.email(),
		avatar: faker.image.abstract(),
		type: faker.datatype.boolean() ? 'gigger' : 'employer',
		currency: faker.finance.currencyCode(),
		form: faker.datatype.boolean() ? 'Private' : 'Business',
		vat_number: faker.datatype.number({ max: 9999999999 }).toString(),
		address1: faker.address.streetAddress(),
		address2: faker.address.secondaryAddress(),
		postcode: faker.address.zipCode(),
		country: faker.address.countryCode(),
		state: faker.address.state(),
		generated_by: null,
		created_at: faker.date.past(20).toString(),
		updated_at: faker.date.past(1).toString(),
		email_verified_at: faker.datatype.boolean() ? faker.date.past(0).toString() : null,
		agency: null,
		theme_name: null,
		logo: null
	}
}

export function generateOrgPayout () {
	return {
		org_id: faker.datatype.number({ max: 9999999999 }),
		type: faker.helpers.arrayElement(['Bank transfer', 'Swish', 'Paypal']),
		address1: faker.address.streetAddress(),
		city: faker.address.cityName(),
		postcode: faker.address.zipCode(),
		bank_country: faker.address.countryCode(),
		state: null,
		iban: 'SE1407208261966032826253', // faker.finance.iban(),
		account: faker.finance.account(),
		clearing: '2342',
		bic: 'LHVBEE22', // faker.finance.bic({ includeBranchCode: false }),
		uk_sort_code: '231470',
		us_routing_number: '111000025',// faker.finance.routingNumber(),
		bank_code: null,
		institution_number: '062',
		transit_number: '04841',
		account_holder: faker.name.fullName().toUpperCase(),
		transfer_type: faker.helpers.arrayElement(['aba', 'iban', 'canadian', 'turkish_earthport']),
		paypal_email: faker.internet.email(),
		swish_number: faker.phone.number('4791#######'),
		ssn: '199012072667',
		email: faker.internet.email(),
		account_type: faker.helpers.arrayElement(['CHECKING', 'SAVINGS']),
		legal_type: faker.helpers.arrayElement(['PRIVATE', 'BUSINESS']),
	}
}

export async function signupOrgFromEmail(page: Page, orgType: string){
	const randString = faker.random.alphaNumeric(10)
	const email = 'e2etest' + randString + '@shoutlymail.com'
	const password = 'Demo123456..'
  
	// Select org type
	await page.locator(`.org-type-select.${orgType}`).click()
	await page.getByTestId('org-type-confirm').click()

	// Select signup method: email
	await page.locator('.select-auth-method app-auth-provider-select mat-card').nth(2).click()
  
	await page.locator('input[formcontrolname="email"]').fill(email)
	await page.locator('input[formcontrolname="password"]').fill(password)
  
	const elementButtonSubmitEmail = await page.$('app-email button[type="submit"]')
	await elementButtonSubmitEmail?.waitForElementState('enabled')
	await elementButtonSubmitEmail?.click()

	await handleAgreementAcceptance(page)
}

export async function switchOrganizationByFirstOnList(page: Page) {
	// switch organization
	await page.locator('[aria-label="organization switcher"]').isEnabled()
	await page.locator('[aria-label="organization switcher"]').click()
	await page.locator('.org-switcher-expanded .overlay-content').first().click()
	await expect(page.locator('.mat-snack-bar-container.success')).toBeVisible()

	// wait loader to disappear
	await page.waitForSelector('.switcher-button .mat-progress-spinner', { state: 'detached' })

	// wait for page to load
	await page.waitForLoadState('networkidle')

	await page.context().storageState({ path: 'auth-state.json' })
}

export async function switchIntoOrganization(page: Page, orgType = 'Gigger'){

	const switchButton = page.locator('[aria-label="organization switcher"]')
	const currentOrgType = await page.locator('[aria-label="organization switcher"]').locator('.content-description .type').innerText()
	
	// if the org type is same as the needed one, do nothing
	if (await currentOrgType === orgType) {
		return
	}

	// switch organization
	await switchButton.isEnabled()
	await switchButton.click()

	// click on the first organization of the type "orgType"
	await page.locator('.org-switcher-expanded .overlay-content .content-description span.type', { hasText: orgType }).first().click()
	await expect(page.locator('.shoutly-snack-bar').first()).toBeVisible()

	// wait loader to disappear
	await page.waitForSelector('.switcher-button .mat-progress-spinner', { state: 'detached' })

	// wait for page to load
	await page.waitForLoadState('networkidle')
	await page.context().storageState({ path: 'auth-state.json' })

	// expect to be in the dashboard
	await page.waitForURL('**/dashboard')
}

export async function fillUserSettings(page: Page) {
	const firstName = faker.name.firstName()
	const lastName = faker.name.lastName()

	await page.locator('input[formcontrolname="first_name"]').fill(firstName)
	await page.locator('input[formcontrolname="last_name"]').fill(lastName)
}

export async function fillOrgSettings(page: Page, currency = 'EUR', orgType = 'gigger', countryCode = 'SE') {
	const randString = faker.random.alphaNumeric(10)
	const email = 'e2etest' + randString + '@shoutlymail.com'
	
	await page.getByTestId('org_currency').click()
	await page.getByTestId('org_currency_' + currency).click()
	await page.locator('input[formcontrolname="name"]').fill('Test Gigger')
	if(orgType !== 'gigger') await page.getByTestId('org_email').fill(email)
	await page.locator('mat-select[formcontrolname="country"]').click()
	await page.locator('#org_country_' + countryCode).click()
	await page.locator('input[formcontrolname="city"]').fill('Stockholm')
	await page.locator('input[formcontrolname="address1"]').fill('123 Test Street')
	await page.locator('input[formcontrolname="postcode"]').fill('123456')
	await page.locator('input[formcontrolname="vat_number"]').fill('SE559219259401')
}

export async function createAnAgencyFromOtp(browser, request, baseURL, skipUserGuide = true){
		let page: Page

		// eslint-disable-next-line prefer-const
		page = await browser.newPage()
		const orgType = 'agency'

		const response = await request.delete(`${process.env.API_URL}/user/test`)
		expect(response.ok()).toBeTruthy()

		await page.goto(`${baseURL}/auth/signup`)

		// Select org type
		await page.locator(`.org-type-select.${orgType}`).click()
		if(orgType !== 'agency') await page.getByTestId('org-type-confirm').click()

		await page.locator('.select-auth-method app-auth-provider-select mat-card').nth(1).click()
		await page.locator('input[formcontrolname="suffixPhone"]').type(phoneNumber)
		await page.locator('app-otp button[type="submit"].mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-otp button[type="submit"]').click()
		await page.locator('input[formcontrolname="code"]').type(otpCode)
		await page.locator('app-otp button[type="submit"].mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-otp button[type="submit"]').click()

		await handleAgreementAcceptance(page)

		// first step: Personal information
		await fillUserSettings(page)
		await page.getByRole('button', { name: 'Next' }).click()

		// second step: Update Organization
		await fillOrgSettings(page, 'SEK', orgType)
		await page.getByRole('button', { name: 'Next' }).click()
		
		// third step: Payment
		const payout = generateOrgPayout()
		await page.getByTestId('org_payout_method_paypal').click()
		await page.getByTestId('org_payout_paypal_email').fill(payout.paypal_email)
		await page.getByRole('button', { name: 'Next' }).click()

		// fourth step: Billing
		await page.locator('#org_billing_email').fill(payout.email)
		await page.getByRole('button', { name: 'Submit' }).click()
		await page.waitForURL('**/dashboard?onboardvideo=true')

		if (skipUserGuide){
			await page.locator('.tour-buttons .skip-button').click()
			await page.waitForResponse(r => r.url().endsWith('user/guide'))
		}
		
		await page.context().storageState({ path: 'auth-state.json' })
}

export async function loginFromOTP(page, baseURL) {
	await page.goto(`${baseURL}/auth/login`)
	await page.locator('app-auth-provider-select mat-card h3').nth(1).click()
	await page.locator('input[formcontrolname="suffixPhone"]').type(phoneNumber)
	await page.locator('app-otp button[type="submit"].mat-button-disabled').waitFor({ state: 'hidden' })
	await page.locator('app-otp button[type="submit"]').click()
	await page.locator('input[formcontrolname="code"]').type(otpCode)
	await page.locator('app-otp button[type="submit"].mat-button-disabled').waitFor({ state: 'hidden' })
	await page.locator('app-otp button[type="submit"]').click()
	await page.waitForURL('**/dashboard**')
}

export async function rejectCookies(page) {
	await page.locator('app-cookie-consent button').nth(2).click()
}