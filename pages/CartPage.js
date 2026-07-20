import { expect } from '@playwright/test';
import Logger from '../utils/Logger.js';

export default class CartPage {

    constructor(page) {

        this.page = page;

        // ===========================================
        // Cart Drawer
        // ===========================================

        this.cartDrawer = page.locator(
            'xpath=//span[text()="Cart"]/ancestor::div[2]'
        );

        // ===========================================
        // Cart Products
        // ===========================================

        this.removeProductButtons = page.getByTitle(
            'remove product from cart'
        );

        this.allCartProducts = page.locator(
            'xpath=//button[@title="remove product from cart"]/parent::div'
        );

        this.cartProductNames = page.locator(
            'xpath=//button[@title="remove product from cart"]/parent::div//p[1]'
        );

        this.cartProductDetails = page.locator(
            'xpath=//button[@title="remove product from cart"]/parent::div//p[2]'
        );

        this.cartProductPrices = page.locator(
            'xpath=//button[@title="remove product from cart"]/parent::div//div/p[1]'
        );

        // ===========================================
        // Quantity Buttons
        // ===========================================

        this.increaseQuantityButtons = page.getByRole('button', {
            name: '+'
        });

        this.decreaseQuantityButtons = page.getByRole('button', {
            name: '-'
        });

        // ===========================================
        // Checkout
        // ===========================================

        this.checkoutButton = page.getByRole('button', {
            name: 'Checkout'
        });

        this.subTotalLabel = page.getByText('SUBTOTAL');

        this.subTotalAmount = page.locator(
            'xpath=//p[text()="SUBTOTAL"]/following::p[1]'
        );

    }

    // ===========================================
    // Cart Validation
    // ===========================================

    async waitForCart() {

        await expect(this.checkoutButton).toBeVisible();

        Logger.title("Cart Loaded Successfully");

    }

    async getCartItemCount() {

        return await this.allCartProducts.count();

    }

    async getCartProductName(index) {

        return (
            await this.cartProductNames
                .nth(index)
                .textContent()
        ).trim();

    }

    async getCartProductPrice(index) {

        const price = await this.cartProductPrices
            .nth(index)
            .textContent();

        return parseFloat(
            price.replace('$', '').trim()
        );

    }

    async getCartProductQuantity(index) {

        const quantityText = await this.cartProductDetails
            .nth(index)
            .textContent();

        const match = quantityText.match(/Quantity:\s*(\d+)/);

        return match ? Number(match[1]) : 0;

    }

    async getSubTotal() {

        const subtotal = await this.subTotalAmount.textContent();

        return parseFloat(
            subtotal.replace('$', '').trim()
        );

    }

    // ===========================================
    // Cart Actions
    // ===========================================

    async removeProduct(index) {

        Logger.info(`Removing Product ${index + 1}`);

        await this.removeProductButtons
            .nth(index)
            .click();

    }

    async increaseQuantity(index) {

        Logger.info(`Increasing Quantity of Product ${index + 1}`);

        await this.increaseQuantityButtons
            .nth(index)
            .click();

    }

    async decreaseQuantity(index) {

        Logger.info(`Decreasing Quantity of Product ${index + 1}`);

        await this.decreaseQuantityButtons
            .nth(index)
            .click();

    }

    // ===========================================
    // Complete Cart Validation
    // ===========================================

    async validateCart(selectedProducts) {

        await this.waitForCart();

        expect(await this.getCartItemCount())
            .toBe(selectedProducts.length);

        let expectedTotal = 0;

        for (let i = 0; i < selectedProducts.length; i++) {

            const actualName = await this.getCartProductName(i);

            const actualPrice = await this.getCartProductPrice(i);

            const actualQuantity = await this.getCartProductQuantity(i);

            Logger.info(
                `${actualName} | $${actualPrice} | Qty : ${actualQuantity}`
            );

            expect(actualName)
                .toBe(selectedProducts[i].name);

            expect(actualPrice)
                .toBe(selectedProducts[i].price);

            expect(actualQuantity)
                .toBe(1);

            expectedTotal += selectedProducts[i].price;

        }

        const actualSubTotal = await this.getSubTotal();

        expect(actualSubTotal)
            .toBeCloseTo(expectedTotal, 2);

        Logger.success("Cart Validation Completed Successfully");

    }

}