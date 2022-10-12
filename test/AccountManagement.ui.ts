import { expect } from 'chai';
import { By, until, WebElement } from 'selenium-webdriver';

import { clear } from './utils';
import {
  AccountsHome,
  App,
  Network,
  PopupHome,
  Settings,
  Windows,
} from './utils/actions';
import { DEFAULT_ANIMATION_DELAY } from './utils/constants';

describe('Account management', function () {
  this.timeout(60 * 1000);

  let tabKeeper: string, tabAccounts: string;

  before(async function () {
    await App.initVault();
    await Settings.setMaxSessionTimeout();
    await browser.openKeeperPopup();
    tabKeeper = await this.driver.getWindowHandle();

    const { waitForNewWindows } = await Windows.captureNewWindows();
    await this.driver
      .wait(
        until.elementLocated(By.css('[data-testid="addAccountBtn"]')),
        this.wait
      )
      .click();
    [tabAccounts] = await waitForNewWindows(1);

    await this.driver.switchTo().window(tabAccounts);
    await this.driver.navigate().refresh();

    await AccountsHome.importAccount(
      'poor',
      'waves private node seed without waves tokens'
    );

    await AccountsHome.importAccount(
      'rich',
      'waves private node seed with waves tokens'
    );

    await this.driver.switchTo().window(tabKeeper);
    await browser.openKeeperPopup();
  });

  after(async function () {
    await App.closeBgTabs.call(this, tabKeeper);
    await App.resetVault();
  });

  describe('Accounts list', function () {
    it('Change active account', async function () {
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="otherAccountsButton"]')),
          this.wait
        )
        .click();

      await this.driver.wait(
        until.elementLocated(By.css('[data-testid="otherAccountsPage"]')),
        this.wait
      );

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="accountCard"]')),
          this.wait
        )
        .click();

      expect(await PopupHome.getActiveAccountName()).to.equal('poor');
    });

    it('Updating account balances on import');

    it('The balance reflects the leased WAVES');

    it('Copying the address of the active account on the accounts screen');

    describe('Show QR', function () {
      after(async function () {
        await this.driver.findElement(By.css('div.arrow-back-icon')).click();
      });

      it('Opening the screen with the QR code of the address by clicking the "Show QR" button', async function () {
        await this.driver
          .wait(
            until.elementLocated(
              By.css('[data-testid="activeAccountCard"] .showQrIcon')
            ),
            this.wait
          )
          .click();

        await this.driver.wait(
          until.elementLocated(
            By.css('[class^="content@SelectedAccountQr-module"]')
          ),
          this.wait
        );
      });

      it('Check that QR matches the displayed address');

      it('Download QR code'); // file downloaded, filename equals "${address}.png"
    });

    describe('Search', function () {
      let searchInput: WebElement;

      before(async function () {
        await this.driver
          .wait(
            until.elementLocated(By.css('[data-testid="otherAccountsButton"]')),
            this.wait
          )
          .click();
        searchInput = this.driver.wait(
          until.elementLocated(By.css('[data-testid="accountsSearchInput"]')),
          this.wait
        );
      });

      after(async function () {
        await this.driver.findElement(By.css('div.arrow-back-icon')).click();
      });

      beforeEach(async function () {
        await searchInput.clear();
      });

      it('Displays "not found" description if term is not account name, address, public key or email', async function () {
        await searchInput.sendKeys('WRONG TERM');

        expect(
          await this.driver.findElements(By.css('[data-testid="accountCard"]'))
        ).length(0);
        expect(
          await this.driver
            .findElement(By.css('[data-testid="accountsNote"]'))
            .getText()
        ).matches(/No other accounts were found for the specified filters/i);
      });

      it('"x" appears and clear search input', async function () {
        await searchInput.sendKeys('WRONG TERM');
        const searchClear = this.driver.findElement(
          By.css('[data-testid="searchClear"]')
        );
        expect(await searchClear.isDisplayed()).to.be.true;
        await searchClear.click();
        expect(await searchInput.getText()).to.be.empty;
      });

      it('By existing account name', async function () {
        await searchInput.sendKeys(/* r */ 'ic' /* h */);
        expect(
          await this.driver
            .wait(
              until.elementLocated(
                By.css(
                  '[data-testid="accountCard"] [data-testid="accountName"]'
                )
              ),
              this.wait
            )
            .getText()
        ).to.be.equal('rich');
      });

      it('By existing account address', async function () {
        await searchInput.sendKeys('3P5Xx9MFs8VchRjfLeocGFxXkZGknm38oq1');
        expect(
          await this.driver
            .wait(
              until.elementLocated(
                By.css(
                  '[data-testid="accountCard"] [data-testid="accountName"]'
                )
              ),
              this.wait
            )
            .getText()
        ).to.be.equal('rich');
      });

      it('By existing account public key', async function () {
        await searchInput.sendKeys(
          'AXbaBkJNocyrVpwqTzD4TpUY8fQ6eeRto9k1m2bNCzXV'
        );
        expect(
          await this.driver
            .wait(
              until.elementLocated(
                By.css(
                  '[data-testid="accountCard"] [data-testid="accountName"]'
                )
              ),
              this.wait
            )
            .getText()
        ).to.be.equal('rich');
      });

      it('By existing email account');
    });
  });

  function accountPropertiesShouldBeRight() {
    describe('Address', function () {
      it('Is displayed', async function () {
        expect(
          await this.driver
            .findElement(
              By.xpath(
                "//div[@id='accountInfoAddress']//div[contains(@class, 'copyTextOverflow@copy')]"
              )
            )
            .getText()
        ).matches(/\w+/i);
      });

      it('Copying by clicking the "Copy" button');
    });

    describe('Public key', function () {
      it('Is displayed', async function () {
        expect(
          await this.driver
            .findElement(
              By.xpath(
                "//div[@id='accountInfoPublicKey']//div[contains(@class, 'copyTextOverflow@copy')]"
              )
            )
            .getText()
        ).matches(/\w+/i);
      });

      it('Copying by clicking the "Copy" button');
    });

    describe('Private key', function () {
      it('Is hidden', async function () {
        expect(
          await this.driver
            .findElement(
              By.xpath(
                "//div[@id='accountInfoPrivateKey']//div[contains(@class, 'copyTextOverflow@copy')]"
              )
            )
            .getText()
        ).not.matches(/\w+/i);
      });

      describe('Copying by clicking the "Copy" button', function () {
        before(async function () {
          await this.driver
            .findElement(
              By.xpath(
                "//div[@id='accountInfoPrivateKey']//div[contains(@class, 'lastIcon@copy')]"
              )
            )
            .click();
        });

        it('Clicking "Copy" displays the password entry form', async function () {
          await this.driver.wait(
            until.elementLocated(By.css('form#enterPassword')),
            this.wait
          );
          await this.driver
            .findElement(By.css('button#passwordCancel'))
            .click();
        });

        it('Clicking "Cancel" does not copy');

        it('Clicking "Copy" and entering the correct password will copy it');
      });
    });

    describe('Backup phrase', function () {
      it('Is hidden', async function () {
        expect(
          await this.driver
            .findElement(
              By.xpath(
                "//div[@id='accountInfoBackupPhrase']//div[contains(@class, 'copyTextOverflow@copy')]"
              )
            )
            .getText()
        ).not.matches(/\w+/i);
      });

      describe('Copying by clicking the "Copy" button', function () {
        before(async function () {
          await this.driver
            .findElement(
              By.xpath(
                "//div[@id='accountInfoBackupPhrase']//div[contains(@class, 'lastIcon@copy')]"
              )
            )
            .click();
          await this.driver.wait(
            until.elementLocated(By.css('form#enterPassword')),
            this.wait
          );
        });

        after(async function () {
          await this.driver
            .findElement(By.css('button#passwordCancel'))
            .click();
        });

        it('Clicking "Cancel" does not copy');

        it('Clicking "Copy" and entering the correct password will copy it');
      });
    });

    describe('Rename an account', function () {
      let newAccountNameInput: WebElement,
        newAccountNameErr: WebElement,
        saveBtn: WebElement,
        currentAccountName: string,
        newAccountName: string;

      before(async function () {
        await this.driver
          .wait(
            until.elementLocated(
              By.xpath("//button[contains(@class, 'accountName@accountInfo')]")
            ),
            this.wait
          )
          .click();
        newAccountNameInput = this.driver.wait(
          until.elementLocated(By.css('input#newAccountName')),
          this.wait
        );
        newAccountNameErr = this.driver.findElement(
          By.css('[data-testid="newAccountNameError"]')
        );
        saveBtn = this.driver.findElement(By.css('button#save'));
        currentAccountName = await this.driver
          .findElement(By.css('div#currentAccountName'))
          .getText();
      });

      it('A name that is already in use cannot be specified', async function () {
        await newAccountNameInput.sendKeys(currentAccountName);
        await newAccountNameInput.sendKeys('\t');
        expect(await newAccountNameErr.getText()).matches(
          /Name already exist/i
        );
        expect(await saveBtn.isEnabled()).to.be.false;
        await clear(newAccountNameInput);
      });

      it('Unique name specified', async function () {
        newAccountName = currentAccountName.slice(1);
        await newAccountNameInput.sendKeys(newAccountName);
        await newAccountNameInput.sendKeys('\t');
        expect(await newAccountNameErr.getText()).to.be.empty;
        expect(await saveBtn.isEnabled()).to.be.true;
      });

      it('Successfully changed account name', async function () {
        await saveBtn.click();

        expect(
          await this.driver
            .wait(
              until.elementIsVisible(
                this.driver.findElement(By.css('.modal.notification'))
              ),
              this.wait
            )
            .getText()
        ).matches(/Account name changed/i);

        await this.driver.sleep(DEFAULT_ANIMATION_DELAY);

        expect(
          await this.driver
            .wait(
              until.elementLocated(
                By.xpath(
                  "//button[contains(@class, 'accountName@accountInfo')]//span"
                )
              ),
              this.wait
            )
            .getText()
        ).to.be.equal(newAccountName);
      });
    });

    describe('Delete account', function () {
      beforeEach(async function () {
        await this.driver
          .wait(
            until.elementLocated(
              By.xpath("//div[contains(@class, 'deleteButton@accountInfo')]")
            ),
            this.wait
          )
          .click();
        await this.driver.wait(
          until.elementLocated(
            By.xpath("//div[contains(@class, 'content@deleteAccount-module')]")
          ),
          this.wait
        );
      });

      it('Click "Back" on the account deletion confirmation screen - the account is not deleted', async function () {
        await this.driver.findElement(By.css('div.arrow-back-icon')).click();

        expect(
          await this.driver.wait(
            until.elementLocated(
              By.xpath("//div[contains(@class, 'content@accountInfo')]")
            ),
            this.wait
          )
        ).not.to.be.throw;
      });

      it('Click "Delete account" deletes the account', async function () {
        await this.driver.findElement(By.css('button#deleteAccount')).click();

        expect(
          await this.driver.wait(
            until.elementLocated(
              By.css('[data-testid="importForm"], [data-testid="assetsForm"]')
            ),
            this.wait
          )
        ).not.to.be.throw;
      });
    });
  }

  describe('Inactive account', async function () {
    before(async function () {
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="otherAccountsButton"]')),
          this.wait
        )
        .click();
    });

    it('By clicking on account - go to the account properties screen', async function () {
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="accountInfoButton"]')),
          this.wait
        )
        .click();

      expect(
        await this.driver.wait(
          until.elementLocated(
            By.xpath("//div[contains(@class, 'content@accountInfo')]")
          ),
          this.wait
        )
      ).not.to.be.throw;
    });

    accountPropertiesShouldBeRight.call(this);
  });

  describe('Active account', async function () {
    it('By clicking on account - go to the account properties screen', async function () {
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="activeAccountCard"]')),
          this.wait
        )
        .click();

      expect(
        await this.driver.wait(
          until.elementLocated(
            By.xpath("//div[contains(@class, 'content@accountInfo')]")
          ),
          this.wait
        )
      ).not.to.be.throw;
    });

    accountPropertiesShouldBeRight.call(this);
  });

  describe('Switching networks', function () {
    before(async function () {
      await this.driver.switchTo().window(tabAccounts);

      await AccountsHome.importAccount(
        'second',
        'second account for testing selected account preservation'
      );
      await AccountsHome.importAccount(
        'first',
        'first account for testing selected account preservation'
      );

      await Network.switchToAndCheck('Testnet');

      await AccountsHome.importAccount(
        'fourth',
        'fourth account for testing selected account preservation'
      );
      await AccountsHome.importAccount(
        'third',
        'third account for testing selected account preservation'
      );

      await Network.switchToAndCheck('Mainnet');

      await this.driver.switchTo().window(tabKeeper);
    });

    after(async function () {
      await Network.switchToAndCheck('Mainnet');
    });

    it('should preserve previously selected account for the network', async function () {
      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="otherAccountsButton"]')),
          this.wait
        )
        .click();

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="accountCard"]')),
          this.wait
        )
        .click();
      await this.driver.sleep(DEFAULT_ANIMATION_DELAY);

      expect(await PopupHome.getActiveAccountName()).to.equal('second');

      await Network.switchToAndCheck('Testnet');

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="otherAccountsButton"]')),
          this.wait
        )
        .click();

      await this.driver
        .wait(
          until.elementLocated(By.css('[data-testid="accountCard"]')),
          this.wait
        )
        .click();
      await this.driver.sleep(DEFAULT_ANIMATION_DELAY);

      expect(await PopupHome.getActiveAccountName()).to.equal('fourth');

      await Network.switchToAndCheck('Mainnet');
      expect(await PopupHome.getActiveAccountName()).to.equal('second');
      await Network.switchToAndCheck('Testnet');
      expect(await PopupHome.getActiveAccountName()).to.equal('fourth');
    });
  });
});
