---
title: Warn SAP Users of Locked Objects
date: "2018-01-17"
draft: true
---

## SAP users lockin' up your objects?
### We're gonna write an ABAP report and run it as a batch job to :robot: _Automatically_ :robot: get rid of them!

## Overview

Alright everyone, we're gonna walk through a fun ABAP report that involves functional programming, some challenging and creative BDC techniques, and a _'forbidden' SAP internal function module!!!_ :scream: :scream: :scream:

## SAP and it's Locked Objects

Anyone with a bit of technical sided SAP/ABAP experience knows that SAP has a locked object system - that is, a maximum of one entity can change an object at a time, wether it be a human user, a program, or any process. These 'objects' in SAP are numerous - orders, HUs, even warehouse bins are 'objects' that can be 'locked' when they are under modification somewhere in the system.

This can get very annoying when multiple entities want to change multiple objects in similar time frames.

## A Remedy for the Problem

The ABAP report I'm going to go through alleviates this problem and could be useful for any company that has automatic processes applied to objects in the system, but at the same time have human users that _also_ modify these objects.

The example program I will go through is for orders specifically (think TYPE AUFNR). Feel free to modify the code for any locked objects of your liking :blush: - the program logic following the locked object selection will not change, as we will soon see.

## Specific Problem

At my company we had some batch jobs that were attempting to change orders, only to find that the users were locked by some of our employees in their own SAP GUI transactions. Nothing 'bad' per say was happening, we were just seeing in the protocol of those various batch jobs that the orders couldn't be accessed. We realized a human user could easily forget they had a transaction open which locked an order, while they went off to work on something else, or were totally away from their work station.

We decided ultimately to build a timed warning system for users that happened to be locking orders, functioning as follows:

1. A warning popup for the user at 5 minutes of lock time
2. A second warning popup for the user warning at 10 minutes of lock time
3. Forcefully close the transaction that was locking the order at 15 minutes of lock time

And yes, this can all be done from an automatic process with no overseeing required! :blush:

Let's get started!

## Identify Locked Objects

The first thing we need to do is get the locked objects and times of all those locked objects across the whole system. As I said, for our case, we are only interested in locked orders. This is object type `AUFK`

So, we have our table of objects, and the users who are locking. To be as

## The 'forbidden' module

## BDC Tricks

<hr/>

# Footnotes
