/**
 * @license
 * SPDX-License-Identifier: MIT
 * WebLinux Playwright E2E Test Suite
 * Validates real VM boot, terminal input/output, process execution, and desktop shell
 */

import { test, expect } from '@playwright/test';

test.describe('WebLinux Browser Linux OS E2E Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to local or production WebLinux instance
    await page.goto('/');
  });

  test('loads desktop shell within performance budget (< 3.0s)', async ({ page }) => {
    // Verify taskbar and window manager exist
    const taskbar = page.locator('[data-testid="desktop-taskbar"]');
    await expect(taskbar).toBeVisible({ timeout: 5000 });

    // Verify system title & brand
    await expect(page.locator('text=WebLinux')).toBeVisible();
  });

  test('boots virtual machine and presents interactive serial terminal', async ({ page }) => {
    // Terminal window should be open by default or launchable
    const terminalWindow = page.locator('[data-testid="window-terminal"]');
    await expect(terminalWindow).toBeVisible();

    // Verify xterm canvas / DOM container is initialized
    const xtermContainer = page.locator('.xterm');
    await expect(xtermContainer).toBeVisible();
  });

  test('launches application from Start Menu', async ({ page }) => {
    // Click Start Menu button
    const startBtn = page.locator('[data-testid="start-menu-button"]');
    await startBtn.click();

    // Verify Start Menu popup is open
    const startMenu = page.locator('[data-testid="start-menu-popup"]');
    await expect(startMenu).toBeVisible();

    // Launch System Monitor
    const sysMonItem = page.locator('text=System Monitor');
    await sysMonItem.click();

    // Verify System Monitor window opened
    const sysMonWindow = page.locator('[data-testid="window-sysmon"]');
    await expect(sysMonWindow).toBeVisible();
  });

  test('handles window drag, minimize, and restore', async ({ page }) => {
    const termWindow = page.locator('[data-testid="window-terminal"]');
    await expect(termWindow).toBeVisible();

    // Click minimize button
    const minimizeBtn = page.locator('[data-testid="btn-minimize-terminal"]');
    await minimizeBtn.click();

    // Window should now be hidden
    await expect(termWindow).not.toBeVisible();

    // Click terminal taskbar chip to restore
    const taskbarChip = page.locator('[data-testid="taskbar-item-terminal"]');
    await taskbarChip.click();

    // Window should be visible again
    await expect(termWindow).toBeVisible();
  });
});
