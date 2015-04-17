/// <reference path='../_all.ts' />

module mjollnir {
    export interface IDashboardScope extends ng.IScope {
        vm: DashboardCtrl;
        userService: UserResource;
        users: any;

        teams: any;

        dates: string[];
        hourThreshold: number;
        selectedTeam: string;
        startDate: any;
        endDate: any;
    }
}