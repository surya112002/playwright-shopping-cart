import { expect } from '@playwright/test';

export default class CommonActions {

    static async click(locator) {

        await expect(locator).toBeVisible();
        await locator.click();

    }

    static async fill(locator, value) {

        await expect(locator).toBeVisible();
        await locator.fill(value);

    }

    static async clear(locator) {

        await expect(locator).toBeVisible();
        await locator.clear();

    }

    static async type(locator, value) {

        await expect(locator).toBeVisible();
        await locator.fill(value);

    }

    static async hover(locator) {

        await expect(locator).toBeVisible();
        await locator.hover();

    }

    static async doubleClick(locator) {

        await expect(locator).toBeVisible();
        await locator.dblclick();

    }

    static async rightClick(locator) {

        await expect(locator).toBeVisible();
        await locator.click({ button: 'right' });

    }

    static async scrollIntoView(locator) {

        await locator.scrollIntoViewIfNeeded();

    }

    static async getText(locator) {

        await expect(locator).toBeVisible();

        return (
            await locator.textContent()
        ).trim();

    }

    static async isVisible(locator) {

        return await locator.isVisible();

    }

}