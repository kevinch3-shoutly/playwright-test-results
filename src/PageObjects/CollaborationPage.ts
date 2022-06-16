import { expect, Page } from '@playwright/test'
import GenerateRandomString, { getOrganizationFromAuthState } from '../../tests/helpers'

const DELIVERABLES_SKILLS = ['Ride', 'Sit down', 'Stand up', 'Fight', 'Laugh', 'Read', 'Play', 'Listen']

const DELIVERABLES_ITEMS = ['Engineering report', 'Proposal', 'Design drawings', 'Design documents', 'Completed product (building, bridge, etc)', 'Technical interpretation.', 'Site investigation report.', 'Design review.']

export class CollaborationsPage {

  page: Page
  baseURL: string

  constructor(page: Page, baseURL: string) {
    this.page = page
    this.baseURL = baseURL
  }

  async createCollaborationExpress(titleID = ''){

    const page = this.page
    const baseURL = this.baseURL
    const organization = getOrganizationFromAuthState(baseURL)
    const frequency = 'once'
    
    const randNumber = await new GenerateRandomString().generateRandomNumber()

    await page.locator('[aria-label="Start a New collab"]').click()

    await page.click('text=Express Collaboration')

    // Fill collaboration title
    const randTitle = 'Collaboration express ' + titleID
    await page.locator('[formcontrolname="title"]').fill(randTitle)

    // Open Calendar
    await page.locator('[aria-label="Open calendar"]').first().click()

    // Click first day available of the current month
    await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').first().click()

    // Open calendar
    await page.locator('[aria-label="Open calendar"]').nth(1).click()

    // Click last day available of the next month
    await page.locator('[aria-label="Next month"]').click()
    await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()

    // Click Frequency dropdown
    await page.locator('[formcontrolname="frequency"]').click()

    // Click Frequency dropdown
    await page.locator(`.mat-option-text:has-text("${frequency}")`).click()
    
    // Set formcontrolname="postpaid" value
    await page.locator('[formcontrolname="postpaid"]').fill(randNumber.toString())

    if(frequency === 'once'){
      // click payout day mat-select
      await page.locator('[aria-label="Open calendar"]').nth(2).click()
      // Click last day available of the current month
      await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
    }

    if(frequency !== 'once'){
      // click payout day mat-select
      await page.locator('[formcontrolname="payout_day"]').click()
      // Click text=Last day of the month
      await page.locator('text=Last day of the month').click()
    }

    // Invite to collaboration
    // Fill [placeholder="PARTNER\'S EMAIL OR NAME"]
    await page.locator('[placeholder="PARTNER\\\'S EMAIL OR NAME"]').fill(organization.email)

    // Click first element as result of autocomplete
    await page.locator('app-org-preview-horizontal .partner-item').first().click()


    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click()

    await expect(page.locator('.mat-snack-bar-container.info')).toBeVisible()
  }

