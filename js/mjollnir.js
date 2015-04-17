/// <reference path='../_all.ts' />
var mjollnir;
(function (mjollnir) {
    var HttpConfig = (function () {
        function HttpConfig(ApiKey) {
            this.ApiKey = ApiKey;
            this.headers = { 'Auth': this.ApiKey };
        }
        return HttpConfig;
    })();
    mjollnir.HttpConfig = HttpConfig;
})(mjollnir || (mjollnir = {}));
/// <reference path='../_all.ts' />
var mjollnir;
(function (mjollnir) {
    var DashboardCtrl = (function () {
        function DashboardCtrl(userService, $scope) {
            var _this = this;
            this.totalHours = function (user) {
                var hours = 0;
                _.each(user['dates'], function (date) {
                    hours = hours + parseFloat(date['hours']);
                });
                return hours;
            };
            this.search = function () {
                // Fetch all users in organization
                _this.userResource.all().then(function (users) {
                    // If team has been selected, filter users based on that
                    if (_this.scope.selectedTeam) {
                        _this.scope.users = _.filter(users, function (user) {
                            return user['discipline'] === _this.scope.selectedTeam['discipline'] ? user : null;
                        });
                    }
                    else {
                        _this.scope.users = users;
                        // Build team list
                        _this.scope.teams = _.uniq(_this.scope.users, function (user) {
                            return user['discipline'];
                        });
                    }
                    // Restrict timesheet fetch by date range
                    var startDate = moment(_this.scope.startDate);
                    var endDate = moment(_this.scope.endDate);
                    var range = moment().range(startDate, endDate);
                    // Clear out existing date selection
                    _this.scope.dates = [];
                    range.by('days', function (day) {
                        _this.scope.dates.push(day.format('YYYY-MM-DD'));
                    });
                    // Iterate through users
                    _.each(_this.scope.users, function (user, userIndex) {
                        // For each user, fetch their timesheet for the specified period
                        _this.userResource.timesheet(user['id'], _this.scope.dates[0], _this.scope.dates[_this.scope.dates.length - 1]).then(function (timesheet) {
                            // Initialize an empty dates object
                            _this.scope.users[userIndex].dates = [];
                            // For each selected date, query timesheet and push data into user.dates object
                            // This is necessary because we cannot guarantee dates coming out of 10kft are in order
                            // It appears that they come out in order of entry: so if I enter Friday's time before Monday,
                            // Friday's time will be ordered before Monday in API response
                            _.each(_this.scope.dates, function (date, dateIndex) {
                                var hours = 0;
                                _.each(_.where(timesheet, { 'date': date, 'user_id': user['id'] }), function (time) {
                                    hours = hours + parseFloat(time['hours']);
                                });
                                _this.scope.users[userIndex].dates.push({
                                    'date': date,
                                    'hours': hours
                                });
                            });
                        });
                    });
                });
            };
            this.scope = $scope;
            this.scope.vm = this;
            this.userResource = userService;
            this.scope.dates = [];
            // Search criteria
            this.scope.hourThreshold = 7;
            this.scope.selectedTeam = null;
            this.scope.startDate = '2015-03-30';
            this.scope.endDate = '2015-04-03';
            this.search();
        }
        DashboardCtrl.$inject = [
            'UserResource',
            '$scope'
        ];
        return DashboardCtrl;
    })();
    mjollnir.DashboardCtrl = DashboardCtrl;
})(mjollnir || (mjollnir = {}));
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
/// <reference path='../_all.ts' />
var mjollnir;
(function (mjollnir) {
    var UserResource = (function () {
        function UserResource($http, ApiBaseUrl, ApiKey) {
            this.$http = $http;
            this.ApiBaseUrl = ApiBaseUrl;
            this.ApiKey = ApiKey;
            this.http = $http;
        }
        UserResource.prototype.all = function () {
            var call = this.http.get(this.ApiBaseUrl + 'users?per_page=100', new mjollnir.HttpConfig(this.ApiKey)).then(function (response) {
                return response.data['data'];
            });
            return call;
        };
        UserResource.prototype.timesheet = function (userId, startDate, endDate) {
            var call = this.http.get(this.ApiBaseUrl + 'users/' + userId + '/time_entries?from=' + startDate + '&to=' + endDate + '&per_page=100', new mjollnir.HttpConfig(this.ApiKey)).then(function (response) {
                return response.data['data'];
            });
            return call;
        };
        UserResource.$inject = [
            '$http',
            'ApiBaseUrl',
            'ApiKey'
        ];
        return UserResource;
    })();
    mjollnir.UserResource = UserResource;
})(mjollnir || (mjollnir = {}));
/// <reference path='libs/angular/angular.d.ts' />
/// <reference path="libs/angular/angular-route.d.ts" />
/// <reference path="libs/angular/angular-translate.d.ts" />
/// <reference path="libs/underscore/underscore.d.ts" />
/// <reference path="libs/moment/moment.d.ts" />
/// <reference path='classes/HttpConfig.ts' />
/// <reference path='controllers/DashboardCtrl.ts' />
/// <reference path='interfaces/IDashboardScope.ts' />
/// <reference path='interfaces/IUserResource.ts' />
/// <reference path='services/UserResource.ts' />
/// <reference path='Application.ts' /> 
/// <reference path='_all.ts' />
/**
 * The mjollnir module
 *
 * @type {angular.Module}
 */
var mjollnir;
(function (_mjollnir) {
    'use strict';
    var mjollnir = angular.module('mjollnir', ['ngRoute', 'pascalprecht.translate']).constant('ApiBaseUrl', 'https://api.10000ft.com/api/v1/').constant('ApiKey', 'YOUR_API_KEY_HERE').config(function ($routeProvider) {
        $routeProvider.when('/', {
            controller: 'DashboardCtrl',
            templateUrl: 'templates/dashboard.html'
        });
    }).config(function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: '../js/i18n/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
    }).service('UserResource', _mjollnir.UserResource).controller('DashboardCtrl', _mjollnir.DashboardCtrl);
})(mjollnir || (mjollnir = {}));
