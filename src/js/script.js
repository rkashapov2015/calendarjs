'use strict';

window.addEventListener('load', function(event) {
    var calendarWrapper = document.getElementById('calendarWrapper');
    var calendarBlock = document.getElementById('calendar');
    var timeBlock = document.querySelector('.time-block');
    var nameMonth = document.querySelector('.name-month');
    var month, year = null;
    var monthsName = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль', 'Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
    var daysTimes = {
        '23.12.2017': ['7:00', '7:30', '8:00', '10:00'],
        '25.12.2017': ['17:00', '17:30', '18:00', '19:00'],
        '28.12.2017': ['16:00', '17:30', '19:00', '20:00'],
        '30.12.2017': ['7:00', '9:30', '10:00', '11:00'],
        '26.12.2017': ['9:00', '9:30', '10:00', '11:00'],
        '01.01.2018': ['9:30', '9:50', '10:30', '11:00'],
        '10.01.2018': ['9:00', '9:30', '10:00', '11:00'],
        '26.01.2018': ['9:00', '9:30', '11:00', '11:30']
    };
    init();

    function createEl(tag, className, id) {
        var element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (id) {
            element.id = id;
        }
        return element;
    }

    function createCalendar(month, year) {
        var now = new Date();
        now.setHours(0);
        now.setMinutes(0);
        now.setSeconds(0);
        var daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
        var table = createEl('table', 'table-calendar');
        var tableHead = createEl('thead');
        var rowHead = createEl('tr');
        
        daysOfWeek.forEach(function (dayName) {
            var th = createEl('th');
            th.innerText = dayName;
            rowHead.appendChild(th);
        });
        tableHead.appendChild(rowHead);
        table.appendChild(tableHead);
        var tableBody = createEl('tbody');
        var mon = month - 1;
        var d = new Date(year, mon);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        var row = createEl('tr');

        for (var i = 0; i < getDay(d); i++) {
            var td = createEl('td');
            row.appendChild(td);
        }

        while (d.getMonth() == mon) {
            var td = createEl('td');
            td.dataset.action = 'select';
            td.dataset.date = formatDate(d);
            if (now.getDate() === d.getDate() && now.getMonth() === d.getMonth() && now.getFullYear() === d.getFullYear()) {
                td.classList.add('current-day');
            }
            if (daysTimes.hasOwnProperty(td.dataset.date)) {
                td.classList.add('free');
            } else {
                td.classList.add('close');
            }
            if (now > d) {
                td.classList.add('disabled');
            }
            var span = createEl('span');
            span.innerText = d.getDate();
            td.appendChild(span);
            row.appendChild(td);
                
            if (getDay(d) % 7 == 6) {
                tableBody.appendChild(row);
                row = createEl('tr');
            }
            d.setDate(d.getDate() + 1);
        }

        if (getDay(d) != 0) {
            for (var i = getDay(d); i < 7; i++) {
                var td = createEl('td');
                row.appendChild(td);
            }
        }
        tableBody.appendChild(row);
        table.appendChild(tableBody);
        return table;
    }

    function getDay(date) {
        var day = date.getDay();
        if (day == 0) day = 7;
        return day - 1;
    }
    function clearNode(node) {
        while(node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }
    
    function formatDate(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        return formatNum(day) + '.' + formatNum(month) + '.' + year;
    }
    function formatNum(number) {
        var strNumber = number.toString();
        if (strNumber.length < 2) {
            strNumber = "0" + strNumber;
        }
        return strNumber;
    }

    function clickHandler(event) {
        var target = event.target;
        
        while(target != this) {
            if (target.tagName === 'TD' || target.tagName === 'DIV') {
                runAction(target);
                return;
            }
            target = target.parentNode;
        }
    }

    function runAction(node) {
        var action = node.dataset.action;
        switch(action) {
            case 'prevMonth':
                clearNode(calendarBlock);
                month--;
                if (month < 0) {
                    month = 11;
                    year--;
                }
                calendarBlock.appendChild(createCalendar(month+1, year));
                nameMonth.innerText = monthsName[month];
            break;
            case 'nextMonth':
                clearNode(calendarBlock);
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
                calendarBlock.appendChild(createCalendar(month+1, year));
                nameMonth.innerText = monthsName[month];
            break;
            case 'select':
                var date_d = node.dataset.date;
                if (!date_d) {
                    return false;
                }
                clearNode(timeBlock);
                if (daysTimes.hasOwnProperty(date_d)) {
                    Array.from(daysTimes[date_d]).forEach(function (value){
                        var button = createEl('button', 'button-time');
                        button.innerText = value;
                        timeBlock.appendChild(button);
                    });
                }
            break;
        }
    }

    function init() {
        if (!calendarBlock) {
            console.log('!!!');
            return false;
        }
        var date = new Date();
        month = date.getMonth() + 1;
        year = date.getFullYear();
        nameMonth.innerText = monthsName[date.getMonth()];
        calendarBlock.appendChild(createCalendar(month, year));
        calendarWrapper.addEventListener('click', clickHandler, false);
    }
});

