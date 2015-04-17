/// <reference path='../_all.ts' />

module mjollnir {

    export class DashboardCtrl {

        public static $inject = [
            'UserResource',
            '$scope'
        ];

        private userResource:UserResource;
        private scope:IDashboardScope;

        constructor(
            userService:UserResource,
            $scope:IDashboardScope
        ) {
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

        totalHours = (user: any) => {
            var hours : number = 0;

            _.each(user['dates'], (date : any) => {
                hours = hours + parseFloat(date['hours']);
            });

            return hours;
        };

        search = () => {
            // Fetch all users in organization
            this.userResource.all().then( (users : any) => {

                // If team has been selected, filter users based on that
                if(this.scope.selectedTeam) {
                    this.scope.users = _.filter(users, (user : any) => {
                        return user['discipline'] === this.scope.selectedTeam['discipline'] ? user : null;
                    });
                } else {
                    this.scope.users = users;

                    // Build team list
                    this.scope.teams = _.uniq(this.scope.users, (user) => {
                        return user['discipline'];
                    });
                }

                // Restrict timesheet fetch by date range
                var startDate = moment(this.scope.startDate);
                var endDate = moment(this.scope.endDate);
                var range = moment().range(startDate, endDate);

                // Clear out existing date selection
                this.scope.dates = [];

                range.by('days', (day) => {
                   this.scope.dates.push(day.format('YYYY-MM-DD'));
                });

                // Iterate through users
                _.each(this.scope.users, (user: any, userIndex: number) => {

                    // For each user, fetch their timesheet for the specified period
                    this.userResource.timesheet(user['id'], this.scope.dates[0], this.scope.dates[this.scope.dates.length - 1]).then( (timesheet) => {

                        // Initialize an empty dates object
                        this.scope.users[userIndex].dates = [];

                        // For each selected date, query timesheet and push data into user.dates object
                        // This is necessary because we cannot guarantee dates coming out of 10kft are in order
                        // It appears that they come out in order of entry: so if I enter Friday's time before Monday,
                        // Friday's time will be ordered before Monday in API response
                        _.each(this.scope.dates, (date: any, dateIndex: number) => {

                            var hours : number = 0;

                            _.each(_.where(timesheet, {'date': date, 'user_id': user['id']}), (time: any) => {
                               hours = hours + parseFloat(time['hours']);
                            });

                            this.scope.users[userIndex].dates.push(
                                {
                                    'date': date,
                                    'hours': hours
                                }
                            );

                        });

                    });

                });
            });
        };

    }

}