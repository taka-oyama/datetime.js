# datetime.js

datetime.js is a Javascript library that provides a more modern date manipulation in place of the conventional Date class.
DateTime class included in datetime.js can provide the following.

* ISO8601 support
* stftime from Ruby's Time class
* distance_of_time_in_words from Ruby on Rails' DateHelper class (can support ~~from now and ~~ ago)
* internationalization on output
* new DateTime(2012,1,1) will actually set the month as January (where as new Date(2012,1,1) will set it to Feb)
* UTC's offset is actually counted eastward (Date counts westward, which is backwards).


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
```


## Documentation
Please check out the the `wiki`.


## Support
The code has only been tested on client side but should support server-side javascript as well.


## Licensing
Please see the file called LICENSE.
