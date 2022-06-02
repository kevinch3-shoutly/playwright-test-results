import { apiUrl } from './../vars';
import { test, expect, Page } from '@playwright/test'
import { createAgencyFromOTP, signupOrgFromEmail } from './functions'
import { AuthPage } from '../../src/PageObjects/AuthPage';

test.describe('Create accounts', async () => {
  test('should create employer', async ({ page, baseURL }) => {
    const org_type = 'employer'
    const authPage = new AuthPage(page, baseURL)

    await page.goto(`${baseURL}/auth/signup`)
    await signupOrgFromEmail(page, 'employer')
    await authPage.onboard(page, org_type)
  })

  test('should create gigger', async ({ page, baseURL }) => {
    const org_type = 'gigger'
    const authPage = new AuthPage(page, baseURL)

    await authPage.signup(org_type)
    await authPage.onboard(page, org_type)
  })
})

test.describe('Login with email', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/auth/login`)
  })
  
  test('should go to dashboard after login when credentials valid', async ({ page }) => {
    await loginWithEmail(page)
  })

  test('should show error notice when password is not valid', async ({ page }) => {
    
    const email = 'irene.axelsson@shoutlymail.com'
    const password = 'WrongPassword123'

    await page.locator('app-auth-provider-select .mat-card h3').nth(2).click()
    await page.locator('app-email mat-form-field input').nth(0).type(email, { delay: 50 })
    await page.locator('app-email mat-form-field input').nth(1).type(password, { delay: 50 })

    const elementButtonSubmitEmail = await page.$('app-email .mat-flat-button')
    await elementButtonSubmitEmail.waitForElementState('enabled')

    await elementButtonSubmitEmail.click()

    await expect(page.locator('app-email .notice.auth-error')).toBeVisible()
  })

  test('should show error message and go to signup when email is unknown', async ({ page }) => {
    const email = 'unknown@shoutlymail.com'
    const password = 'Demo123456'

    await page.locator('app-auth-provider-select .mat-card h3').nth(2).click()
    await page.locator('app-email mat-form-field input').nth(0).type(email, { delay: 50 })
    await page.locator('app-email mat-form-field input').nth(1).type(password, { delay: 50 })
    
    const elementButtonSubmitEmail = await page.$('app-email .mat-flat-button')
    await elementButtonSubmitEmail.waitForElementState('enabled')

    await elementButtonSubmitEmail.click()

    await expect(page.locator('.mat-snack-bar-container.error')).toBeVisible()
    await expect(page.waitForURL(`**\/auth/signup`)).toBeTruthy()
  })
})

test.describe('Login with OTP', () => {

  test.beforeAll(async ({ baseURL }) => {
    await createAgencyFromOTP(baseURL)
  })

  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/auth/login`)
  })

  test('should go to dashboard after login when credentials valid', async ({ page, request }) => {

    const phoneNumber = '7123456789'
    const otp = '123456'

    await page.locator('app-auth-provider-select .mat-card h3').nth(1).click()

    await page.locator('input[formcontrolname="suffixPhone"]').type(phoneNumber, { delay: 50 })

    let elementButtonSubmitPhoneNumber = await page.$('app-otp .mat-flat-button')
    await elementButtonSubmitPhoneNumber.waitForElementState('enabled')
    await elementButtonSubmitPhoneNumber.click()

    await page.locator('input[formcontrolname="code"]').type(otp, { delay: 50 })

    let elementButtonSubmitOTPCode = await page.$('app-otp .mat-flat-button')
    await elementButtonSubmitOTPCode.waitForElementState('enabled')
    await elementButtonSubmitOTPCode.click()
    
    await page.waitForURL(`**\/dashboard`)
  }) 

  test.afterAll(async ({ request }) => {
    const response = await request.delete(`${apiUrl}/user/test`)
    expect(response.ok()).toBeTruthy()
  })
})

export async function loginWithEmail(page: Page){

  const email = 'irene.axelsson@shoutlymail.com'
  const password = 'Demo123456'

  await page.locator('app-auth-provider-select .mat-card').nth(2).click()
  await page.locator('app-email mat-form-field input').nth(0).type(email, { delay: 50 })
  await page.locator('app-email mat-form-field input').nth(1).type(password, { delay: 50 })

  const elementButtonSubmitEmail = await page.$('app-email .mat-flat-button')
  await elementButtonSubmitEmail.waitForElementState('enabled')

  await elementButtonSubmitEmail.click()

  await page.waitForURL(`**\/dashboard`)
}