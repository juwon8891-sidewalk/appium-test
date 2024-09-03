const { remote } = require('webdriverio');

async function main() {
  const caps = {
    "platformName": "Android",
    "appium:automationName": "UiAutomator2",
    "appium:avd": "Nexus_5X_Edited_API_34",
    "appium:appPackage": "com.sidewalkent.stepin",  // 설치된 앱의 패키지 이름
    "appium:appActivity": ".MainActivity",          // 앱의 시작 Activity (명확하게 지정해야 함)
    "appium:noReset": true,                        // 앱의 상태를 초기화하지 않음
    "appium:fullReset": false,                      // 앱을 제거하고 재설치하지 않음
    "appium:ensureWebviewsHavePages": true,
    "appium:nativeWebScreenshot": true,
    "appium:newCommandTimeout": 3600,
    "appium:connectHardwareKeyboard": true
  };

  const driver = await remote({
    protocol: "http",
    hostname: "127.0.0.1",
    port: 4723,
    path: "/",
    capabilities: caps
  });

  // 화면 크기 가져오기
  const screenSize = await driver.getWindowRect();
  const startX = screenSize.width * 0.5; // 화면의 중간
  const endX = screenSize.width * 0.1;   // 화면의 왼쪽 끝
  const y = screenSize.height / 2;       // 화면의 중간 높이

  // 스와이프 동작
  await driver.performActions([{
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: startX, y: y },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerMove', duration: 500, x: endX, y: y },
      { type: 'pointerUp', button: 0 }
    ]
  }]);

  // 스와이프 후 대기
  await driver.pause(2000); // 스와이프 후 2초 대기

  // 클릭할 요소 찾기
  const element = await driver.$('android=new UiSelector().resourceId("com.sidewalkent.stepin:id/rpd_page_dance_anim")');

  // 요소가 화면에 나타날 때까지 대기
  await driver.waitUntil(async () => {
    return await element.isDisplayed();
  }, {
    timeout: 15000, // 15초
    timeoutMsg: 'Element was not displayed within 15 seconds'
  });

  // 요소 클릭
  await element.click();

  // 세션 종료
  await driver.deleteSession();
}

main().catch(console.log);
