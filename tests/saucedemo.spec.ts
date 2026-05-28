import { test, expect } from '@playwright/test';

test('Skenario 1: User harus bisa login dengan akun valid', async ({ page }) => {

    // 1. NAVIGATE
    await page.goto('https://www.saucedemo.com/');

    // 2. INTERACT: Isi form login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. ASSERTION: Memastikan user sukses masuk ke dashboard
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    const headerTitle = page.locator('.title');
    await expect(headerTitle).toHaveText('Products');
});

test('Skenario 2: User harus mendapatkan eror jika login dengan password salah', async ({ page }) => {

    // 1. NAVIGATE
    await page.goto('https://www.saucedemo.com/');

    // 2. INTERACT: Isi form login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('salah_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 3. ASSERTION: Validasi pesan eror
    const errorContainer = page.locator('[data-test="error"]');
    await expect(errorContainer).toBeVisible();

    // Memastikan pesan error sesuai
    await expect(errorContainer).toHaveText(/Epic sadface: Username and password do not match/);
    await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('Skenario 3: User harus bisa memasukkan item ke keranjang', async ({ page }) => {
    // 1. NAVIGATE & LOGIN
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    // 2. INTERACT: Tambah item ke keranjang
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    // 3. ASSERTION: Validasi item berhasil masuk ke keranjang
    const shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    // Memastikan ikon keranjang belanja muncul tanda ada item di dalamnya
    await expect(shoppingCartBadge).toBeVisible();
    await expect(shoppingCartBadge).toHaveText('1');
});

test('Skenario 4: User harus bisa menyelesaikan proses checkout belanja sampai selesa', async ({ page }) => {
    // 1. NAVIGATE & LOGIN
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    // 2. INTERACT: Tambah item ke keranjang
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    // 3. INTERACT: Klik ikon keranjang belanja di kanan atas untuk masuk ke halaman Cart
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

    // 4. INTERACT: Klik tombol Checkout
    await page.locator('[data-test="checkout"]').click();

    // 5. INTERACT: Isi form informasi pengiriman barang
    await page.locator('[data-test="firstName"]').fill('Kenza');
    await page.locator('[data-test="lastName"]').fill('Agatha');
    await page.locator('[data-test="postalCode"]').fill('16710');

    // 6. INTERACT: Klik tombol Continue untuk lanjut ke halaman review barang
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // 7. INTERACT: Klik tombol Finish buat bayar/menyelesaikan orderan
    await page.locator('[data-test="finish"]').click();

    // 8. ASSERTION FINAL: Memastikan orderan sukses dikirim
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

    // Akan muncul teks "Thank you for your order!" sebagai bukti valid
    const successHeader = page.locator('[data-test="complete-header"]');
    await expect(successHeader).toHaveText('Thank you for your order!');
});