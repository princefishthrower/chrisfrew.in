---
title: "A Production Ready Jest Setup for React Native - All Mocks"
description: "Every mock that you could possibly need is in this post."
date: "2021-11-08"
draft: false
tags: react native,jest,testing
---

# React Native Testing

In the modern JavaScript world, testing is hard.

_Really hard._

Take a framework like React Native that interfaces with native code (on multiple native systems no less!) and you've got to mock _a lot_ of modules, just to get your tests to _run_, let alone pass...

![_😵‍💫 When I say a lot, I mean A LOT. Mocks... so many mocks... 😵‍💫_](./equations.gif)

<div style={{textAlign:"center"}}>
<i>😵‍💫 When I say a lot, I mean <u>A LOT</u>. Mocks... so many mocks... 😵‍💫</i>
</div>

# Integration Testing on the Entire `<App/>` Component

I enjoy making myself angry and smashing my keyboard, so of course the very first thing I tried to do with my integration tests was rendering my entire `<App/>` component. If I'm able to do this, then I know I am rendering the full app tree and can modify my mocks and stubs as I need for virtually any integration test we could think up... But just getting the `App` to render was in itself a hurdle - by definition, rendering `<App/>`, the entry point of my entire component tree, I'm going to pull in literally every single package, module, and function that is used in our app. Here's where the pain began.

# The Real Problem?

Not many libraries or modules post how to properly mock their libraries. They are of course focused on the functionality of the library or module itself - does it work as it should? They are not responsibile. Credit where credit is due - and the only example I've found so far `` includes a `jestSetup` that you can simply `import` into your `jest.setup.js` file and it works like a charm.

Understandably, to mock a single given library, it wouldn't take that much time - you look in your code to find all references, and mock whatever you use from that library.

But... when you're starting from a clean slate with absolutely no tests, you'd need to repeat this process a dozen times or more. This all takes time, precious time we developers don't want to spend on essentially repeating code that exists, just in mock form...

# Enter DefinitelyTested

