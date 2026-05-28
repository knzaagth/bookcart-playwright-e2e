import { test, expect } from '@playwright/test';

test('Skenario 1: User harus bisa login dengan akun valid', async ({ page }) => {

    // 1. NAVIGATE: Suruh robot buka website tujuan
    await page.goto('https://www.saucedemo.com/');

    // 2. INTERACT: Isi form login
    // Kita cari kolom input yang punya id="user-name", lalu ketik 'standard_user'
    await page.locator('[data-test="username"]').fill('standard_user');

    // Kita cari kolom input yang punya id="password", lalu ketik 'secret_sauce'
    await page.locator('[data-test="password"]').fill('secret_sauce');

    // 3. INTERACT: Klik tombol login
    // Kita cari elemen tombol yang punya id="login-button", lalu klik
    await page.locator('[data-test="login-button"]').click();

    // 4. ASSERTION: Mastiin kalau kita beneran sukses masuk
    // Kita cek apakah setelah diklik, URL browsernya berubah jadi halaman inventory (katalog produk)
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

    // Kita cek juga apakah ada tulisan "Products" di dashboard sebagai bukti halaman sudah ke-load
    const headerTitle = page.locator('.title');
    await expect(headerTitle).toHaveText('Products');
});

test('Skenario 2: User harus mendapatkan eror jika login dengan password salah', async ({ page }) => {

    // 1. NAVIGATE: Buka web
    await page.goto('https://www.saucedemo.com/');

    // 2. INTERACT: Isi form login
    await page.locator('[data-test="username"]').fill('standard_user');

    // SENGJA SALAH: Masukkan password 'salah_sauce' (harusnya 'secret_sauce')
    await page.locator('[data-test="password"]').fill('salah_sauce');

    // 3. INTERACT: Klik login
    await page.locator('[data-test="login-button"]').click();

    // 4. ASSERTION: Validasi pesan eror
    // Kita cari elemen penampung eror dan pastikan dia kelihatan di layar
    const errorContainer = page.locator('[data-test="error"]');
    await expect(errorContainer).toBeVisible();

    // Mastiin isi teks erornya bener, bukan asal eror
    await expect(errorContainer).toHaveText(/Epic sadface: Username and password do not match/);

    // Mastiin kita tetep diam di halaman login, gak pindah URL
    await expect(page).toHaveURL('https://www.saucedemo.com/');
});

test('Skenario 3: User harus bisa memasukkan item ke keranjang', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();

    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    const shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');

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

    // 8. ASSERTION FINAL: Mastiin orderan sukses dikirim
    // Kita cek apakah URL-nya sudah berubah ke halaman checkout-complete
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');

    // Kita pastikan muncul teks "Thank you for your order!" sebagai bukti valid
    const successHeader = page.locator('[data-test="complete-header"]');
    await expect(successHeader).toHaveText('Thank you for your order!');
});