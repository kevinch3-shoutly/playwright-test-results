import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { createAnAgencyFromOtp, loginFromOTP, switchIntoOrganization } from '../auth/functions'
import { getOrganizationFromAuthState } from '../helpers'

test.describe('Dashboard tests', async () => {


    test('should show and update guide_seen', async ({ browser, request, page, baseURL }) => {
        await createAnAgencyFromOtp(browser, request, baseURL, false)

        await loginFromOTP(page, baseURL)
        await page.locator('.tour-buttons .skip-button').click()
        await expect(page.waitForResponse(response => response.url().includes('user/guide'))).toBeTruthy()
        await page.waitForURL('**/dashboard')
    })

    // test.describe('tests for summary', async () => {})

    test.describe('tests for todo-list', async () => {

        test.beforeAll(async ({ browser, request, baseURL }) => {
            await createAnAgencyFromOtp(browser, request, baseURL, true)
        })

        test('should not have a task with an "collab-ends-soon" slug', async ({ page, baseURL }) => {

            const collabTitle = 'Collab once that ends soon'

            await loginFromOTP(page, baseURL)

            const organization = getOrganizationFromAuthState(baseURL)

            // Create a collaboration
            await page.goto(`${baseURL}/collaborations/create-express`)
            await page.waitForURL('**/collaborations/create-express')
            await page.locator('[formcontrolname="title"]').fill(collabTitle)

            // Date start: random date in the past
            await page.locator('[aria-label="Open calendar"]').first().click()
            await page.locator('[aria-label="Previous month"]').click({ clickCount: faker.datatype.number({ min: 2, max: 9 }) }) // click 2 to 9 times previous month
            const calendarDayStartDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
            await calendarDayStartDays[faker.datatype.number(calendarDayStartDays.length - 1)].click()

            // Date end: Add 3 days to today
            await page.locator('[aria-label="Open calendar"]').nth(1).click()
            const todayNumber = new Date().getDate()
            const calendarDayEndDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
            await calendarDayEndDays[(todayNumber - 1) + 3].click()

            // Click Frequency dropdown
            await page.locator('[formcontrolname="frequency"]').click()

            // Click Frequency dropdown
            await page.locator('.mat-option-text:has-text("once")').click()
    
            // Set formcontrolname="postpaid" value
            await page.locator('[formcontrolname="postpaid"]').fill('200')

            // Set who pays the fee
            await page.locator('[formcontrolname="currency_fee"]').click()
            await page.locator('.mat-option-text:has-text(\'Consultant\')').click()

            // click payout day mat-select
            await page.locator('[aria-label="Open calendar"]').nth(2).click()
            // Click last day available of the current month
            await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
            
            // Invite to collaboration
            await page.getByTestId('invite-input-email-or-name').click()
            await page.getByTestId('invite-input-email-or-name').type(organization.email, { delay: 10 })

            // Click first element as result of autocomplete
            await page.locator('app-org-preview-horizontal .partner-item').first().click()

            // Click button:has-text("Submit")
            await page.locator('button:has-text("Submit")')
            await page.locator('button:has-text("Submit")').click()

            await expect(page.locator('.mat-snack-bar-container.info')).toBeVisible()

            // Switch organization
            await switchIntoOrganization(page, 'Employer')

            // Accept collaboration
            const tableRow = page.locator('tr.mat-row', { hasText: collabTitle })
            await page.getByTestId('sidebar-menu-item-collaborations').click()
            await tableRow.locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
            await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'ACCEPT' }).click()
            await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()

            await page.waitForResponse(response => response.url().includes('accept') && response.status() === 200)

            await expect(await page.locator('.item-wrapper .item-info .status.sent')).toBeTruthy()
            
            // Switch organization
            await switchIntoOrganization(page, 'Gigger')

            // expect to be in the dashboard
            await page.waitForURL('**/dashboard')

            // the locator app-to-do-tasks-table should be visible
            await expect(page.locator('app-to-do-tasks-table')).toBeVisible()

            // the locator app-to-do-tasks-table should not have a table
            await expect(page.locator('app-to-do-tasks-table table')).not.toBeVisible()
        })
    })

    // test.describe('tests for payouts', async () => {})
})