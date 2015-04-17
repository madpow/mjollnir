/// <reference path='../_all.ts' />

module mjollnir {
    export class HttpConfig implements ng.IRequestShortcutConfig {

        public headers:any;

        constructor (
            private ApiKey:string
        ) {
            this.headers = {'Auth' : this.ApiKey};
        }

    }
}