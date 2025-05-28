import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { chromium, Page, Browser, BrowserContext } from "playwright";

let browser: Browser;
let context: BrowserContext;
let page: Page;

const LOGIN_URL = "https://petstore.octoperf.com/actions/Catalog.action";

Given('el usuario está en la página de login', { timeout: 20000 }, async function () {
    browser = await chromium.launch({}); // Mostrar el navegador
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto(LOGIN_URL);
    await page.click('text=Sign In');
});

When('se identifica con credenciales válidas', async function () {
    await page.fill('input[name="username"]', 'jtkm5');
    await page.fill('input[name="password"]', 'HTMharry1996');
    await page.click('input[name="signon"]');
});

Then('debería ver su panel de usuario', async function () {
    await expect(page.locator('text=Welcome Daniel!')).toBeVisible();
    await browser.close();
});

When('se identifica con credenciales inválidas', async function () {
    await page.fill('input[name="username"]', 'usuario_invalido');
    await page.fill('input[name="password"]', 'contraseña_invalida');
    await page.click('input[name="signon"]');
});

Then('debería ser informado que sus credenciales son incorrectas', async function () {
    const errorLocator = page.locator('li', {
        hasText: 'Invalid username or password. Signon failed.',
    });
    await expect(errorLocator).toBeVisible();
    await browser.close();
});