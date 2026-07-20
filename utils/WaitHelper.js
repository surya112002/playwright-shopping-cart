import { expect } from '@playwright/test';

export default class WaitHelper {

    static async waitForVisible(locator) {

        await expect(locator).toBeVisible();

    }

    static async waitForHidden(locator) {

        await expect(locator).toBeHidden();

    }

    static async waitForEnabled(locator) {

        await expect(locator).toBeEnabled();

    }

    static async waitForDisabled(locator) {

        await expect(locator).toBeDisabled();

    }

    static async waitForText(locator, expectedText) {

        await expect(locator).toHaveText(expectedText);

    }

    static async waitForCount(locator, expectedCount) {

        await expect(locator).toHaveCount(expectedCount);

    }

    static async waitForPageLoad(page) {

        await page.waitForLoadState('networkidle');

    }

}