import { test, expect } from '@playwright/test'

test.describe('Tests for password lost', () => {
	test.beforeEach(async ({ page, baseURL }) => {
		await page.goto(`${baseURL}/auth/login`)
	})
  
	test('should have a forgot your password link', async ({ page }) => {
        await page.locator('app-auth-provider-select .mat-card').nth(2).click()
        await expect(page.locator('app-email .forgot-password-wrapper > a')).toBeVisible()
	})
})