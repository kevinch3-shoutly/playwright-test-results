import { test, expect } from '@playwright/test'
import { CollaborationsPage } from '../../src/PageObjects/CollaborationPage'
import { switchOrganizationByFirstOnList } from '../auth/functions'
import GenerateRandomString from '../helpers'

test.use({
    storageState: 'auth-state.json'
})

test.describe.serial('Create collaborations', () => {

    test.beforeEach(async ({ page, baseURL }) => {
        await page.goto(`${baseURL}/collaborations`)
    })

    test('Should create an express collaboration', async({ page, baseURL }) => {
        const collaborationsPage = new CollaborationsPage(page, baseURL)      
        await collaborationsPage.createCollaborationExpress()
    })

    test('Should create an express hourly collaboration', async({ page, baseURL }) => {
        const collaborationsPage = new CollaborationsPage(page, baseURL)
        const titleID = await new GenerateRandomString().generateRandomString()  
        await collaborationsPage.createHourlyCollaboration(titleID)
        
        // be an employer
        await switchOrganizationByFirstOnList(page)

        // create collaboration with counterpart
        await collaborationsPage.createCollaborationExpress(titleID)
        
        // be a gigger
        await switchOrganizationByFirstOnList(page)
        
        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        const collabItem = page.locator('.grid-collaboration-item', { hasText: titleID })
        
        // click accept button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("ACCEPT")').click() 
        
        // // Check the checkbox
        // await page.click('.mat-dialog-container .acceptance-section .mat-checkbox')

        // // Assert the checked state
        // expect(await page.isChecked('.mat-dialog-container .acceptance-section input.mat-checkbox-input')).toBeTruthy()

        // confirm accept
        await page.locator('.mat-dialog-container .mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 
       
        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // check if collaboration is accepted
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Ongoing')

    })

    test('Should create a regular collaboration', async({ page, baseURL }) => {
        const collaborationsPage = new CollaborationsPage(page, baseURL)      
        await collaborationsPage.createCollaborationRegular()
    })

    test('Should accept a collaboration', async({ page, baseURL }) => {
        const titleID = await new GenerateRandomString().generateRandomString()
        const collaborationsPage = new CollaborationsPage(page, baseURL)

        // be an employer
        await switchOrganizationByFirstOnList(page)

        // create collaboration with counterpart
        await collaborationsPage.createCollaborationExpress(titleID)
        
        // be a gigger
        await switchOrganizationByFirstOnList(page)
        
        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        const collabItem = page.locator('.grid-collaboration-item', { hasText: titleID })
        
        // click accept button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("ACCEPT")').click() 
        
        // // Check the checkbox
        // await page.click('.mat-dialog-container .acceptance-section .mat-checkbox')

        // // Assert the checked state
        // expect(await page.isChecked('.mat-dialog-container .acceptance-section input.mat-checkbox-input')).toBeTruthy()

        // confirm accept
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 
       
        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // check if collaboration is accepted
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Ongoing')
    })

    test('Should decline a collaboration', async({ page, baseURL }) => {
        const titleID = await new GenerateRandomString().generateRandomString()
        const collaborationsPage = new CollaborationsPage(page, baseURL)

        // be an employer
        await switchOrganizationByFirstOnList(page)

        // create collaboration with counterpart
        await collaborationsPage.createCollaborationExpress(titleID)
        
        // be a gigger
        await switchOrganizationByFirstOnList(page)
        
        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        const collabItem = page.locator('.grid-collaboration-item', { hasText: titleID })
        
        // click Decline button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("DECLINE")').click() 
        
        // confirm accept
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 
       
        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // check if collaboration is declined
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Declined')
    })

    test('Should cancel a collaboration', async({ page, baseURL }) => {
        const titleID = await new GenerateRandomString().generateRandomString()
        const collaborationsPage = new CollaborationsPage(page, baseURL)

        // be an employer
        await switchOrganizationByFirstOnList(page)

        // create collaboration with counterpart
        await collaborationsPage.createCollaborationExpress(titleID)
        
        // be a gigger
        await switchOrganizationByFirstOnList(page)
        
        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        const collabItem = page.locator('.grid-collaboration-item', { hasText: titleID })
        
        // click accept button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("ACCEPT")').click() 
        
        // confirm accept
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 
       
        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // check if collaboration is accepted
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Ongoing')
   
        /** UNTIL HERE ONLY CREATED AND ACCEPTED */

        // Click cancel collaboration
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("CANCEL")').click() 
        
        // confirm action
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 

        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // be an employer
        await switchOrganizationByFirstOnList(page)

        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        // accept cancellation
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("ACCEPT")').click()
        
        // confirm action
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click()

        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // check if collaboration is cancelled
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Cancelled')
    })

    test('Should approve extension in a collaboration', async({ page, baseURL }) => {
        const titleID = await new GenerateRandomString().generateRandomString()
        const collaborationsPage = new CollaborationsPage(page, baseURL)

        // be an employer
        await switchOrganizationByFirstOnList(page)

        // create collaboration with counterpart
        await collaborationsPage.createCollaborationExpress(titleID)
        
        // be a gigger
        await switchOrganizationByFirstOnList(page)
        
        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        const collabItem = page.locator('.grid-collaboration-item', { hasText: titleID })
        
        // click accept button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("ACCEPT")').click() 
        
        // confirm accept
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 
       
        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // check if collaboration is accepted
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Ongoing')
   
        /** UNTIL HERE ONLY CREATED AND ACCEPTED */

        // Click collaboration item header
        await collabItem.locator('.item-header').click()

        // Click extension button
        await page.locator('.mat-button-wrapper:has-text("Extend collaboration")').click()
        
        // Open Calendar
        await page.locator('[aria-label="Open calendar"]').first().click()
        
        // Click last day available of the next month
        await page.locator('[aria-label="Next month"]').click()
        await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()

        // Click EXTEND button
        await page.locator('.mat-dialog-container .mat-button-wrapper:has-text("Extend")').click()
        
        // be an employer
        await switchOrganizationByFirstOnList(page)

        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        // click REVIEW EXTENSION button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("REVIEW EXTENSION")').click() 

        // confirm accept
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 
     
        // check if collaboration is accepted
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Ongoing')

     })

    test('Should reject an extension in a collaboration', async({ page, baseURL }) => {
        const titleID = await new GenerateRandomString().generateRandomString()
        const collaborationsPage = new CollaborationsPage(page, baseURL)

        // be an employer
        await switchOrganizationByFirstOnList(page)

        // create collaboration with counterpart
        await collaborationsPage.createCollaborationExpress(titleID)
        
        // be a gigger
        await switchOrganizationByFirstOnList(page)
        
        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        const collabItem = page.locator('.grid-collaboration-item', { hasText: titleID })
        
        // click accept button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("ACCEPT")').click() 
        
        // confirm accept
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("YES")').click() 
       
        // await Loader to disappear
        await page.waitForResponse(response => response.url().includes('/collabs/'))

        // check if collaboration is accepted
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Ongoing')
   
        /** UNTIL HERE ONLY CREATED AND ACCEPTED */

        // Click collaboration item header
        await collabItem.locator('.item-header').click()

        // Click extension button
        await page.locator('.mat-button-wrapper:has-text("Extend collaboration")').click()
        
        // Open Calendar
        await page.locator('[aria-label="Open calendar"]').first().click()
        
        // Click last day available of the next month
        await page.locator('[aria-label="Next month"]').click()
        await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()

        // Click EXTEND button
        await page.locator('.mat-dialog-container .mat-button-wrapper:has-text("Extend")').click()
        
        // be an employer
        await switchOrganizationByFirstOnList(page)

        // go to collaborations page
        await page.locator('.sidebar-menu .menu-item-collaborations').click()

        // click REVIEW EXTENSION button
        await collabItem.locator('.actions-wrapper .mat-button-wrapper:has-text("REVIEW EXTENSION")').click() 

        // confirm accept
        await page.locator('.mat-dialog-actions .mat-button-wrapper:has-text("NO")').click() 
     
        // check if collaboration is accepted
        await expect(collabItem.locator('.item-info-content .item-wrapper .param').first()).toContainText('Ongoing')

    })
})