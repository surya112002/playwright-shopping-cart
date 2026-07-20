import { test, expect } from '@playwright/test';
import ProductPage from '../pages/ProductPage.js';
import CartPage from '../pages/CartPage.js';
import testData from '../testdata/products.json' assert { type: 'json' };

test.describe('Task 1 - Shopping Cart Validation', () => {

    test('Validate products added to cart', async ({ page }) => {

        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        // ===========================================
        // Open Application
        // ===========================================

        await productPage.openApplication();

        console.log("====================================");
        //console.log("Application Opened Successfully");
        console.log("====================================");

        // ===========================================
        // Read Products
        // ===========================================

        const productCount =
            await productPage.allProducts.count();

        console.log(`Total Products : ${productCount}`);

        const selectedProducts = [];

        // ===========================================
        // Select Products
        // ===========================================

        for (let i = 0; i < productCount; i++) {

            const product =
                productPage.allProducts.nth(i);

            const productName = (
    await product
        .locator('p')
        .first()
        .textContent()
).trim();
            const wholePrice = await product
    .locator('p b')
    .first()
    .textContent();

           const decimalPrice = await product
    .locator('p span')
    .first()
    .textContent();

            const productPrice =
                parseFloat(`${wholePrice}${decimalPrice}`);

            console.log(
                `${productName} - $${productPrice}`
            );

            if (
                testData.targetPrices.includes(productPrice)
            ) {

                console.log(
                    `Adding : ${productName}`
                );

                await productPage
                    .addToCartButtons
                    .nth(i)
                    .click();

                selectedProducts.push({

                    name: productName,

                    price: productPrice

                });

                if (
                    await productPage
                        .closeCartButton
                        .isVisible()
                ) {

                    await productPage
                        .closeCartButton
                        .click();

                }

            }

        }

        console.log("====================================");
        console.log("Selected Products");
        console.log("====================================");

        selectedProducts.forEach(product => {

            console.log(
                `${product.name} - $${product.price}`
            );

        });

        // ===========================================
        // Open Cart
        // ===========================================

        await productPage.cartButton.click();

        console.log("====================================");
        console.log("Validating Cart");
        console.log("====================================");
                // ===========================================
        // Validate Cart Items
        // ===========================================

        await expect(cartPage.allCartProducts)
            .toHaveCount(selectedProducts.length);

        let expectedTotal = 0;

        for (let i = 0; i < selectedProducts.length; i++) {

            const expected = selectedProducts[i];

            const cartProduct =
                cartPage.allCartProducts.nth(i);
const actualName = (
    await cartProduct
        .locator('p')
        .first()
        .textContent()
).trim();

            const quantityText = (
    await cartProduct
        .locator('p')
        .nth(1)
        .textContent()
).trim();
const actualPriceText = (
    await cartProduct
        .locator('p')
        .nth(2)
        .textContent()
).trim();

const actualPrice = parseFloat(
    actualPriceText.replace('$', '').trim()
);
                

            console.log("------------------------------------");
            console.log(`Expected Name : ${expected.name}`);
            console.log(`Actual Name   : ${actualName}`);

            console.log(`Expected Price : ${expected.price}`);
            console.log(`Actual Price   : ${actualPrice}`);

            console.log(`Quantity : ${quantityText}`);

            expect(actualName)
                .toBe(expected.name);

            expect(actualPrice)
                .toBe(expected.price);

            expect(quantityText)
                .toContain("Quantity: 1");

            expectedTotal += expected.price;

        }

        console.log("====================================");
        console.log("Cart Items Validated Successfully");
        console.log("====================================");
                // ===========================================
        // Validate Cart Badge
        // ===========================================

       const cartBadgeCount = Number(
    (
        await page
            .locator('xpath=//span[text()="Cart"]/preceding-sibling::div/div')
            .textContent()
    ).trim()
);

        console.log("====================================");
        console.log("Validating Cart Badge");
        console.log("====================================");

        console.log(
            `Expected Cart Count : ${selectedProducts.length}`
        );

        console.log(
            `Actual Cart Count   : ${cartBadgeCount}`
        );

        expect(cartBadgeCount)
            .toBe(selectedProducts.length);

        // ===========================================
        // Validate Sub Total
        // ===========================================

        const actualSubtotal = parseFloat(
            (
                await productPage
                    .subTotalAmount
                    .textContent()
            )
                .replace('$', '')
                .trim()
        );

        console.log("====================================");
        console.log("Validating Sub Total");
        console.log("====================================");

        console.log(
            `Expected Total : ${expectedTotal.toFixed(2)}`
        );

        console.log(
            `Actual Total   : ${actualSubtotal.toFixed(2)}`
        );

        expect(actualSubtotal)
            .toBeCloseTo(expectedTotal, 2);

        console.log("====================================");
        console.log("TASK 1 PASSED SUCCESSFULLY");
        console.log("====================================");

    });

});