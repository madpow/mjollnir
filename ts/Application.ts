/// <reference path='_all.ts' />

/**
 * The mjollnir module
 *
 * @type {angular.Module}
 */
module mjollnir {
    'use strict';

    var mjollnir = angular.module('mjollnir', ['ngRoute', 'pascalprecht.translate'])
        .constant('ApiBaseUrl', 'https://api.10000ft.com/api/v1/')
        .constant('ApiKey', 'YOUR_API_KEY_HERE')
        .config(function($routeProvider: ng.route.IRouteProvider) {
            $routeProvider
                .when('/', {
                    controller: 'DashboardCtrl',
                    templateUrl: 'templates/dashboard.html'
                })
        })
        .config(function($translateProvider: angular.translate.ITranslateProvider) {
            $translateProvider.useStaticFilesLoader({
                prefix: '../js/i18n/locale-',
                suffix: '.json'
            });

            $translateProvider.preferredLanguage('en');
        })
        .service('UserResource', UserResource)
        .controller('DashboardCtrl', DashboardCtrl);
}