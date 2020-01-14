---
title: Debugging ABAP Code with a SAP Shortcut - A Must-Have Tool!
description:
date: "2017-12-27"
draft: false
starID: 9
postType: dev
---

## This is a Must-Have Tool for any ABAP Developer!
Did you ever find you wanted to debug something in SAP GUI right on a certain command or action, but it was in a popup? You can't access the command line to enter `\h`! Well, now you can with this amazing SAP shortcut!

Open any text editor and add the following:

```txt
[System]
Name=ERP
Description=My company's super awesome ERP system name
Client=100
[User]
Name=CHRIS_IS_AWESOME
Language=EN
[Function]
Title=Debugging
Command=/h
Type=SystemCommand
[Configuration]
WorkDir=\\SomePath\To_a_working_directory
[Options]
Reuse=0
```

Note that the `Name` (under `[System]`), `Client`, `Name` (under `[User]`), and `WorkDir` should all be set to your specific setup. (That's why I've put obvious bogus names for each of them :smile: ).

I keep a copy of mine on my desktop and in my documents directory, as `debugging.sap`, so it's always close at hand.

Whenever you need to debug something running from a popup, just drag and drop this shortcut into the window you want to debug! (either pressing enter in a field or pressing a button to continue the process in the GUI.)

\*\*\* Common gotchya: Things like pressing F4 or clicking the entry help button on any fields will also bring up the debugger after you have dragged and dropped this GUI shortcut - so, make sure you press the button/do the action of exactly what you want to debug!
