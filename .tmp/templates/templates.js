angular.module('app.directives').run(function($templateCache) {$templateCache.put('$/angular/views/currency.html', "<div><h1>Currency</h1><span>Reference</span><select ng-options=\"c as c.name for c in currencies\" ng-model=\"reference\"></select><span>Currency</span><select ng-options=\"c as c.name for c in currencies\" ng-model=\"currency\"></select><br><mm-chart-area ng-data=\"chartData\"></mm-chart-area></div>");$templateCache.put('$/angular/views/my-share.html', "<div><h1>My share</h1><div><button ng-click=\"createMyShare()\">Add a new share</button><button ng-click=\"sellSimulation()\">Sell somulation</button></div><div><div><a ng-click=\"showAll()\">show all</a><span>/</span><a ng-click=\"hideAll()\">hide all</a></div><div class=\"my-share-table\" loading-container=\"tableParams.settings().$loading\"><table class=\"admin-table-import-bad\" ng-table=\"tableParams\"><tr ng-repeat=\"share in $data\"><td data-title=\"''\"><input ng-click=\"setVisibleChart(share)\" ng-model=\"share.visible\" type=\"checkbox\"></td><td sortable=\"'stock.code'\" data-title=\"'Stock'\">{{share.stock.symbol}}</td><td sortable=\"'buyDate'\" data-title=\"'Date'\">{{share.buyDate | date}}</td><td style=\"text-align:right\" data-title=\"'Value'\">{{share.buyPrice | numberToI18N}}</td><td style=\"text-align:right\" data-title=\"'Number'\">{{share.nbShare | numberToI18N}}</td><td style=\"text-align:right;border-right: 3px double #bbb;\" sortable=\"'totalEur'\" data-title=\"'Total (&euro;)'\">{{share.totalEur | numberToI18N}}<div class=\"question_info\"><div class=\"question_info_popup\"><div ng-repeat=\"(key, value) in share.totalEurDetails\"><div style=\"display:inline-block;width:50%\">{{key}}</div><div style=\"display:inline-block;width:50%;text-align:right\">{{value | numberToI18N: 4 }}</div></div></div></div></td><td sortable=\"'sellDate'\" data-title=\"'Sell Date'\">{{share.sellDate | date}}</td><td style=\"text-align:right\" data-title=\"'Sell Value'\">{{share.sellPrice | numberToI18N}}</td><td style=\"text-align:right;border-right: 3px double #bbb;\" sortable=\"'sellTotalEur'\" data-title=\"'Sell Total (&euro;)'\">{{share.sellTotalEur | numberToI18N}}<div class=\"question_info\"><div class=\"question_info_popup\"><div ng-repeat=\"(key, value) in share.totalSellEurDetails\"><div style=\"display:inline-block;width:50%\">{{key}}</div><div style=\"display:inline-block;width:50%;text-align:right\">{{value | numberToI18N: 4 }}</div></div></div></div></td><td style=\"text-align:right\" sortable=\"'differenceEur'\" data-title=\"'Difference (&euro;)'\">{{share.differenceEur | numberToI18N}}</td><td style=\"text-align:right\" sortable=\"'differencePercentEur'\" data-title=\"'Difference % (&euro;)'\">{{share.differencePercentEur | numberToI18N}} %</td><td style=\"text-align:right\" sortable=\"'differencePercentEurAverageByDay'\" data-title=\"'Average % (&euro;)'\">{{share.differencePercentEurAverageByDay | numberToI18N}} %</td><td style=\"text-align:left\" data-title=\"'Opts'\"><button ng-click=\"sellSimulation(share)\" class=\"glyphicon glyphicon-file\"></button><button ng-click=\"editShare(share)\" class=\"glyphicon glyphicon-pencil\"></button><button ng-click=\"sellShare(share)\" class=\"glyphicon glyphicon-ok-sign\" ng-show=\"share.sellPrice == null\"></button><button ng-click=\"remove(share)\" class=\"glyphicon glyphicon-remove\"></button></td></tr></table></div><div class=\"my-share-table\"><table><tr><th colspan=\"2\">Summary</th></tr><tr><td>Total</td><td>{{summary.value | numberToI18N}}</td></tr><tr><td>average %</td><td>{{averagePercentSell| numberToI18N}} %</td></tr></table></div></div><div><input ng-model=\"isCompare\" type=\"checkbox\"><div>Percentage ?</div></div><tabSet><tab><tab-heading><span>stock value</span></tab-heading><div><div id=\"{{idChartStock}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab><tab><tab-heading><span>shares value</span></tab-heading><div><div id=\"{{idChartShare}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab><tab><tab-heading><span>Results</span></tab-heading><div><div id=\"{{idChartResult}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab><tab><tab-heading><span>Results average by day</span></tab-heading><div><div id=\"{{idChartResultAverage}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div></tab></tabSet></div>");$templateCache.put('$/angular/views/stock.html', "<div><h1>Stock</h1><button ng-click=\"loadStocks()\">LOAD STOCK</button><table><tr><td><div class=\"field_form\" style=\"width:400px\"><mm-field-auto-completion ng-info=\"stock\"></mm-field-auto-completion></div></td><td><table><tr ng-repeat=\"stock in stocks\"><td>{{stock.stock.symbol}}</td><td><button ng-click=\"removeStock(stock.stock.symbol)\">remove</button></td></tr></table></td></tr></table><div>Percentage ?<input ng-model=\"isCompare\" type=\"checkbox\"></div><div style=\"100%\"><div style=\"display:inline-block; width: calc(100% - 200px); vertical-align : top\"><div id=\"{{id}}\" style=\"height: 700px; min-width: 310px\" class=\"chart\"></div></div><div style=\"display:inline-block;width:200px;vertical-align : top\"><table class=\"table\"><tr><th colspan=\"2\">Historic visit</th></tr><tr><th>Name</th><th>last visit</th></tr><tr ng-click=\"loadStock(stock.stockDTO.symbol)\" ng-repeat=\"stock in historic.list\"><td>{{stock.stockDTO.symbol}}</td><td>{{stock.lastVisit | date}}</td></tr></table></div></div></div>");$templateCache.put('$/angular/templates/mm-table.html', "<div>je suis la directive table<button class=\"btn btn-default\" ng-click=\"tableParams.reload()\">Reload</button><button class=\"btn btn-default\" ng-click=\"tableParams.sorting({})\">Clear sorting<div class=\"clearfix\"></div><div loading-container=\"tableParams.settings().$loading\"><table class=\"table\" show-filter=\"true\" ng-table=\"tableParams\"><tbody><tr ng-repeat=\"stock in $data\"><td sortable=\"name\" data-title=\"'Name'\" filter=\"{ 'name': 'text' }\">{{stock.name}}{{$loading}}</td><td sortable=\"code\" data-title=\"'Code'\">{{stock.code}}</td></tr></tbody></table></div></button></div>");$templateCache.put('$/angular/templates/mm-field-date.html', "<div class=\"field_row\" ng-hide=\"getInfo().hidden === true\"><div ng-click=\"logField()\">{{getInfo().fieldTitle}}</div><div><div class=\"dropdown\"></div><a class=\"dropdown-toggle\" data-target=\"#\" id=\"{{id}}\" role=\"button\" data-toggle=\"dropdown\" href=\"\"><div class=\"input-group\"><input class=\"form-control\" ng-model=\"resultFormated\" type=\"text\"><span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-calendar\"></i></span></div><ul class=\"dropdown-menu date_input\" aria-labelledby=\"dLabel\" role=\"menu\"><datetimepicker data-ng-model=\"result\" data-datetimepicker-config=\"{ dropdownSelector: '{{idHtag}}',minView:'day' }\"></datetimepicker></ul></a></div><div><img src=\"/assets/images/field_valid.png\" ng-if=\"!hideIsValidIcon\" ng-show=\"getInfo().isValid\"><div class=\"error_message\" ng-hide=\"getInfo().isValid\"><img src=\"/assets/images/field_invalid.png\"><div>{{getInfo().validationMessage}}</div></div><div ng-transclude></div></div></div>");$templateCache.put('$/angular/templates/mm-field-text.html', "<div class=\"field_row\" ng-hide=\"getInfo().hidden === true\"><div ng-click=\"logField()\">{{getInfo().fieldTitle}}</div><div><div class=\"field_error_message_flash\" ng-show=\"errorMessage.length&gt;0\"><div>{{errorMessage}}</div><img src=\"/assets/images/question_field_error_message_icon_arrow.png\"></div><input ng-disabled=\"getInfo().disabled\" placeholder=\"{{getInfo().placeholder}}\" numbers-only=\"{{getInfo().numbersOnly}}\" focus-me=\"getInfo().focus()\" ng-class=\"{input_number: getInfo().numbersOnly === 'integer' || getInfo().numbersOnly === 'double'}\" ng-model=\"getInfo().field\" type=\"{{fieldType}}\"></div><div><div ng-if=\"isValidationDefined\"><img src=\"/assets/images/field_valid.png\" ng-if=\"!hideIsValidIcon\" ng-show=\"getInfo().isValid\"><div class=\"error_message\" ng-hide=\"getInfo().isValid\"><img src=\"/assets/images/field_invalid.png\"><div>{{getInfo().validationMessage}}</div></div></div><div ng-transclude></div></div></div>");$templateCache.put('$/angular/templates/mm-field-auto-completion.html', "<div class=\"field_row\" ng-hide=\"getInfo().hidden === true\"><div ng-click=\"logField()\">{{getInfo().fieldTitle}}</div><div><angucomplete minlength=\"1\" pause=\"400\" ng-disabled=\"getInfo().disabled\" id=\"members\" titlefield=\"content\" inputclass=\"form-control form-control-small\" placeholder=\"{{getInfo().placeholder}}\" selectedobject=\"result\" datafield=\"values\" url=\"{{getInfo().url}}\"></angucomplete></div><div><img src=\"/assets/images/field_valid.png\" ng-if=\"!hideIsValidIcon\" ng-show=\"getInfo().isValid\"><div class=\"error_message\" ng-hide=\"getInfo().isValid\"><img src=\"/assets/images/field_invalid.png\"><div>{{getInfo().validationMessage}}</div></div><div ng-transclude></div></div></div>");$templateCache.put('$/angular/templates/mm-welcome.html', "<div><nav class=\"navbar navbar-default\" role=\"navigation\"><div class=\"container-fluid\"><div class=\"navbar-header\"><button class=\"navbar-toggle collapsed\" data-target=\"#bs-example-navbar-collapse-1\" data-toggle=\"collapse\" type=\"button\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button><a class=\"navbar-brand\" href=\"#\">Money Maker</a></div><div id=\"bs-example-navbar-collapse-1\" class=\"collapse navbar-collapse\"><ul class=\"nav navbar-nav\"><li ng-class=\"{'active' : $root.isMenuCurrentlySelected('/currency') == true}\"><a ng-click=\"nav('/currency')\">Currency</a></li><li ng-class=\"{'active' : $root.isMenuCurrentlySelected('/stock') == true}\"><a ng-click=\"nav('/stock')\">Stock</a></li><li ng-class=\"{'active' : $root.isMenuCurrentlySelected('/myShare') == true}\"><a ng-click=\"nav('/myShare')\">My share</a></li></ul></div></div></nav><div ng-view></div></div>");$templateCache.put('$/angular/templates/mm-chart-area.html', "<div><div id=\"{{id}}\" style=\"height: 400px; min-width: 310px\" class=\"chart\"></div></div>");$templateCache.put('$/angular/templates/mm-modal-create-currency.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"save()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Create share</h4></div><div class=\"modal-body\"><div class=\"field_form\"><mm-field-text ng-info=\"fields.name\"></mm-field-text><mm-field-text ng-info=\"fields.symbol\"></mm-field-text></div></div><div class=\"modal-footer\"><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"save();\" type=\"button\">Save</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");$templateCache.put('$/angular/templates/mm-modal-sell-share.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"save()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Sell share {{getParams().share.stock.symbol}}</h4></div><div class=\"modal-body\"><div class=\"field_form\"><mm-field-date ng-info=\"fields.date\"></mm-field-date><mm-field-text ng-info=\"fields.price\"></mm-field-text></div><div class=\"modal-footer\"></div><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"save();\" type=\"button\">Save</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");$templateCache.put('$/angular/templates/mm-modal-manager.html', "<div></div>");$templateCache.put('$/angular/templates/mm-modal-create-share.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"save()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Create share</h4></div><div class=\"modal-body\"><div class=\"field_form\"><mm-field-auto-completion ng-info=\"fields.stock\"></mm-field-auto-completion><mm-field-text ng-info=\"fields.stockEdit\"></mm-field-text><mm-field-date ng-info=\"fields.date\"></mm-field-date><mm-field-text ng-info=\"fields.nb\"></mm-field-text><mm-field-text ng-info=\"fields.price\"></mm-field-text><mm-field-date ng-info=\"fields.sellDate\"></mm-field-date><mm-field-text ng-info=\"fields.sellPrice\"></mm-field-text></div><div class=\"modal-footer\"></div><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"save();\" type=\"button\">Save</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");$templateCache.put('$/angular/templates/mm-modal-sell-simulation.html', "<!--Modal--><div class=\"modal\" ng-escape=\"close()\" ng-enter=\"simulation()\"><div class=\"modal-dialog\"><div class=\"modal-content\"><div class=\"modal-header\"><button class=\"button\" ng-click=\"close()\" type=\"button\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button><h4 class=\"modal-title\">Create share</h4></div><div class=\"modal-body\"><div class=\"field_form\"><div class=\"field_row\"><div>Buy</div><div><input ng-model=\"buy\" type=\"checkbox\"></div></div><mm-field-auto-completion ng-info=\"fields.stock\"></mm-field-auto-completion><mm-field-date ng-info=\"fields.date\"></mm-field-date><mm-field-text ng-info=\"fields.nb\"></mm-field-text><mm-field-text ng-info=\"fields.buyPrice\"></mm-field-text><mm-field-text ng-info=\"fields.sellPrice\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.totalCurrency\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.exchangeRate\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.price\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.tax\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.value\"></mm-field-text><mm-field-text ng-info=\"fieldsResult.percentCost\"></mm-field-text></div><div class=\"modal-footer\"></div><div ng-hide=\"isLoading\"><button class=\"button btn btn-primary\" ng-click=\"close();\" type=\"button\">Cancel</button><button class=\"button btn btn-primary\" ng-disabled=\"!allFieldValid()\" ng-click=\"simulation();\" type=\"button\">Simulate</button></div><img src=\"/assets/images/modal-loading.gif\" ng-show=\"isLoading\"></div></div></div></div>");});