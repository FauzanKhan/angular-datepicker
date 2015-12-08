
/**
 * Created by Fulup on 16/01/15
 *
 * Modified by FauzanKhan on 03/12/15
 *
 * Format: https://docs.angularjs.org/api/ng/filter/date
 *
 */

'use strict';

var DatePicker = angular.module('date-picker',[]);

DatePicker.directive('datePicker', ["$log", "$document", "$filter", fznDatePicker]);

function fznDatePicker ($log, $document, $filter) {

    var dates = {
        en: {
            months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            today: "Today",
            placeholder: "Select Date"
        },
        fr: {
            months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            monthsShort: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Dec"],
            today: "Aujourd'hui",
            placeholder: "Date Selection"
        },
        es: {
            months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Deciembre"],
            monthsShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            today: "Hoy"
        },
        de: {
            months: ["Januar", "Februar", "Marz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
            today: "Heute"
        },
        nl: {
            months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
            monthsShort: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"],
            today: "Vandaag"
        }
    };

    var partials = {
        headTemplate : '<thead>'+
        '<tr>'+
        '<th class="prev"><i class="material-icons">chevron_left</i></th>'+
        '<th colspan="5" class="date-switch"></th>'+
        '<th class="next"><i class="material-icons">chevron_right</i></th>'+
        '</tr>'+
        '</thead>',
        contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
        footTemplate: '<tfoot ng-show="todayButton"><tr><th colspan="7" class="today">{{todayButton}}</th></tr></tfoot>',
        headTemplateDays: '<thead>'+
        '<tr>'+
        '<th class="prev"><i class="material-icons">chevron_left</i></th>'+
        '<th colspan="5" class="date-switch"></th>'+
        '<th class="next"><i class="material-icons">chevron_right</i></th>'+
        '</tr>'+
        '</thead>',
        footTemplateDays: '<tfoot class="picker {{todayClass}}" ng-show="todayButton"><tr><th colspan="7" class="today">{{todayButton}}</th></tr></tfoot>'
    };

    var template = '<div class="fzn-date-picker"> ' +
        '<div ng-click="displayPicker()" class="date-display">' +
        '<label for={{pickerid}} class="date-input-label"></label>' +
        '<input readonly id={{pickerid}} class="date-input" placeholder="{{placeholder}}" value="{{modelviewvalue}}">' +
        '<span class="date-input-icon"></span>' +

        '<div ng-show="showPicker" class="datepicker datepicker-dropdown">'+
        '<div ng-show="viewMode === 0" class="datepicker-days">'+
        '<table class=" table-condensed">'+
        partials.headTemplateDays+
        '<tbody></tbody>'+
        partials.footTemplateDays+
        '</table>'+
        '</div>'+

        '<div ng-show="viewMode === 1" class="datepicker-months">'+
        '<table class="table-condensed">'+
        partials.headTemplate+
        partials.contTemplate+
        partials.footTemplate+
        '</table>'+
        '</div>'+

        '<div ng-show="viewMode === 2" class="datepicker-years">'+
        '<table class="table-condensed">'+
        partials.headTemplate+
        partials.contTemplate+
        partials.footTemplate+
        '</table>'+
        '</div>'+
        '<a class="button datepicker-close small alert right" style="width:auto;"><i class="fa fa-remove fa-times fi-x"></i></a>'+
        '</div>';

    var DPGlobal = {
        modes: [
            {
                clsName: 'days',
                navFnc: 'Month',
                navStep: 1
            },
            {
                clsName: 'months',
                navFnc: 'FullYear',
                navStep: 1
            },
            {
                clsName: 'years',
                navFnc: 'FullYear',
                navStep: 10
            }],
        isLeapYear: function (year) {
            return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
        },
        getDaysInMonth: function (year, month) {
            return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
        },
        formatDate: function(date, format, timezone) {

            var datestring = $filter('date')(date, format, timezone);
            return (datestring);
        }
    };

    function link (scope, element, attrs, model) {

        var monthOnly = attrs.monthOnly;

        // Logic for body listerner function
        var bodyListenerLogic = function(e){
            var clickedElement = e.target;
            var insideDatepicker = false;
            do {
                // if user clicks inside datepicker
                if(clickedElement != document && (clickedElement.classList && (clickedElement.classList.contains('showPicker') || clickedElement.classList.contains('fzn-date-picker')))) {
                    insideDatepicker = true;
                    break;
                }
            } while ((clickedElement = clickedElement.parentNode));
            if(!insideDatepicker) {
                scope.hide(true);
                unregisterBodyListener();
            }
        }

        // function to register click handler for body
        var registerBodyListener = function(){
            document.body.addEventListener('click', bodyListenerLogic)
        };

        // function to unregister click handler for body
        var unregisterBodyListener = function(){
            document.body.removeEventListener('click', bodyListenerLogic)
        }

        // update external representation when internal value change
        model.$formatters.unshift(function (date) {

            // move from internal object format to external view string
            var fmtdata =  DPGlobal.formatDate (date, scope.format);

            // check date validity
            if (date < scope.startDate) model.$setValidity ("DATE-TOO-EARLY", false);
            if (date > scope.endDate)   model.$setValidity ("DATE-TOO-LATE", false);

            // update template
            scope.modelviewvalue=fmtdata;

            return (fmtdata);
        });

        // Update Internal form when external representation change
        model.$parsers.unshift(function(value) {
            return "Hoops";
        });

        scope.moveMonth = function(date, dir){
            if (!dir) return date;
            var new_date = scope.ngModel,
                day = new_date.getDate(),
                month = new_date.getMonth(),
                mag = Math.abs(dir),
                new_month, test;
            dir = dir > 0 ? 1 : -1;
            if (mag == 1){
                test = dir === -1
                    // If going back one month, make sure month is not current month
                    // (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
                    ? function(){ return new_date.getMonth() == month; }
                    // If going forward one month, make sure month is as expected
                    // (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
                    : function(){ return new_date.getMonth() != new_month; };
                new_month = month + dir;
                new_date.setMonth(new_month);
                // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
                if (new_month < 0 || new_month > 11)
                    new_month = (new_month + 12) % 12;
            } else {
                // For magnitudes >1, move one month at a time...
                for (var i=0; i<mag; i++)
                    // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
                    new_date = scope.moveMonth(new_date, dir);
                // ...then reset the day, keeping it in the new month
                new_month = new_date.getMonth();
                new_date.setDate(day);
                test = function(){ return new_month != new_date.getMonth(); };
            }
            // Common date-resetting loop -- if date is beyond end of month, make it
            // end of month
            while (test()){
                new_date.setDate(--day);
                new_date.setMonth(new_month);
            }
            return new_date;
        };

        scope.moveYear = function(date, dir){
            return scope.moveMonth(date, dir*12);
        };

        scope.showMode = function(dir) {
            if (dir) {
                scope.viewMode = Math.max(0, Math.min(2, scope.viewMode + dir));
                scope.$apply(); // notify template/view that scope changed
                scope.updateNavArrows();
            }
        };


        // emulate jQuery closest API to enable search by tag+class within current element and parents
       scope.closest = function (angelem, selector) {
           var parent = angelem;
           while (parent[0]) {
                for (var idx= 0; idx < selector.length; idx++) {
                    if (selector [idx] === parent[0].tagName) {
                        return parent;
                    }  // HTMLDivElement properties
                }
               parent = parent.parent();
            }
           // alert ("Browser not supported [scope.closest please report a bug]");
        };


        scope.today = function () {
            var now  =new Date();
            var today= new Date (now.getFullYear(), now.getMonth(), now.getDate(),0,0,0,0);
            return today;
        };

        // update internal value of ng-model [external form is updated automatically through scope/watch]
        scope.setDate =  function(date){

            // if no date is provided take Today/NOW
            if (!date) date = scope.today();

            // update date model through its scope
            scope.$apply(function() {
                    scope.ngModel = date;
                }
            );
            model.$setTouched();
            if (scope.autohide) scope.hide(true);

            // if a callback defined call it now
            if (scope.callback) scope.callback (date, scope.pickerid);
        };


        // If start/end date is provided this will display or not corresponding arrows
        scope.updateNavArrows = function() {
            var d = scope.viewDate,
                year = d.getFullYear(),
                month = d.getMonth();
            switch (scope.viewMode) {
                case 0:
                    if (year <= scope.startDate.getFullYear() && month <= scope.startDate.getMonth()) {
                        scope.find('.prev').css({visibility: 'hidden'});
                    } else {
                        scope.find('.prev').css({visibility: 'visible'});
                    }
                    if (year >= scope.endDate.getFullYear() && month >= scope.endDate.getMonth()) {
                        scope.find('.next').css({visibility: 'hidden'});
                    } else {
                        scope.find('.next').css({visibility: 'visible'});
                    }
                    break;
                case 1:
                case 2:
                    if (year <= scope.startDate.getFullYear()) {
                        scope.find('.prev').css({visibility: 'hidden'});
                    } else {
                        scope.find('.prev').css({visibility: 'visible'});
                    }
                    if (year >= scope.endDate.getFullYear()) {
                        scope.find('.next').css({visibility: 'hidden'});
                    } else {
                        scope.find('.next').css({visibility: 'visible'});
                    }
                    break;
            }
        };

        scope.fillMonths= function(){
            var html = '',
                i = 0;
            while (i < 12) {
                html += '<span class="picker month">'+dates[scope.language].monthsShort[i++]+'</span>';
            }
            scope.find('.datepicker-months td').html(html);
        };

        scope.fill= function() {

            var viewyear  = scope.viewDate.getFullYear();
            var viewmonth = scope.viewDate.getMonth();
            var viewdate  = scope.viewDate.getDate();
            var startYear = scope.startDate.getFullYear();
            var startMonth= scope.startDate.getMonth();
            var endYear   = scope.endDate.getFullYear();
            var endMonth  = scope.endDate.getMonth();
            var today = scope.today();

            // insert current date on top of picker table
            scope.find('.datepicker-days th.date-switch').text(dates[scope.language].months[viewmonth]+' '+viewyear);

            scope.updateNavArrows();
            scope.fillMonths();

            var prevMonth = new Date(viewyear, viewmonth-1, 28,0,0,0,0);
            var day = DPGlobal.getDaysInMonth(prevMonth.getFullYear(), prevMonth.getMonth());

            prevMonth.setDate(day);
            prevMonth.setDate(day - (prevMonth.getDay() - scope.weekStart + 7)%7);
            var nextMonth = new Date(prevMonth.valueOf());
            nextMonth.setDate(nextMonth.getDate() + 42);
            nextMonth = nextMonth.valueOf();
            var html = [];
            var clsName;
            var disableday;

            while(prevMonth.valueOf() < nextMonth) {
                clsName="picker"; // reset classes for new picker element
                if (prevMonth.getDay() === scope.weekStart) {
                    html.push('<tr>');
                    if(scope.calendarWeeks){
                        // adapted from https://github.com/timrwood/moment/blob/master/moment.js#L128
                        var a = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - prevMonth.getDay() + 10 - (scope.weekStart && scope.weekStart%7 < 5 && 7)),
                            b = new Date(a.getFullYear(), 0, 4),
                            calWeek =  ~~((a - b) / 864e5 / 7 + 1.5);
                        html.push('<td class="cw">'+ calWeek +'</td>');
                    }
                }

                if (prevMonth.valueOf() < scope.startDate.valueOf() || prevMonth.valueOf() > scope.endDate.valueOf() ||
                    scope.dayoff.indexOf (prevMonth.getDay()) !== -1) {
                    clsName += ' disabled';
                    disableday = true;
                } else disableday= false;

                if (prevMonth.getFullYear() < viewyear || (prevMonth.getFullYear() === viewyear && prevMonth.getMonth() < viewmonth)) {
                    clsName += ' old';
                } else if (prevMonth.getFullYear() > viewyear || (prevMonth.getFullYear() === viewyear && prevMonth.getMonth() > viewmonth)) {
                    clsName += ' new';
                }
                // Process Today highlight and button Display
                if (prevMonth === today) {
                    if (scope.todayHighlight) clsName += ' today';
                    if (attrs.today) {
                        if (disableday) scope.todayClass='disabled'; else  scope.todayClass="enable";
                    }
                }

                if (viewyear === prevMonth.getFullYear() && viewmonth === prevMonth.getMonth() && viewdate === prevMonth.getDate())  {
                      clsName += ' active';
                }

                html.push('<td class="day ' + clsName + '">'+prevMonth.getDate() + '</td>');
                if (prevMonth.getDay() === scope.weekEnd) {
                    html.push('</tr>');
                }
                prevMonth.setDate(prevMonth.getDate()+1);
            }

            scope.find('.datepicker-days tbody').empty().append(html.join(''));
            scope.find(".datepicker-days tbody").prepend('<tr class="days"><td>Mon</td><td>Tue</td><td>Wed</td><td>Thu</td><td>Fri</td><td>Sat</td><td>Sun</td></tr>')

            var currentYear = scope.viewDate.getFullYear();

            var monthspicker = scope.find('.datepicker-months');
            scope.find ('th.date-switch', monthspicker).text(viewyear);
            var monthspan = monthspicker.find('span', monthspicker);
            monthspan.removeClass('active');

            if (currentYear && currentYear === viewyear) {
                monthspan.eq(scope.viewDate.getMonth()).addClass('active');
            }
            if (viewyear < startYear || viewyear > endYear) {
                monthspan.addClass('disabled');
            }

            if (viewyear === startYear) {
                // monthspan.slice(0, startMonth).addClass('disabled');
                for (var idx=0; idx < startMonth; idx++) {
                    monthspan.eq(idx).addClass('disabled');
                }
            }
            if (viewyear === endYear) {
                //monthspan.slice(endMonth+1).addClass('disabled');
                for (var idx=endMonth+1; idx < monthspan.length; idx++) {
                    monthspan.eq(idx).addClass('disabled');
                }
            }

            html = '';
            viewyear = parseInt(viewyear/10, 10) * 10;
            var yearCont = scope.find('.datepicker-years');
            scope.find ('th.date-switch', yearCont ).text(viewyear + '-' + (viewyear + 9));
            yearCont= yearCont.find('td');
            viewyear -= 1;
            for (var i = -1; i < 11; i++) {
                html += '<span class="picker year'+(i === -1 || i === 10 ? ' old' : '')+(currentYear === viewyear ? ' active' : '')+(viewyear < startYear || viewyear > endYear ? ' disabled' : '')+'">'+viewyear+'</span>';
                viewyear += 1;
            }
            yearCont.html(html);
        };

        // Place picker on the screen [need to be fixes to handle exceptions]
        scope.place = function(){
            debugger;
            scope.picker.css({
                top:    element.children('.date-display')[0].offsetTop + element.children('.date-display')[0].clientHeight + 'px',
                left:   element[0].offsetLeft + 'px',
                zIndex: 100,
                display: "block"
            });
        };


        scope.update = function() {
            // Clone current picker's date model value
            scope.viewDate = new Date (scope.ngModel || new Date());

            if (this.viewDate < this.startDate) {
                this.viewDate = new Date(this.startDate.valueOf());
            } else if (this.viewDate > this.endDate) {
                this.viewDate = new Date(this.endDate.valueOf());
            }
            this.fill();
        };



        scope.dateValueWithinRange = function(date){
            return date >= scope.startDate && date <= scope.endDate;
        };

        // This method handle DOM event on Picker and depending on clicked zone update view date
        // Because of light version of Angular jQuery it unfortunately mixes both DOM and Angular elements
        scope.onclick = function(domelem) {

            // move from DOM element to Angular Element
            var angelem = angular.element(domelem);

            // in case we have a close button check it 1st
            if (angelem.hasClass('datepicker-close')) {
                scope.hide(true);
                return;
            }

            // search for closest element by tag to find which one was clicked
            var closestElemNg = scope.closest(angelem, ['SPAN','TD','TH']);

            switch(closestElemNg[0].tagName) {
                case 'TH':
                    if (closestElemNg.hasClass ("date-switch")) {
                        scope.showMode(1);
                    };

                    if (closestElemNg.hasClass ("prev") || closestElemNg.hasClass ("next")) {

                        var dir = DPGlobal.modes[scope.viewMode].navStep * (closestElemNg.hasClass ("prev") ? -1 : 1);
                        switch (scope.viewMode) {
                            case 0:
                                scope.viewDate = scope.moveMonth(scope.viewDate, dir);
                                break;
                            case 1:
                            case 2:
                                scope.viewDate = scope.moveYear(scope.viewDate, dir);
                                break;
                        }
                        scope.fill();
                    } else if (closestElemNg.hasClass ('today')) {
                        // select current day and force picker closing
                        scope.setDate();
                        if (scope.autohide) scope.hide(true);
                        break;
                    }
                    break;

                case 'SPAN':
                    if (!closestElemNg.hasClass('disabled')) {
                        if (closestElemNg.hasClass('month')) {
                            var months = closestElemNg.parent().find("span");
                            for (var idx=0; idx < months.length; idx++) {
                                if (closestElemNg.text() === months.eq(idx).text()) {
                                    scope.viewDate.setMonth(idx);
                                    break;
                                }
                            }

                        } else {
                            var year = parseInt(closestElemNg.text(), 10)||0;
                            scope.viewDate.setFullYear(year);
                        }
                        if(monthOnly && !closestElemNg.hasClass('disabled') && closestElemNg.hasClass('month')){
                            scope.showMode(-1);
                            scope.fill();
                            var temp = document.querySelector('.datepicker-days td.day.picker:not(.old)');
                            scope.onclick(temp);
                            scope.hide(true);
                        }
                        else{
                            scope.showMode(-1);
                            scope.fill();
                        }
                    }
                    break;
                case 'TD':
                    if (closestElemNg.hasClass('day') && !closestElemNg.hasClass('disabled')){

                        var day   = parseInt(closestElemNg.text(), 10)||1;
                        var year  = scope.viewDate.getFullYear(),
                            month = scope.viewDate.getMonth();
                        if (closestElemNg.hasClass('old')) {
                            if (month === 0) {
                                month = 11;
                                year -= 1;
                            } else {
                                month -= 1;
                            }
                        } else if (closestElemNg.hasClass('new')) {
                            if (month === 11) {
                                month = 0;
                                year += 1;
                            } else {
                                month += 1;
                            }
                        }
                        scope.setDate( new Date (year, month, day,0,0,0,0));
                    }
                    break;
            }
        };

        // Minimal keystroke handling to close picker with ESC
        scope.keydown=  function(e){

            console.log

            switch(e.keyCode){
                case 27: // escape
                case 13: // enter
                case 9: // tab
                    scope.hide(true);
            }
        };

        // simulate jquery find by classes capabilities [warning only return 1st elements]
        scope.find = function (select, elem) {
            var domelem;

            if (elem) domelem = elem[0].querySelector(select);
            else domelem = element[0].querySelector(select);

            var angelem = angular.element(domelem);
            return (angelem);
        };

        scope.setStartDate = function(startDate){
            if (startDate) {
                scope.startDate = startDate;
            } else {
                scope.startDate= new Date (0,0,0); // Sun Dec 31 1899
            }
        };

        scope.setEndDate= function(endDate){
            if (endDate) {
                scope.endDate = endDate;
            } else {
                scope.endDate = new Date (3000,0,0); // hopefully far enough
            }
        };

        scope.show = function(apply) {

            // if not initial date provide one
            if (!scope.ngModel) {
                scope.ngModel = new Date();
            };

            scope.update();
            scope.place();
            if(monthOnly)
                scope.viewMode = 1;
            else
                scope.viewMode = 0;
            scope.showPicker = true;
            $document.on('keydown',scope.keydown);

            if (apply) scope.$apply();
        };

        scope.hide = function(apply) {

            scope.showPicker = false;
            scope.picker.off('mousedown');

            $document.unbind('keydown', scope.keydown);
            if (apply) scope.$apply();
        };

        // input field was selected
        scope.displayPicker = function (elem) {
            debugger;
          if (!scope.picker) {
              return;
          }

          if (!scope.showPicker) {
              scope.bindevent(scope.picker);
              scope.show();
              registerBodyListener();
          }
        };

        // bind mouse event
        scope.bindevent = function (picker) {

            function mousedown(event) {
                //console.log ("Mouse in Picker")
                event.preventDefault();
                if (event.explicitOriginalTarget) scope.onclick (event.explicitOriginalTarget); // Firefox
                else if (event.target) scope.onclick (event.target); // IExplorer & Chrome
                // else if (event.currentTarget)  {console.log ("curenttarget used"); scope.onclick (event.currentTarget)} // chrome
                else alert ("Browser click event not supported [report a bug]");
            }

            function mouseup(event) {
                //console.log ("Mouse out of Picker")
                $document.off('mouseup');
            }
            picker.on('mousedown', mousedown);
        };

        // directive initialisation
        scope.init = function () {

            //$log.log("picker ID=%s", attrs.id, "scope=", scope, "element=", element, ' model=', model, ' contoller-date=', scope.ngModel);

            // Process week disable days [1=Monday, 6=Sunday]
            scope.dayoff = [];
            if (attrs.dayoff) {
                var dayoff = attrs.dayoff.split(',');
                for (var idx = 0; idx < dayoff.length; idx++) scope.dayoff.push(parseInt(dayoff[idx]));
            }
            scope.pickerid          = attrs.id || "date-picker-" + parseInt (Math.random() * 1000);
            scope.language          = attrs.language    || scope.locale || "en";
            scope.autohide          = attrs.autohide    || true;
            scope.weekStart         = attrs.weekstart   || 1;
            scope.calendarWeeks     = attrs.weeknum     || false;
            scope.todayButton       = attrs.today       || false;
            scope.todayHighlight    = attrs.highlight   || true;
            scope.placeholder       = attrs.placeholder || "";
            scope.format            = attrs.format      || scope.datefmt || "dd-MM-yyyy";
            scope.locales           = dates [scope.language];

            // start/end Date are copied within private scope to avoid infinite loop when shared with an other picker
            scope.setStartDate(scope.notBefore);
            scope.setEndDate(scope.notAfter);

            if (attrs.today && scope.todayButton.toLowerCase() === "true") {
                scope.todayButton = scope.locales.today;
            }

            if (attrs.iconify) {
                var input= element.find('input');
                var label= element.find('label');
                input.addClass ("date-input-hidden");
                label.addClass ("date-input-hidden");
                element.addClass ("fzn-iconified")
            }

            if (attrs.icon || attrs.iconify) {
                var span= element.find('span');
                span.addClass ("icon-label-input fa fa-calendar fi-calendar");
            }

            if (attrs.label) {
                var label= element.find ('label');
                label.html (attrs.label);
            } else {
                // if the label is not set, delete the label tag from template
                var label = element.find('label');
                label.remove();
            }

            // Monitor any changes on start/stop dates.
            scope.$watch('notBefore', function() {
                scope.setStartDate (scope.notBefore);
                scope.update();
                scope.updateNavArrows();
            });

            scope.$watch('notAfter' , function() {
                scope.setEndDate (scope.notAfter);
                scope.update();
                scope.updateNavArrows();
            });

            scope.picker = scope.find('div .datepicker'); // bind mouse only on datepicker's div
        };

        scope.init();
    }

return {
        restrict: "E",    // restrict to <pickadate> HTML element name
        scope: {
          datefmt : '=',  // see angular date format string
          locale  : '=',  // hopefully this is defined from controller
          ngModel : '=',  // necessary to update internal from inside directive
          notAfter: '=',  // First acceptable date
          notBefore:'=',  // Last acceptable date
          callback : '&',  // Callback to active when a date is selected
          monthOnly : '@'
        },
        template: template, // html template is build from JS
        require: 'ngModel', // get access to external/internal representation
        replace: true,      // replace current directive with template while inheriting of class
        link: link          // pickadate object's methods
    };
}