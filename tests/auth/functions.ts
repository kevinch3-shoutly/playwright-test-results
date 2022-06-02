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

// export async function onboardAgency(page: Page) {
//     const firstName = 'Testie'
//     const lastName = 'Agency'
  
//     // Go to onboarding for agency page
//     await page.waitForURL(`**\/settings/onboard/agency`)
  
//     // Fill first_name
//     await page.locator('input[formcontrolname="first_name"]').fill(firstName)

//     // Fill last_name
//     await page.locator('input[formcontrolname="last_name"]').fill(lastName)
  
    
//     await page.locator('app-name-form button[type="submit"]').click()  
  
//     await page.locator('.action.right button.mat-warn').click()

//     // second step: Company and Billing info
//     await page.waitForResponse(response => response.url().includes('data/currencies'))
//     await page.locator('mat-select[formcontrolname="currency"]').click()
//     await page.locator('#org_currency_SEK').click()
  
//     await page.locator('input[formcontrolname="name"]').fill('Test Company')
    
//     await page.locator('input[formcontrolname="email"]').fill('e2etest@shoutlymail.com')
    
//     await page.locator('input[formcontrolname="vat_number"]').fill('SE559219259401')
  
//     await page.locator('mat-select[formcontrolname="country"]').click()
//     await page.locator('#org_country_SE').click()
  
//     await page.locator('input[formcontrolname="city"]').fill('Stockholm')
  
//     await page.locator('input[formcontrolname="address1"]').fill('123 Test Street')
  
//     await page.locator('#button_select_org_billing_type_2').click()
  
//     await page.locator('.stepper-footer .action.right button').click()
  
//     // third step: Payment info
//     await page.locator('input[formcontrolname="postcode"]').fill('123456')
  
//     await page.locator('.mat-expansion-panel.paypal').click()
  
//     await page.locator('input[formcontrolname="paypal_email"]').fill('e2etest@shoutlymail.com')
    
//     await page.locator('.stepper-footer .action.right button').click()
  
//     // fourth step: Position
//     await page.locator('input[formcontrolname="position"]').fill('CEO')
  
//     await page.locator('.stepper-footer .action.right button').click()
  
//     await page.waitForURL(`**\/dashboard?onboardvideo=true`)
// }

// export async function onboardGigger(page: Page) {
//     const firstName = 'Testie'
//     const lastName = 'gigger'
  
//     await page.waitForURL(`**\/settings/onboard/gigger`)
  
//     // first step: Personal information
    
//     // Fill first_name
//     await page.locator('input[formcontrolname="first_name"]').fill(firstName)

//     // Fill last_name
//     await page.locator('input[formcontrolname="last_name"]').fill(lastName)
  
//     // Click save
//     await page.locator('app-name-form button[type="submit"]').click()  

//     // Click next
//     await page.locator('.action.right button.mat-warn').click()

//     // second step: Update Organization

//     // Select currency
//     await page.waitForResponse(response => response.url().includes('data/currencies'))
//     await page.locator('mat-select[formcontrolname="currency"]').click()
//     await page.locator('#org_currency_SEK').click()
  
//     // Fill name
//     await page.locator('input[formcontrolname="name"]').fill('Test Gigger')

//     // Select country
//     await page.locator('mat-select[formcontrolname="country"]').click()
//     await page.locator('#org_country_SE').click()

//     // Fill city
//     await page.locator('input[formcontrolname="city"]').fill('Stockholm')

//     // Fill address1
//     await page.locator('input[formcontrolname="address1"]').fill('123 Test Street')

//     // Fill postcode
//     await page.locator('input[formcontrolname="postcode"]').fill('123456')

//     // Fill vat_number
//     await page.locator('input[formcontrolname="vat_number"]').fill('SE559219259401')

//     // Select paypal option
//     await page.locator('.mat-expansion-panel.paypal').click()
  
//     // Add paypal.email
//     await page.locator('input[formcontrolname="paypal_email"]').fill('e2etest@shoutlymail.com')
    
//     // Click next
//     await page.locator('.stepper-footer .action.right button').click()


//     // Third step: Position

//     // Fill position
//     await page.locator('input[formcontrolname="position"]').fill('The best gigger')

//     // Click submit
//     await page.locator('.stepper-footer .action.right button').click()
  
//     // Wait for onboarding video
//     await page.waitForURL(`**\/dashboard?onboardvideo=true`)
// }

// export async function onboardEmployer(page: Page) {
//     const firstName = 'Testie'
//     const lastName = 'Employer'
  
//     await page.waitForURL(`**\/settings/onboard/employer`)
  
//     // first step: Personal information
//     await page.locator('input[formcontrolname="first_name"]').fill(firstName)
//     await page.locator('input[formcontrolname="last_name"]').fill(lastName)
  
//     await page.locator('app-name-form button[type="submit"]').click()  
  
//     await page.locator('.action.right button.mat-warn').click()
  
//     // second step: Company and Billing info
//     await page.waitForResponse(response => response.url().includes('data/currencies'))
//     await page.locator('mat-select[formcontrolname="currency"]').click()
//     await page.locator('#org_currency_SEK').click()
  
//     await page.locator('input[formcontrolname="name"]').fill('Test Company')
    
//     await page.locator('input[formcontrolname="email"]').fill('e2etest@shoutlymail.com')
    
//     await page.locator('input[formcontrolname="vat_number"]').fill('SE559219259401')
  
//     await page.locator('mat-select[formcontrolname="country"]').click()
//     await page.locator('#org_country_SE').click()
  
//     await page.locator('input[formcontrolname="city"]').fill('Stockholm')
  
//     await page.locator('input[formcontrolname="address1"]').fill('123 Test Street')
  
//     await page.locator('#button_select_org_billing_type_2').click()
  
//     await page.locator('.stepper-footer .action.right button').click()
// }

export async function switchOrganizationByFirstOnList(page: Page) {
    // switch organization
    await page.locator('[aria-label="organization switcher"]').isEnabled()
    await page.locator('[aria-label="organization switcher"]').click()
    await page.locator('.org-switcher-expanded .overlay-content').first().click()
    await expect(page.locator('.mat-snack-bar-container.success')).toBeVisible()

    // wait for dashboard
    await page.waitForURL(`**\/dashboard`)

    await page.context().storageState({ path: 'auth-state.json' })

}