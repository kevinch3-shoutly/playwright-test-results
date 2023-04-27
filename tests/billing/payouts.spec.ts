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
    
    test.skip('Last transactions should be on the top', async({ page, baseURL }) => {
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

    test.skip('Timeline should be ordered', async({ page, baseURL }) => {
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

        // The last item in the bottom should have a ball with a class .is-last
        await expect(await timelineItems.last().locator('.ball.is-last').isVisible()).toBeTruthy()

        // Double click on the last of the timelineItems element with class .occurred_at
        await timelineItems.first().locator('.mat-tooltip-trigger').dblclick()

        // The first item in the bottom should have a ball with a class .is-last
        await expect(await timelineItems.first().locator('.ball.is-last').isVisible()).toBeTruthy()
        // await expect().toBeTruthy()
    })
})