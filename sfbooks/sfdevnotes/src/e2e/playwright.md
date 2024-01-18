# More with Playwright


<iframe width="900" height="600" src="https://www.youtube.com/embed/RZxMM0O_d7c" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

```ts
import { test, expect } from '@playwright/test';
import fs from 'fs';

const settings = JSON.parse(fs.readFileSync('/Users/mchinnappan/.playwright/sel2/settings.json', 'utf-8'));

test('test', async ({ page }) => {
  await page.goto('https://login.salesforce.com/');
  await page.getByLabel('Username').click();
  await page.getByLabel('Username').fill(settings.username);
  await page.getByLabel('Username').press('Tab');
  await page.getByLabel('Password').click();
  await page.getByLabel('Password').fill(settings.password);
  await page.getByRole('button', { name: 'Log In' }).click();
  await page.getByRole('link', { name: 'Setup' }).click();
  await page.getByRole('link', { name: 'Expand - Customize - Level 1' }).click();
  await page.getByRole('link', { name: 'Expand - Accounts - Level 2' }).click();
  await page.getByRole('link', { name: 'Fields' }).click();
  await page.getByRole('link', { name: 'NumLakes' }).click();
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByLabel('*Field Name').click();
  await page.getByLabel('*Field Name').fill('NumLakes7');
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('row', { name: 'Custom Field Definition Edit Change Field Type Save Cancel', exact: true }).getByRole('button', { name: 'Save' }).click();
});


```

- Github actions 

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 16
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
```

## Recording with Playwright in VSCode

```ts
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://mohan-chinnappan-n5.github.io/xml/sfl-xslt.html');
  await page.getByPlaceholder('Search for XML Type...').click();
  await page.getByPlaceholder('Search for XML Type...').fill('pr');
  await page.getByRole('option', { name: 'profile3' }).click();

  await expect(page.getByRole('button', { name: 'Transform' })).toHaveText('Transform');
});
```


<iframe width="900" height="600" src="https://www.youtube.com/embed/KjoC_KQUUt4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

#### Python version
```py
from playwright.sync_api import Page, expect


def test_example(page: Page) -> None:
    page.goto("https://mohan-chinnappan-n5.github.io/xml/sfl-xslt.html")
    page.get_by_placeholder("Search for XML Type...").click()
    page.get_by_placeholder("Search for XML Type...").fill("p")
    page.get_by_role("option", name="profile3").click()
    expect(page.get_by_role('button', name='Transform' )).to_have_text('Transform')

```