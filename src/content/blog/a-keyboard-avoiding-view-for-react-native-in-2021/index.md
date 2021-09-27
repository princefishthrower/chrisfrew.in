---
title: A Keyboard Avoiding View for React Native in 2021
description: "A Copy-and-Paste Solution that Supports all iOS and Android keyboards!"
date: "2021-09-22"
draft: false
tags: TypeScript, React, React Native, React Hook, UI/UX
---

## Back in the React Native World

I've been deep in the React Native world recently as I develop big features for [InClub](https://inclub-app.com), an app which enables you to join and host private events!

Our latest sprint (for "v.1.3.0🥳") was designed to culiminate in a chat functionality. That's right - I built an entire chat function in a mobile app in 3 weeks. 😉 This wasn't your grandma's chat either - the full feature set included profile picture uploading, routing push notifications to the correct chat window based on sender, and creation of new channels based on various events around the app. I know, I know, most dev consultants would need _teams_ of people to get this done...

![You know how many people they needed to get the chat working?! Teams!](./teams.gif)

<p style="text-align: center;">
<i>You know how many people they needed to get the chat working?!</i>
</p>

Yeah, I'm pretty awesome 😎

All bravado aside, I had multiple cases of imposter syndrome and existential crisis during the sprint. (Did you know, for example, that [Flipper screws up file uploads in development mode on React Native projects, and that commenting out a single line fixes it?](https://github.com/facebook/react-native/issues/28551#issuecomment-918540487)) <-- that little gem right there took me 2 weeks to figure out why file uploads wouldn't work on Android devices. 😑

Alright, enough joking - let's get into the technical info and code.

# Pesky Android Keyboards

The most critical screen of an entire chat function, in my opinion, is the chat window itself. You want a clean text input and send button - luckily, we have fantastic apps to use as examples. In our case, we followed the styling and layout used in Whatsapp, Tinder, and Facebook Messenger. While iPhones of all shapes and sizes were working great with React Native's standard `KeyboardAvoidingView` component, I quickly learned that Android devices didn't like to abide by the same rules. 

Alarm bells started going off when I read something on Stack Overflow (no link, I couldn't find it again) that some phone manufacturers for Android don't expose the keyboard API at all! So it was clear that I couldn't reliably trust whatever info Android phones were sending to React Native's `KeyboardAvoidingView`. It was time to hunt for a different solution.

I found [this potential solution from John Tucker via codeburst.io](https://codeburst.io/react-native-keyboard-covering-inputs-72a9d3072689), which takes the input location and keyboard height itself and adjusts the screen accordingly - but there were two things that I didn't like with that post. The first was that it was the old school style of class components. Second, it was utilizing deprecated methods of `TextInputState.currentlyFocusedField()` and `UIManager.measure()`.

Long story short, I converted the class component to a functional component with hooks and found out the way to replace those two deprecated methods. `TextInputState.currentlyFocusedField()` can be replaced with `TextInputState.currentlyFocusedInput()` which returns not a number (like `currentlyFocusedField()`), but a React `ref` to the input itself. This actually makes things easier while at the same time eliminating the second deprecation of using `UIManager.measure()`, since we are able to call the `measure()` method directly on the `ref` returned by `currentlyFocusedInput()`.

In the end, we get a shiny new 2021-friendly, less than 100 line, deliciously clean keyboard shifting view component:

```tsx
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { Animated, Dimensions, Keyboard, KeyboardAvoidingView, StyleSheet, TextInput } from 'react-native';
import {useHeaderHeight} from '@react-navigation/elements';
import { useKeyboard } from '@react-native-community/hooks';

export default function KeyboardShift (props: PropsWithChildren<{}>) {
  const [shift, setShift] = useState(new Animated.Value(0))
  const keyboard = useKeyboard()

  // On mount, add keyboard show and hide listeners
  // On unmount, remove them
  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);
    return () => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    }
  }, [])

  const handleKeyboardDidShow = () => {
    const { height: windowHeight } = Dimensions.get('window');
    const keyboardHeight = keyboard.keyboardHeight;
    const currentlyFocusedInputRef = TextInput.State.currentlyFocusedInput();
    currentlyFocusedInputRef.measure((x, y, width, height, pageX, pageY) => {
      const fieldHeight = height;
      const fieldTop = pageY;
      const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
      if (gap >= 0) {
        return;
      }
      Animated.timing(
        shift,
        {
          toValue: gap,
          duration: 1000,
          useNativeDriver: true,
        }
      ).start();
    })
  }

  const handleKeyboardDidHide = () => {
    Animated.timing(
      shift,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }
    ).start();
  }

  const { children } = props;

  // Android: we need an animated view since the keyboard style can vary widely
  // And React Native's KeyboardAvoidingView isn't always reliable
  if (Platform.OS === 'android') {
    return (
      <Animated.View style={[styles.container, { transform: [{translateY: shift}] }]}>
        {children}
      </Animated.View>
    );
  }

  // iOS: React Native's KeyboardAvoidingView with header offset and 
  // behavior 'padding' works fine on all ios devices (and keyboard types)
  const headerHeight = useHeaderHeight();
  return (
    <KeyboardAvoidingView
      keyboardVerticalOffset={headerHeight}
      style={styles.container}
      behavior={'padding'}>
      {children}
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
```

Simply wrap the components in your screen that need a keyboard with the `<KeyboardShift>` component and enjoy the perfection:

```tsx
export default function YourCoolKeyboardScreen () {
    
    // Other logic, variables, etc.

    return (
        <KeyboardShift>
            {/* Screen components */}
        </KeyboardShift>
    )
}
```

## Dependencies and Notes

Note that this solution relies on two additional libraries, `@react-navigation/elements` for the header height, and `@react-native-community/hooks` for the keyboard height. A repeating theme I've found in `KeyboardAvoidingView` issues is the presence of react-navigation in a react native project - so if you are in fact _not_ using `react-navigation` in your app (in all reality, not many apps go without this dependency anymore in 2021) - you could try React Native's standard `KeyboardAvoidingView` solution for both iOS and Android. Otherwise, I of course suggest my solution. 😄 It's works well and we are using it in production.

## Thanks and Stay Tuned 📻

I'll likely be posting plenty more about React Native in the coming weeks months and years as we continue to build out the [InClub](https://inclub-app.com) mobile app.

Oh yeah - I should also mention, I also built a nice scaling input for the chat - you know, one that can grow to multiple lines as you write - just like the big boys. But that post will be for another day 😉.

Cheers! 🍻

-Chris