import { apiUrl } from './../vars'
import { test, expect } from '@playwright/test'
import { createAnAgencyFromOtp, loginFromOTP } from './functions'

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