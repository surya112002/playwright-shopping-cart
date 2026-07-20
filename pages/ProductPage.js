import { expect } from '@playwright/test';
import Logger from '../utils/Logger.js';

export default class ProductPage {

    constructor(page) {

        this.page = page;

        // ==========================
        // Product Section
        // ==========================

        // All Product Cards
        this.allProducts = page
            .getByRole('button', { name: 'Add to cart' })
            .locator('xpath=..');

        // Add To Cart Buttons
        this.addToCartButtons = page.getByRole('button', {
            name: 'Add to cart'
        });

        // Close Cart Button
        this.closeCartButton = page.getByRole('button', {
            name: 'X'
        });

        // ==========================
        // Cart Section
        // ==========================

        // Cart Button
        this.cartButton = page
            .getByTitle('Products in cart quantity')
            .locator('xpath=ancestor::button');

        // Cart Badge
        this.cartBadge = page.getByTitle(
            'Products in cart quantity'
        );

        // Remove Product Buttons
        this.removeProductButtons = page.getByTitle(
            'remove product from cart'
        );

        // All Cart Products
        this.allCartProducts = page.locator(
            'xpath=//button[@title="remove product from cart"]/parent::div'
        );

        // Checkout Button
        this.checkoutButton = page.getByRole('button', {
            name: 'Checkout'
        });

        // Sub Total Label
        this.subTotalLabel = page.getByText('SUBTOTAL');

        // Sub Total Amount
        this.subTotalAmount = page.locator(
            'xpath=//p[text()="SUBTOTAL"]/following::p[1]'
        );

    }

    // ===========================================
    // Application
    // ===========================================

    async openApplication() {

        await this.page.goto('/');

        await expect(this.addToCartButtons.first()).toBeVisible();

        Logger.title("Application Opened Successfully");

    }

    // ===========================================
    // Product Methods
    // ===========================================

    async getProductCount() {

        return await this.allProducts.count();

    }

    async getProductName(index) {

        return (
            await this.allProducts
                .nth(index)
                .locator('p')
                .first()
                .textContent()
        ).trim();

    }

    async getProductPrice(index) {

        const product = this.allProducts.nth(index);

        const whole = await product
            .locator('p b')
            .textContent();

        const decimal = await product
            .locator('p span')
            .textContent();

        return parseFloat(`${whole}${decimal}`);

    }

    async addProductToCart(index) {

        await this.addToCartButtons
            .nth(index)
            .click();

        if (await this.closeCartButton.isVisible()) {

            await this.closeCartButton.click();

        }

    }

    async selectProductsByPrice(targetPrices) {

        const selectedProducts = [];

        const totalProducts = await this.getProductCount();

        Logger.title("Selecting Products");

        Logger.info(`Total Products : ${totalProducts}`);

        for (let i = 0; i < totalProducts; i++) {

            const productName = await this.getProductName(i);

            const productPrice = await this.getProductPrice(i);

            Logger.info(`${productName} - $${productPrice}`);

            if (targetPrices.includes(productPrice)) {

                Logger.success(`Adding : ${productName}`);

                await this.addProductToCart(i);

                selectedProducts.push({

                    name: productName,

                    price: productPrice

                });

            }

        }

        return selectedProducts;

    }

    // ===========================================
    // Cart Methods
    // ===========================================

    async openCart() {

        await this.cartButton.click();

        await expect(this.checkoutButton).toBeVisible();

        Logger.title("Cart Opened Successfully");

    }

    async getCartBadgeCount() {

        return Number(

            (
                await this.cartBadge.textContent()
            ).trim()

        );

    }

}