  async createCollaborationRegular(){

    const page = this.page
    const baseURL = this.baseURL
    const organization = getOrganizationFromAuthState(baseURL)
    const frequency = 'once'

    const randNumber = await new GenerateRandomString().generateRandomNumber()

    await page.locator('[aria-label="Start a New collab"]').click()

    await page.locator('text=Long-Term Collaboration').click()

    // Fill [placeholder="Marketing campaign for brand"]
    const randTitle = 'Collaboration test ' + await new GenerateRandomString().generateRandomString()
    await page.locator('[formcontrolname="title"]').fill(randTitle)

    // Create and select department
    await page.locator('[formcontrolname="department_id"]').click()
    await page.locator('app-department-input-create .dropdown-block .mat-form-field-infix input').fill('Engineering')
    await page.locator('app-department-input-create .dropdown-block .mat-form-field-suffix .suffix-action').click()
    await page.locator('.mat-select-panel .mat-option').click()

    // Fill reason
    await page.locator('[formcontrolname="reason"]').fill('Collaboration Reason')

    // Fill location
    await page.locator('[formcontrolname="location"]').fill('Atlanta, GA')

    // Fill description
    await page.locator('[formcontrolname="description"]').fill('Collaboration Description')

    // Click next
    await page.locator('button:has-text("Next keyboard_arrow_right")').click()


    // Add skills
    for (const skill of DELIVERABLES_SKILLS ) {
        await page.locator('[aria-label="skill input"]').fill(skill)
        await page.locator('[aria-label="skill add button"]').click()
    }

    // Fill experience_years
    await page.locator('[formcontrolname="experience_years"]').fill('7')

    // Set experience_level as Senior
    await page.locator('[formcontrolname="experience_level"]').click()
    await page.locator('text=Senior').click()

    // Add deliverables
    for (const deliverable of DELIVERABLES_ITEMS ) {
        await page.locator('[aria-label="deliverables input"]').fill(deliverable)
        await page.locator('[aria-label="deliverables add button"]').click()
    }

    // Click next
    await page.locator('button:has-text("Next keyboard_arrow_right")').click()

    // Open Calendar
    await page.locator('[aria-label="Open calendar"]').first().click()

    // Click first day available of the current month
    await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').first().click()

    // Open Calendar
    await page.locator('[aria-label="Open calendar"]').nth(1).click()

    // Click last day available of the current month
    await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()

    // Click text=Deadline is not strict
    await page.locator('text=Deadline is not strict').click()

    // Click next
    await page.locator('button:has-text("Next keyboard_arrow_right")').click()


    // Click Frequency dropdown
    await page.locator('[formcontrolname="frequency"]').click()

    // Click Frequency dropdown
    await page.locator(`.mat-option-text:has-text("${frequency}")`).click()

    // Set formcontrolname="postpaid" value
    await page.locator('[formcontrolname="postpaid"]').fill(randNumber.toString())

    // IF frequency === 'once' set formcontrolname="upfront" value
    // await page.locator('[formcontrolname="upfront"]').fill(randNumber)
    
    if(frequency === 'once'){
      // click payout day mat-select
      await page.locator('[aria-label="Open calendar"]').nth(2).click()
      // Click last day available of the current month
      await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
    }

    if(frequency !== 'once'){
      // click payout day mat-select
      await page.locator('[formcontrolname="payout_day"]').click()
      // Click text=Last day of the month
      await page.locator('text=Last day of the month').click()
    }

    // Click next
    await page.locator('button:has-text("Next keyboard_arrow_right")').click()

    // Invite to collaboration
    // Fill [placeholder="PARTNER\'S EMAIL OR NAME"]
    await page.locator('[placeholder="PARTNER\\\'S EMAIL OR NAME"]').fill(organization.email)

    // Click first element as result of autocomplete
    await page.locator('app-org-preview-horizontal .partner-item').first().click()


    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click()

    await expect(page.locator('.mat-snack-bar-container.info')).toBeVisible()
  }

  async createHourlyCollaboration(titleID = ''){
    const page = this.page
    const baseURL = this.baseURL
    const organization = getOrganizationFromAuthState(baseURL)
    const frequency = 'hourly'
    
    const randNumber = await new GenerateRandomString().generateRandomNumber()

    await page.locator('[aria-label="Start a New collab"]').click()

    await page.click('text=Express Collaboration')

    // Fill collaboration title
    const randTitle = 'Collaboration express hourly ' + titleID
    await page.locator('[formcontrolname="title"]').fill(randTitle)

    // Open Calendar
    await page.locator('[aria-label="Open calendar"]').first().click()

    // Click first day available of the current month
    await page.locator('[aria-label="Previous month"]').click({ clickCount: 3 })
    await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').first().click()

    // Open calendar
    await page.locator('[aria-label="Open calendar"]').nth(1).click()

    // Click last day available of the next month
    await page.locator('[aria-label="Next month"]').click()
    await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()

    // Click Frequency dropdown
    await page.locator('[formcontrolname="frequency"]').click()

    // Click Frequency dropdown
    await page.locator(`.mat-option-text:has-text("${frequency}")`).click()
    
    // Set formcontrolname="postpaid" value
    await page.locator('[formcontrolname="postpaid"]').fill(randNumber.toString())

    if(frequency === 'once'){
      // click payout day mat-select
      await page.locator('[aria-label="Open calendar"]').nth(2).click()
      // Click last day available of the current month
      await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').last().click()
    }

    if(frequency !== 'once'){
      // click payout day mat-select
      await page.locator('[formcontrolname="payout_day"]').click()
      // Click text=Last day of the month
      await page.locator('text=Last day of the month').click()
    }

    // Invite to collaboration
    // Fill [placeholder="PARTNER\'S EMAIL OR NAME"]
    await page.locator('[placeholder="PARTNER\\\'S EMAIL OR NAME"]').fill(organization.email)

    // Click first element as result of autocomplete
    await page.locator('app-org-preview-horizontal .partner-item').first().click()


    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click()

    await expect(page.locator('.mat-snack-bar-container.info')).toBeVisible()
  }
}