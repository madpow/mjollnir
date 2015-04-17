# Mjollnir
Produces reports on hours entered into 10000ft on an organization and team basis for specific date ranges.

## Mythology
You can read more about Mjöllnir (Thor's Hammer) here: http://norse-mythology.org/symbols/thors-hammer/

## Built with

 * AngularJS via Typescript
 * MomentJS
 * UnderscoreJS

## Configuration
 * In `ts/Application.ts` set the `ApiKey` constant.
 * Optional: In `ts/Application.ts` set the `ApiBaseUrl` constant. This is set to production by default, but for testing you should point to either vnext or preprod. 
 * `gulp ts` to compile typescript

## Development

 * `npm install` to install dependencies
 * `gulp srv` to launch local server
 * `gulp ts` to compile typescript

## Thanks

Special thanks to Mad*Pow (http://www.madpow.com) for supporting the development of this app. 