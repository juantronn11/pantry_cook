# Research Notes: Servers and Websites <span style="font-size: 20px;">by Tina Carter</span>
### time: `2` (or maybe more like `7`)

## What are different ways to make a website accessable outside of localhost?

### Use a Hosting Service/Deploy to Cloud Services:
borrow someone eles' server, essentially... or download server creation/hosting service 
the 'borrow a server bit'-->AWS, or Google Cloud// free tiers with limited resources, perfect for small projects or testing.
or dowload service to make your own-->Apache and/or Wampserver (which... utilizes apache... apache is just server, wamp is also database creation and a couple other things). There are others, but I didn't use any so no details to add.

### Register a Domain Name
uhhh... used to cover IP addressed... a lot of places that you can regester domain names also have... like GUI form website creater things (wordpress the website.. did they get aquired/split, something about the capitolisation... I'm pretty sure tehre are two trademarks... to google when I'm not doing HW, or like Squarespace I think is a big one). Um, you can find free ones as long as you're okay with uggly-ish names and/or not .com s...

### Port Forwarding:
Hosting the website from a home server (junk laptop, virtual machine, raspberrypi/ardunio --> I have a RaspberryPI, which could be used next sprint to perminantly host a server for the rest of the semester, rather that a VM on my laptop, which had be be closed/reboot (and slowed down my laptop) which made testing slow and cumbersome, and access for others dificult to guarentee... essentially this server was down more than it was up, which isn't good practive), by configuring your router to forward requests from a certain port (80 for HTTP, 443 for HTTPS, 22 for SSH) to your machine's local IP address. Then external traffic can reach your local server from that port without _necessarily_ seeing/interacting directly with your IP address (as is done with localhost Network... see below).
IE If you run a web server locally with an IP address 192.168.X.XX, then configure your router to forward requests from port 80 (HTTP) to 192.168.X.XX (so the requests aren't straight to private IP). So, entering your public IP followed by port 80 will display your website. This can be further masked by getting a domain name, and linking the domain name to your IP in htpd.config files (or similar, this was the name for Wampserver).
This is essentially what npm run dev -- --host does, using the network URL to access a website that's hosted on one device in a network on another device, by 'forwarding it' over that network.
A network URL specifies the location of a resource and the protocol used to retrieve it.Components of a URL:
Protocol: http, https, ftp then Domain Name or IP Address: The address of the server hosting the resource (ie., www.example.com, 192.168.1.1) // hence getting a domain to cover the IP. Port (Optional?? apparently??): Specifies what port the server is listening to (80 for HTTP,443 for HTTPS, 22 for SSH, etc). The stuff after the / is called 'path': which is the same as file path, aka what and where is the specific resource/file on the server that you're accessing (/path/to/resource). (localhost:????/History vs localhost:???/Saved)

### Application Frameworks: (is that what this is called??)
publish directly to hosting services or GitHub Pages, which can make your website publicly accessible from a subdomain (or no, from a specific path) off of the broader domain of github (with your account appended for location tracking),... runs index.html, like everything else, which is waht caused the issues.


## What are relevant things to know when hosting a website?
- router (not the modem, lol I spent way too long looking for the router password on my modem. Please get eight hours of sleep and maybe google what it looks like after 5 minutes unstead of 20).
- depending on your network and device firewalls, running a server may not be possible without changing them, because most private network firewalls try to limit lots of pings from unknown IPs to your outward facing ports, actually. I wasn't haivng this problem too much, but mostly because all the devices (and thus IPs) were local to the network I was on on both networks I was trying this with 
- ... I need to change the disk configs. on my virtual box. I think I have some old files from last semester that I just never moved, but accessing files in VM is a pain, and I can't find the disk location on my machine (good job VM for actaully sandboxing, but please be worse, actually. Forget what I used in like... winter 2024, but way easier to move files in it from my OS inside it's boxed-OS)

## How does website display with index.html differ from npm run /script/?
index.html is the 'automaic' way to do it... very easy, relies on browser to... like carry the burden of running things.. comands and such, and in... providing a path to access places (i.e. the browser reaches out to APIs, kinda) 
* The web server automatic config == look for an index.html file in /root (or specified path, usually /doc?) when a website loads.
* content/styles (CSS)/scripts (JavaScript) are linked within the index.html file... like they need to be called by the file directly or indirectly. If index doesn't call them somehow, the file won't run/be touched/whatever
* static content... which is why we've been using npm run dev, because our content isn't static, it's loading differnt information from mongoDM/spoonacular

commandline > npm run /script/ executes the script, usually defined in 'package.json'. Usually building or testing or starting a Node.js application or frontend (React, in our case), hence both `npm run dev` and `npm run test` etc.
"Usually involves a development server that provides more dynamic capabilities." uuhh, dynamicness is why we used it... like when you run the comand Express (our dev. server) starts which then schedules all the processes that are covered under the `dev` (or `test` etc.) script (read: "comand", but not like comandline "command").
* you can have app fetch data dynamically, which index doesn't allow for (why not? uh, see: https://stackoverflow.com/questions/64527420/how-to-pass-data-from-fetch-api-to-index-html and https://www.youtube.com/watch?v=-PmNcIX9En4 TLDR: static file = static data... but you _can_ bypass that, just automatically, index.html is one file, run once or on called repeat, but it doesn't make calling new data, for example, an easy thing to implement due to non-recursion nature? see 'hot reloading'--> see changes without refreshing the browser, auto-update the webpage,essentially. THis was causing issues with overalling the API because of auto rerunning fetch whenever the type-in changed, in order to use autofill from ??? I forget where. I'm pretty sure this is currently patched with a 'wait X time then request all at once' to take into acount typing speed =/= instantaneous and such).


## What are potential ways to make our current npm deployment work on index.html and/or are there other ways to fix the problem?
Don't.

### Change Scripts in package.json to automatically run build steps before deployment:
details if i have anything to elaborate on

## Citation
lots of overlap from ServerDocumentation.md

<br>&emsp; "Publish Websites on Github Pages with a Custom Domain," geeksforgeeks, https://www.geeksforgeeks.org/git/publish-websites-on-github-pages-with-a-custom-domain/.
<br>&emsp; "How to set up Port Forwarding on the Linksys Smart WiFi router using the local access interface," linksys, https://support.linksys.com/kb/article/318-en/.
<br>&emsp; "About npm," npm Docs, https://docs.npmjs.com/about-npm
<br>&emsp; "What does npm run do?" stackoverflow, https://stackoverflow.com/questions/49275342/what-does-npm-run-do.
<br>&emsp; "Build a Simple Dynamic Site with Node.js," teamtreehouse, https://teamtreehouse.com/library/build-a-simple-dynamic-site-with-nodejs.
<br>&emsp; "How to call nodejs in html file?" teamtreehouse, https://teamtreehouse.com/community/how-to-call-nodejs-in-html-file.
<br>&emsp; Indigo Software LLC, "How To Host Your Own Website For Free," youtube, https://www.youtube.com/watch?v=LnOaURGIdbA.
<br>&emsp; Redian TopNotch Programmer, "How to Host your Website locally into a Ubuntu Virtual Machine," youtube, https://www.youtube.com/watch?v=U-Xi0EsMI0Y.
DIFFERENT CITATIONS FROM SERVERDOCUMENTATION FROM HERE DOWN:
<br>&emsp; "How to pass data from Fetch API to index.html," stackoverflow, https://stackoverflow.com/questions/64527420/how-to-pass-data-from-fetch-api-to-index-html.
<br>&emsp; BugBytes, "Python and Requests-HTML - Web Scraping Dynamic Content from JavaScript applications," youtube, https://www.youtube.com/watch?v=-PmNcIX9En4.
<br>&emsp; "How to deploy a simple HTML/CSS/JS site that uses some node packages?" redit, https://www.reddit.com/r/node/comments/naxe6t/comment/gxwbhjj/.
<br>&emsp; "Deploying a Static Site," Vite v3, https://v3.vitejs.dev/guide/static-deploy.html.
<br>&emsp; "Deployment," Create React App, https://create-react-app.dev/docs/deployment/.
<br>&emsp; "Deploying a Static Site," Vite v2, https://v2.vitejs.dev/guide/static-deploy.html.
<br>&emsp; `not very relevant` "Simplify deployments with Netlify’s branch-matching environment variables," netifly, https://developers.netlify.com/guides/simplify-deployments-with-netlifys-branch-matching-environment-variables/. 
<br>&emsp;`not very relevant` "Why do we push the building app and not only the html files on netlify?" netiflyforums, https://answers.netlify.com/t/why-do-we-push-the-building-app-and-not-only-the-html-files-on-netlify/22234/.
<br>&emsp; "About npm run build and deployment," Laracasts, https://laracasts.com/discuss/channels/vite/about-npm-run-build-and-deployment.
<br>&emsp; "Express Tutorial Part 7: Deploying to production," mdn_, https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Server-side/Express_Nodejs/deployment.
<br>&emsp; "How to deploy my HTML website using GitHub Pages?" github, https://github.com/orgs/community/discussions/160361.
<br>&emsp;`sidequest` "Did You Know There Are Two Different Versions of WordPress?" rangemarketing, https://rangemarketing.com/did-you-know-there-are-two-different-versions-of-wordpress/.
<br>&emsp; Author(?) "Title of Website or Video or Document," host location (i.e. geeks for geeks), https://url-access-example.
