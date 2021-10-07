---
title: "A React Native Growing Text Input for 2021"
description: A copy-and-paste growing text input for React Native
date: "2021-10-03"
tags: React Native, Component, TypeScript, UI/UX
---


```tsx
export default function GrowingTextInput() => {

    const [height, setHeight] = useState(CommonConstant.DEFAULT_MESSAGE_INPUT_HEIGHT);

    const onContentSizeChange = (
        event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => {
        const height = isIOS()
        ? event.nativeEvent.contentSize.height + 15
        : event.nativeEvent.contentSize.height;
        setHeight(height);
    };

    return (
        <TextInput
            placeholder="I'm a growing TextInput!"
            style={[style.input, {height}]}
            multiline={true}
            numberOfLines={1}
            onContentSizeChange={(event) => onContentSizeChange(event)}
        />
    )
}

const styles = createStyleSheet({
    input: {
        flex: 1,
        fontSize: 20,
        color: 'white',
        backgroundColor: 'gray',
        borderRadius: 20,
        height: 40,
        margin: 5,
        padding: 6,
        paddingLeft: 15,
        paddingBottom: isIOS() ? 0 : 6,
        paddingTop: isIOS() ? 8 : 6,
    },
})

```

and using it anywhere in a component:

```tsx

```

I think such an input only makes sense