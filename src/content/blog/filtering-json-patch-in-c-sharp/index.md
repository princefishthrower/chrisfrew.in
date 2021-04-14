---
title: "C# .NET Core and TypeScript: Using Generics and LINQ to Secure and Filter Operations on Your JSONPatchDocuments"
description: "Full stack: React with TypeScript frontend, .NET backend!"
date: "2020-11-23"
tags: csharp,.NET,typescript
---

_This post is mirrored on my [Medium Account](https://chrisfrewin.medium.com/c-net-core-and-typescript-using-generics-and-linq-to-secure-and-filter-operations-on-your-e85e23e065c3) and my [DEV Community Account](https://dev.to/fullstackchris/c-net-core-and-typescript-using-generics-and-linq-to-secure-and-filter-operations-on-your-jsonpatchdocuments-4cl4)._

# Show Me the Code!

As always, the code is in the [example repository](https://github.com/princefishthrower/json-patch-filter-example).

I've also hosted the repository as an [example site](https://chrisfrew.in/json-patch-filter-example/). 

**Please be respectful with the example site, just give it a test to see how it works. Spam and other nonsense will be quickly dealt with.**

I've named the .NET project `JsonPatchFilterExample`, and all the namespaces in the code snippets below reflect that. If you start up the code in the repository, you'll have your browser open up right away with the working, real-time edit form!

_*Note that the code in the example repository was originally created with .NET 5. I'm not sure if you can simply start the project up if you don't have 5 installed._

# Motivation

In a recent project, I had to implement an edit form to edit various properties of existing entities. The form itself would only show a subset of all the fields in the entity. For the sake of simplicity, let's say the model we wish to modify is called `WidgetModel`, and looks like this:

```csharp
using System;
using System.ComponentModel.DataAnnotations;

namespace JsonPatchFilterExample.Models
{
    public class WidgetModel
    {
        [Required]
        public Guid Id { get; set; }

        [Required]
        [StringLength(128, MinimumLength = 2)]
        public string Title { get; set; }

        [Required]
        [StringLength(1000, MinimumLength = 2)]
        public string Description { get; set; }

        [Required]
        public DateTime Updated { get; set; }

        [Required]
        public DateTime Created { get; set; }
    }
}
```

We wanted to allow edits on the `Title` and `Description` fields only. (The `Updated` field updates itself internally).

# Using the Correct HTTP Method for Editing

An initial API controller I wrote was a `POST` endpoint - we're creating an entity right? Well, not really. We're only _editing_ the entity. Attributes like the `Id` and `Creation` date time should not be touched. We only want to allow modifying attributes like the `Title` and `Description` as stated above.

Such an action is also not a `PUT`, since we are not replacing the object. 

The most correct HTTP method for this operation is a `PATCH`. 

`PATCH` is rather rare. How can we send commands of exactly what we want done to our object. There must be a standard, right?

# Enter JSON Patch and JSONPatchDocument

A great (and now standard) way of modifying objects exactly like our `WidgetModel` is via a `JSON Patch`. This is a JSON way of describing changes, or 'operations' as they are known, on the object of interest. 

Some examples of these operations are shown on the official [JSON Patch website](http://jsonpatch.com/). 

I was amazed yet again by the powers of .NET: Microsoft has gone a step further and created their own `JSONPatchDocument<T>`, where `T` is any model that you want to modify via a `PATCH` request. 

You'll need the `Microsoft.AspNetCore.JsonPatch` NuGet package to use it:

`dotnet add package Microsoft.AspNetCore.JsonPatch`

You'll also need the `Microsoft.AspNetCore.Mvc.NewtonsoftJson` package as well:

`dotnet add package Microsoft.AspNetCore.Mvc.NewtonsoftJson`

and then to add `AddNewtonsoftJson()` after the `AddControllersWithViews()` call in your `Startup.cs` file:

```csharp
services.AddControllersWithViews().AddNewtonsoftJson();
```

To me these last two steps related to the `Microsoft.AspNetCore.Mvc.NewtonsoftJson` package seem unclear in their necessity, but without them I ran into the same error as referenced [in this GitHub thread](https://github.com/dotnet/aspnetcore/issues/13938). 

In short, without them, .NET was unable to serialize the `JSONPatchDocument` into the model instance.

# Finally: Our Problem

**In the [JSON Patch specification](https://tools.ietf.org/html/rfc6902) there is no security layer built-in.**

According to the specification, _any_ field can be specified in these 'operations' and its value can be modified or even deleted. 

Notice that in our `WidgetModel`, even if we wish to show only the `Title` and `Description` fields as form fields on the client, it's trivial for a bad actor to call the API endpoint and send other information with it - such as sending a different `Id` or modifying the `Creation` field. 

The challenge? We'll have to build our own way of filtering out these unwanted fields from the JsonPatchDocument - to ensure they can't be modified.

# Enter: Generics

As soon as you are doing `PATCH` requests and updating entities on a website, it's likely you'll need similar JSON Patch operations on multiple models. We can use generics in such a way that our filtering can be reused and applied to:

1. any model of type `T`

and 

2. any attribute on that model of type `TU`

# The PatchFiltererService

In the end, the full implementation I arrived at looks like this:

```csharp
using System;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch;

namespace JsonPatchFilterExample.Services
{
    public static class PatchFiltererService
    {
        public static JsonPatchDocument<T> ApplyAttributeFilterToPatch<T, TU>(JsonPatchDocument<T> patch)
        where T : class
        where TU : Attribute
        {
            // Get path for all attributes of type TU that are in type T
            var allowedPaths = typeof(T)
                .GetProperties()
                .Where(x => x.GetCustomAttributes(false).OfType<TU>().Any())
                .Select(x => x.Name);

            // Now build a new JSONPatchDocument based on properties in T that were found above
            var filteredPatch = new JsonPatchDocument<T>();
            patch.Operations.ForEach(x =>
            {
                if (allowedPaths.Contains(x.path))
                {
                    filteredPatch.Operations.Add(x);
                }
            });

            return filteredPatch;
        }
    }
}
```

We first look at the model of type `T`, getting all attributes on the type, and then using LINQ with a `Where` command to keep only those properties which have the attribute of type `TU`. We then only keep the name of the property itself.

With those names, we create a _new_ `JSONPatchDocument`, of type `T`, which will only keep those operations which have the name. (If the `path` component of the JSON Patch is found in `allowedPaths`). We then return that new `JSONPatchDocument`.

_Small side note:_ You'll notice here I am just reading and writing to a JSON file in the `App_Data` folder as a makeshift database. In a production scenario you'd have a repository that would be doing all the database operations, but doing all that stuff is outside the scope of this blog post. 

Also note for this juggling of JSON data I use the tasty `Newtonsoft.Json` package:

`dotnet add package Microsoft.AspNetCore.JsonPatch`

but by cloning and running the code [from the repository](https://github.com/princefishthrower/json-patch-filter-example) you'll already have this NuGet package installed. 😊

# Using the PatchFiltererService

For our use case, type `T` is the `WidgetModel` and type `TU` is the `StringLengthAttribute` type. We are able to use the `StringLengthAttribute` as the attribute type to filter on, since it just so happens that the only attributes we want to be modified have the `StringLengthAttribute` attribute. In our controller we can write:

```csharp
patch = PatchFiltererService.ApplyAttributeFilterToPatch<WidgetModel, StringLength>(patch);
```

The full API controller method looks like this:

```csharp
[HttpPatch("{id}")]
public ActionResult Patch(Guid id, [FromBody] JsonPatchDocument<WidgetModel> patch)
{
    try
    {
        // For now, load the widget from the json file - ideally this would be retrieved via a repository from a database
        var physicalProvider = new PhysicalFileProvider(Directory.GetCurrentDirectory());
        var jsonFilePath = Path.Combine(physicalProvider.Root, "App_Data", "ExampleWidget.json");
        var item = new WidgetModel();
        using (var reader = new StreamReader(jsonFilePath))
        {
            var content = reader.ReadToEnd();
            item = JsonConvert.DeserializeObject<WidgetModel>(content);
        }
        if (item.Id != id || patch == null)
        {
            return NotFound();
        }

        // Create a new patch to match only the type and attributes passed
        patch = PatchFiltererService.ApplyAttributeFilterToPatch<WidgetModel, StringLengthAttribute>(patch);

        // Apply the patch!
        patch.ApplyTo(item);

        // Update updated time - normally would be handled in a repository
        item.Updated = DateTime.Now;

        // Update the item - ideally this would also be done with a repository via an 'Update' method
        // write JSON directly to a file
        var json = JsonConvert.SerializeObject(item);

        //write string to file
        System.IO.File.WriteAllText(jsonFilePath, json);

        return Ok();
    }
    catch
    {
        return UnprocessableEntity();
    }
}
```

# Bonus \#1: The Editable Attribute

So far, the examples use the `StringLengthAttribute` type to keep properties of interest. While it works for our `WidgetModel`, it's only by luck really that we're able to use it to keep only the `Title` and `Description` fields.

We can do better: we can leverage yet another built-in attribute of .NET - the `Editable` attribute. In this case, our `WidgetModel` might look something like this:

```csharp
namespace JsonPatchFilterExample.Models
{
    using System;
    using System.ComponentModel.DataAnnotations;

    public class WidgetModel
    {
        [Required]
        [Editable(false)]
        public Guid Id { get; set; }

        [Required]
        [Editable(true)]
        [StringLength(128, MinimumLength = 2)]
        public string Title { get; set; }

        [Required]
        [Editable(true)]
        [StringLength(1000, MinimumLength = 2)]
        public string Description { get; set; }

        [Required]
        [Editable(false)]
        public DateTime Updated { get; set; }

        [Required]
        [Editable(false)]
        public DateTime Created { get; set; }
    }
}
```

In such a case, we would set the `Editable(true)` attribute specifically for the fields that should be editable for the frontend. Then, our `ApplyAttributeFilterToPatch` call would look like this:

```csharp
patch = PatchFilterer.ApplyAttributeFilterToPatch<WidgetModel, Editable(true)>(patch);
```

# Bonus \#2: Frontend Stuff

While I won't go into too much detail about the implementation in the React Typescript frontend, I'll show two key interfaces that help you play with JSON Patch on the frontend.

First, the operation types themselves, which I've made as an `enum`:

```typescript
/**
 * @description RFC 6902 compliant enum for allowed JSON Patch operations. See http://jsonpatch.com/ for details.
 */
enum JSONPatchOperationType {
    Add = "add",
    Remove = "remove",
    Replace = "replace",
    Copy = "copy",
    Move = "move",
    Test = "test"
}

export default JSONPatchOperationType;
```

and, the interface for an actual operation:

```typescript
import JSONPatchOperationType from "./JSONPatchOperationType";

/**
 * @description RFC 6902 compliant interface for a JSON Patch Operation. See http://jsonpatch.com/ for details.
 */
export default interface JSONPatchOperation {
    op: JSONPatchOperationType;
    path: string;
    value: string;
}
```

We can then build an array of one or more `JSONPatchOperation`s, and .NET will do the rest of the detection since we've put `[FromBody] JsonPatchDocument<WidgetModel> patch`. 

On the frontend we can do that like so:

```typescript
let requestObject: JSONPatchOperation[] = [{
    op: JSONPatchOperationType.Replace,
    path: propertyName,
    value: debouncedValue
}];

await apiService.patch(
    requestObject,
    () => {
        setEditState(EditStatus.Saved);
        setTimeout(() => setEditState(EditStatus.Idle), 1500)
    },
    (error) => {
        setEditState(EditStatus.Error);
    }
);
```

**.NET will serialize the JSON Patch(es) to their respective model instances at runtime!**

From there, we've built a few editor field components which take a given endpoint to modify an entity and show an `EditStatus` enum. There's also an `ApiService` service class that helps abstract the `fetch` calls out of our components. Check it all out in the [example repository](https://github.com/princefishthrower/json-patch-filter-example)!

# Thanks!

As always, thanks for reading and stay tuned - I've always got more blog posts in the pipeline - and they're always for stuff that was hard to dig up or figure out the first time, so the next dev that comes around has an easier time!

🌊 A rising tide lifts all boats. 🛶

Cheers! 🍺

-Chris