---
title: Magento 2 IP Location Detection (GeoIP) and Store Context Control Using the ipstack API
description: A full code solution with example repository to get you started with international stores!
date: "2020-05-06"
tags: magento
---

[_This post is mirrored on my Medium account._](https://medium.com/@frewin.christopher/magento-2-ip-location-detection-geoip-and-store-context-control-using-the-ipstack-api-b48c17cc19c7)

## TL;DR

The example code repository [is here.](https://github.com/princefishthrower/example-magento-2-geo-ip-redirect) But I'd at least skim some of the important caveats in this post here before implementing!

## A Final Step in a Big Project

As I've subtly alluded to every so often, I spent most of 2019 working on a Magento 2 shop. I and colleagues are _still_ working on that project to this day, but much less so, simply tying off a few loose tickets that are really just 'nice to haves' instead of critical business components that needed to be done.

However, one of the last critical business functions was dynamically setting the correct store context based on a user's location. Sure, you can always use Magento's [default switch component](https://github.com/magento/magento2/blob/2.4-develop/app/code/Magento/Store/view/frontend/templates/switch/stores.phtml) to change store scope, but it's a bit more user friendly to do it automatically 😉.

Alright, let's get started.

## Magento 2 Websites, Stores, and Store Views?!

First, if you haven't already, **_please_** look at how Magento 2 organizes and differentiates between three key items: a 'website' a 'store' and a 'store view' [in the official documentation](https://docs.magento.com/m2/ce/user_guide/stores/websites-stores-views.html). The full code example I'll show you is for an e-shop with one website, and one store view per store, for only two stores. To be clear, let me list a hypothetical 'Widgy Widgets' store, that has two stores: one for the United States and one for Germany (and a store view for each store with default languages):

```
_
├── Widgy Widgets Website
│   ├── USA Store (USD default currency)
│   │   └── USA Store View (English language)
│   └── Germany Store (EUR default currency)
│       └── Germany Store View (German language)
```

This is obviously a very basic configuration. You may have (or plan to have) more store views per store, or more stores per website, or even multiple websites! _Note that a default currency can **only** be set at the store or website level in Magento 2. Languages are typically set at the store view level, but can also be set at the store level and inherited in store views._

No worries! The code in this post is organized to scale easily no matter how many stores or store views you have.

## Software Logic and Process

So, back to the original task: we want to show the proper store, and automatically as well, based on their location. Sticking with our 'Widgy Widgets' example, if we detect the visitor's IP is from Germany, we want to show them the German store view. Likewise, if we see a US IP, we want to show the US store view. Let's say in default cases we show the US store.

We will use the ipstack API, [you can signup for free and get 10000 requests per month here](https://ipstack.com/product). 
***Full disclosure, this website and blog post are NOT sponsored by ipstack in any way!

To restate the process, there are two key steps:
1. Retrieve the customer's IP
2. Use that IP and call an API to get the user's location (for our purposes, we only needed country-level resolution, though this pattern of course works for any level of location - i.e. you could have separate store views per city, for example.)

The location detection and subsequent store setting should take place very early in the processing pipeline during a customer's visit to your website. In fact, since we will be potentially changing the store view, it _must_ occur before any controller fires - subsequent controllers in the pipeline may be using store information, and we want to make sure it is the correct store. This led us to put our store switching logic in a router.

Alright, sounds good! We can write our router to call the API for every page visit, and always set the store view! 

**Not so fast!**

What would that mean? We would be calling the API _every_ time a site was visited. It takes time to call this API, right? Let's see how long. For checking my own IP I get this for total time (in ms):

```bash
Lookup time:    0.061647
Connect time:   0.281195
AppCon time:    0.000000
Redirect time:  0.000000
PreXfer time:   0.281248
StartXfer time: 0.759128

Total time:     0.761387
```

(By the way, this command comes from my `supercurl` function, which you can find [on the snippets page.](/snippets#supercurl))

So we can say the API call is going to delay page rendering by _at least_ 50 ms per page visit. So ideally, we should do this only once per visitor. In 99% of situations, their IP won't be changing as they move from page to page on our site. This will ultimately reduce page loads (after the first visit), not to mention saving us on our ipstack monthly quota! We'll then need some sort of variable that is attached to our visitor's session. Then we can check this variable to see if it is set. We only call the geo IP API if it is set.

So how can we know when a visitor is visiting our shop for the first time? Surely Magento must have this functionality already. They do! It's in the `SessionManager` class, method `start()`. In this case, we can tap into when Magento 2 creates a session via an `after` plugin. The full plugin class looks like this: 

```php
<?php

namespace YourCompany\YourModule\Plugin\Session;

use Magento\Framework\Session\SessionManager;
use Magento\Framework\Session\StorageInterface;
use Magento\Framework\UrlInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Store\Model\StoreSwitcher\ManageStoreCookie;
use Psr\Log\LoggerInterface;
use YourCompany\YourModule\Api\GeolocationServiceInterface;

class SessionManagerPlugin
{
    /**
     * @var GeolocationServiceInterface
     */
    private $geolocationService;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var ManageStoreCookie
     */
    private $manageStoreCookie;
    /**
     * @var StorageInterface
     */
    private $storage;
    /**
     * @var StoreManagerInterface
     */
    private $storeManager;
    /**
     * @var UrlInterface
     */
    private $url;

    public function __construct(
        ManageStoreCookie $manageStoreCookie,
        UrlInterface $url,
        StoreManagerInterface $storeManager,
        GeolocationServiceInterface $geolocationService,
        StorageInterface $storage,
        LoggerInterface $logger
    )
    {
        $this->geolocationService = $geolocationService;
        $this->storage = $storage;
        $this->logger = $logger;
        $this->storeManager = $storeManager;
        $this->url = $url;
        $this->manageStoreCookie = $manageStoreCookie;
    }

    /**
     * After plugin for start() function of SessionManager
     * @param SessionManager $subject
     * @param SessionManager $result
     * @return SessionManager
     */
    public function afterStart(SessionManager $subject, SessionManager $result)
    {
        // get stored code from session storage
        $storedStoreCode = $this->storage->getData('store_code');

        // if set, simply continue plugin
        if (isset($storedStoreCode)) {
            return $result;
        }

        // otherwise, get the store code from the geo ip api and map the country
        $storeCode = $this->mapCountryCodeToStoreCode();
        $this->storage->setData('store_code', $storeCode);
        return $result;
    }

    /**
     * Maps a country code (found by geolocation IP) to a corresponding store code
     * @return string
     */
    private function mapCountryCodeToStoreCode(): string {
        $countryCode = $this->geolocationService->getCountryCodeByIp();

        // TODO: as an alternative to this switch statement, there could be mapper class of country code:store code
        // add countries and store codes as needed
        switch($countryCode) {
            case 'US':
                return 'us';
            case 'DE':
                return 'de';
            // ... more cases here ...
            // default as stated should be our US shop
            default:
                return 'us';
        }
    }
}
```

You probably noticed we have organized the actual geolocation work into `GeolocationService` (The interface `GeolcationServiceInterface` is trivial to implement, it only needs `getCountryCodeeByIp` in its contract - it's anyway included in the [example code repository](https://github.com/princefishthrower/example-magento-2-geo-ip-redirect)). Don't forget of course to include that in the `di.xml` which is also included in the repository.

Class `GeolocationService` looks like this:

```php
<?php

namespace YourCompany\YourModule\Service;

use Exception;
use Magento\Framework\Filesystem\DirectoryList;
use Magento\Framework\HTTP\Client\CurlFactory;
use Psr\Log\LoggerInterface;
use Magento\Framework\App\ResourceConnection;
use Magento\Framework\HTTP\Client\Curl;
use YourCompany\YourModule\Api\GeolocationServiceInterface;

class GeolocationService implements GeolocationServiceInterface
{
    /**
     * @var DirectoryList
     */
    private $dir;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var ResourceConnection
     */
    private $resourceConnection;
    /**
     * @var CurlFactory
     */
    private $curlFactory;

    /**
     * LocationRepository constructor.
     *
     * @param CurlFactory $curlFactory
     * @param ResourceConnection $resourceConnection
     * @SuppressWarnings(PHPMD.LongVariable)
     */
    public function __construct(
        DirectoryList $dir,
        LoggerInterface $logger,
        CurlFactory $curlFactory,
        ResourceConnection $resourceConnection
    )
    {
        $this->resourceConnection = $resourceConnection;
        $this->curlFactory = $curlFactory;
        $this->logger = $logger;
        $this->dir = $dir;
    }

    public function getCountryCodeByIp(): string
    {
        $ipAddress = $this->getClientIp();
        $this->logger->debug('IP address is: ' . $ipAddress);
        if ($ipAddress !== 'UNKNOWN') {
            return $this->getCountryCodeFromIpStack($ipAddress);
        }
        return '';
    }

    /**
    * @param string $ipAddress
    * @return string
    */
    private function getCountryCodeFromIpStack(string $ipAddress): string
    {
        $requestUrl = 'http://api.ipstack.com/' . $ipAddress . '?access_key=YOUR_ACCESS_KEY_HERE&fields=country_code';

        /** @var Curl $curl */
        $curl = $this->curlFactory->create();
        $curl->setTimeout(5);
        try {
            $curl->get($requestUrl);
            $body = $curl->getBody();
            $response = json_decode($body, true);
            if(isset($response['country_code'])) {
                $this->logger->debug($body);
                return strtoupper($response['country_code']);
            }
        } catch (Exception $ex) {
            return '';
        }
    }

    private function getClientIp()
    {
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
        else if (getenv('HTTP_X_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
        else if (getenv('HTTP_X_FORWARDED'))
            $ipaddress = getenv('HTTP_X_FORWARDED');
        else if (getenv('HTTP_FORWARDED_FOR'))
            $ipaddress = getenv('HTTP_FORWARDED_FOR');
        else if (getenv('HTTP_FORWARDED'))
            $ipaddress = getenv('HTTP_FORWARDED');
        else if (getenv('REMOTE_ADDR'))
            $ipaddress = getenv('REMOTE_ADDR');
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }
}
```

Don't forget to replace `YOUR_ACCESS_KEY_HERE` with your actual access key 😉

The private function `getClientIp()` was shamelessly copied from [this stack overflow question](https://stackoverflow.com/questions/15699101/get-the-client-ip-address-using-php/19189952). Read the comments there to see the caveats to this using this method. At the end of the day, you can never _definitively_ know where a customer is coming from; it can always be masked via VPN, for example. This code is a best guess. For 99% of users who are browsing the site as normal shoppers, this method of IP determination will work.

With this plugin written, we have a persistent value to check against to prevent spamming the API. We can write our router now, which will actually have the store-setting logic.

## The Router

In our router, we'll only need to inherit from a basic `RouterInterface`. The router logic looks like this:

```php
<?php

namespace YourCompany\YourModule\Router;

use Magento\Framework\App\ActionFactory;
use Magento\Framework\App\RouterInterface;
use Magento\Framework\Session\StorageInterface;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Store\Model\StoreSwitcher\ManageStoreCookie;
use Psr\Log\LoggerInterface;

class GeoIpRouter implements RouterInterface
{
    /**
     * @var ActionFactory
     */
    private $actionFactory;
    /**
     * @var LoggerInterface
     */
    private $logger;
    /**
     * @var ManageStoreCookie
     */
    private $manageStoreCookie;
    /**
     * @var StorageInterface
     */
    private $storage;
    /**
     * @var StoreManagerInterface
     */
    private $storeManager;

    public function __construct(
        ManageStoreCookie $manageStoreCookie,
        StoreManagerInterface $storeManager,
        StorageInterface $storage,
        ActionFactory $actionFactory,
        LoggerInterface $logger
    )
    {
        $this->actionFactory = $actionFactory;
        $this->storage = $storage;
        $this->logger = $logger;
        $this->storeManager = $storeManager;
        $this->manageStoreCookie = $manageStoreCookie;
    }

    /**
     * For any page, ensure current store is set properly
     *
     * @param \Magento\Framework\App\RequestInterface $request
     * @return \Magento\Framework\App\ActionInterface|null
     */
    public function match(\Magento\Framework\App\RequestInterface $request)
    {
        // get store code from store_code storage value
        $storeCode = $this->storage->getData('store_code');

        // Loop at all stores until (or if!) we find a matching store code
        $stores = $this->storeManager->getStores();
        foreach ($stores as $store) {
            if ($store->getCode() === $storeCode) {
                $this->storeManager->setCurrentStore($store);
                break;
            }
        }

        return null;
    }
}
```

Keep in mind this isn't a router in the _true_ sense since we're not routing to any specific controller. 

However, since the call to `setCurrentStore()` must occur before any controller is executed, I believe it must exist in a router. If you have a better alternative, please shoot me an email at `frewin.christopher@gmail.com`. 

You may also want to add a default case after the `foreach` if you don't find a matching store, but that can anyway be configured admin - simply ensure your default store is correct, and Magento will use that store context if `setCurrentStore()` is never touched in the router.

Also note that we only set the store level context, not the store _view_ context. In our example, this is fine, since we have only one store view per store. But if you have multiple store views per store, you could go on to add another filter based on the visitor's browser preferred language, for example, if you have multiple store views per language under a store. [Some hints on how to get the user's preferred browser language are here](https://stackoverflow.com/questions/3770513/detect-browser-language-in-php).

## Thanks!

That's about it for this one. We've built a SessionManager plugin and a router to dynamically set the correct Magento 2 store context via ipstack's Geo IP API, using our shopper's location. 

Please let me know of any errors or issues by sending me an email at <a href="mailto:frewin.christopher@gmail.com">frewin.christopher@gmail.com</a>

Cheers! 🍺

-Chris