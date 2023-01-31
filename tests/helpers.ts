import { Page } from '@playwright/test'
import fs from 'fs'

async function scrollDownAgreement(page: Page) {
    const agreementContentDialog = await page.locator('.mat-dialog-container .agreement-dialog-content > .agreement-dialog-content-text')
    const agreementContentDialogBox = await agreementContentDialog.boundingBox() || { height: 0 }
    await page.mouse.wheel(0, (agreementContentDialogBox.height + 100))
  }
  

export async function handleAgreementAcceptance(page: Page) {
    await scrollDownAgreement(page)
  
    // Button should be enabled
    const elementButtonAcceptAgreement = await page.locator('app-agreement-dialog button', { hasText: 'Accept'})
    await elementButtonAcceptAgreement.click()
  
    // click accept
    await page.locator('app-agreement-dialog button:has-text("Accept")').click()  

    // wait for page to be loaded
    await page.waitForNavigation({ waitUntil: 'load' })
}

export function getOrganizationFromAuthState(baseURL){
    // get authState
    const authStateJSON = JSON.parse(fs.readFileSync('auth-state.json').toString())

    // get origins
    const origins = authStateJSON.origins

    // get localstorage
    const local_storage: { name, value }[] = origins.find(item => item.origin === baseURL).localStorage 
    
    // get organization
    let organization = local_storage.find(item => item.name === 'organization')?.value || '{}'

    return organization = JSON.parse(organization)
}

export function lastDayOfNextMonth(date: Date) {
    const inputDate = new Date(date)
    const lastDayOfNextMonth = new Date(inputDate.getFullYear(), inputDate.getMonth() + 3, 0)
    const lastDayOfNextMonthString = lastDayOfNextMonth.toISOString().slice(0, 10)
    return lastDayOfNextMonthString
}