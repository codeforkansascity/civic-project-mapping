This code is based of of Tom Kompare's https://github.com/tkompare/flushots2013.  

This is a volunteer effort of the Kansas City Brigade of Code for America. http://codeforkc.org

The live site is at http://kcflushots.com/

Special thanks to Ashly Hand of KCMO for suggesting that we do this project.

The data behind this site is a Google Fusion Table https://www.google.com/fusiontables/DataSource?docid=1JL0TihFJT5MTJiVK1t54e6hE836Fw-UHwdB_8YOA.




#### Running the Site Locally on Your Computer
To run the site locally on your own computer (most helpful for previewing your own changes), 

Fork and clone the repository to a directory on your computer.
Open the index.html file in your browser.

## Technology Patterns
This a HTML/CSS/JavaScript web application.

## <a name="contributing"></a>Contributing

The list of [beginner friendly](https://github.com/codeforkansascity/flushots2013/issues?labels=beginner+friendly&page=1&state=open) issues is a great place to start!

In the spirit of [free software][free-sw], **everyone** is encouraged to help
improve this project.

[free-sw]: http://www.fsf.org/licensing/essays/free-sw.html

Here are some ways *you* can contribute:

* by adding locations, see below
* by reporting bugs
* by suggesting new features
* by writing or editing documentation
* by writing code (**no patch is too small**: fix typos, add comments, clean up
  inconsistent whitespace)
* by refactoring code
* by closing [issues][]
* by reviewing patches

[issues]: https://github.com/codeforkansascity/flushots2013/issues

## <a name="issues"></a>Submitting an Issue
We use the [GitHub issue tracker][issues] to track bugs and features. Before
submitting a bug report or feature request, check to make sure it hasn't
already been submitted. You can indicate support for an existing issue by
voting it up. When submitting a bug report, please include a [Gist][] that
includes a stack trace and any details that may be necessary to reproduce the
bug.

[gist]: https://gist.github.com/

## <a name="pulls"></a>Submitting a Pull Request
1. Fork the project.
2. Create a topic branch.
3. Implement your feature or bug fix.
4. Commit and push your changes.
5. Submit a pull request.

## Adding Locations
If you have locations you would like to add, please fork this project, create a file based off of data/flueshot.csv called data/yourname.csv, add location, commit, and do a pull request.  The spread sheet needs to be in the following format.

* latitude - a value in the format of 39.102609 - not required but will save us time see [website to fine latitude and logitude][longlat]
* longitude - a value in the format of -94.582728
* street1 - required
* street2
* city - required
* state - required
* postal_code - required
* facility_name - required
* url - prefered
* phone - requred
* contact - prefered
* begin_date - required mm/dd/yyyy
* end_date - required mm/dd/yyyy
* begin_time - can be blank
* end_time - can be blank
* hours - can be blank
* recurrence_days - Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday
* cost - free, call, or dollar amount
* notes - any notes that would be usefull in researching this

[longlat]: http://www.findlatitudeandlongitude.com/?loc=4990+NORTH+EAST+VIVION+RD%2C+KANSAS+CITY%2C+MO+64119&id=1625383

## <a name="copyright"></a>Copyright
Copyright (c) 2014 Code for America Kansas City Brigade. See [LICENSE][] for details.


