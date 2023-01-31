import { expect, test } from '@playwright/test'
import { createAnAgencyFromOtp, loginFromOTP } from '../auth/functions'

test.describe('Dashboard tests', async () => {

    test.beforeEach(async ({ baseURL, request, browser }) => {
        await createAnAgencyFromOtp(browser, request, baseURL, false)
    })

    test('should show and update guide_seen', async ({ page, baseURL }) => {
        await loginFromOTP(page, baseURL)
        await page.locator('.tour-buttons .skip-button').click()
        await expect(page.waitForResponse(response => response.url().includes('user/guide'))).toBeTruthy()
        await page.waitForURL('**/dashboard')
    })

    // test.describe('tests for summary', async () => {})

    // test.describe('tests for todo-list', async () => {})

    // test.describe('tests for payouts', async () => {})
})