import { faker } from '@faker-js/faker'
import { test, expect } from '@playwright/test'
import { CollaborationsPage } from '../../src/PageObjects/CollaborationPage'
import { createAnAgencyFromOtp, loginFromOTP, switchIntoOrganization } from '../auth/functions'
import { getOrganizationFromAuthState } from '../helpers'

test.describe('Create collaborations', () => {

    test.beforeAll(async ({ browser, request, baseURL }) => {
        await createAnAgencyFromOtp(browser, request, baseURL)
    })

    test('Should have a notification when incomplete collaboration is created', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        // const organization = getOrganizationFromAuthState(baseURL)
        const randNumber = faker.datatype.number(99999)
        await page.goto(`${baseURL}/collaborations/create`)
        await page.waitForURL('**/collaborations/create')
        const randTitle = 'Collaboration that fails to create'
        await page.locator('[formcontrolname="title"]').fill(randTitle)
        await page.locator('[formcontrolname="reason"]').fill('Collaboration Reason')
        await page.locator('[formcontrolname="location"]').fill('Atlanta, GA')
        await page.locator('[formcontrolname="description"]').fill('Collaboration Description')
        await page.locator('.stepper-footer .action.right button').click()
        await page.locator('[formcontrolname="experience_years"]').fill('7')
        await page.locator('[formcontrolname="experience_level"]').click()
        await page.locator('text=Senior').click()
        await page.locator('.stepper-footer .action.right button').click()

        await page.locator('.date-range > .mat-form-field .mdc-icon-button').last().click()
        const availableDaysOfTheMonth = await page.locator('button:not(.mat-calendar-body-disabled) .mat-calendar-body-cell-content')
        const minDayMonth = parseInt(await availableDaysOfTheMonth.first().innerText())
        const maxDayMonth = parseInt(await availableDaysOfTheMonth.last().innerText())
        const randDay = faker.datatype.number({ min: minDayMonth, max: maxDayMonth })
        // get aria-label of the first day that have randDay as text
        await availableDaysOfTheMonth.filter({ hasText: randDay.toString() }).first().click()

        await page.locator('.stepper-footer .action.right button').click()
        await page.locator('[formcontrolname="frequency"]').click()
        await page.locator('.mat-option-text:has-text("once")').click()
        await page.locator('[formcontrolname="postpaid"]').fill(randNumber.toString())
        await page.locator('[formcontrolname="currency_fee"]').click()
        await page.locator('.mat-option-text:has-text(\'Consultant\')').click()
        await page.locator('.stepper-footer .action.right button').click()
        // await page.getByTestId('invite-input-email-or-name').type(organization.email, { delay: 10 })
        // await page.locator('app-org-preview-horizontal .partner-item').first().click()
        await page.locator('button:has-text("Submit")').click()
        await expect(page.locator('.server-errors')).toBeVisible()
    })
    
    test('Should create an express collaboration', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const collaborationsPage = new CollaborationsPage(page, baseURL)
        const titleID = faker.random.alphaNumeric(10)
        await collaborationsPage.createExpressCollaboration(titleID, 'once')
    })

    test('Should create and accept an express hourly collaboration', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const collaborationsPage = new CollaborationsPage(page, baseURL)
        const titleID = faker.random.alphaNumeric(10)

        await switchIntoOrganization(page, 'Gigger')
        await collaborationsPage.createExpressCollaboration(titleID)
        await switchIntoOrganization(page, 'Employer')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: titleID }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'ACCEPT' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(page.locator('.item-wrapper .item-info .status.ongoing')).toBeTruthy()
    })

    test('Should create a regular collaboration', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const collaborationsPage = new CollaborationsPage(page, baseURL)
        const titleID = faker.random.alphaNumeric(10)
        await collaborationsPage.createCollaborationRegular(titleID, 'once')
        await switchIntoOrganization(page, 'Gigger')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: titleID }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'ACCEPT' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(page.locator('.item-wrapper .item-info .status.ongoing')).toBeTruthy()
    })

    test('Should create a regular collaboration and fail', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const organization = getOrganizationFromAuthState(baseURL)
        const frequency = 'once'
        const randNumber = faker.datatype.number(99999)
        await page.goto(`${baseURL}/collaborations/create`)
        await page.waitForURL('**/collaborations/create')
        // SKIP THIS TO TEST FAIL
        // const randTitle = 'Collaboration should not create ' + faker.random.alphaNumeric(10)
        // await page.locator('[formcontrolname="title"]').fill(randTitle)
        await page.locator('[formcontrolname="reason"]').fill('Collaboration Reason')
        await page.locator('[formcontrolname="location"]').fill('Atlanta, GA')
        await page.locator('[formcontrolname="description"]').fill('Collaboration Description')
        await page.locator('.stepper-footer .action.right button').click()
        await page.locator('[formcontrolname="experience_years"]').fill('7')
        await page.locator('[formcontrolname="experience_level"]').click()
        await page.locator('text=Senior').click()
        await page.locator('.stepper-footer .action.right button').click()
        await page.locator('[aria-label="Open calendar"]').first().click()
        await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').first().click()
        await page.locator('[aria-label="Open calendar"]').nth(1).click()
        await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
        await page.locator('text=Deadline is not strict').click()
        await page.locator('.stepper-footer .action.right button').click()
        await page.locator('[formcontrolname="frequency"]').click()
        await page.locator(`.mat-option-text:has-text("${frequency}")`).click()
        await page.locator('[formcontrolname="postpaid"]').fill(randNumber.toString())
        await page.locator('[aria-label="Open calendar"]').nth(2).click()
        await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
        await page.locator('.stepper-footer .action.right button').click()
        await page.getByTestId('invite-input-email-or-name').click()
        await page.getByTestId('invite-input-email-or-name').type(organization.email, { delay: 10 })
        await page.locator('app-org-preview-horizontal .partner-item').first().click()
        await page.locator('button:has-text("Submit")').click()
        await expect(page.locator('.server-errors > div b')).toHaveText('The description.title field is required when title is not present.')
    })

    test('Should decline a collaboration', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const collaborationsPage = new CollaborationsPage(page, baseURL)
        const titleID = faker.random.alphaNumeric(10)

        await switchIntoOrganization(page, 'Gigger')
        await collaborationsPage.createExpressCollaboration(titleID, 'once')
        await switchIntoOrganization(page, 'Employer')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: titleID }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'DECLINE' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(page.locator('.item-wrapper .item-info .status.declined')).toBeTruthy()
    })

    test('Should cancel a collaboration', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const collaborationsPage = new CollaborationsPage(page, baseURL)
        const titleID = faker.random.alphaNumeric(10)

        await switchIntoOrganization(page, 'Employer')
        await collaborationsPage.createExpressCollaboration(titleID)
        await switchIntoOrganization(page, 'Gigger')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: titleID }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'ACCEPT' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(page.locator('.item-wrapper .item-info .status.sent')).toBeTruthy()
        await switchIntoOrganization(page, 'Employer')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: titleID }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'CANCEL' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(page.locator('.item-wrapper .item-info .status.ongoing')).toBeTruthy()
        await switchIntoOrganization(page, 'Gigger')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: titleID }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'ACCEPT' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(page.locator('.item-wrapper .item-info .status.cancelled')).toBeTruthy()
    })

    test('Should approve extension in a collaboration', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const collaborationsPage = new CollaborationsPage(page, baseURL)

        await switchIntoOrganization(page, 'Employer')
        const collabResult = collaborationsPage.createExpressCollaboration()
        await collabResult

        const tableRow = page.locator('tr.mat-row', { hasText: (await collabResult).title })
        const date_end = new Date(await tableRow.locator('.mat-cell.mat-column-date_end').getAttribute('data-testvalue') || '').getTime()
        
        await switchIntoOrganization(page, 'Gigger')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: (await collabResult).title }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'ACCEPT' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(await page.locator('.item-wrapper .item-info .status.sent')).toBeTruthy()

        await switchIntoOrganization(page, 'Employer')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: (await collabResult).title }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.mat-button-wrapper:has-text("Extend collaboration")').click()
        await page.locator('[aria-label="Open calendar"]').first().click()
        await page.locator('[aria-label="Next month"]').click()
        await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
        await page.locator('.mat-datepicker-content').waitFor({ state: 'detached' })
        await page.locator('.mat-dialog-container .mat-button-wrapper:has-text("Extend")').click()

        await switchIntoOrganization(page, 'Gigger')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await page.locator('tr.mat-row', { hasText: (await collabResult).title }).locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'REVIEW EXTENSION' }).click()

        const suggested_date_end = new Date(await page.getByTestId('suggested-date-end').getAttribute('data-testvalue') || '').getTime()
        await expect(suggested_date_end).toBeGreaterThan(date_end)

        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
     })

    test('Should reject an extension in a collaboration', async({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        const collaborationsPage = new CollaborationsPage(page, baseURL)

        await switchIntoOrganization(page, 'Employer')
        const collabResult = collaborationsPage.createExpressCollaboration()
        await collabResult

        const tableRow = page.locator('tr.mat-row', { hasText: (await collabResult).title })
        const date_end = new Date(await tableRow.locator('.mat-cell.mat-column-date_end').getAttribute('data-testvalue') || '').getTime()

        await switchIntoOrganization(page, 'Gigger')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await tableRow.locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'ACCEPT' }).click()
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'YES' }).click()
        await expect(await page.locator('.item-wrapper .item-info .status.sent')).toBeTruthy()

        await switchIntoOrganization(page, 'Employer')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await tableRow.locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.mat-button-wrapper:has-text("Extend collaboration")').click()
        await page.locator('[aria-label="Open calendar"]').first().click()
        await page.locator('[aria-label="Next month"]').click()
        await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
        await page.locator('.mat-datepicker-content').waitFor({ state: 'detached' })
        await page.locator('.mat-dialog-container .mat-button-wrapper:has-text("Extend")').click()

        await switchIntoOrganization(page, 'Gigger')
        await page.getByTestId('sidebar-menu-item-collaborations').click()
        await tableRow.locator('.mat-cell.mat-column-actions > button.mat-icon-button').click()
        await page.locator('.actions-wrapper .mat-button-wrapper', { hasText: 'REVIEW EXTENSION' }).click()

        const suggested_date_end = new Date(await page.getByTestId('suggested-date-end').getAttribute('data-testvalue') || '').getTime()

        await expect(suggested_date_end).toBeGreaterThan(date_end)

        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper', { hasText: 'NO' }).click()
    })
})