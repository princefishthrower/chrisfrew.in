---
title: Using a Fluent Interface to Ease The Pain of SOAP Calls
description:
date: "2019-02-27"
draft: true
starID: 500
postType: dev
---

# The Stack's Changed, Dude!

<sub>_Yes, I know, it's been a while - but I've been totally clocked at work and I've also started writing a react native app on the side which I'm hoping to release in beta around end of March / early April - more info coming soon!_</sub>

So, in the [dev](https://chrisfrew.in/?post-type=dev) posts on this blog I usually talk about JavaScript, React, Redux, and what have you. 

But for work I'm currently in a PHP stack, where we're to link an E-commerce store in Magento to SAP By Design's database. While this presents a myriad of challenges in terms of real-time syncing on its own, I'm going to talk about the implementation details of some of the getters and setters that we will use internally on the Magento side. For example, when a new user registers on the shop, we need to set all their data on the SAP By Design side. I think we've created an elegant solution, and it uses a fluent interface!

# What is a Fluent Interface?

A fluent interface `is a method for designing object oriented APIs based extensively on method chaining with the goal of making the readability of the source code close to that of ordinary written prose, essentially creating a domain-specific language within the interface.` ([Wikipdia](https://en.wikipedia.org/wiki/Fluent_interface))

Fluent interfaces have been around since the 70s, but the most recent articles / blog posts i found on the topic [a C# one](https://www.red-gate.com/simple-talk/dotnet/net-framework/fluent-code-in-c/) and a [PHP critique one](https://ocramius.github.io/blog/fluent-interfaces-are-evil/)- were both published in 2013 - so I don't know, was there a conference or something that caused fluent concepts to rise to the surface of the internet again?

So fluent interfaces... yeah! Let's say we are tasked to set a users belt length, shoe size, and address Instead of something like this, which is perfectly fine, clean code, and which you have likely seen, or even written yourself (guilty):

```php
$customerObject = new customer('123456');
$customerObject->setBeltLength('180cm');
$customerObject->setShoeSize('180cm');
$response = callSoap($customerObject);
$parsedResponse = parseResponse($response);
```

(Since the original project is in PHP, i'll be keeping my snippets likewise in PHP - I hope that's ok :smile:.)

We could implement a fluent interface for these actions and write it like this:

```php
$parsedResponse = initializeCustomerObject('123456') // accepts customer ID, returns customer object
          ->setBeltLength('180cm') // accepts customer object, returns customer object
          ->setShoeSize('42') // ibid
          ->callSOAPAndParseResponse(); // accepts customer object, returns SOAP response
```

Note that these code snippets are only at the very top level implementation (we will look at the horrible internal function chaining down below). 

As we will see, not only does the code look and feel better on the top side, but the actual implementing class behind-the-scenese will also be much, much cleaner by leveraging the fluent method.

# Still, why Fluent?

It's still probably not totally clear why we chose to opt for a fluent implementation. 

SAP By Design uses a SOAP interface to interact with the data programmatically. To generated PHP classes from the WSDL interfaces, we used this excellent tool called [wsdl2phpgenerator](https://github.com/wsdl2phpgenerator/wsdl2phpgenerator), which generates php classes for a given WSDL file. The good thing with SOAP is (I'll grudgingly admit it, as much as I like to think it is a kind of stone-age technology) that it is an immutable fixed-version API. Indeed, things can be updated for SAP By Design's API, but the WSDL interface that YOU are using is a fixed interface. That means for that interface (if SAP is maintaining good SOAP standards :wink:), you can call any method on SAP's side and be sure to get a response in the given response format - even if the WSDL is a few years old. 

With all of that said, while SOAP is a 'rock-solid' API, _because_ it is 'rock-solid', the generated classes for a given WSDL file interface are extremely type specific, leave you to construct really annoying method chaining to finally drill down to the things you need, which for us 99% of the time  _very_ simple actions, such as setting a user's shoe size, address, and things like that. Just to show you how comical this is I managed to find a kind of worst-case scenario example of this necessary method chaining, in address retrieval:

`$customerResponseMessage_sync->getCustomer()[0]->getAddressInformation()[0]->getAddress()->getFormattedAddress()->getFormattedAddress()->getFirstLineDescription()`

We won't go into that example in this post, but after doing enough of this method chaining and object constructing, I began to notice that all my setter methods looked something like this (we will look at three methods for completeness: `setBeltLength` and `setShoeSize`; `setMaintenceCustomer` is just a helper function to initialize a user object):

```php
public function setMaintenanceCustomer(string $internalID) 
{
    $customerMaintainRequestBundleCustomer_V1 = new CustomerMaintainRequestBundleCustomer_V1(); 
    $customerMaintainRequestBundleCustomer_V1->setInternalID($internalID);
    return $customerMaintainRequestBundleCustomer_V1;
}
public function setBeltLength(string $internalID, string $beltSize)
{
    $customerMaintainRequestBundleCustomer_V1 = $this->setMaintenceCustomer($internalID);
    $customerMaintainRequestBundleCustomer_V1->setBelt_Length($beltSize);

    $customerBundleMaintainRequestMessage_sync_V1 = new CustomerBundleMaintainRequestMessage_sync_V1();
    $customerBundleMaintainRequestMessage_sync_V1->setCustomer([$customerMaintainRequestBundleCustomer_V1]); // can be array of customers

    $customerBundleMaintainConfirmationMessage_sync_V1 = $this->soapService->MaintainBundle_V1($customerBundleMaintainRequestMessage_sync_V1);
    $customerBundleMaintainConfirmationMessage_sync_V1->getLog()->getMaximumLogItemSeverityCode();
}
public function setShoeSize(string $internalID, string $shoeSize)
{
    $customerMaintainRequestBundleCustomer_V1 = $this->setMaintenceCustomer($internalID);
    $customerMaintainRequestBundleCustomer_V1->setShoe_Size($shoeSize);

    $customerBundleMaintainRequestMessage_sync_V1 = new CustomerBundleMaintainRequestMessage_sync_V1();
    $customerBundleMaintainRequestMessage_sync_V1->setCustomer([$customerMaintainRequestBundleCustomer_V1]); // can be array of customers

    $customerBundleMaintainConfirmationMessage_sync_V1 = $this->soapService->MaintainBundle_V1($customerBundleMaintainRequestMessage_sync_V1);
    $customerBundleMaintainConfirmationMessage_sync_V1->getLog()->getMaximumLogItemSeverityCode();
}
// can you guess what the 'setAddress' function looks like? :joy:
```

You can see in each function, there is only a single internal SOAP function that is _actually_ in the snippets above, those are `setBelt_length` and `setShoe_Size` methods, respectively. 

ALL the other code is just SOAP fluff, creating the proper objects in order to have the correct typing for the method call we need to use! 

In this case then, a fluent interface would make sense, for quite a few reasons:

- it removes all that enormous code 'fluff' from the WSDL methods - which in plain methods would be pretty much outside of our control because they are generated by `wsdl2phpgenerator`
- it removes coupling from the methods - we don't need to pass in internalID every time, AND we seperate calling SOAP into it's own function, instead of calling it in each `set` method (agreed, partly my fault which could have been avoided in the first version implementation - but at least with fluent it is totally out of the question)
- it prevents us from creating extra `new()` objects.  For each method, we are only doing exactly what the method suggests; we aren't calling the SOAP service, we aren't parsing response errors. This is generally good; helping us enforce the (single responsibility principle)[https://en.wikipedia.org/wiki/Single_responsibility_principle]
- it makes it trivial to chain different getters and setters together. As the site grows, we may find a need to have an exotic chaining of methods to complete a particular task, which, when we are done with the fluent interface, will be trivial to write the code for.

# Alright, Show Me the Fluent Implementation!

Rewritten to fluent, those methods look as follows:

```php
...
private $maintenanceCustomer;
...
public function setMaintenanceCustomer(string $internalID) {
    $customerMaintainRequestBundleCustomer_V1 = new CustomerMaintainRequestBundleCustomer_V1(); // this has a HUGE constructor, don't know if all fields are mandatory
    $customerMaintainRequestBundleCustomer_V1->setInternalID($internalID);
    $this->maintenanceCustomer = $customerMaintainRequestBundleCustomer_V1;
    return $this;
}
public function setBeltLength(string $beltSize)
{
    $this->maintenanceCustomer->setBelt_Length($beltSize);
    return $this;
}
    
public function setShoeSize(string $shoeSize)
{
    $this->maintenanceCustomer->setShoe_Size($shoeSize);
    return $this;
}

public function callSOAPAndParseResponse() {
    $customerBundleMaintainRequestMessage_sync_V1 = new CustomerBundleMaintainRequestMessage_sync_V1();
    $customerBundleMaintainRequestMessage_sync_V1->setCustomer([$this->maintenanceCustomer]); // can be array of customers
    $customerBundleMaintainConfirmationMessage_sync_V1 = $this->soapService->MaintainBundle_V1($customerBundleMaintainRequestMessage_sync_V1);
    return $customerBundleMaintainConfirmationMessage_sync_V1->getLog()->getMaximumLogItemSeverityCode();
}
```

By introducing a private variable $maintenanceCustomer, slightly modifying `setMaintenanceCustomer`, and adding a new method, `callSOAPAndParseResponse`, we reduce our setter methods to single parameter, 2 line functions :smile:. Not bad!

# Bonus Extension

Another fluent opportunity presents itself. We may later decide to improve our error handling and separate it out completely from `callSOAPAndParseResponse` - perhaps into `callSOAP` and `parseResponse`. I would add another private variable `$confirmationMessage` and make that the return signature of callSoap:

```php
public function callSOAP() {
    $customerBundleMaintainRequestMessage_sync_V1 = new CustomerBundleMaintainRequestMessage_sync_V1();
    $customerBundleMaintainRequestMessage_sync_V1->setCustomer([$this->maintenanceCustomer]); // can be array of customers
    $customerBundleMaintainConfirmationMessage_sync_V1 = $this->soapService->MaintainBundle_V1($customerBundleMaintainRequestMessage_sync_V1);
    $this->confirmationMessage = $customerBundleMaintainConfirmationMessage_sync_V1;
    return $this;
}
public function parseResponse() {
    $severityCode = $this->confirmationMessage->getLog()->getMaximumLogItemSeverityCode();
    $messages = $this->confirmationMessage->getLog()->getMessages();
    ...
    // even more fancy log parsing / error handling...
    ...
    return;
}
```

In any case, while the fluent method has been around for a while, the fluent methodology definitely has value - and I think my code snippets illustrate that fact pretty well! :smile:

Enjoy, and Cheers! :beer:

-Chris