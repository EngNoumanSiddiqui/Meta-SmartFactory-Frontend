/*!
 *
 * Bryntum Scheduler 3.1.5 (TRIAL VERSION)
 *
 * Copyright(c) 2020 Bryntum AB
 * https://bryntum.com/contact
 * https://bryntum.com/license
 *
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("examples.Ru",[],t):"object"==typeof exports?exports["examples.Ru"]=t():(e.bryntum=e.bryntum||{},e.bryntum.locales=e.bryntum.locales||{},e.bryntum.locales["examples.Ru"]=t())}(window,(function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=4)}([,,function(e,t,n){"use strict";n.r(t);var o={localeName:"Ru",localeDesc:"Русский",Object:{Yes:"Да",No:"Нет",Cancel:"Отмена",Custom:"обычай"},InstancePlugin:{fnMissing:function(e){return"Пытаемся связать метод ".concat(e.plugIntoName,"#").concat(e.fnName,", но в плагине не был найден метод ").concat(e.pluginName,"#").concat(e.fnName)},overrideFnMissing:function(e){return"Пытаемся перегрузить метод ".concat(e.plugIntoName,"#").concat(e.fnName,", но в плагине не был найден метод ").concat(e.pluginName,"#").concat(e.fnName)}},Field:{badInput:"Недопустимое значение поля",patternMismatch:"Значение должно соответствовать определенному шаблону",rangeOverflow:function(e){return"Значение должно быть меньше или равно ".concat(e.max)},rangeUnderflow:function(e){return"Значение должно быть больше или равно ".concat(e.min)},stepMismatch:"Значение должно соответствовать шагу",tooLong:"Значение должно быть короче",tooShort:"Значение должно быть длиннее",typeMismatch:"Значение должно быть в специальном формате",valueMissing:"Поле не может быть пустым",invalidValue:"Недопустимое значение поля",minimumValueViolation:"Нарушение минимального значения",maximumValueViolation:"Нарушение максимального значения",fieldRequired:"Поле не может быть пустым",validateFilter:"Выберите значение из списка"},DateField:{invalidDate:"Невернывй формат даты"},TimeField:{invalidTime:"Неверный формат времени"},DateHelper:{locale:"ru",shortWeek:"нед",shortQuarter:"квар",week:"Hеделя",weekStartDay:1,unitNames:[{single:"миллисек",plural:"миллисек",abbrev:"мс"},{single:"секунда",plural:"секунд",abbrev:"с"},{single:"минута",plural:"минут",abbrev:"мин"},{single:"час",plural:"часов",abbrev:"ч"},{single:"день",plural:"дней",abbrev:"д"},{single:"неделя",plural:"недели",abbrev:"нед"},{single:"месяц",plural:"месяцев",abbrev:"мес"},{single:"квартал",plural:"кварталов",abbrev:"квар"},{single:"год",plural:"лет",abbrev:"г"}],unitAbbreviations:[["мс","мил"],["с","сек"],["м","мин"],["ч"],["д","ден","дне"],["н","нед"],["мес"],["к","квар","квр"],["г"]],parsers:{L:"DD.MM.YYYY",LT:"HH:mm"},ordinalSuffix:function(e){return"".concat(e,"-й")}},PagingToolbar:{firstPage:"Перейти на первую страницу",prevPage:"Перейти на предыдущую страницу",page:"страница",nextPage:"Перейти на следующую страницу",lastPage:"Перейти на последнюю страницу",reload:"Перезагрузить текущую страницу",noRecords:"Нет записей для отображения",pageCountTemplate:function(e){return"из ".concat(e.lastPage)},summaryTemplate:function(e){return"Показаны записи ".concat(e.start," - ").concat(e.end," из ").concat(e.allCount)}},List:{loading:"Загрузка..."}},r={TemplateColumn:{noTemplate:"TemplateColumn необходим шаблон",noFunction:"TemplateColumn.template должен быть функцией"},ColumnStore:{columnTypeNotFound:function(e){return"Тип колонки '".concat(e.type,"' не зарегистрирован")}},ColumnPicker:{columnsMenu:"Колонки",hideColumn:"Спрятать колонку",hideColumnShort:"Спрятать"},Filter:{applyFilter:"Применить фильтр",filter:"Фильтр",editFilter:"Изменить фильтр",on:"В этот день",before:"До",after:"После",equals:"Равно",lessThan:"Меньше, чем",moreThan:"Больше, чем",removeFilter:"Убрать фильтр"},FilterBar:{enableFilterBar:"Показать панель фильтров",disableFilterBar:"Спрятать панель фильтров"},Group:{groupAscending:"Группа по возрастанию",groupDescending:"Группа по убыванию",groupAscendingShort:"Возрастание",groupDescendingShort:"Убывание",stopGrouping:"Убрать группу",stopGroupingShort:"Убрать"},Search:{searchForValue:"Найти значение"},Sort:{sortAscending:"Сортировать по возрастанию",sortDescending:"Сортировать по убыванию",multiSort:"Сложная сортировка",removeSorter:"Убрать сортировку",addSortAscending:"Добавить сортировку по возрастанию",addSortDescending:"Добавить сортировку по убыванию",toggleSortAscending:"Сортировать по возрастанию",toggleSortDescending:"Сортировать по убыванию",sortAscendingShort:"Возрастание",sortDescendingShort:"Убывание",removeSorterShort:"Убрать",addSortAscendingShort:"+ Возраст...",addSortDescendingShort:"+ Убыв..."},Tree:{noTreeColumn:"Чтобы использовать дерево необходимо чтобы одна колонка имела настройку tree: true"},Grid:{featureNotFound:function(e){return"Опция '".concat(e,"' недоступна, убедитесь что она импортирована")},invalidFeatureNameFormat:function(e){return"Неверное имя функциональности '".concat(e,"', так как оно должно начинаться с маленькой буквы")}},GridBase:{loadFailedMessage:"Не удалось загрузить!",syncFailedMessage:"Не удалось cинхронизировать!",serverResponseLabel:"Ответ сервера:",unspecifiedFailure:"Неуказанная ошибка",unknownFailure:"Неизвестная ошибка",networkFailure:"Ошибка сети",parseFailure:"Не удалось разобрать ответ сервера",loadMask:"Загрузка...",syncMask:"Сохраняю данные, пожалуйста подождите...",noRows:"Нет записей для отображения",removeRow:"Удалить запись",removeRows:"Удалить записи",moveColumnLeft:"Передвинуть в левую секцию",moveColumnRight:"Передвинуть в правую секцию"},PdfExport:{"Waiting for response from server...":"Ожидание ответа от сервера...","Export failed":"Не удалось экспортировать","Server error":"На сервере произошла ошибка"},ExportDialog:{width:"40em",labelWidth:"13em",exportSettings:"Настройки",export:"Экспорт",exporterType:"Разбивка на страницы",cancel:"Отмена",fileFormat:"Формат файла",rows:"Строки",alignRows:"Выровнять строки",columns:"Колонки",paperFormat:"Размер листа",orientation:"Ориентация"},ExportRowsCombo:{all:"Все строки",visible:"Видимые строки"},ExportOrientationCombo:{portrait:"Портретная",landscape:"Ландшафтная"},SinglePageExporter:{singlepage:"Одна страница"},MultiPageExporter:{multipage:"Многостраничный",exportingPage:function(e){var t=e.currentPage,n=e.totalPages;return"Экспорт страницы ".concat(t,"/").concat(n)}}};for(var a in o)r[a]=o[a];var i=r,l={SchedulerCommon:{},ExcelExporter:{"No resource assigned":"Ресурс не назначен"},ResourceInfoColumn:{eventCountText:function(e){return e+" "+(e>=2&&e<=4?"события":1!==e?"событий":"событие")}},Dependencies:{from:"От",to:"К",valid:"Верная",invalid:"Неверная",Checking:"Проверяю…"},EventEdit:{Name:"Название",Resource:"Ресурс",Start:"Начало",End:"Конец",Save:"Сохранить",Delete:"Удалить",Cancel:"Отмена","Edit Event":"Изменить событие",Repeat:"Повтор"},DependencyEdit:{From:"От",To:"К",Type:"Тип",Lag:"Запаздывание","Edit dependency":"Редактировать зависимость",Save:"Сохранить",Delete:"Удалить",Cancel:"Отменить",StartToStart:"Начало к Началу",StartToEnd:"Начало к Окончанию",EndToStart:"Окончание к Началу",EndToEnd:"Окончание к Окончанию"},EventDrag:{eventOverlapsExisting:"Событие перекрывает существующее событие для этого ресурса",noDropOutsideTimeline:"Событие не может быть отброшено полностью за пределами графика"},Scheduler:{"Add event":"Добавить событие","Delete event":"Удалить событие","Unassign event":"Убрать назначение с события"},HeaderContextMenu:{pickZoomLevel:"Выберите масштаб",activeDateRange:"Диапазон дат",startText:"Начало",endText:"Конец",todayText:"Сегодня"},EventFilter:{filterEvents:"Фильтровать задачи",byName:"По имени"},TimeRanges:{showCurrentTimeLine:"Показать текущую шкалу времени"},PresetManager:{minuteAndHour:{topDateFormat:"ddd DD.MM, HH:mm"},hourAndDay:{topDateFormat:"ddd DD.MM"},weekAndDay:{displayDateFormat:"HH:mm"}},RecurrenceConfirmationPopup:{"delete-title":"Вы удаляете повторяющееся событие","delete-all-message":"Хотите удалить все повторения этого события?","delete-further-message":"Хотите удалить это и все последующие повторения этого события или только выбранное?","delete-further-btn-text":"Удалить все будущие повторения","delete-only-this-btn-text":"Удалить только это событие","update-title":"Вы изменяете повторяющееся событие","update-all-message":"Изменить все повторения события?","update-further-message":"Изменить только это повторение или это и все последующие повторения события?","update-further-btn-text":"Все будущие повторения","update-only-this-btn-text":"Только это событие",Yes:"Да",Cancel:"Отменить",width:600},RecurrenceLegend:{" and ":" и ",Daily:"Ежедневно","Weekly on {1}":function(e){var t=e.days;return"Еженедельно (".concat(t,")")},"Monthly on {1}":function(e){var t=e.days;return"Ежемесячно (день: ".concat(t,")")},"Yearly on {1} of {2}":function(e){var t=e.days,n=e.months;return"Ежегодно (день: ".concat(t,", месяц: ").concat(n,")")},"Every {0} days":function(e){var t=e.interval;return"Каждый ".concat(t," день")},"Every {0} weeks on {1}":function(e){var t=e.interval,n=e.days;return"Каждую ".concat(t," неделю, день: ").concat(n)},"Every {0} months on {1}":function(e){var t=e.interval,n=e.days;return"Каждый ".concat(t," месяц, день: ").concat(n)},"Every {0} years on {1} of {2}":function(e){var t=e.interval,n=e.days,o=e.months;return"Каждый ".concat(t," год, день: ").concat(n," месяц: ").concat(o)},position1:"первый",position2:"второй",position3:"третий",position4:"четвертый",position5:"пятый","position-1":"последний",day:"день",weekday:"будний день","weekend day":"выходной день",daysFormat:function(e){var t=e.position,n=e.days;return"".concat(t," ").concat(n)}},RecurrenceEditor:{"Repeat event":"Повторять событие",Cancel:"Отменить",Save:"Сохранить",Frequency:"Как часто",Every:"Каждый(ую)",DAILYintervalUnit:"день",WEEKLYintervalUnit:"неделю по:",MONTHLYintervalUnit:"месяц",YEARLYintervalUnit:"год/лет в:",Each:"Какого числа","On the":"В следующие дни","End repeat":"Прекратить","time(s)":"раз(а)"},RecurrenceDaysCombo:{day:"день",weekday:"будний день","weekend day":"выходной день"},RecurrencePositionsCombo:{position1:"первый",position2:"второй",position3:"третий",position4:"четвертый",position5:"пятый","position-1":"последний"},RecurrenceStopConditionCombo:{Never:"Никогда",After:"После","On date":"В дату"},RecurrenceFrequencyCombo:{Daily:"Каждый день",Weekly:"Каждую неделю",Monthly:"Каждый месяц",Yearly:"Каждый год"},RecurrenceCombo:{None:"Не выбрано","Custom...":"Настроить..."},ScheduleRangeCombo:{completeview:"Полное расписание",currentview:"Текущая видимая область",daterange:"Диапазон дат",completedata:"Полное расписание (по всем событиям)"},SchedulerExportDialog:{"Schedule range":"Диапазон расписания","Export from":"С","Export to":"По"}};for(var c in i)l[c]=i[c];t.default=l},,function(e,t,n){"use strict";n.r(t);n(2);t.default={extends:"Ru",Column:{Name:"Имя",Staff:"Персонал",Machines:"Машины",Type:"Тип","Task color":"Цвет задачи","Employment type":"Тип занятости",Capacity:"Вместительность","Production line":"Производственная линия",Company:"Компания",Start:"Начало",End:"Конец",Role:"Роль",Id:"№","First name":"Имя",Surname:"Фамилия",Score:"Счет",Rating:"Рейтинг","Nbr tasks":"Кол-во задач","Unassigned tasks":"Неназначенные задачи",Duration:"Продолжительность"},Shared:{"Locale changed":"Язык изменен",Fullscreen:"На весь экран","Click to show the built in code editor":"Показать редактор кода","Click to show info and switch theme or locale":"Показать информацию, переключить тему или язык","Select theme":"Выбрать тему","Select locale":"Выбрать язык","Select size":"Выбрать размер","Full size":"Полный размер","Phone size":"Экран смартфона","Display hints":"Показать подсказки",Automatically:"Автоматически","Check to automatically display hints when loading the example":"Автоматически показывать подсказки при загрузке примера"},CodeEditor:{"Code editor":"Редактор кода","Download code":"Скачать код","Auto apply":"Применять автоматически",Apply:"Применить"}}}]).default}));