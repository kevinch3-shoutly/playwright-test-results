import { apiUrl } from './../vars'
import { test, expect } from '@playwright/test'
import { createAnAgencyFromOtp, fillOrgSettings, fillUserSettings, generateOrgPayout, loginFromOTP } from './functions'
import { AuthPage } from '../../src/PageObjects/AuthPage'

test.describe('Create accounts', async () => {

	test.describe('Tests for employer', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			const org_type = 'employer'
			const authPage = new AuthPage(page, baseURL)
  
			await authPage.signup(org_type)
			await page.waitForURL('**/settings/onboard')
		})

		test('should create employer with SEK', async ({ page }) => {
				// first step: Personal information
				await fillUserSettings(page)
				await page.getByRole('button', { name: 'Next' }).click()

				// second step: Update Organization
				await fillOrgSettings(page, 'SEK')
				await page.getByRole('button', { name: 'Next' }).click()

				// fourth step: Billing
				await page.locator('#org_billing_email').fill('test@shoutlymail.com')
				await page.getByRole('button', { name: 'Submit' }).click()
	
				await page.waitForURL('**/dashboard?onboardvideo=true')

				const currentOrgType = await page.locator('[aria-label="organization switcher"]').locator('.content-description .type').innerText()
				expect(currentOrgType).toBe('Employer')
		})
	})

	test.describe('Tests for gigger', () => {
		test.beforeEach(async ({ page, baseURL }) => {
			const org_type = 'gigger'
			const authPage = new AuthPage(page, baseURL)
  
			await authPage.signup(org_type)
			await page.waitForURL('**/settings/onboard')
		})

		test.describe('Tests for Swish', () => {
			test('should create gigger and fail to create payout: swish,ZAR', async ({ page }) => {
				// first step: Personal information
				await fillUserSettings(page)
				await page.getByRole('button', { name: 'Next' }).click()

				// second step: Update Organization
				await fillOrgSettings(page, 'ZAR')
				await page.getByRole('button', { name: 'Next' }).click()
				
				// third step: Payment
				await expect(await page.getByTestId('org_payout_method_swish').isVisible()).toBe(false)
			})
		})

		test.describe('Tests for bank account', () => {

			test.describe('Tests for requirements handling', () => {
				test('should create gigger with payout: bank,SEK,iban,SE', async ({ page }) => {
					// first step: Personal information
					await fillUserSettings(page)
					await page.getByRole('button', { name: 'Next' }).click()
		
					// second step: Update Organization
					await fillOrgSettings(page, 'SEK')
					await page.getByRole('button', { name: 'Next' }).click()
		
					// third step: Bank settings
					const payout = generateOrgPayout()
					const transfer_type = 'iban'
					
					await page.getByTestId('org_payout_method_bank').click()
					await page.getByRole('combobox', { name: 'Bank country' }).locator('span').click()
					await page.locator('#org_payout_bank_country_SE').click()
					await page.getByTestId('isfetching').waitFor({ state: 'detached' })
					await page.getByTestId('org_payout_transfer_type').click()
					await page.locator('#org_payout_transfer_type_' + transfer_type).click()
					await page.getByTestId('org_payout_legal_type').click()
					await page.getByRole('option', { name: 'Person' }).getByText('Person').click()
					await page.getByPlaceholder('Account holder name').fill(payout.account_holder)
					await page.getByTestId('org_payout_iban').fill(payout.iban)
					await page.getByTestId('org_payout_bic').fill(payout.bic)
					await page.getByTestId('org_payout_city').fill(payout.city)
					await page.getByTestId('org_payout_address1').fill(payout.address1)
					await page.getByTestId('org_payout_postcode').fill(payout.postcode)
		
					await page.getByRole('button', { name: 'Submit' }).click()
		
					await page.waitForURL('**/dashboard?onboardvideo=true')
				})
		
				test('should create gigger with payout: bank,EUR,iban,SE', async ({ page }) => {
					// first step: Personal information
					await fillUserSettings(page)
					await page.getByRole('button', { name: 'Next' }).click()
		
					// second step: Update Organization
					await fillOrgSettings(page, 'EUR')
					await page.getByRole('button', { name: 'Next' }).click()
		
					// third step: Bank settings
					const payout = generateOrgPayout()
					const transfer_type = 'iban'
	
					await page.getByTestId('org_payout_method_bank').click()
					await page.getByRole('combobox', { name: 'Bank country' }).locator('span').click()
					await page.locator('#org_payout_bank_country_SE').click()
					await page.getByTestId('isfetching').waitFor({ state: 'detached' })
					await page.getByTestId('org_payout_transfer_type').click()
					await page.locator('#org_payout_transfer_type_' + transfer_type).click()
					await page.getByTestId('org_payout_legal_type').click()
					await page.getByRole('option', { name: 'Person' }).getByText('Person').click()
					await page.getByPlaceholder('Account holder name').fill(payout.account_holder)
					await page.getByTestId('org_payout_iban').fill(payout.iban)
					await page.getByTestId('org_payout_bic').fill(payout.bic)
					await page.getByTestId('org_payout_city').fill(payout.city)
					await page.getByTestId('org_payout_address1').fill(payout.address1)
					await page.getByTestId('org_payout_postcode').fill(payout.postcode)
		
					await page.getByRole('button', { name: 'Submit' }).click()
					await page.waitForURL('**/dashboard?onboardvideo=true')
				})
		
				test('should create gigger with payout: bank,USD,swift_code,SE', async ({ page }) => {
					// first step: Personal information
					await fillUserSettings(page)
					await page.getByRole('button', { name: 'Next' }).click()
		
					// second step: Update Organization
					await fillOrgSettings(page, 'USD')
					await page.getByRole('button', { name: 'Next' }).click()
		
					// third step: Bank settings
					const payout = generateOrgPayout()
					const transfer_type = 'swift_code'
	
					await page.getByTestId('org_payout_method_bank').click()
					await page.getByRole('combobox', { name: 'Bank country' }).locator('span').click()
					await page.locator('#org_payout_bank_country_SE').click()
					await page.getByTestId('isfetching').waitFor({ state: 'detached' })
					await page.getByTestId('org_payout_transfer_type').click()
					await page.locator('#org_payout_transfer_type_' + transfer_type).click()
					await page.getByTestId('org_payout_legal_type').click()
					await page.getByRole('option', { name: 'Person' }).getByText('Person').click()
					await page.getByPlaceholder('Account holder name').fill(payout.account_holder)
					await page.getByTestId('org_payout_account').fill(payout.account)
					await page.getByTestId('org_payout_bic').fill(payout.bic)
					await page.getByTestId('org_payout_city').fill(payout.city)
					await page.getByTestId('org_payout_address1').fill(payout.address1)
					await page.getByTestId('org_payout_postcode').fill(payout.postcode)
			
					await page.getByRole('button', { name: 'Submit' }).click()
		
					await page.waitForURL('**/dashboard?onboardvideo=true')
				})
		
				test('should create gigger with payout: bank,USD,aba,US', async ({ page }) => {
					// first step: Personal information
					await fillUserSettings(page)
					await page.getByRole('button', { name: 'Next' }).click()
		
					// second step: Update Organization
					await fillOrgSettings(page, 'USD')
					await page.getByRole('button', { name: 'Next' }).click()
		
					// third step: Bank settings
					const payout = generateOrgPayout()
					const bank_country = 'US'
					const transfer_type = 'aba'
					const account_type = 'CHECKING'
					const state = 'CA'

					await page.getByTestId('org_payout_method_bank').click()
					await page.getByRole('combobox', { name: 'Bank country' }).locator('span').click()
					await page.locator('#org_payout_bank_country_' + bank_country).click()
					await page.getByTestId('isfetching').waitFor({ state: 'detached' })
					await page.getByTestId('org_payout_transfer_type').click()
					await page.locator('#org_payout_transfer_type_' + transfer_type).click()
					await page.getByTestId('org_payout_legal_type').click()
					await page.getByRole('option', { name: 'Person' }).getByText('Person').click()
					await page.getByPlaceholder('Account holder name').fill(payout.account_holder)
					await page.getByTestId('org_payout_account').fill(payout.account)
					await page.getByTestId('org_payout_us_routing_number').fill(payout.us_routing_number)
					await page.getByTestId('org_payout_account_type').click()
					await page.locator('#org_payout_account_type_' + account_type).click()
					await page.getByTestId('org_payout_state').click()
					await page.locator('#org_payout_state_' + state).click()
					await page.getByTestId('org_payout_city').fill(payout.city)
					await page.getByTestId('org_payout_address1').fill(payout.address1)
					await page.getByTestId('org_payout_postcode').fill(payout.postcode)
		
					await page.getByRole('button', { name: 'Submit' }).click()
		
					await page.waitForURL('**/dashboard?onboardvideo=true')
				})
		
				test('should create gigger with payout: bank,CAD,canadian,CA', async ({ page }) => {
					// first step: Personal information
					await fillUserSettings(page)
					await page.getByRole('button', { name: 'Next' }).click()
		
					// second step: Update Organization
					await fillOrgSettings(page, 'CAD')
					await page.getByRole('button', { name: 'Next' }).click()
		
					// third step: Bank settings
					const payout = generateOrgPayout()
					const bank_country = 'CA'
					const transfer_type = 'canadian'
					const account_type = 'CHECKING'
					const state = 'ON'

					await page.getByTestId('org_payout_method_bank').click()
					await page.getByRole('combobox', { name: 'Bank country' }).locator('span').click()
					await page.locator('#org_payout_bank_country_' + bank_country).click()
					await page.getByTestId('isfetching').waitFor({ state: 'detached' })
					await page.getByTestId('org_payout_transfer_type').click()
					await page.locator('#org_payout_transfer_type_' + transfer_type).click()
					await page.getByTestId('org_payout_legal_type').click()
					await page.getByRole('option', { name: 'Person' }).getByText('Person').click()
					await page.getByPlaceholder('Account holder name').fill(payout.account_holder)
					await page.getByTestId('org_payout_account').fill(payout.account)
					await page.getByTestId('org_payout_account_type').click()
					await page.getByTestId('org_payout_institution_number').fill(payout.institution_number)
					await page.getByTestId('org_payout_transit_number').fill(payout.transit_number)
					await page.locator('#org_payout_account_type_' + account_type).click()
					await page.getByTestId('org_payout_state').click()
					await page.locator('#org_payout_state_' + state).click()
					await page.getByTestId('org_payout_city').fill(payout.city)
					await page.getByTestId('org_payout_address1').fill(payout.address1)
					await page.getByTestId('org_payout_postcode').fill(payout.postcode)
					await page.getByRole('button', { name: 'Submit' }).click()
					await page.waitForURL('**/dashboard?onboardvideo=true')
				})
		
				test('should create gigger with payout: bank,TRY,turkish_earthport,TR', async ({ page }) => {
					// first step: Personal information
					await fillUserSettings(page)
					await page.getByRole('button', { name: 'Next' }).click()
		
					// second step: Update Organization
					await fillOrgSettings(page, 'TRY')
					await page.getByRole('button', { name: 'Next' }).click()
		
					// third step: Bank settings
					const payout = generateOrgPayout()
					const bank_country = 'TR'
					const transfer_type = 'turkish_earthport'
	
					await page.getByTestId('org_payout_method_bank').click()
					await page.getByRole('combobox', { name: 'Bank country' }).locator('span').click()
					await page.locator('#org_payout_bank_country_' + bank_country).click()
					await page.getByTestId('isfetching').waitFor({ state: 'detached' })
					await page.getByTestId('org_payout_transfer_type').click()
					await page.locator('#org_payout_transfer_type_' + transfer_type).click()
					await page.getByTestId('org_payout_legal_type').click()
					await page.getByRole('option', { name: 'Person' }).getByText('Person').click()
					await page.getByPlaceholder('Account holder name').fill(payout.account_holder)
					await page.getByTestId('org_payout_iban').fill(payout.iban)
					await page.getByTestId('org_payout_city').fill(payout.city)
					await page.getByTestId('org_payout_address1').fill(payout.address1)
					await page.getByTestId('org_payout_postcode').fill(payout.postcode)
					await page.getByRole('button', { name: 'Submit' }).click()
					await page.waitForURL('**/dashboard?onboardvideo=true')
				})
			})

			test.describe('other tests', () => {
				test('should patch org address1, city, postcode', async ({ page }) => {
					const country = 'SE'
					
					// first step: Personal information
					await fillUserSettings(page)
					await page.getByRole('button', { name: 'Next' }).click()
		
					// second step: Update Organization
					await fillOrgSettings(page, 'SEK', 'gigger', country)
					await page.getByRole('button', { name: 'Next' }).click()

					// third step: Payment
					const payout = generateOrgPayout()
					const bank_country = country
					const transfer_type = 'iban'

					await page.getByTestId('org_payout_method_bank').click()
					await page.getByRole('combobox', { name: 'Bank country' }).locator('span').click()
					await page.locator('#org_payout_bank_country_' + bank_country).click()
					await page.getByTestId('isfetching').waitFor({ state: 'detached' })
					await page.getByTestId('org_payout_transfer_type').click()
					await page.locator('#org_payout_transfer_type_' + transfer_type).click()
					await page.getByTestId('org_payout_legal_type').click()
					await page.getByRole('option', { name: 'Person' }).getByText('Person').click()
					await page.getByPlaceholder('Account holder name').fill(payout.account_holder)
					await page.getByTestId('org_payout_iban').fill(payout.iban)
					await expect(page.getByTestId('org_payout_city')).toHaveValue('Stockholm')
					await expect(page.getByTestId('org_payout_address1')).toHaveValue('123 Test Street')
					await expect(page.getByTestId('org_payout_postcode')).toHaveValue('123456')
				})
			})
		})

		test.describe('Tests for paypal', () => {
			test('should create gigger with payout: paypal,SEK', async ({ page }) => {
				// first step: Personal information
				await fillUserSettings(page)
				await page.getByRole('button', { name: 'Next' }).click()

				// second step: Update Organization
				await fillOrgSettings(page, 'SEK')
				await page.getByRole('button', { name: 'Next' }).click()
				
				// third step: Payment				
				const payout = generateOrgPayout()
				
				await page.getByTestId('org_payout_method_paypal').click()
				await page.getByTestId('org_payout_paypal_email').fill(payout.paypal_email)

				await page.getByRole('button', { name: 'Submit' }).click()
				await page.waitForURL('**/dashboard?onboardvideo=true')
			})

			test('should create gigger and be able to select payout: paypal,SEK', async ({ page }) => {
				// first step: Personal information
				await fillUserSettings(page)
				await page.getByRole('button', { name: 'Next' }).click()

				// second step: Update Organization
				await fillOrgSettings(page, 'SEK')
				await page.getByRole('button', { name: 'Next' }).click()
				
				// third step: Payment
				await page.getByTestId('org_payout_payment_accordion').waitFor({ state: 'visible' })
				await page.getByTestId('org_payout_method_loading').waitFor({ state: 'detached' })
				await page.getByTestId('org_payout_method_paypal').click()
				await page.getByTestId('org_payout_paypal_email').fill('email@shoutlymail.com')
				await expect(await page.getByTestId('org_payout_method_paypal').isVisible()).toBe(true)
			})

			test('should create gigger and not be able to select payout: paypal,ZAR', async ({ page }) => {
				// first step: Personal information
				await fillUserSettings(page)
				await page.getByRole('button', { name: 'Next' }).click()

				// second step: Update Organization
				await fillOrgSettings(page, 'ZAR')
				await page.getByRole('button', { name: 'Next' }).click()
				
				// third step: Payment
				await page.getByTestId('org_payout_payment_accordion').waitFor({ state: 'visible' })
				await page.getByTestId('org_payout_method_loading').waitFor({ state: 'detached' })
				await expect(await page.getByTestId('org_payout_method_paypal').isVisible()).toBe(false)
				await page.getByTestId('org_payout_currency').click()
				await page.locator('#org_payout_currency_SEK').click()
				await page.getByTestId('org_payout_method_loading').waitFor({ state: 'attached' })
				await page.getByTestId('org_payout_method_loading').waitFor({ state: 'detached' })
				await expect(await page.getByTestId('org_payout_method_paypal').isVisible()).toBe(true)
			})
		})
	})

})

