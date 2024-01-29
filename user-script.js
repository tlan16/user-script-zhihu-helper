// ==UserScript==
// @name        Zhihu Helper
// @namespace   https://github.com/tlan16/user-script-zhihu-helper
// @match       *://*.zhihu.com/*
// @grant       unsafeWindow
// @version     1.0
// @license     GPL-3.0 license
// @author      Frank<franklan118@gmail.com>
// @updateURL   https://raw.githubusercontent.com/tlan16/user-script-zhihu-helper/main/user-script.js
// @downloadURL https://raw.githubusercontent.com/tlan16/user-script-zhihu-helper/main/user-script.js
// @homepage    https://github.com/tlan16/user-script-zhihu-helper
// @supportURL  https://github.com/tlan16/user-script-zhihu-helper
// @description 29/01/2024, 7:15:58 pm
// @require     https://cdn.jsdelivr.net/npm/jquery@3/dist/jquery.min.js
// @run-at      document-idle
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);


const sleep = (time = 1000) => new Promise((resolve) => {
  setTimeout(() => {
    resolve();
  }, time);
});

const logger = {
  log: (...args) => {
    console.log(`[UserScript][Zhihu Helper]`, ...args)
  },
  error: (...args) => {
    console.error(`[UserScript][Zhihu Helper]`, ...args)
  },
}

async function clickElement(selector) {
  if (this.counter && this.counter > 5) return;

  if (this.counter == undefined) this.counter = 0;
  const element = document.querySelector(selector);
  if (element) {
    element.click();
    this.counter = 0;
    logger.log(`Element ${selector} clicked. Counter: ${this.counter}.`);
  }
  else {
    this.counter++;
    logger.log(`Element ${selector} not found. Counter: ${this.counter}.`);
    await sleep();
    await clickElement(selector);
  }
}

async function removeElement(counter = 0) {
  if (document.querySelector(`.Modal button[aria-label="关闭"]`)) {
    await sleep();
    await removeElement();
  }
  if (counter > 10) return;

  const elements = document.querySelectorAll('body > *');
  for (let i = 1; i < elements.length; i++) {
    const lastTagName = elements[i-1].tagName;
    const thisTagName = elements[i].tagName;
    logger.log({lastTagName, thisTagName});
    if (lastTagName === 'SCRIPT' && thisTagName === 'DIV') {
      elements[i].remove();
      logger.log('Removed <div> after <script>.');
    }
  }
  logger.log(`No <div> found after <script>. Counter: ${counter}.`)
  await sleep(50);
  await removeElement(counter + 1);
}

clickElement(`.Modal button[aria-label="关闭"]`).then(() => {
  removeElement().catch(logger.error);
}).catch(logger.error);
