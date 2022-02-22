using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Shouldly;

namespace AssertPropertiesAreNonNullExample {
    public static class AssertPropertiesAreNonNullService
    {
        // Asserts that all required properties (via the 'Required' attribute) be non null
        // Optionally include all properties if desired
        private static void AssertPropertiesAreNonNull<T>(T obj, bool onlyRequiredProperties = true)
        {
            if (obj == null)
            {
                return;
            }

            var objType = obj.GetType();

            // Get either all or only required properties
            var properties = onlyRequiredProperties ? objType.GetProperties()
                .Where(x => x.GetCustomAttributes(false).OfType<RequiredAttribute>().Any()) : 
            objType.GetProperties();

            foreach (var property in properties)
            {
                var propValue = property.GetValue(obj, null);
                var elems = propValue as IList<object>;

                // Another layer 
                if (elems != null)
                {
                    foreach (var item in elems)
                    {
                        AssertPropertiesAreNonNull(item, onlyRequiredProperties);
                    }
                }
                else
                {
                    if (property.PropertyType.Assembly == objType.Assembly)
                    {
                        AssertPropertiesAreNonNull(propValue, onlyRequiredProperties);
                    }
                    // Reached the end of the tree
                    else
                    {
                        propValue.ShouldNotBeNull();
                    }
                }
            }
        }
    }
}