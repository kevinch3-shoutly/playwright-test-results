import { expect, test } from '@playwright/test'

test.describe('Spreadsheet upload', () => {
    test.beforeEach(async ({ baseURL, page }) => {
        /** THIS REQUIRES BACKEND BILLING SETTING: csv_import TO BE 1 */
        const email = 'jonsson.isabella@shoutlymail.com'
		const password = 'Demo123456'

        await page.goto(`${baseURL}/auth/login`)
        
		await page.locator('app-auth-provider-select .mat-card').nth(2).click()
		await page.locator('app-email mat-form-field input').nth(0).type(email)
		await page.locator('app-email mat-form-field input').nth(1).type(password)

		await page.locator('app-email .mat-flat-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-email .mat-flat-button').click()

		await page.waitForURL('**/dashboard')

        const skipUserGuide = await page.locator('.tour-buttons .skip-button').isVisible()

        if (skipUserGuide){
			await page.locator('.tour-buttons .skip-button').click()
		}
    })

    test('should upload a spreadsheet', async ({ page }) => {
        await page.getByTestId('sidebar-menu-item menu-item-upload-collaborations').click()
        await page.waitForURL('**/collaborations/spreadsheet')
        await page.locator('input[type="file"]').setInputFiles('assets/spreadsheet-simple.csv')
        await page.locator('.mat-flat-button.mat-warn').click()
        await page.locator('.mat-flat-button.mat-warn').click()
        await page.waitForURL('**/collaborations')

        await expect(page.locator('.mat-table .mat-cell.mat-column-name span', { hasText: 'X716s8a0' })).toBeTruthy()
        await expect(page.locator('.mat-table .mat-cell.mat-column-state span').first()).toHaveClass('status payout-waiting')
        await expect(page.locator('.mat-table .mat-cell.mat-column-name span', { hasText: '01A8j319sD' })).toBeTruthy()
        await expect(page.locator('.mat-table .mat-cell.mat-column-name span', { hasText: 'ÑoaA81900' })).toBeTruthy()
    })
})