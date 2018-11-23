---
title: Jump to Web GUI Using SAPUI5 Or OpenUI5
date: "2018-11-23"
draft: false
---
Jumping to the Web GUI from a SAPUI5 app can be helpful, since it will keep your user all in the same app (their browser), and they won't have to jump back and forth between the traditional native GUI and the browser.

This will also be a bit of a BONUS post, because I'm going to show you _two_ specific examples of how to jump to the SAP Web GUI from a SAPUI5 or OpenUI5 app! These functions will be:

1. Display a production or processing order (Transaction CO03 for Production Orders, Transaction COR3 for Process Orders) 
and
2. To the documented goods movements of a production or processing order (Transaction COOIS for Production Orders, Transaction COOISPI for Process Orders)

## The Challenge with Web GUI

Passing commands to Web GUI transactions are, in the least... weird. The good news is that they are all URL parameters, no complex objects to deal with. You can read more about them [in SAP's documentation](). 

### General Skeleton of a Web GUI Link

Under a normal install, the SAP Web GUI should sit in the Gateway path `/sap/bc/gui/sap/its/webgui`. We then add a `?` to tell Web GUI it is a query. Then we provide the transaction code by means of `~transaction=`. Finally, we provide the web dynpro with various parameters about which fields in that transaction to fill, each seperated by the encoded HTML space string `%20` If you are familiar with batch data communication, or BDC, you will be familiar with working with these fields. For example as we will see below, the 

The last important thing is the base URL, which comes before that Gatway apth `/sap/bc/gui/sap/its/webgui` in the URL. This has to be dynamically generated if you have the typical chain of DEV, QAS, and PRD systems as part of your SAP instance, since the URL will be different. For example, if the company is 'Super Cool Company', the URLs of the 3 sites might look like this:

`https://super-cool-company-sap-dev.com/sap/bc/gui/sap/its/webui/`
`https://super-cool-company-sap-qas.com/sap/bc/gui/sap/its/webui/`
`https://super-cool-company-sap-prd.com/sap/bc/gui/sap/its/webui/`

and a full Web GUI URL (let's say we want to fill the material field for the display material transaction MM03 with material 123456, in the test system QAS):

https://super-cool-company-sap-qas.com/sap/bc/gui/sap/its/webui/~transaction=MM03%20RMMG1-MATNR=123456

all you need to do is change the base URL (super-cool-company-sap-qas.com) to your system and it should work! As a bonus, if you want to skip the first screen of MM03 and go right into the details with that material, you can use a URL like this:

https://super-cool-company-sap-qas.com/sap/bc/gui/sap/its/webui/~transaction=\*MM03%20RMMG1-MATNR=123456

If you have eagle eyes, you'll see the only difference is the `*` before the transaction name. This is what tells Web GUI to skip the first screen. (I know, I told you, Web GUI commands are weird!)

So, in the two examples below, I'll show you what view control to build first, and then I'll show the code from the controller. Then we'll put them into the SAP standard name convention of an `onPress{whateverfunctionname}` function. So, let's hop right into the code for these two functionalities!

## 1. Jump to Goods Movements for an Order (COOIS or COOISPI)

### View Code (XML)

First let's make our view control for this. We'll make it simple: a `<Button>` control you could drop in anywhere easily. Here's what I used:

```xml
<Button icon="sap-icon://action" text="Jump to goods movements in SAP Web GUI" press="onPressJumpToGoodsMovements" data:Aufnr="{Aufnr}" data:Auart="{Auart}"/>
```

Note for this view we'll need the `data:` namespace, so add the following to the top of your view file:

```xml
<mvc:View ... xmlns:data="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1" ... >
```

### Controller Code (JavaScript)

```javascript
onPressJumpToGoodsMovements: function(oEvent) {
  var sAufnr = oEvent.getSource().data("Aufnr"); // for now the order number (AUFNR) and order type (AUART) are coded as if they were already in the source button data, but you could get these from a sapui5 model or similar
  var sAuart = oEvent.getSource().data("Auart");
  var sTcode = "";
	var sHost, sAufnrParameter, sLink;
  var sViewParameter = "%20PPIO_ENTRY_SC1100-PPIO_LISTTYP=PPIOD000;%20"; // same for both types of orders

  // host determination
  if (window.location.hostname.includes("clu10") || window.location.hostname.includes("prd")) {
  	sHost = "http://your-prd-site.whatever/sap/bc/gui/sap/its/webgui?";
  } else if (window.location.hostname.includes("clu20") || window.location.hostname.includes("qas")) {
  	sHost = "http://your-qas-site.whatever/sap/bc/gui/sap/its/webgui?";
  } else if (window.location.hostname.includes("dev") || window.location.hostname.includes("webide")) {
  	sHost = "http://your-dev-site.whatever/sap/bc/gui/sap/its/webgui?";
  }
  if (sAuart === "PP01") { // standard production order 
		sTcode = "~transaction=*COOIS"; // asterisk is to skip initial screen
		sAufnrParameter = "S_AUFNR-LOW=" + sAufnr;
	if (sAuart === "PI01") // process order, internal 
		sTcode = "~transaction=*COOISPI"; // asterisk is to skip initial screen
		sAufnrParameter = "S_PAUFNR-LOW=" + sAufnr;
	}
	if (sTcode === "") { // if we don't have a tcode, the given type isn't supported yet
		MessageToast.show("Order type " + sAuart + " not yet supported!");
		return;
	}
	sLink = sHost + sTcode + sViewParameter + sAufnrParameter;
	window.open(sLink); // open link in new tab
}
```

and that line

```javascript
sLink = sHost + sTcode + sViewParameter + sAufnrParameter;
```

looks in total like this: 

```
http://your-qas-site.whatever/sap/bc/gui/sap/its/webgui?~transaction=*COOIS%20PPIO_ENTRY_SC1100-PPIO_LISTTYP=PPIOD000;%20S_PAUFNR-LOW=123456
```

Go and give that a try in your browser! (After changing that phony base url first!)

## 2. Jump to the Production or Processing Order Details (CO03 or COR3)

### View Code (XML)

Again, we'll use a button, and again it will look very similar to the 'show order' view control:

```xml
<Button icon="sap-icon://action" text="Jump to order details in SAP Web GUI" press="onPressJumpToOrderDetails" data:Aufnr="{Aufnr}" data:Auart="{Auart}"/>
```

### Controller Code (JavaScript)

```javascript
onPressJumpToOrderDetails: function (oEvent) {
	var sAufnr = oEvent.getSource().data("Aufnr");
	var sAuart = oEvent.getSource().data("Auart");
	var sTcode = "";
	var sHost, sAufnrParameter, sLink;

	// host determination
	if (window.location.hostname.includes("clu10") || window.location.hostname.includes("prd")) {
		sHost = "http://your-prd-site.whatever:8001/sap/bc/gui/sap/its/webgui?";
	} else if (window.location.hostname.includes("clu20") || window.location.hostname.includes("qas")) {
		sHost = "http://your-qas-site.whatever/sap/bc/gui/sap/its/webgui?";
	} else if (window.location.hostname.includes("dev") || window.location.hostname.includes("webide")) {
		sHost = "http://your-dev-site.whatever/sap/bc/gui/sap/its/webgui?";
	}
	
	if (sAuart === "PP01") { // standard production order
		sTcode = "~transaction=*CO03%20"; // asterisk is to skip initial screen
	} 
	if (sAuart === "PI01") { // process order, internal
		sTcode = "~transaction=*COR03%20"; // asterisk is to skip initial screen
	}
	if (sTcode === "") {
		MessageToast.show("Order type " + sAuart + " not yet supported!");
		return;
	}
	sAufnrParameter = "CAUFVD-AUFNR=" + sAufnr; // this is the same for transactions CO03 and COR03
	sLink = sHost + sTcode + sAufnrParameter;
	window.open(sLink); // open link in new tab
}
```

Like the first example, the generated link should also be callable in your browser (provided the link points to your local Web GUI instance and the order exists!)

If you'd like, request a boilerplate repo and I'll put one together on GitHub real quick - I was feeling a bit lazy and didn't feel like putting one together. Just send me an email!

That's it for this post! Hope it was helpful!

Cheers! :beer:

-Chris


