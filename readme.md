# ngDatepick
An elegant, easily customizable datepicker in Angular built on top of [Datepicker by fulup-bzh](https://github.com/fulup-bzh/DatePicker)

### Description
* An angular directive for datepicker.
* Easily customizable, elegant design.
* Works well with/without Foundation & Bootstrap.
* ![](http://s1.postimg.org/r4nc3gmhb/datepicker1.png)
* ![](http://s1.postimg.org/9dbpp072n/datepicker2.png)

### Dependecies
* Angular.js
* Google material Icons

### Installation
* Use the following cpmmand to install the bower pakage for the datpicker: 
```bower install fzn-angular-datepicker```

* Or Copy datepicker.js and datepicker.scss from the repository and use it the way you like.

### Usage
* Make sure you include the '''datepicker''' module in you angular app: 

```
angular.module('myApp', ['date-picker']);
```


* once you've added the module in your app. Use the code below to get the datepicker up and running:

```html
<date-picker
      id="my-picker-name"                         // only use as an argument to callback
      class="my-custom-class"                   // default class is bzm-date-picker
      placeholder="Track Date Selection"  // place holder for date readonly input zone

      // Angular Scope Variables
      callback="myCallBack"                    // $scope.myCallBack(selectedDate) is called when ever a new date is selected
      ng-model="viewDate"                  // $scope.viewDate angular scope for selected date
      not-after="myEndDate"              // $scope.myEndDate   = JS Date OBJECT
      not-before="myStartDate"        // $scope.myStartDate = idem

      // Angular Directive Attributes
      format="dd-MM-yy"                      // angular date filter https://docs.angularjs.org/api/ng/filter/date
      language="en"                            // English, French, German, ...
      weekstart="1"                            // Week start [1==Monday]
      today='true|text'                        // If true display 'today' in chosen language, if 'text' display text in todaybouton
      dayoff=[6,7]                             // Disable Saturday/Sunday for selection
      weeknum="true"                             // Display week number
      month-only="true"                               // Allow user to pick months & years only
      autohide=  /></date-picker>

```

###Customization
You can easily customize the look and feel of the datepicker by changing the following variables in the datepicker.scss file as per your requirement:

```css
$primary-font:  arial; // the font you want to use
$primary-color: #008CCD; // the highlighting colot
$text-color: #434A54; // color of the text in datepicker
$border-color: #EAEAEA; //Datepicker's border color
$hover-color: #F8F8F8;
$white: #FFF;
$black: #333;
```


###Demo
visit <a href="http://fauzankhan.github.io/angular-datepicker/">http://fauzankhan.github.io/angular-datepicker/</a> to see the datepicker in action


