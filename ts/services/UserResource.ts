/// <reference path='../_all.ts' />

module mjollnir {
    export class UserResource implements IUserResource {

        public static $inject = [
            '$http',
            'ApiBaseUrl',
            'ApiKey'
        ];

        private http:ng.IHttpService;

        constructor(
            private $http:ng.IHttpService,
            private ApiBaseUrl:string,
            private ApiKey:string
        ) {
            this.http = $http;
        }

        all () : ng.IPromise<string> {

            var call : ng.IPromise<string> = this.http
                .get(this.ApiBaseUrl + 'users?per_page=100', new HttpConfig(this.ApiKey))
                .then( (response) => {
                    return response.data['data'];
                });

            return call;
        }

        timesheet (userId: string, startDate: string, endDate: string) : ng.IPromise<string> {
            var call : ng.IPromise<string> = this.http
                .get(this.ApiBaseUrl + 'users/' + userId + '/time_entries?from=' + startDate + '&to=' + endDate + '&per_page=100', new HttpConfig(this.ApiKey))
                .then( (response) => {
                    return response.data['data'];
                });

            return call;
        }

    }
}