import { faker } from '@faker-js/faker'
import { Locator, Page } from '@playwright/test'

async function scrollDownAgreement(page: Page) {
    const agreementContentDialog = await page.locator('.agreement-dialog-content > .agreement-dialog-content-text')
    const agreementContentDialogBox = await agreementContentDialog.boundingBox() || { height: 0 }
    await page.mouse.wheel(0, (agreementContentDialogBox.height + 100))
}


export async function handleAgreementAcceptance(page: Page) {
    await scrollDownAgreement(page)

    // Button should be enabled
    const elementButtonAcceptAgreement = await page.locator('app-agreement-dialog .mat-mdc-dialog-actions button:nth-child(2)')
    await elementButtonAcceptAgreement.click()

    // click accept
    await page.locator('app-agreement-dialog .mat-mdc-dialog-actions button:nth-child(2)').click()

    // wait for page to be loaded
    await page.waitForNavigation({ waitUntil: 'load' })
}

// export function getOrganizationFromAuthState(baseURL) {
//     // get authState
//     const authStateJSON = JSON.parse(fs.readFileSync('auth-state.json').toString())

//     // get origins
//     const origins = authStateJSON.origins

//     // get localstorage
//     const local_storage: { name, value }[] = origins.find(item => item.origin === baseURL).localStorage

//     // get organization
//     let organization = local_storage.find(item => item.name === 'organization')?.value || '{}'

//     return organization = JSON.parse(organization)
// }

// export async function getOrgEmailFromSettings(page: Page): Promise<string> {
//     await page.goto(`${baseURL}/settings?tab=org`)
//     return await page.getByTestId('org_email')
// }

export async function getOrgEmailFromSettings(page: Page, baseURL): Promise<string> {
    await page.goto(`${baseURL}/settings?tab=org`)
    const emailInputLocator: Locator = await page.getByTestId('org_email')
    const email = await emailInputLocator.inputValue()
    return email
}

export function lastDayOfNextMonth(date: Date) {
    const inputDate = new Date(date)
    const lastDayOfNextMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 3, 0)
    const lastDayOfNextMonthString = lastDayOfNextMonth.toISOString().slice(0, 10)
    return lastDayOfNextMonthString
}
export interface csvInput {
    'Name': string
    'Email': string
    'Hours': string
    'Amount': string
    'Cost center': string
    'Currency': string
    'Fee': string
    'Title': string
}

function arrayToCsv(data: object[]): string {
    if (data.length === 0) return ''

    const header = Object.keys(data[0]).join(',') + '\n'
    const rows = data.map(row => Object.values(row).join(',')).join('\n')

    return header + rows
}

export function createCsv(data: csvInput[]) {
    // Convert data to CSV
    const csvData = arrayToCsv(data)

    // Convert the CSV data to a Buffer
    const csvBuffer = Buffer.from(csvData, 'utf-8')

    // Return an object with the expected properties
    return {
        name: 'spreadsheet-simple.csv',
        mimeType: 'text/csv',
        buffer: csvBuffer,
    }
}

export function generateRandomTitles(length: number): string[] {
    const result: string[] = []

    for (let i = 0 ; i < length ; i++) {
        result.push(faker.random.alphaNumeric(12))
    }

    return result
}

export async function trySkipUserGuide(page: Page) {
    try {
        await page.locator('.tour-buttons .skip-button').waitFor({ state: 'visible', timeout: 5000 })
        await page.locator('.tour-buttons .skip-button').click()
    } catch (error) {
        console.log("Skip button did not appear in time, proceeding with the test.")
    }
}


export async function closeCookieConsentBar(page: Page) {
    try {
        const closeButton = page.locator('app-cookie-consent .cookie-banner .buttons-wrapper button[fs-cc="allow"]')
        await closeButton.waitFor({ state: 'visible', timeout: 5000 })
        await page.waitForTimeout(100)
        await closeButton.click()
    } catch (error) {
      console.log("Cookie consent bar did not appear in time, proceeding with the test.")
    }
  }
  