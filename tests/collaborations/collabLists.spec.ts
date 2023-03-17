import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { CollaborationsPage } from '../../src/PageObjects/CollaborationPage'
import { createAnAgencyFromOtp, loginFromOTP, switchIntoOrganization } from '../auth/functions'

test.describe('Collaboration listing assertions', () => {
    
    test.beforeAll(async ({ browser, request, baseURL }) => {
        await createAnAgencyFromOtp(browser, request, baseURL)
    })
    
    test('Should have reportable notice on the top of the list', async({ page, baseURL }) => {
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
        
        // go to page /collaborations
        await page.getByTestId('sidebar-menu-item-collaborations').click()

        // as Employer, an element with class .top-list-message.warn should be present
        expect(await page.locator('.top-list-message.warn').innerText()).toContain('There are reports to be filled in before the gigger can receive the payout.')

        // switch into Gigger
        await switchIntoOrganization(page, 'Gigger')

        await page.getByTestId('sidebar-menu-item-dashboard').click()
        await page.getByTestId('sidebar-menu-item-collaborations').click()

        // as Employer, an element with class .top-list-message.warn should be present
        expect(await page.locator('.top-list-message.warn').innerText()).toContain('You need to fill in monthly reports to receive the payouts')
    })
})