# Pantry Cook
#### Document Owned by: Tina Carter

## Table of Contents
* [References Used](#references-used)
* [Current State of the Server](#current-state-of-the-server)
* [How to Duplicate this Portion of the Project](#how-to-duplicate-this-portion-of-the-project)
* [How to Update the Global Page](#how-to-update-the-global-page)

## References Used
`Ubuntu 25.10` `Apache 2.4.43` `Wampserver 3.4.0` `GitHub Pages` `Wordpress 6.9.1`

https://www.geeksforgeeks.org/git/publish-websites-on-github-pages-with-a-custom-domain/

https://support.linksys.com/kb/article/318-en/

https://wordpress.org/download/

https://docs.npmjs.com/about-npm

https://stackoverflow.com/questions/49275342/what-does-npm-run-do

https://teamtreehouse.com/library/build-a-simple-dynamic-site-with-nodejs

https://teamtreehouse.com/community/how-to-call-nodejs-in-html-file

https://httpd.apache.org/

https://www.youtube.com/watch?v=LnOaURGIdbA

https://www.youtube.com/watch?v=U-Xi0EsMI0Y

<br>&emsp; Author(?) "Title of Website or Video or Document," host location (i.e. geeks for geeks), https://url-access-example.

## Current State of the Server 
`functional` but `out of date` internal to a network access accross devices
<br> `Ubuntu 25.10` `VirtualBox 7.1.12` 
* keep the local version running (not including a second terminal running .server/mongo.js)
* the website can now be accessed by anyone on that network without needing to have or deploy the code or run any terminals

ISSUES: `time remaining to fix: 10` `time spent so far: 5`
* currently, server/mongo.js must be running on the same machine as the place the website is accessed (i.e. the mongo.js is not being transmitted on the open network URL)
--> the most recently available version of PantryCook that this works for it from last week.
* fixing this necessitates more closely linking mongo.js with the deployment of the website overall OR also making the mongo.js call avaiable in the network URL
* calling 'node ./server/mongo.js/' in the terminal of the 'other device' (in addition to being counterproductive to the point of hosting the website without needing to comand line it) doesn't work without the codebase also being avaiable on the 'other device'

`placeholder` locally accessable website linked to codebase
* in the process of attempting to make a global website, a (not globally deployed, so trivial to do so over network, and fairly east to do so) a webpage with a server and database through wordpress that is not associated with our codebase has been deployed. Attaching this to our codebase would be a fairly cumbersome process.

![Website Demo Wordpress](./media/pantry_cook_with_wordpress.jpg)

`placeholder` globally avaiable website
* the link "https://a-gr1f.github.io/HuttTest/" is a currently in progress link that leads to a website that is globally avaiable and associated with up to date codebase (as of 27/03/2026 14:37), but that doesn't acctually access it.
* the code in the gitHub repo it is built from is _not_ from any development code in our bitbucket, because index.html, package.json, and vite.config.js have been modified and start-dev.js has been created such that (rather than a blank page, as loads if gitHub page is loaded through dev2, the most up to date branch 27/03/2026) a button asking to 'Start Dev Server' is present, that when pushed (and key input) attempts _and fails_ to load the comand prompts that lead to the website opeing locally 

![Website Demo GitHub](./media/pantry_cook_with_github.jpg)


## How to Duplicate this Portion of the Project

don't

## How to Update the Global Page

1. what to do to update the server.
2. and then this.
3. another step.

## Project By:
Miguel Alvarez, Tina Carter, Juan Estrada, Christian Johnson, Patrick Rucker