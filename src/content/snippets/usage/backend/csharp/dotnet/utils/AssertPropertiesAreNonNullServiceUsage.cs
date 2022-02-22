using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using AssertPropertiesAreNonNullService;

public class SomethingNested
{
	[Required]
	public string SomeString { get; set; }

	[Required]
	public int SomeNumber { get; set; }

	public bool SomeBoolean { get; set; }

	public List<string> SomeStringList { get; set; }

}

public class MyWidget
{
	[Required]
	public SomethingNested SomethingNested { get; set; }

	public string SomeString { get; set; }

	public int SomeNumber { get; set; }

	public bool SomeBoolean { get; set; }

	[Required]
	public List<string> SomeStringList { get; set; }
}

public class Program
{
	public static void Main()
	{
		// Declare some object you want to check for null values
		var myWidget = new MyWidget
		{
			SomethingNested = new SomethingNested
			{
				SomeString = null,
				SomeNumber = 123,
				SomeBoolean = true,
				SomeStringList = new List<string> { "a", "b", null }
			},
			SomeString = null,
			SomeNumber = 123,
			SomeBoolean = true,
			SomeStringList = null
		};

		// Only run for required properties of myWidget
		AssertPropertiesAreNonNullService.AssertPropertiesAreNonNull(myWidget);
		
		// Run for ALL properties in myWidget
		AssertPropertiesAreNonNullService.AssertPropertiesAreNonNull(myWidget, false);
	}
}