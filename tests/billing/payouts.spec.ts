import { test, expect } from '@playwright/test'

test.describe('Create collaborations', () => {

    test.beforeEach(async ({ baseURL, page }) => {
        /** THIS REQUIRES BACKEND BILLING SETTING: csv_import TO BE 1 */
        const email = 'lindberg.nicklas@shoutlymail.com'
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
    
    test('Last transactions should be on the top', async({ page, baseURL }) => {
        // Go to billing/payouts/transactions
        await page.goto(`${baseURL}/billing/payouts/transactions`)

        // Should have a table with transactions
        await expect(page.locator('.mat-table')).toBeVisible()

        // Should have at least 2 transactions
        const transactionsRow = await page.locator('.mat-table .mat-row.element-row')
        await expect(await transactionsRow.count()).toBeGreaterThan(1)

        // The first transaction row attr called data-testid should be higher that the last one
        const firstTransactionRow = await transactionsRow.first().getAttribute('data-testid') || ''
        const lastTransactionRow = await transactionsRow.last().getAttribute('data-testid') || ''

        await expect(parseInt(firstTransactionRow)).toBeGreaterThan(parseInt(lastTransactionRow))
    })
})