---
title: "A Robust Way to Secure and Filter Operations on Your JSON Patch Documents in C# .NET Core"
description: Robust, Secure, and Leveraging Generics to Boot!
date: "2020-10-10"
---

The full implementation looks like this:

```csharp
namespace Imitate.Infrastructure
{
    using System;
    using System.Linq;
    using Microsoft.AspNetCore.JsonPatch;

    public static class PatchFilterer
    {
        // TODO: this really could just be a standalone function, but I don't know how to import / export functions in C#
        public static JsonPatchDocument<T> ApplyAttributeFilterToPatch<T, TU>(JsonPatchDocument<T> patch)
        where T : class
        where TU : Attribute
        {
            // get a JSONPatch compatible path for all attributes of type TU from type T
            var allowedPaths = typeof(T)
                .GetProperties()
                .Where(x => x.GetCustomAttributes(false).OfType<TU>().Any())
                .Select(x => x.Name);

            // now build a new filtered patch based on the allowed paths found
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