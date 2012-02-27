# datetime.js

datetime.js is a Javascript library that provides a modern way to manipulate dates. 

## List of Main Features

* ISO8601 support
* stftime from Ruby's Time class
* distance_of_time_in_words from Ruby on Rails' DateHelper class (can support ~~from now and ~~ ago)
* internationalization on output
* `new DateTime(2012,1,1)` will actually set the month as January (where as `new Date(2012,1,1)` will set it to Feb)
* UTC's offset is actually counted eastward (Date counts westward, which is backwards).

## Tested Browsers
* IE6/7/8/9
* Chrome 18
* Firefox 10
* Safari 5

*The code has only been tested on client side but should support server-side javascript as well.*


## Examples

``` javascript
DateTime.now();                                     // returns a instance with current local time.

new DateTime(2012,01,01).toUTCString();             // 2011-12-31T15:00:00Z 
                                                    // (interpreted as local time)

DateTime.UTC(2012,01,01).toUTCString();             // 2011-12-31T15:00:00Z 
                                                    // (use DateTime.UTC to interpret as UTC time)

new DateTime('2012-01-01').toUTCString();           // 2012-01-01T00:00:00Z 
                                                    // (ISO8601 format is interpreted as UTC time)

new DateTime('2012-12-31T23:59:59Z').toUTCString(); // 2012-12-31T23:59:59Z

new DateTime('2012').isLeap();                      // true

new DateTime(2000,12,31).strftime('%m/%d/%y');      // 12/31/00

var d1 = new DateTime(2000,1,1);
var d2 = new DateTime(2000,1,31);
d1.distanceOfTimeInWordsTo(d2);                     // about 1 month from now
d2.distanceOfTimeInWordsTo(d1);                     // about 1 month ago

DateTime.distanceOfTimeInWords(d1,d2);              // about 1 month from now
```


## Documentation
#### Constructor
DateTime's constructor will accept the following inputs  
  
`DateTime()`  
Creates a new instance with current __local time__.  
  
`DateTime(Date date)`  
Creates a new instance with Date's __local time__.  
  
**`DateTime(String isoString)`**  
Should be in ISO8601 format and will interpreted as __UTC time__ unless specified.  

``` javascript
 Ex: new DateTime('2000')
     new DateTime('2000-01')
     new DateTime('2000-01-01')
     new DateTime('2000-01-01T00:00:00Z')
     new DateTime('2000-01-01T00:00:00+00:00')
     new DateTime('2000-W01-1')
     new DateTime('2000-001')
```  
  
`DateTime(int unixTime)`  
Number is time from epoch or unix time.  
  
`DateTime(int year,int month, int day,...)`  
Creates a new instance in __local time__.  

#### Class Functions
`DateTime.now()`  
Alias to new DateTime().  
  
`DateTime.UTC(int year, int month, int day,...)`  
Similiar to the constructor but creates instance in __UTC time__.  
  
`DateTime.distance(DateTime from, DateTime to)`  
Returns the distance between the two DateTimes in milliseconds (to - from).  
  
`DateTime.distanceOfTimeInWords(DateTime from, DateTime to)`  
Returns the distance between the two DateTimes in human readable format (to - from).    
  
#### Instance Variables  
`locale`  
Default is 'en'. You can change it to whatever you locale you add to DateTime.i18n. You can set it globally by using ``DateTime.defaultLocale = 'locale defined in DateTime.i18n'``  
  
#### Prototype Functions
`clone()`  
Create a clone of if DateTime instance.  
  
`time()`  
Returns the time representation in unix time as an integer.  
  
`year()`  
Returns the current year as an integer.  
  
`month()`  
Returns the current month of the year as an integer. (1-12)  
  
`day()`  
Returns the current day of the month as an integer. (1-31)  
  
`hour()`  
Returns the current hour of the day as an integer. (0-23)  

`minute()`  
Returns the current minute of the hour as an integer. (0-59)  
  
`second()`  
Returns the current second of the minute as an integer. (0-59)  
  
`millisecond()`  
Returns the current millisecond of the second as an integer. (0-999)  
  
`wday()`  
Returns the current day of the week represented as integer starting with monday. (1-7)  
  
`utcOffset()`  
Returns the time zone offset from UTC in minutes.
  
`isLeap()`  
Returns _true_ if the year is a leap year, otherwise return __false__.
   
`distanceTo(DateTime that)`  
Returns the distance from __this__ to __that__ in milliseconds.  
  
`distanceOfTimeInWordsTo(DateTime that)`  
Returns the distance from __this__ to __that__ in human readable format.  
  
`weekOfYear()`  
Returns the week of the year starting with week 0. (0-53)  
  
`yearWeekDay()`  
Returns an object with properties year, week, and day according to ISO8601 standard.  
  
`dayOfYear()`  
Returns the day of the year (1-366)  
  
`strftime(String format)`  
This function was created based on ruby's implementation of strftime.  
You can heck out ruby's implementation [here](http://ruby-doc.org/core-1.9.3/Time.html#method-i-strftime).  
There are a few expections though. See below.

``` javascript
 // 'h': won't be implemented. (use %b)  
 // 'N': won't be implemented. (javascript doesn't support micro/nano/pico seconds)  
 // 'U': not implemented.  
 // 'x': won't be implemented. (use %D)  
 // 'X': won't be implemented. (use %T)  
 // 'v': won't be implemented. (VMS?)  
```  
  
`toDate()`  
returns DateTime represented in Javascript's Date class.  
  
`toUTCObject()`  
returns an object which includes DateTime properties in UTC time.  
Properties include time, year, month, day, wday, hour, minute, second, millisecond, dayOfYear, and utcOffset.  
  
`toObject()`  
returns an object which includes DateTime properties in local time.  

`toUTCString()`  
returns a string which represents the current UTC date and time in ISO8601 format.  
  
`toString()`  
returns a string which represents the current local date and time in ISO 8601 format.  


## Localization
You can localize the strftime output and distance of time in words.  

## Adding the locale definition
The english locale looks like this...

``` javascript
{
  'wdays' : ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
  'months': ['January','February','March','April','May','June','July','August','September','October','November','December'],
  'abbrWdays' : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  'abbrMonths': ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
  'distanceWords': {
    '_filter': function(s, n) { 
      s+= (Math.abs(n) > 1 ? 's' : '');
      s = (n <  0) ? s + ' ago'      : s;
      s = (n >= 0) ? s + ' from now' : s;
      return s;
    },
    'half_a_minute'      : 'half a minute',
    'less_than_x_seconds': 'less than %{count} second',
    'x_minutes'          : '%{count} minute',
    'about_x_hours'      : 'about %{count} hour',
    'x_days'             : '%{count} day',
    'about_x_months'     : 'about %{count} month',
    'x_months'           : '%{count} month',
    'about_x_years'      : 'about %{count} year',
    'over_x_years'       : 'over %{count} year',
    'almost_x_years'     : 'almost %{count} year'
  }
}
```
just edit the above to create your own locale.  
  
*wdays*, *months*, *abbrWdays*, *abbrMonths* are used in `strftime()` and *distanceWords* are used in `distanceOfTimeInWords()`.  
*_filter* is an optional function you can define to run a filter before the number is inserted into the locale string.  

#### Applying the locales

To add a locale, set the locale definition object like so... `DateTime.i18n['myLocale'] = { ... }`.  
To apply the localization globally, do... `DateTime.defaultLocale = 'myLocale';`.  
To apply your locale to the DateTime instance, do `myDateTimeInstance.locale = 'mylocale';`.  
  