To solve these headaches, I created [DefinitelyTested](https://github.com/FullStackCraft/DefinitelyTested), which includes fully kitted mock files for any library, module, or function you may need to mock! Playing off the name of the very famous TypeScript GitHub Repository [DefinitelyTyped](https://github.com/DefinitelyTyped/definitelytyped.github.io), I aim to eventually have community approved mocks for every repository that is out there! Currently the repository includes only `react-native` relevant mocks, but I assume with time more mocks for `web` and `electron` environments, for example, may appear.

# Bonus

If you're too lazy to even check out the [`DefinitelyTested`](https://github.com/FullStackCraft/DefinitelyTested) repository, here's the working `jest.setup.js` file I'm currently using in our large app:

```js
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import {NativeModules} from 'react-native';
import 'react-native-gesture-handler/jestSetup';

NativeModules.ImagePickerManager = {
  showImagePicker: jest.fn(),
  launchCamera: jest.fn(),
  launchImageLibrary: jest.fn(),
};

NativeModules.RNPermissions = {};

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-share', () => ({
  default: jest.fn(),
}));

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react-native-device-info', () => {
  return {
    getVersion: () => 4,
  };
});

jest.mock('@react-native-community/geolocation', () => {});

jest.mock('react-native-localize', () => {});

jest.mock('react-native-indicators', () => {});

jest.mock('react-native-keychain', () => {});

jest.mock('reanimated-bottom-sheet');

jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    Value: jest.fn(),
    event: jest.fn(),
    add: jest.fn(),
    eq: jest.fn(),
    set: jest.fn(),
    cond: jest.fn(),
    interpolate: jest.fn(),
    sub: jest.fn(),
    multiply: jest.fn(),
    sqrt: jest.fn(),
    max: jest.fn(),
    diff: jest.fn(),
    onChange: jest.fn(),
    View: View,
    Extrapolate: {CLAMP: jest.fn()},
    Clock: jest.fn(),
    greaterThan: jest.fn(),
    lessThan: jest.fn(),
    startClock: jest.fn(),
    stopClock: jest.fn(),
    clockRunning: jest.fn(),
    not: jest.fn(),
    or: jest.fn(),
    and: jest.fn(),
    spring: jest.fn(),
    decay: jest.fn(),
    defined: jest.fn(),
    call: jest.fn(),
    block: jest.fn(),
    abs: jest.fn(),
    greaterOrEq: jest.fn(),
    lessOrEq: jest.fn(),
    debug: jest.fn(),
    Transition: {
      Together: 'Together',
      Out: 'Out',
      In: 'In',
    },
  };
});

jest.mock('react-native-fs', () => {
  return {
    mkdir: jest.fn(),
    moveFile: jest.fn(),
    copyFile: jest.fn(),
    pathForBundle: jest.fn(),
    pathForGroup: jest.fn(),
    getFSInfo: jest.fn(),
    getAllExternalFilesDirs: jest.fn(),
    unlink: jest.fn(),
    exists: jest.fn(),
    stopDownload: jest.fn(),
    resumeDownload: jest.fn(),
    isResumable: jest.fn(),
    stopUpload: jest.fn(),
    completeHandlerIOS: jest.fn(),
    readDir: jest.fn(),
    readDirAssets: jest.fn(),
    existsAssets: jest.fn(),
    readdir: jest.fn(),
    setReadable: jest.fn(),
    stat: jest.fn(),
    readFile: jest.fn(),
    read: jest.fn(),
    readFileAssets: jest.fn(),
    hash: jest.fn(),
    copyFileAssets: jest.fn(),
    copyFileAssetsIOS: jest.fn(),
    copyAssetsVideoIOS: jest.fn(),
    writeFile: jest.fn(),
    appendFile: jest.fn(),
    write: jest.fn(),
    downloadFile: jest.fn(),
    uploadFiles: jest.fn(),
    touch: jest.fn(),
    MainBundlePath: jest.fn(),
    CachesDirectoryPath: jest.fn(),
    DocumentDirectoryPath: jest.fn(),
    ExternalDirectoryPath: jest.fn(),
    ExternalStorageDirectoryPath: jest.fn(),
    TemporaryDirectoryPath: jest.fn(),
    LibraryDirectoryPath: jest.fn(),
    PicturesDirectoryPath: jest.fn(),
  };
});

jest.mock('react-native-image-crop-picker', () => {
  return {
    openPicker: jest.fn().mockImplementation(() => Promise.resolve()),
    openCamera: jest.fn().mockImplementation(() => Promise.resolve()),
  };
});

jest.mock('@react-native-firebase/messaging', () => {
  return {
    hasPermission: jest.fn(() => Promise.resolve(true)),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('myMockToken')),
  };
});

jest.mock('@react-native-firebase/dynamic-links', () => {
  return () => {
    return {
      getInitialLink: jest.fn(() => Promise.resolve()),
      onLink: jest.fn()
    };
  };
});

jest.mock('react-native-settings', () => {});

jest.mock('react-native-notifications', () => {
  return {
    Notifications: {
      getInitialNotification: jest.fn(() => Promise.resolve()),
      registerRemoteNotifications: jest.fn(),
      events: () => {
        return {
          registerRemoteNotificationsRegistered: jest.fn(),
          registerRemoteNotificationsRegistrationFailed: jest.fn(),
          registerNotificationReceivedForeground: jest.fn(),
          registerNotificationReceivedBackground: jest.fn(),
          registerNotificationOpened: jest.fn(),
        };
      },
    },
  };
});

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native-vector-icons/Entypo', () => 'Icon');

jest.mock('react-native-vector-icons/Octicons', () => 'Icon');

jest.mock('react-native-vector-icons/AntDesign', () => 'Icon');

jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => 'Icon');

jest.mock('react-native-vector-icons/Feather', () => 'Icon');

jest.mock('react-native-vector-icons/FontAwesome5', () => 'Icon');

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('react-native-vector-icons/EvilIcons', () => 'Icon');
```

You're milage may vary, again, as your mocks depends on what libraries your React Native app may be using. Take and pick what you need, or just copy and paste the whole thing!

## Thanks!

I hope this post was useful to you, and saves you from the mocking headache that I encountered.

Cheers! 🍺

-Chris