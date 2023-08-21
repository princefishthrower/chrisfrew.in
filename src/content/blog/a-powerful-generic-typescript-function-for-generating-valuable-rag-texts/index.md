---
title: "A Powerful Generic TypeScript Function for Generating Valuable RAG Texts"
description: "In a Nutshell: Given X, what’s the probability of Y occurring?"
date: "2023-08-20"
draft: false
tags: typescript,javascript,ai,rag
---

_The full code example used in this post is on [TypeScript Playground](https://www.typescriptlang.org/play?jsx=0&ssl=8&ssc=17&pln=8&pc=23#code/JYOwLgpgTgZghgYwgAgJIGU4BsIGcAicYcyA3gFDLIAmcAngPIwDqEEA1gFzK5hSgBzSsgAOUAPbUArgjDpxWat178QQqlNwRqAYXFSR4kNwBG4hRDghyAX3LkER3j2x5CxbhlcEicANoAusgAvMh+wqQ09EysHNwARACyRrR08QA0ohLSsvKKCQAK2TJgyACCGcia2noGRtx8Uig26RFRjCxsXMjxACpNuKmVYpIleUo9RaOyyABCldW6+obGyPBYWsgtbakxXQms1CB4Q5kjOXIKE-FTF8g6C1pLdauNza1UkbudcT29ABZSKCDejDYq5K6FcGlCqZRa1Fbcdabbafdp7X7xABi-FOWWml3yk2hc0eNWW9WQby2HzI6J+3XimDAQLx5zGkOJBPuZOeiLW2BRtK+0QZCXQUhAbOh4yh3NhVSeCMp1NRdO+sUZySloLOMs5NxJ8zhSopq2R7x2os1CX6J11+Iusq5dweJvJLwaUCaNKtHRtPUOxxBaT1BOdhvlvOV5sFlrRGv2f0BwOl4YNtxKpPdfJV3vj6utSexuId7IhRMjrujZqRcd9CaLmOZrLL+srmZmCvhtap+Ybhf9xYlOtDjo5HaNNc9Ao2BZFQ8x2rTTozJLdio9-NVwvpAb6AxXE+unZh0-5FoHC4xjKD9rH5cJJ6nOZjXp9auvYuTQJDYPTk7chuPYzpen57sWOLAEeFbPlGr69jufo3uKRCtg+7ZwXcxqbrmsZzr6AQANz2KAkCwIgKCoFMJhwCYwBYMAYB0IkEB8MACAADy9AAfGQwhYHREBYMo7FqCRVAjCI0DMdw7AQHQ4gwMgvQkXY5BkdA8BIGgUzSVAzHoMQYC4NxfEUFQYDiMQWC1OA3AgFIAC2JjQBJVQgMAACOTQAGrYAM3CJHAIicfJinKb0mToGx3F+OFSkqQEPE8e5ABuAUQHZJlBSFYUKYlUXIMFoW9PFBWRQEmSOS50ApWp9iOCAzgINgCBSIJkB6TJdBGUQuAhMgZkABTCOIJgAFYQLIuDcGVVXCE5bH8Ags26RItH0YxzGsexXG8YE5AAJSeN1Bm9cZpm8SE5nCE1zhST1fU5et4j6YZl1mYNFlUFS1nYNl3AAAy0honk+RA-lYIFyDHAA7sVeUJZF0WxWVyNJSlw1HaDyAZdDWX6OAa3w4joUY0VJVxRTVWw85rlQFjOPCDYJHCDA4hQMgw33aU40TcgiX89NJlHfxv34u9F39QAdFZNnZQA1IrbMSxzXM804pRLXtgvKTrK24GLP0S7zks9QA0gpg0GxxMuPed7mm1r5vnVDPqhPzfgO8xVt0MR9gS1QwDKcNACEPvSyZMuSt5fmZbgMv-HAuDDZHftHcbwhB67H2y7HEPu3gMtaGAacSFLfvVRACMxWA1MVZj2NHU7QeR89if4002WJ6Xo05xL6cKbjOek1T6ON70tM1QzPHY9nQctwvVDqTn7eXTH4PxwTicCGx5dvZbClHWHMtwNQ1AH1LRdL8vyAh9zEcV09G9d4TkrR3vZdD3QJ9JynV8eo3yzgPXOUdO6ZR7jLL+gDzoZ1Pn3SORdMhAyXjnVebdn7nQ7jLN+Pc75UGgfvH+J8CHIBLvvMhkksHMWQVQsBOC8FE0-sQmhdB4FEO-mwm+YdkCK2QAARjIWg36dgV6B2QFANiQIQAMMug1BwLs97HCgEQCANE6IMSYr1CA4BdFIAGqEEaY1JoizWvNWkttVqnQ2po7aLFlocTModE6PAxICECDdcWyAzY-0McgKxicnIhWGsNKxYtgh8SsfbNhIjfFsI7jYw+2DPrXVCK1LA7VOrqISZdfuv1hYzVxoE4Qt8qBmy0HokABjRKqA8UEUIgRVZrE5tzM2IABFnV9tbRKfiQG-XVm0l2HSi56zkfnLekME6cOGh0rp7Dj5h36WrVpmtmqlBAAAJnmX7MZfTvE50GWs5wWzRm9NyRMuOUyd4zK2TsxZyyB7tIEUXbKg116yyYR-XA9DCEwLmWw+BvzyH-JeZlE+zTQFm00sCEWwAjBvM9qYmaMsYAMXIvk0BVBhr8wiTxYFVAvYAuSd0-2IRgihBGZlZAAAyGlgtJp+DuYChSDSKWw02UXehR0ZY4DUGAf4kKnkuxGJtLRzEQjAqpQTN5fEgYEuQAAfm5sNGFWhZDwpAG8gA9LDMFMrmFiwAFSCKBqguW4gsTAAAB7aGGpso6CrgZCpzmbQSrksACJto41aqLQCX2BWEn1eKAk+piSSug5LKWdJZXQblireVCSwK3V1Lt3XCU2d6vaic0VSkxVioNe0Q3RMjlGjl9y41YuQEdBN6bk0SKhSKiuqApQQGtV60IfiZb+rbUwWZMaI0ZxTUHeJb0W3UDbZmztsbE49utX25lg7j4uqDg-YadavVh3ZXWzNdLJbjrbV6zi+7W3WodQcrFlTIDVOLiITQ-x81VoAAYAHFgBpV0cgAAJKQDdNh74DR-dKpoLQqT-BQKKux2ixk-p3f+oDnLMr-uAIB0gkGtraJsAAUhlk+4FIjQFiIHkRiWJGtgswkVIlkUBZFXv0XgNSbNtW6tSGMuGXRkBWGoD4s05AcDax9WtaitiMM7R9ZxLwOAfDEB4p4xpEQF51oSAKlArHErsY4BkBekcEiJk07ST8imk3KfAz4zQVklpc00IITjPGXjIFcoILTg82EJBAisZzhESL8Z4Lo69BjBrKOgGojRomdFVIMcNXA3h3BwEyIE2+zHkBYHEAITjWAsC+fAFYALVkwMoHuhYcgdGb05s5gAUUQA+krOlIk8eahYXlqWot+fo5newSW1PKQ0+wTjUo7MrHIIEwa4RPhGY9SZ1T9A2NdE89QiNummzsE84ZiWSmegqbM7wcQlnRBAgQMnXANnNuPjm2AhIj5xgrdaAHGreBAu6OC11ET4rwv+bwFFmLvh4uCcS7qlLaXsCZavTl+7eXNuFZwMV1rpXUUVaqy1iLKA6uQ4gE1gQiP3uZyAA)._

## Generating Deterministic Statistics for LLMs That are Bad at Deterministic Things

I’m currently hard at work on my latest SaaS product, [AMT JOY](https://amtjoy.com/), which is a historical, statistical, and probabilistic tool covering futures trading sessions, focusing on Auction Market Theory, or AMT. Part of the product we are calling “[AMT GPT](https://amtjoy.com/amt-gpt/)” — a chat-based tool where you can ask for any information about any historical session that ever occurred, eventually with the idea of planning intraday plays in real-time. This is where I discovered embeddings and Retrieval Augmented Generation (RAG). At first, skeptical as always with the accuracy of these LLMs, I was fully expecting the very poor results which I indeed was seeing initially. For example, I asked a very simple “What trading session had the highest return?” and I was each time getting a completely different answer! That’s when I realized:

**This was completely my fault.**

I had to first inform myself about how RAG works. In the background, RAG is first finding a select number of _matching_ documents, and then creating a response from them. Since I only had per-day session descriptions, where the return of the session is only a small part of those description files, of course, the initial selection was faulty, and then the LLM could only report on the session that was returned. However, as soon as I included a sort of “overall stats” file, it started working much more reliably. This stats file literally had the line “The session with the highest return occurred on …”. This was definitely what the RAG was finding in subsequent queries. That’s when I realized, to make the RAG work for a vast variety of statistical and probabilistic questions, I needed mounds and mounds of not just my data converted to human readable / normal language documents — and crucially _not_ just randomly generated data, but highly structured and statistically accurate data. Only then would AMT GPT start to be useful.

## Generating the Data

At first, I started with a sort of alpha, using string interpolation to format various files, like my ‘stats’ file:

```typescript
...

return `# Stats overview Data for ${data[0].symbol}
The session with the highest return was ${sessionWithHighestReturn.formattedDate} (${sessionWithHighestReturn.sessionId}) with a return of ${sessionWithHighestReturn.sessionReturn.toFixed(2)}.
The session with the lowest return was ${sessionWithLowestReturn.formattedDate} (${sessionWithLowestReturn.sessionId}) with a return of ${sessionWithLowestReturn.sessionReturn.toFixed(2)}.
The session with the highest volume was ${sessionWithHighestVolume.formattedDate} (${sessionWithHighestVolume.sessionId}) with a volume of ${sessionWithHighestVolume.totalVolume}.
The session with the lowest volume was ${sessionWithLowestVolume.formattedDate} (${sessionWithLowestVolume.sessionId}) with a volume of ${sessionWithLowestVolume.totalVolume}.
The session with the highest A period return was ${sessionWithHighestAPeriodReturn.formattedDate} (${sessionWithHighestAPeriodReturn.sessionId}) with a return of ${sessionWithHighestAPeriodReturn.candles[0].r.toFixed(2)}.
The session with the lowest A period return was ${sessionWithLowestAPeriodReturn.formattedDate} (${sessionWithLowestAPeriodReturn.sessionId}) with a return of ${sessionWithLowestAPeriodReturn.candles[0].r.toFixed(2)}.`;
};

...
```

I realized however, there were far more correlations possible, and since potentially thousands of traders will use AMT JOY, a correlation that I may think is useless, unnecessary, or not even realize entirely, may in fact be an essential part of another trader’s strategy! Just look at our ISessionStats interface, and realize how many “Given” … “Then” correlations are possible:

```typescript
interface ISessionStats {
    index: number
    symbol: string
    sessionId: string
    formattedDate: string
    dayOfWeek: string
    month: string
    year: number
    candles: Candle[]
    dailyOTF: string
    weeklyOTF: string
    monthlyOTF: string
    orTrend: string
    orExtensionUp: string
    orExtensionDown: string
    ibTrend: string
    trTrend: string
    ibExtensionUp: string
    ibExtensionDown: string
    sessionType: string
    sessionAnnotation: string
    openingRange: Range
    initialBalance: Range
    tradingRange: Range
    vwap: VWAPWithStdDev[]
    timeAboveOR: number
    timeInOR: number
    timeBelowOR: number
    timeAboveIB: number
    timeInIB: number
    timeBelowIB: number
    timeAboveTR: number
    timeInTR: number
    timeBelowTR: number
    timeAboveSD1: number
    timeWithinSD1: number
    timeBelowSD1: number
    timeAboveSD2: number
    timeWithinSD2: number
    timeBelowSD2: number
    timeAboveSD3: number
    timeWithinSD3: number
    timeBelowSD3: number
    timeAboveSD4: number
    timeWithinSD4: number
    timeBelowSD4: number
    vwapCrossesUp: number
    vwapCrossesDown: number
    closeInRelationToOR: string
    closeInRelationToIB: string
    candleClosesBelowBelowORMidpoint: number
    candleClosesAboveAboveORMidpoint: number
    candleClosesBelowBelowIBMidpoint: number
    candleClosesAboveAboveIBMidpoint: number
    crossesORHighPeriodUp: string[]
    crossesORHighPeriodDown: string[]
    crossesORLowPeriodDown: string[]
    crossesORLowPeriodUp: string[]
    crossesIBHighPeriodUp: string[]
    crossesIBHighPeriodDown: string[]
    crossesIBHighPeriodDownCount: number
    crossesIBHighPeriodUpCount: number
    crossesIBLowPeriodDown: string[]
    crossesIBLowPeriodUp: string[]
    crossesIBLowPeriodUpCount: number
    crossesIBLowPeriodDownCount: number
    openingDrive: string
    gapName: string
    gapPercent: number
    gapFillLevel: number
    gapFilled: string
    gapFillPeriod: string
    sessionReturn: number
    totalVolume: number
    totalVolumePercentile: number
    ibHighFromOpenPercentChange: number
    ibLowFromOpenPercentChange: number
    lowestLevelFromOpenPercentChange: number
    lowestLevelPeriod: string
    highestLevelFromOpenPercentChange: number
    highestLevelPeriod: string
    trueRange: number
    averageTrueRange: number
    aPeriodTrend: string
    bPeriodTrend: string
    cPeriodTrend: string
    dPeriodTrend: string
    ePeriodTrend: string
    fPeriodTrend: string
    gPeriodTrend: string
    hPeriodTrend: string
    iPeriodTrend: string
    jPeriodTrend: string
    kPeriodTrend: string
    lPeriodTrend: string
    mPeriodTrend: string
    phod: number
    plod: number
    prevClose: number
    mostSimilarSessionsByReturn: Array<ISessionCorrelation>
}
```

In any case, a generic or at the very least, abstract approach is required to efficiently and effectively build a software solution to build as many statistics-based files as possible. The more combinations of stats we can make, the more powerful our RAG.

## Given This, Then…

The first function I wrote takes an array of your objects (of any type — that’s the power of generics!) and generates “given X, the probability of Y occurring is Z” type sentences. There are two parts: the first part, we need to calculate all the different possibilities of the single metric alone. Only then can we combine the various combinations of metrics to build all our Given / Then sentences:

```typescript
const calculatePropertyStats = <T>(
    objects: T[],
    metrics: IProbabilityMetric<T>[]
): IPropertyStats<T> => {
    const propertyStats: IPropertyStats<T> = {
        totalCount: 0,
        uniqueValues: new Map<keyof T, Set<T[keyof T]>>(),
        valueCounts: new Map<keyof T, Map<T[keyof T], number>>(),
    }

    for (const obj of objects) {
        propertyStats.totalCount++

        for (const metric of metrics) {
            const propertyKey = metric.property
            const propertyValue = obj[propertyKey]

            if (!propertyStats.uniqueValues.has(propertyKey)) {
                propertyStats.uniqueValues.set(
                    propertyKey,
                    new Set<T[keyof T]>()
                )
                propertyStats.valueCounts.set(
                    propertyKey,
                    new Map<T[keyof T], number>()
                )
            }

            propertyStats.uniqueValues.get(propertyKey)!.add(propertyValue)

            if (
                !propertyStats.valueCounts.get(propertyKey)!.has(propertyValue)
            ) {
                propertyStats.valueCounts
                    .get(propertyKey)!
                    .set(propertyValue, 0)
            }

            propertyStats.valueCounts
                .get(propertyKey)!
                .set(
                    propertyValue,
                    propertyStats.valueCounts
                        .get(propertyKey)!
                        .get(propertyValue)! + 1
                )
        }
    }
    return propertyStats
}
```

Leveraging this function, we achieve the parent function, `generateProbabilitySentences`:

```typescript
const generateProbabilitySentences = <T>(
    objects: T[],
    metrics: IProbabilityMetric<T>[]
): string[] => {
    const propertyKeys = metrics.map((metric) => metric.property)
    const propertyStats: IPropertyStats<T> = calculatePropertyStats(
        objects,
        metrics
    )

    const sentences: string[] = []

    for (const n1PropertyKey of propertyKeys) {
        for (const n1Value of propertyStats.uniqueValues.get(n1PropertyKey)!) {
            for (const n2PropertyKey of propertyKeys) {
                for (const n2Value of propertyStats.uniqueValues.get(
                    n2PropertyKey
                )!) {
                    const n1ValueCount = propertyStats.valueCounts
                        .get(n1PropertyKey)!
                        .get(n1Value)!

                    const intersectionCount = objects.filter(
                        (obj) =>
                            obj[n1PropertyKey] === n1Value &&
                            obj[n2PropertyKey] === n2Value
                    ).length

                    const probability =
                        n1ValueCount > 0
                            ? (
                                  (intersectionCount / n1ValueCount) *
                                  100
                              ).toFixed(2)
                            : 0

                    const label1 = metrics.find(
                        (metric) => metric.property === n1PropertyKey
                    )?.label
                    const label2 = metrics.find(
                        (metric) => metric.property === n2PropertyKey
                    )?.label

                    const propIndex1 = propertyKeys.indexOf(n1PropertyKey)
                    const propIndex2 = propertyKeys.indexOf(n2PropertyKey)

                    if (label1 !== label2 && propIndex1 < propIndex2) {
                        sentences.push(
                            `Given ${label1} is ${n1Value}, the probability of ${label2} ${n2Value} is ${probability}%.`
                        )
                    }
                }
            }
        }
    }
    return sentences
}
```

## Example

Observe the following example data shape, `ISalesData`:

```typescript
interface ISalesData {
    dayOfWeek: string
    productSold: string
    usedCoupon: boolean
}
```

and data `salesData`:

```typescript
const salesData: ISalesData[] = [
    { dayOfWeek: "Monday", productSold: "Product A", usedCoupon: true },
    { dayOfWeek: "Tuesday", productSold: "Product B", usedCoupon: false },
    { dayOfWeek: "Wednesday", productSold: "Product C", usedCoupon: true },
    { dayOfWeek: "Thursday", productSold: "Product A", usedCoupon: false },
    { dayOfWeek: "Friday", productSold: "Product B", usedCoupon: true },
    { dayOfWeek: "Saturday", productSold: "Product C", usedCoupon: false },
    { dayOfWeek: "Sunday", productSold: "Product A", usedCoupon: true },
    { dayOfWeek: "Monday", productSold: "Product B", usedCoupon: false },
    { dayOfWeek: "Tuesday", productSold: "Product C", usedCoupon: true },
    { dayOfWeek: "Wednesday", productSold: "Product A", usedCoupon: false },
    { dayOfWeek: "Thursday", productSold: "Product B", usedCoupon: true },
    { dayOfWeek: "Friday", productSold: "Product C", usedCoupon: false },
    { dayOfWeek: "Saturday", productSold: "Product A", usedCoupon: true },
    { dayOfWeek: "Sunday", productSold: "Product B", usedCoupon: false },
    { dayOfWeek: "Monday", productSold: "Product C", usedCoupon: true },
    { dayOfWeek: "Tuesday", productSold: "Product A", usedCoupon: false },
    { dayOfWeek: "Wednesday", productSold: "Product B", usedCoupon: true },
    { dayOfWeek: "Thursday", productSold: "Product C", usedCoupon: false },
    { dayOfWeek: "Friday", productSold: "Product A", usedCoupon: true },
    { dayOfWeek: "Saturday", productSold: "Product B", usedCoupon: false },
]
```

What if we want to know the probability / chance a customer buys a certain product on a given day? Or the chance they used a coupon on a certain day? Easy, we just need to pass each of these given / then scenarios into generateProbabilitySentences :

```typescript
// day of week and coupon
let metrics: IProbabilityMetric<ISalesData>[] = [
    {
        label: "The day of week",
        property: "dayOfWeek",
    },
    {
        label: "the customer using a coupon being",
        property: "usedCoupon",
    },
]
let sentences = generateProbabilitySentences(salesData, metrics)

// log all sentances to the console
sentences.forEach((sentence) => console.log(sentence))

// day of week and coupon
metrics = [
    {
        label: "The day of week",
        property: "dayOfWeek",
    },
    {
        label: "the customer purchasing the product",
        property: "productSold",
    },
]
sentences = generateProbabilitySentences(salesData, metrics)

// log all sentances to the console
sentences.forEach((sentence) => console.log(sentence))
```

and… drumroll please… our amazing output:

```text
Given the day of week is Monday, the probability of the customer using a coupon being true is 66.67%.
Given the day of week is Monday, the probability of the customer using a coupon being false is 33.33%.
Given the day of week is Tuesday, the probability of the customer using a coupon being true is 33.33%.
Given the day of week is Tuesday, the probability of the customer using a coupon being false is 66.67%.
Given the day of week is Wednesday, the probability of the customer using a coupon being true is 66.67%.
Given the day of week is Wednesday, the probability of the customer using a coupon being false is 33.33%.
Given the day of week is Thursday, the probability of the customer using a coupon being true is 33.33%.
Given the day of week is Thursday, the probability of the customer using a coupon being false is 66.67%.
Given the day of week is Friday, the probability of the customer using a coupon being true is 66.67%.
Given the day of week is Friday, the probability of the customer using a coupon being false is 33.33%.
Given the day of week is Saturday, the probability of the customer using a coupon being true is 33.33%.
Given the day of week is Saturday, the probability of the customer using a coupon being false is 66.67%.
Given the day of week is Sunday, the probability of the customer using a coupon being true is 50.00%.
Given the day of week is Sunday, the probability of the customer using a coupon being false is 50.00%.
Given the day of week is Monday, the probability of the customer purchasing the product Product A is 33.33%.
Given the day of week is Monday, the probability of the customer purchasing the product Product B is 33.33%.
Given the day of week is Monday, the probability of the customer purchasing the product Product C is 33.33%.
Given the day of week is Tuesday, the probability of the customer purchasing the product Product A is 33.33%.
Given the day of week is Tuesday, the probability of the customer purchasing the product Product B is 33.33%.
Given the day of week is Tuesday, the probability of the customer purchasing the product Product C is 33.33%.
Given the day of week is Wednesday, the probability of the customer purchasing the product Product A is 33.33%.
Given the day of week is Wednesday, the probability of the customer purchasing the product Product B is 33.33%.
Given the day of week is Wednesday, the probability of the customer purchasing the product Product C is 33.33%.
Given the day of week is Thursday, the probability of the customer purchasing the product Product A is 33.33%.
Given the day of week is Thursday, the probability of the customer purchasing the product Product B is 33.33%.
Given the day of week is Thursday, the probability of the customer purchasing the product Product C is 33.33%.
Given the day of week is Friday, the probability of the customer purchasing the product Product A is 33.33%.
Given the day of week is Friday, the probability of the customer purchasing the product Product B is 33.33%.
Given the day of week is Friday, the probability of the customer purchasing the product Product C is 33.33%.
Given the day of week is Saturday, the probability of the customer purchasing the product Product A is 33.33%.
Given the day of week is Saturday, the probability of the customer purchasing the product Product B is 33.33%.
Given the day of week is Saturday, the probability of the customer purchasing the product Product C is 33.33%.
Given the day of week is Sunday, the probability of the customer purchasing the product Product A is 50.00%.
Given the day of week is Sunday, the probability of the customer purchasing the product Product B is 50.00%.
Given the day of week is Sunday, the probability of the customer purchasing the product Product C is 0.00%.
```

I can guarantee the statistics are accurate :)

You could then throw data like this into a document, then into your favorite vector store (like Pinecone), and query against it with any embedder of your choice (like GPT4)! You can then be sure your queries will be matched with accurate, and not hallucinated, data.

Of course, this is a toy example, and you can see how this function works best with properties that are string enums, i.e. a set list of countable strings. You would need to define additional rules for things like sums, time frames (“show me all sales for June / July / August”) averages, max, or min, and this is exactly what we’re working on!

## More Coming!

In the coming weeks and months, I’m looking to scale this tool out into a fully separate product. Essentially, you’ll be able to put in your organization's data — whatever type it might be, and we’ll be able to generate all possible probabilities and statistics, and then you can use RAG or any LLM of your choice against it to extract mathematically true values. It replaces the need for any big data analysis completely, and it operates through an extremely human-like interface. Think of it like a friendly human assistant that has memorized the entirety of your org’s data set — including probabilities and statistics that you may not even have thought of yourself!

Also, if you’ve got this far, do you know of any tools working on similar problems like this? Or what this field of technology is called? I’d love to research

## Thanks & Cheers

Cheers,

-Chris
