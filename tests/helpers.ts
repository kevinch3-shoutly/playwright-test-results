import { Page } from "@playwright/test"
const fs = require('fs')

export default class GenerateRandomString { 
    async generateRandomString(length: number = 5): Promise<string> {
        
        var result           = ''
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length

        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength))
        }

        return result
    }

    async generateRandomNumber(): Promise<number> {
        // get random number
        const randNumber = Math.floor(Math.random() * (100 - 1 + 1)) + 1

        return randNumber
    }
}

async function scrollDownAgreement(page: Page) {
    const agreementContentDialog = await page.locator('.mat-dialog-container .agreement-dialog-content > .agreement-dialog-content-text')
    const agreementContentDialogBox = await agreementContentDialog.boundingBox()
      
    await page.mouse.wheel(0, (agreementContentDialogBox.height + 100))
  }
  

export async function handleAgreementAcceptance(page: Page) {
    await scrollDownAgreement(page)
  
    // Button should be enabled
    let elementButtonAcceptAgreement = await page.$('app-agreement-dialog button:has-text("Accept")')
    await elementButtonAcceptAgreement.waitForElementState('enabled')
    await elementButtonAcceptAgreement.click()
  
    // click accept
    await page.locator('app-agreement-dialog button:has-text("Accept")').click()  

    // wait for page to be loaded
    await page.waitForNavigation({ waitUntil: 'load' })
}

export async function getAuthState(page: Page, authType: string) {
    
}

export function getOrganizationFromAuthState(baseURL){
    // get authState
    let authStateJSON = JSON.parse(fs.readFileSync('auth-state.json'))

    // get origins
    let origins = authStateJSON.origins

    // get localstorage
    let local_storage: {name, value}[] = origins.find(item => item.origin === baseURL).localStorage
    
    // get organization
    let organization = local_storage.find(item => item.name === 'organization').value

    return organization = JSON.parse(organization)
}