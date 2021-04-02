using System;
using System.Linq;
using Microsoft.AspNetCore.JsonPatch;

namespace JsonPatchFilterExample.Services
{
    // a security filter for JSON patch filter operations
    // see the full blog post at https://chrisfrew.in/blog/filtering-json-patch-in-c-sharp/
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