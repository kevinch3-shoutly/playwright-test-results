import { test, expect } from '@playwright/test'

test.describe('Payouts tests', () => {

    test.beforeEach(async ({ baseURL, page }) => {
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

    test('Timeline should have elements', async({ page, baseURL }) => {
        // Go to billing/payouts/transactions
        await page.goto(`${baseURL}/billing/payouts/transactions`)

        // Should have a table with transactions
        await expect(page.locator('.mat-table')).toBeVisible()

        // Click on expansion arrow
        await page.locator('tr.mat-row').first().locator('app-expansion-arrow-rotate').click()

        // Should have a timeline
        await expect(page.locator('app-timeline-payouts').first()).toBeVisible()

        // Should have at least 2 timeline items
        const timelineItems = page.locator('app-timeline-payouts .timeline-row')
        await expect(await timelineItems.count()).toBeGreaterThan(1)
    })

    test('Should have a page with self invoices', async({ page, baseURL }) => {
        // click on the link that has text "Payouts"
        await page.locator('a:has-text("Payouts")').click()
        
        // click on a .mat-tab-links > a with text "Self invoices"
        await page.locator('.mat-tab-links > a:has-text("Self invoices")').click()

        // expect to be on /billing/payouts/self-invoices
        await expect(page.url()).toBe(`${baseURL}/billing/payouts/self-invoices`)
    })
})