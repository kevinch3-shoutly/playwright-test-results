import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { createAnAgencyFromOtp, loginFromOTP, switchIntoOrganization } from '../auth/functions'
import { closeCookieConsentBar, getOrgEmailFromSettings, trySkipUserGuide } from '../helpers'

test.describe('Dashboard tests', async () => {

    test.beforeAll(async ({ browser, request, baseURL }) => {
        await createAnAgencyFromOtp(browser, request, baseURL)
    })

    test.describe('tests for todo-list', async () => {

        test.beforeAll(async ({ browser, request, baseURL }) => {
            await createAnAgencyFromOtp(browser, request, baseURL)
        })

        test('should not have a task with an collab-ends-soon slug', async ({ page, baseURL }) => {

            const titleID = 'Collab once that ends soon'

            await loginFromOTP(page, baseURL)

            const org_email = await getOrgEmailFromSettings(page, baseURL)

            // Create a collaboration
            await page.goto(`${baseURL}/collaborations/create-express`)
            await page.waitForURL('**/collaborations/create-express')
            await page.locator('[formcontrolname="title"]').fill(titleID)

            const previousMonthButton = page.locator('[aria-label="Previous month"]')
            const nextMonthButton = page.locator('[aria-label="Next month"]')
            // Date start: random date in the past
            await page.locator('[aria-label="Open calendar"]').first().click()
            await previousMonthButton.click({ clickCount: faker.datatype.number({ min: 2, max: 9 }) }) // click 2 to 9 times previous month
            const calendarDayStartDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
            await calendarDayStartDays[faker.datatype.number(calendarDayStartDays.length - 1)].click()

            // Date end: Add 3 days to current day
            await page.locator('[aria-label="Open calendar"]').nth(1).click()

            // Get last day of the current month
            const lastDayOfCurrentMonth = await parseInt(await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().innerText())
            
            // Get the current day of the month
            const todayNumber = new Date().getDate()
            // Store the days of the current month in an array
            let calendarDayEndDays

            // If the current day + 3 is greater than the last day of the current month
            if (todayNumber + 3 > lastDayOfCurrentMonth) {
                // Click the next month button
                await nextMonthButton.click()
                // Get the days of the next month
                calendarDayEndDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
                // Click the last day of the current month
                await calendarDayEndDays[(lastDayOfCurrentMonth - todayNumber) + 1].click()
            } else {
                // Get the days of the current month
                calendarDayEndDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
                // Click the day 3 days from today
                await calendarDayEndDays[(todayNumber + 3)].click()
            }
            // Click Frequency dropdown
            await page.locator('[formcontrolname="frequency"]').click()

            // Click Frequency dropdown
            // Click Frequency dropdown @TODO add FREQUENCY -- It's hardcoded "once"
            await page.locator('mat-option[ng-reflect-value="once"]').click()
    
            // Set formcontrolname="postpaid" value
            await page.locator('[formcontrolname="postpaid"]').fill('200')

            // Set who pays the fee
            await page.locator('[formcontrolname="currency_fee"]').click()
            await page.locator('mat-option[value="paid_by_gigger"]').click()

            // click payout day mat-select
            await page.locator('[aria-label="Open calendar"]').nth(2).click()
            // Click last day available of the current month
            await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
            
            // Invite to collaboration
            await page.getByTestId('invite-input-email-or-name').click()
            await page.getByTestId('invite-input-email-or-name').type(org_email, { delay: 10 })

            // Click first element as result of autocomplete
            await page.locator('app-org-preview-horizontal .partner-item').first().click()

            // Click button:has-text("Submit")
            await page.locator('.stepper-footer .action.right button').click()

            await expect(page.locator('.shoutly-snack-bar.info')).toBeVisible()

            // Switch organization
            await switchIntoOrganization(page, 'Employer')

            // Accept collaboration
            await page.getByTestId('sidebar-menu-item-collaborations').click()
            const desiredRow = page.locator('tr.mat-mdc-row', { hasText: titleID })
            await desiredRow.locator('.mat-column-actions > button.mdc-icon-button').click()
            await page.locator('.actions-wrapper .mdc-button:nth-child(1)').click()
            await page.locator('.mat-mdc-dialog-container .mdc-button:nth-child(2)').click()

            await expect(await page.locator('.item-wrapper .item-info .status.ongoing')).toBeTruthy()
            
            // Switch organization
            await switchIntoOrganization(page, 'Gigger')

            // the locator app-to-do-tasks-table should be visible
            await expect(page.locator('app-to-do-tasks-table')).toBeVisible()

            // the locator app-to-do-tasks-table should not have a table, avoid skeleton
            await expect(page.locator('app-to-do-tasks-table .todo-tasks-table > table')).not.toBeVisible()
        })
    })
})

test.describe('tests using admin gigger', async () => {
    test.beforeEach(async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/auth/login`)
	})
})

test.describe('tests for block last transactions', async () => {

    test.beforeEach(async ({ page, baseURL }) => {
        const email = 'arne41@shoutlymail.com'
        const password = process.env.DEMO_USER_PASSWORD || 'Demo123456'
		await page.goto(`${baseURL}/auth/login`)
        await closeCookieConsentBar(page)
		await page.locator('app-auth-provider-select mat-card').nth(2).click()
		await page.locator('app-email mat-form-field input').nth(0).type(email)
		await page.locator('app-email mat-form-field input').nth(1).type(password)
		await page.locator('app-email .mdc-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-email .mdc-button').click()
		await page.waitForURL('**/dashboard')
	})

    test('should show last transactions', async ({ page }) => {
        await trySkipUserGuide(page)
        // should contain the locator app-transactions-featured
        await expect(page.locator('app-transactions-featured')).toBeVisible()

        // should a table with class .transactions-table
        await expect(page.locator('app-transactions-featured .transactions-table')).toBeVisible()

        // Should have at least 2 transactions
        const transactionsRow = await page.locator('app-transactions-featured .transactions-table tr.element-row')
        await expect(await transactionsRow.count()).toBeGreaterThan(1)

        // The first transaction row attr called data-testid should be higher that the last one
        const firstTransactionRow = await transactionsRow.first().getAttribute('data-testid') || ''
        const lastTransactionRow = await transactionsRow.last().getAttribute('data-testid') || ''

        await expect(parseInt(firstTransactionRow)).toBeGreaterThan(parseInt(lastTransactionRow))

    })
})

test.describe('tests using org with limited access', async () => {
    test.beforeEach(async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/auth/login`)
        await closeCookieConsentBar(page)
	})
    
    test('should not show app-quick-actions-block', async ({ page }) => {
        const email = 'subscriber@shoutlymail.com'
        const password = process.env.DEMO_USER_PASSWORD || 'Demo123456'
        
		await page.locator('app-auth-provider-select mat-card').nth(2).click()
		await page.locator('app-email mat-form-field input').nth(0).type(email)
		await page.locator('app-email mat-form-field input').nth(1).type(password)

		await page.locator('app-email .mdc-button.mat-button-disabled').waitFor({ state: 'hidden' })
		await page.locator('app-email .mdc-button').click()

		await page.waitForURL('**/dashboard')

        await trySkipUserGuide(page)

        await expect(page.locator('app-quick-actions-block')).not.toBeVisible()
    })
})