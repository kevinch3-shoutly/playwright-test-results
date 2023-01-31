import { faker } from '@faker-js/faker'
import { expect, Page } from '@playwright/test'
import { getOrganizationFromAuthState } from '../../tests/helpers'

const DELIVERABLES_SKILLS = ['Ride', 'Sit down', 'Stand up', 'Fight', 'Laugh', 'Read', 'Play', 'Listen']

const DELIVERABLES_ITEMS = ['Engineering report', 'Proposal', 'Design drawings', 'Design documents', 'Completed product (building, bridge, etc)', 'Technical interpretation.', 'Site investigation report.', 'Design review.']

export class CollaborationsPage {

  page: Page
  baseURL: string | undefined

  constructor(
    page: Page, 
    baseURL: string | undefined
    ) {
    this.page = page
    this.baseURL = baseURL
  }

  async createExpressCollaboration(titleID = faker.random.alphaNumeric(10), frequency = 'hourly'){
    const page = this.page
    const baseURL = this.baseURL
    const organization = getOrganizationFromAuthState(baseURL)
    
    const randNumber = faker.datatype.number(99999)

    await page.goto(`${baseURL}/collaborations/create-express`)
    await page.waitForURL('**/collaborations/create-express')

    // Fill collaboration title
    const randTitle = 'Collaboration express ' + frequency + ' ' + titleID
    await page.locator('[formcontrolname="title"]').fill(randTitle)

    // Date start: Open Calendar and choose a 
    await page.locator('[aria-label="Open calendar"]').first().click()
    await page.locator('[aria-label="Previous month"]').click({ clickCount: faker.datatype.number({ min: 1, max: 9 }) }) // click 0 to 9 times previous month
    const calendarDayStartDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
    await calendarDayStartDays[faker.datatype.number(calendarDayStartDays.length - 1)].click()

    // Date end: Open Calendar and choose a 
    await page.locator('[aria-label="Open calendar"]').nth(1).click()
    await page.locator('[aria-label="Next month"]').click({ clickCount: faker.datatype.number({ min: 1, max: 9 }) })
    const calendarDayEndDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
    await calendarDayEndDays[faker.datatype.number(calendarDayEndDays.length - 1)].click()

    // Click Frequency dropdown
    await page.locator('[formcontrolname="frequency"]').click()

    // Click Frequency dropdown
    await page.locator(`.mat-option-text:has-text("${frequency}")`).click()
    
    // Set formcontrolname="postpaid" value
    await page.locator('[formcontrolname="postpaid"]').fill(randNumber.toString())

    // Set who pays the fee
    await page.locator('[formcontrolname="currency_fee"]').click()
    await page.locator('.mat-option-text:has-text(\'Consultant\')').click()
    
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
    await page.getByTestId('invite-input-email-or-name').click()
    await page.getByTestId('invite-input-email-or-name').type(organization.email, { delay: 10 })

    // Click first element as result of autocomplete
    await page.locator('app-org-preview-horizontal .partner-item').first().click()


    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")')
    await page.locator('button:has-text("Submit")').click()

    await expect(page.locator('.mat-snack-bar-container.info')).toBeVisible()

    return {
      title: randTitle,
      org_name: organization.name
    }
  }

  async createCollaborationRegular(titleID = '', frequency = 'hourly'){
    const page = this.page
    const baseURL = this.baseURL
    const organization = getOrganizationFromAuthState(baseURL)
    const randNumber = faker.datatype.number(99999)

    await page.goto(`${baseURL}/collaborations/create`)
    await page.waitForURL('**/collaborations/create')

    // Fill collaboration title
    const randTitle = 'Collaboration regular ' + frequency + ' ' + titleID
    await page.locator('[formcontrolname="title"]').fill(randTitle)

    // Create and select department
    // await page.locator('[formcontrolname="department_id"]').click()
    // await page.locator('app-department-input-create .dropdown-block .mat-form-field-infix input').fill('Engineering')
    // await page.locator('app-department-input-create .dropdown-block .mat-form-field-suffix .suffix-action').click()
    // await page.locator('.mat-select-panel .mat-option').click()

    // Fill reason
    await page.locator('[formcontrolname="reason"]').fill('Collaboration Reason')

    // Fill location
    await page.locator('[formcontrolname="location"]').fill('Atlanta, GA')

    // Fill description
    await page.locator('[formcontrolname="description"]').fill('Collaboration Description')

    // Click next
    await page.locator('.stepper-footer .action.right button').click()


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
    await page.locator('.stepper-footer .action.right button').click()

    // Date start: Open Calendar and choose a 
    await page.locator('[aria-label="Open calendar"]').first().click()
    await page.locator('[aria-label="Previous month"]').click({ clickCount: faker.datatype.number({ min: 1, max: 9 }) }) // click 0 to 9 times previous month
    const calendarDayStartDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
    await calendarDayStartDays[faker.datatype.number(calendarDayStartDays.length - 1)].click()

    // Date end: Open Calendar and choose a 
    await page.locator('[aria-label="Open calendar"]').nth(1).click()
    await page.locator('[aria-label="Next month"]').click({ clickCount: faker.datatype.number({ min: 1, max: 9 }) })
    const calendarDayEndDays = await page.locator('button:not(.mat-calendar-body-disabled) > .mat-calendar-body-cell-content').all()
    await calendarDayEndDays[faker.datatype.number(calendarDayEndDays.length - 1)].click()

    // Click text=Deadline is not strict
    await page.locator('text=Deadline is not strict').click()

    // Click next
    await page.locator('.stepper-footer .action.right button').click()


    // Click Frequency dropdown
    await page.locator('[formcontrolname="frequency"]').click()

    // Click Frequency dropdown
    await page.locator(`.mat-option-text:has-text("${frequency}")`).click()

    // Set formcontrolname="postpaid" value
    await page.locator('[formcontrolname="postpaid"]').fill(randNumber.toString())
    
    // Set who pays the fee
    await page.locator('[formcontrolname="currency_fee"]').click()
    await page.locator('.mat-option-text:has-text(\'Consultant\')').click()

        
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
    await page.locator('.stepper-footer .action.right button').click()

    // Invite to collaboration
    await page.getByTestId('invite-input-email-or-name').click()
    await page.getByTestId('invite-input-email-or-name').type(organization.email, { delay: 10 })

    // Click first element as result of autocomplete
    await page.locator('app-org-preview-horizontal .partner-item').first().click()

    // Click button:has-text("Submit")
    await page.locator('button:has-text("Submit")').click()

    await expect(page.locator('.mat-snack-bar-container.info')).toBeVisible()
  }
}