/// <reference path='../_all.ts' />

module mjollnir {
    export interface IUserResource {
        all () : ng.IPromise<string>
    }
}