import { chromium, expect, Page } from "@playwright/test"
import GenerateRandomString, { handleAgreementAcceptance } from "../helpers"
import { demoUserPassword } from "../vars"

const phoneNumber = '7123456789'
const otpCode = '123456'

export interface TestUser{
    email?: string,
    password?: string,
    phoneNumber?: string,
    orgType?: string
}

export var TEST_USERS: TestUser[] = [
    {
        email: 'e2etestA@shoutlymail.com',
        password: demoUserPassword,
        orgType: 'gigger'
    },
    {
        email: 'e2etestB@shoutlymail.com',
        password: demoUserPassword,
        orgType: 'employer'
    },
    {
        email: 'e2etestC@shoutlymail.com',
        password: demoUserPassword,
        orgType: 'agency'
    }
]

export async function createAgencyFromOTP(baseURL: string) {
    const browser = await chromium.launch({ 
        headless: false, 
        slowMo: 30
    })
      
    const context = await browser.newContext({ ignoreHTTPSErrors: true })
    const page = await context.newPage()

    await page.goto(`${baseURL}/auth/signup`)
    
    await page.locator('.select-user-type app-auth-provider-select .mat-card').nth(2).click()
    await page.locator('.select-auth-method app-auth-provider-select .mat-card').nth(1).click()

    await page.locator('input[formcontrolname="suffixPhone"]').type(phoneNumber, { delay: 50 })

    let elementButtonSubmitPhoneNumber = await page.$('app-otp .mat-flat-button')
    await elementButtonSubmitPhoneNumber.waitForElementState('enabled')
    await elementButtonSubmitPhoneNumber.click()

    await page.locator('input[formcontrolname="code"]').type(otpCode, { delay: 50 })

    let elementButtonSubmitOTPCode = await page.$('app-otp .mat-flat-button')
    await elementButtonSubmitOTPCode.waitForElementState('enabled')
    await elementButtonSubmitOTPCode.click()

    await handleAgreementAcceptance(page)

    await page.waitForURL(`**\/settings/onboard/agency`)
}

export async function createAgencyFromEmail(page: Page){
    
    const generateRandomString = new GenerateRandomString()
    const randString = await generateRandomString.generateRandomString(5)
    const email = 'e2etest' + randString + '@shoutlymail.com'
    const password = demoUserPassword
  
    await page.locator('.select-user-type app-auth-provider-select .mat-card').nth(2).click()
    await page.locator('.select-auth-method app-auth-provider-select .mat-card').nth(2).click()
  
    await page.locator('input[formcontrolname="email"]').fill(email)
    await page.locator('input[formcontrolname="password"]').fill(password)
  
    let elementButtonSubmitEmail = await page.$('app-email .mat-flat-button')
    await elementButtonSubmitEmail.waitForElementState('enabled')
    await elementButtonSubmitEmail.click()
  
    await handleAgreementAcceptance(page)
}

export async function signupOrgFromEmail(page: Page, orgType: string){

    const generateRandomString = new GenerateRandomString()
    const randString = await generateRandomString.generateRandomString(5)
    const email = 'e2etest' + randString + '@shoutlymail.com'
    const password = demoUserPassword
  
    await page.locator(`.provider-select.${orgType}`).click()
    await page.locator('.select-auth-method app-auth-provider-select .mat-card').nth(2).click()
  
    await page.locator('input[formcontrolname="email"]').fill(email)
    await page.locator('input[formcontrolname="password"]').fill(password)
  
    let elementButtonSubmitEmail = await page.$('app-email .mat-flat-button')
    await elementButtonSubmitEmail.waitForElementState('enabled')
    await elementButtonSubmitEmail.click()

    await handleAgreementAcceptance(page)
}


export async function createGiggerFromEmail(page: Page){
    const email = TEST_USERS.filter(user => user.orgType === 'gigger')[0].email
    const password = demoUserPassword
  
    await page.locator('text=Consultant').click()
    await page.locator('.select-auth-method app-auth-provider-select .mat-card').nth(2).click()
  
    await page.locator('input[formcontrolname="email"]').fill(email)
    await page.locator('input[formcontrolname="password"]').fill(password)
  
    let elementButtonSubmitEmail = await page.$('app-email .mat-flat-button')
    await elementButtonSubmitEmail.waitForElementState('enabled')
    await elementButtonSubmitEmail.click()
  
    await handleAgreementAcceptance(page)
}

export async function switchOrganizationByFirstOnList(page: Page) {
    // switch organization
    await page.locator('[aria-label="organization switcher"]').isEnabled()
    await page.locator('[aria-label="organization switcher"]').click()
    await page.locator('.org-switcher-expanded .overlay-content').first().click()
    await expect(page.locator('.mat-snack-bar-container.success')).toBeVisible()

    // wait for dashboard
    await page.waitForURL(/dashboard/)

    await page.context().storageState({ path: 'auth-state.json' })

}