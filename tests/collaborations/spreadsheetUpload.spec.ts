import { expect, test } from '@playwright/test'
import { closeCookieConsentBar, createCsv, csvInput, generateRandomTitles, trySkipUserGuide } from '../helpers'

test.beforeEach(async ({ baseURL, page }) => {
    /** THIS REQUIRES BACKEND BILLING SETTING: csv_import TO BE 1 */
    const email = 'jonsson.isabella@shoutlymail.com'
    const password = 'Demo123456'

    await page.goto(`${baseURL}/auth/login`)
    await closeCookieConsentBar(page)
    
    await page.locator('app-auth-provider-select mat-card').nth(2).click()
    await page.locator('app-email mat-form-field input').nth(0).type(email)
    await page.locator('app-email mat-form-field input').nth(1).type(password)

    await page.locator('app-email .mdc-button.mat-button-disabled').waitFor({ state: 'hidden' })
    await page.locator('app-email .mdc-button').click()

    await page.waitForURL('**/dashboard')

    await trySkipUserGuide(page)
})

test.describe('Spreadsheet upload', () => {
    
    test('should upload a spreadsheet', async ({ page }) => {
        const randomTitles = generateRandomTitles(3)

        const data: csvInput[] = [
            {
            'Name': 'John Doe',
            'Email': 'test1@shoutlymail.com',
            'Hours': '',
            'Amount': '1950.00',
            'Currency': 'EUR',
            'Cost center': 'HR (6555)',
            'Fee': 'paid_by_employer',
            'Title': randomTitles[0],
            },
            {
            'Name': 'Sam Smith',
            'Email': 'test2@shoutlymail.com',
            'Hours': '168.00',
            'Amount': '30.00',
            'Currency': 'EUR',
            'Cost center': 'HR (6555)',
            'Fee': 'paid_by_gigger',
            'Title': randomTitles[1],
            },
            {
            'Name': 'Mary Stark',
            'Email': 'test3@shoutlymail.com',
            'Hours': '160.00',
            'Amount': '20.00',
            'Currency': 'EUR',
            'Cost center': 'MGMT (2002)',
            'Fee': 'paid_together',
            'Title': randomTitles[2],
            },
        ]
        
        await page.getByTestId('sidebar-menu-item menu-item-upload-collaborations').click()
        await page.waitForURL('**/collaborations/spreadsheet')
        await page.locator('input[type="file"]').setInputFiles(createCsv(data))
        await page.locator('.action.right .mdc-button.mat-warn').click()
        await page.locator('.action.right .mdc-button.mat-warn').click()
        await page.waitForURL('**/collaborations')

        await expect(page.locator('.mat-table .mat-cell.mat-column-name span', { hasText: randomTitles[0] })).toBeTruthy()
        await expect(page.locator('.mat-table .mat-cell.mat-column-name span', { hasText: randomTitles[1] })).toBeTruthy()
        await expect(page.locator('.mat-table .mat-cell.mat-column-name span', { hasText: randomTitles[2] })).toBeTruthy()
    })
})