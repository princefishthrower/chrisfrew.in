---
title: Data Challenge! Building a PBR Bottle Cap Card Deck!
description: How many brews must be cracked open to build a full deck of 52?
date: "2020-12-19"
draft: false
tags: data challenge,csharp,.NET
---

# Motivation

I'm a big beer fan. Although a home brewer myself, I don't mind the occasional non-craft classics, like an ice cold PBR (which, totally unrelated, may have helped me survive my undergrad and graduate programs). This holiday season, as a particularly special treat, we decided to get PBR _in bottles_, which is when I realized the bottle caps have a playing card face written on the inside. 

Immediately, I realized one would need to open at least 52 beers to make their own deck, but on average it would be _much_ more. The motivation for this **Data Challenge!** was exactly that:
 
_Exactly how many bottles would one need to purchase to build their own deck of 52?_

# Tackling the Challenge

From a simple understanding of the problem, we can determine the _best_ case scenario, $B$ for the number of bottles you would have to buy, that is, every single time you open a bottle you would miraculously get a card face that you still needed in your collection. Thus, the number of trials needed equals that of the size of a deck of cards, 52:

$
B = 52
$

We can also describe the _worst_ case scenario, $W$, that is, if you got repeat card faces every single time you were trying to get a new card face. Since we describe any given bottle as starting from a fresh deck (i.e. replacement allowed), the worst case scenario is technically an infinite number of bottles! You could be infinitely unlucky and continuously draw repeat card faces that you don't need!

$
W = \infty
$

But what about for the _average_ case, where you are probably somewhere in between, sometimes getting a new card face you need, but sometimes getting card faces you've already found?

Due to my worse-than-rusty statistics skills (which, when I stopped to think about it, are nearly 10 years old - jeez, _I'm_ old!), I fell back to my programming skills. I thought C# would be a nice high-performance language to get the job done, so that's what I put together. The program procedure is as follows:

1. Generate a list of 'card IDs' from 1 to 52 which represents all cards in a standard playing card deck
2. While our own card deck does not have all cards (I checked it by checking the sum from 1 to 52 = 1378), do the following:
3. Draw a card at random from the card IDs array
4. Check if the drawn card is in our own collection of cards. If it isn't, add it. If it is, go back to step 2. Keep track of total count of draws needed to build. Throughout the process we do not mutate the card IDs array, as the array represents that a given PBR bottle can have any 1 of the 52 cards.

Steps 2-4 can be looped as a set 'experiment', to smooth out the random number generation.

Here's the full script which will run 10000 such experiments, and spit out the minimum, maximum, and average draws needed over all experiments:

```csharp
using System;
using System.Collections.Generic;
using System.Linq;

namespace pbr_bottles_card_deck
{
    class Program
    {
        static void Main(string[] args)
        {
            // Set up card ids, number of trials, and draw counts
            var cardIDs = Enumerable.Range(1, 52).ToArray();
            var trials = 10000;
            var drawCounts = new List<int>();

            // Enter experiment loop
            for (var i = 0; i < trials; i++)
            {
                var ourCards = new List<int>();
                var drawCount = 0;

                // Continue to draw cards until we have all cards to make a deck
                while (ourCards.Sum() != cardIDs.Sum())
                {
                    var random = new Random();
                    var index = random.Next(cardIDs.Count());
                    var cardIDDrawn = cardIDs[index];

                    if (!ourCards.Contains(cardIDDrawn))
                    {
                        ourCards.Add(cardIDDrawn);
                    }

                    drawCount++;
                }
                drawCounts.Add(drawCount);
                Console.WriteLine($"Done. Draw count needed was {drawCount}");
            }

            Console.WriteLine($"Average draw count needed over all experiments was {drawCounts.Average()}");
            Console.WriteLine($"Minimum draw count needed over all experiments was {drawCounts.Min()}");
            Console.WriteLine($"Maximum draw count needed over all experiments was {drawCounts.Max()}");
        }
    }
}
```

and a typical output looks like this:

```bash
...
Done. Draw count needed was 197
Average draw count needed over all experiments was 235.9183
Minimum draw count needed over all experiments was 103
Maximum draw count needed over all experiments was 687
```

Typically, I'm getting mean values around 235 'draws' so to speak, or bottles you would need to open, on average, to be able to complete your own full bottle cap deck.

# Analytical Solution?

I'm still searching for an analytical solution to this problem, but *gasp* I'm finding the internet doesn't have the solution on a platter for me! Curse you, Stack Overflow!

The challenge is that this problem doesn't quite follow the requirements of a binomial distribution, that is, the probability of getting the card face you need doesn't remain constant. The first one has a probability of $\frac{52}{52} = 1$ (we don't care what first card we get), the second is $\frac{51}{52}$, the third $\frac{50}{52}$, and so on, until the last card, which is $\frac{1}{52}$. The best I can think of is a sum of each of these 52 scenarios, which individually could be classified as binomial distributions. I'll update this post if I figure out how to describe that analytical solution without writing out 52 separate equations 😂.

# Thanks!

As always, I hope you enjoyed!

Cheers! 🍺 🍺 🍺


