import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { createAnAgencyFromOtp, loginFromOTP, switchIntoOrganization } from '../auth/functions'
import { getOrganizationFromAuthState } from '../helpers'

test.describe('Dashboard tests', async () => {

    test.beforeAll(async ({ browser, request, baseURL }) => {
        await createAnAgencyFromOtp(browser, request, baseURL, false)
    })


    test('should show and update guide_seen', async ({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        await page.locator('.tour-buttons .skip-button').click()
        await page.waitForResponse(response => response.url().endsWith('user/guide'))
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
            const todayNumber = new Date().getDate()
            let calendarDayEndDays

            if (todayNumber + 3 > lastDayOfCurrentMonth) {
                await nextMonthButton.click()
                calendarDayEndDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
                await calendarDayEndDays[(lastDayOfCurrentMonth - todayNumber) + 1].click()
            } else {
                calendarDayEndDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
                await calendarDayEndDays[(todayNumber - 1)].click()
            }

            // Click Frequency dropdown
            await page.locator('[formcontrolname="frequency"]').click()

            // Click Frequency dropdown
            await page.locator('.mat-option-text:has-text("once")').click()
    
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

            // await page.waitForResponse(response => response.url().includes('accept') && response.status() === 200)

            await expect(await page.locator('.item-wrapper .item-info .status.ongoing')).toBeTruthy()
            
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