test.describe('Login with email', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/auth/login`)
	})
  
	test('should go to dashboard after login when credentials valid', async ({ page }) => {
		const email = 'irene.axelsson@shoutlymail.com'
		const password = 'Demo123456'

		await page.locator('app-auth-provider-select .mat-card').nth(2).click()
		await page.locator('app-email mat-form-field input').nth(0).type(email)
		await page.locator('app-email mat-form-field input').nth(1).type(password)

		await page.locator('app-email .mat-flat-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-email .mat-flat-button').click()

		await page.waitForURL('**/dashboard')
	})

	test('should show error notice when password is not valid', async ({ page }) => {
    
		const email = 'irene.axelsson@shoutlymail.com'
		const password = 'WrongPassword123'

		await page.locator('app-auth-provider-select .mat-card h3').nth(2).click()
		await page.locator('app-email mat-form-field input').nth(0).type(email)
		await page.locator('app-email mat-form-field input').nth(1).type(password)

		await page.locator('app-email .mat-flat-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-email .mat-flat-button').click()

		await expect(page.locator('app-email .notice.auth-error')).toBeVisible()
	})

	test('should show error message and go to signup when email is unknown', async ({ page }) => {
		const email = 'unknown@shoutlymail.com'
		const password = 'Demo123456'

		await page.locator('app-auth-provider-select .mat-card h3').nth(2).click()
		await page.locator('app-email mat-form-field input').nth(0).type(email)
		await page.locator('app-email mat-form-field input').nth(1).type(password)

		await page.locator('app-email .mat-flat-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-email .mat-flat-button').click()

		await expect(page.locator('.auth-error')).toBeVisible()
	})
})

test.describe('Login with OTP', () => {

	test('should go to dashboard after login when credentials valid', async ({ browser, request, page, baseURL }) => {
		await createAnAgencyFromOtp(browser, request, baseURL)
		await loginFromOTP(page, baseURL)
	}) 

	test('should give an error and show mobile number input', async ({ request, page, baseURL }) => {

		const response = await request.delete(`${apiUrl}/user/test`)
		expect(response.ok()).toBeTruthy()

		await page.goto(`${baseURL}/auth/login`)
		await page.locator('app-auth-provider-select .mat-card h3').nth(1).click()
		await page.locator('input[formcontrolname="suffixPhone"]').type('7123456789')
		await page.locator('app-otp .mat-flat-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-otp .mat-flat-button').click()
		await page.locator('input[formcontrolname="code"]').type('123456')
		await page.locator('app-otp .mat-flat-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-otp .mat-flat-button').click()
		await expect(page.locator('.shoutly-snack-bar.error')).toBeVisible()
	})
})