import expect from 'expect';
import playwright from 'playwright';

jest.setTimeout(120000);

const { chromium } = require('playwright'); 

let browser;

const url1 = 'https://the-internet.herokuapp.com/iframe';

afterAll( async () => {
    await browser.close();
});

describe('Frame Test',()=>{
    test('Test # 1 - Type in frame', async () => {
        browser = await chromium.launch({headless:false, slowMo: 1000});
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto(url1);
        await page.waitForSelector('#mce_0_ifr');
        const elementHandle = await page.$('#mce_0_ifr');
        const frame = await elementHandle.contentFrame();
        await elementHandle.type(' Hello!   \n');
    });
});
