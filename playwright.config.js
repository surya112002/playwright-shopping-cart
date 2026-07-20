// @ts-check

import { defineConfig, devices } from '@playwright/test';
import environments from './config/environments.js';

export default defineConfig({

    // Test Folder
    testDir: './tests',

    // Maximum time for each test
    timeout: 60000,

    // Run tests in parallel
    fullyParallel: true,

    // Retry failed tests
    retries: process.env.CI ? 2 : 1,

    // Reporters
    reporter: [
        ['html'],
        ['list']
    ],

    // Common Settings
    use: {

        // Application URL
        baseURL: environments.qa.url,

        // Run headed locally, headless in GitHub Actions
        headless: process.env.CI ? true : false,

        // Ignore HTTPS errors
        ignoreHTTPSErrors: true,

        // Browser Viewport
        viewport: {
            width: 1920,
            height: 1080
        },

        // Capture Screenshot on Failure
        screenshot: 'only-on-failure',

        // Record Video on Failure
        video: 'retain-on-failure',

        // Save Trace on Retry
        trace: 'on-first-retry',

        // Action Timeout
        actionTimeout: 30000,

        // Navigation Timeout
        navigationTimeout: 30000

    },

    // Browser Projects
    projects: [

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome']
            }
        }

    ]

});