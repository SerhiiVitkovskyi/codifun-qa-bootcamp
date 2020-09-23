import expect from 'expect';
import playwright from 'playwright';

jest.setTimeout(120000);

const { chromium } = require('playwright'); 

const str_to_search = "2c0f70082e53e92fe96fe79eaea7ba6901b357356d1f32090bc1b27c4f1cdd94"; // Bitcoin transaction
const foo_to_search = "4352134kjfdg34"; // Something dummy

let browser;
const url1 = 'https://bitaps.com';
const url2 = 'https://bitaps.com/address';

afterAll( async () => {
    await browser.close();
});

describe('Bitaps.com Tests',()=>{
    test('Test # 1 - Search Function - Positive RESULT', async () => {
        browser = await chromium.launch({headless:false, slowMo: 500});
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url1);
        await page.fill('#search-box', str_to_search);
        await page.press('#search-box', 'Enter');
        await page.waitForTimeout(2000);
        await page.goForward();
        const title_str = await page.title();
        expect(title_str).toEqual('Bitcoin transaction ' + str_to_search);
    });

    test('Test # 2 - Search Function - Negative RESULT', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url1);
        await page.fill('#search-box', foo_to_search);
        await page.press('#search-box', 'Enter');
        await page.waitForTimeout(2000);
        await page.goForward();
        const title_str = await page.title();
        expect(title_str).toEqual('Not found');
        await page.waitForSelector('text=' + foo_to_search);
    });

    test('Test # 3 - Address Tool - Load of empty key', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url2);
        await page.click('#load-key-btn');
        await page.waitForSelector('text=private/public key invalid');       
    });

    test('Test # 4 - Address Tool - Generate private key and Load it', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url2);
        await page.click('#gen-key-btn');
        await page.waitForTimeout(500);
        await page.click('#load-key-btn');
        await page.waitForSelector('#address-info-wrap');
    });

    test('Test # 5 - Fast Menu - Transitions to site pages', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url1);
        
        var title_str = '';
        
        await page.click('#fast-menu > ul > li:nth-child(1) > a');
        await page.goForward();
        title_str = await page.title();
        expect(title_str).toEqual('Today bitcoin blocks');
        await page.goBack();

        await page.click('#fast-menu > ul > li:nth-child(2) > a');
        await page.goForward();
        title_str = await page.title();
        expect(title_str).toEqual('Tools');
        await page.goBack();

        await page.click('#fast-menu > ul > li:nth-child(3) > a');
        await page.goForward();
        title_str = await page.title();
        expect(title_str).toEqual('Bitcoin statistics');
        await page.goBack();

        await page.click('#fast-menu > ul > li:nth-child(4) > a');
        await page.goForward();
        title_str = await page.title();
        expect(title_str).toEqual('Developer Center');
        await page.goBack();

        title_str = await page.title();
        expect(title_str).toEqual('Bitcoin explorer');
    });

    test('Test # 6 - Web Camera - Unable to access', async () => {
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url1);
        await page.click('.scan-qr');
        await page.waitForSelector('text=Unable to access video stream (please make sure you have a webcam enabled)');       
        var timestamp = Math.round(+new Date()/1000);
        var filename = "screenshot_unabletoaccess_" + timestamp + ".png";
        await page.screenshot({ path: filename });
    });
}); 