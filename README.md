# Pantry Cook

### What is this repository for? ###

This is the README document for CS 3398.253 Spring 2026 Hutt's semester project: Recipe App.
The purpose of this project is to provide a UI where you can input ingredients (i.e. what you have at home)
and be provided recipes that use those ingredients and only those ingredients. This is for people who want
to cook with what they already have. This app has the potential to reduce home food waste and povide a way to
cook on budget.

## Table of Contents
* [How do I get set up?](#how-do-i-get-set-up)
* [General Info](#general-information)
* [Contribution Guidelines](#contribution-guidelines)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Images](#images)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)

## How do I get set up?

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server`
Start a local access port for MongoDB:
```bash
node ./server/mongo.js
```
In a different terminal, start the local dev server:
```bash
npm run dev
```
This will open the app at `http://localhost:5173/`. The server hot-reloads automatically — any file changes you save will instantly update in the browser.

To also access the app from a phone or another device on the same Wi-Fi network:
```bash
npm run dev -- --host
```
This exposes a **Network URL** (e.g. `http://192.168.x.x:5173/`) that you can open on any device connected to the same network.

Stop the server with `Ctrl + C`.

### Running Unit Tests
#### Prerequisites
- Vitetest (npm install -D vitest)

Run the full test suite:
```bash
npm test
```
This runs all unit tests using [Vitest](https://vitest.dev/). Tests cover the API services, RecipeContext, and all React components. All fetch calls are mocked — no API keys or internet connection needed.

To run tests in watch mode (re-runs on file changes):
```bash
npm test -- --watch
```
To run specific tests: 'patrick' can be replaced with 'miguel', 'tina', 'juan', or 'christian'
```bash
npm test:patrick
```
Specific details of what each person's tests run, see documentation/tests/&#60;any folder> and read the file with name in the form: "Name_Assignment-14-test-plan.md"

### Building for Production
To deploy or present the app, run:
```bash
npm run build
```
This compiles and bundles all the project files (JSX, CSS Modules, etc.) into a `dist/` folder containing plain HTML, CSS, and JS that any browser can run — no Node.js or dev server needed. You can upload the `dist/` folder to any web host to make the app publicly accessible.

## General Information
- This app solves the common problem of not knowing what to cook with the ingredients you already have at home.
- Users select ingredients from a form, and the app returns matching recipes using the Spoonacular API.
- The goal is to reduce food waste and help users cook on a budget without needing to buy extra ingredients.

## Contribution guidelines

* Writing tests
    - Tests are written using vitest formatting
    - ELEPHANT details?
* Code review
    - All PRs must be approved by two team members before it can be merged (with the logic that the requester and two other group members means '3 aprovals' which is more than half of the group (5 people))
* Development
    - All development is to be done off (and back into) a development branch (name guide 'dev#') off of main. All development features should be completed before dev-branch is comitted to main-branch.
    - Commits to a branch ('mergeing') should be done by:
    1. `Rebasing` feature/bugfix branch onto development
    2. `Testing` new version of feature/bugfix branch
    3. `Rebasing` development branch onto feature/bugfix branch
    4. `Testing` new version of devlopment branch
    5. `Squashing` all commits on **devlopment** from the feature/bugfix branch and `Labeling` that squash commit in the format: _SQUASH-&#60;number of commits squashed>-SCRUM-&#60;number>-descriptive-title-of-scrum_
    - Commits from development-branch to main should be done in the same manner, only _after_ all features and bugfixes for a specific development period have been completed and committed to the development branch


## Technologies Used
- **Vite** — Build tool and development server
- **React 19** — Frontend UI library
- **React Router DOM** — Client-side page routing
- **CSS Modules** — Scoped component styling
- **Spoonacular API** — Recipe search by ingredient
- **Express** — Backend server (for API calls)
- **JavaScript (ES6+)** — Programming language

## Features
- MVP: webpage with radial buttons of searchable ingredients (API is queried for recipies matching each button chosen, overlaping recipes returned), returns (visible to user) list of recepies (format TBD*)
    * list of images of recepies (with name?) that are clickable links, just list of recipe names that are clickable links; API returns as json
- initially, the only retention is: user is returned a downloadable recipe

**Specific features for MVP:**
* Choose your ingredient: Multi-select Buttons search form for ingredients
* Search for recipe: Search button (i.e. click all buttons. do not search until search button AKA do not search after each updated button selections)
* Recipes are searched for: Recipes are returned that are relevant (i.e. do contain ingredients from form)
    * recipes are returned with NAME of recipe, PICTURE(?) (less important) and LINK to full recipe/recipe discription
    * recipes are returned in RELAVANCY order (i.e. most matching ingredients comes before fewer matching ingredients)
* Make Recipes Downloadable: All recipes can be downloaded as PDFs by user from DOWNLOAD button... on each recipe display (i.e. with name of recipe/image/link)
    - specific task suggested by Claude, per Spring Assignment 4: (for full discriptions of each task, see Jira: User Story 4, subtasks)
        * Task 1 – Design the Print/Download UI Component
        * Task 2 – Implement the Print Functionality (React + Browser API)
        * Task 3 – Implement the PDF Download Functionality (Client-Side Generation)
        * Task 4 – Build the Express API Endpoint for Server-Side Recipe Retrieval
        * Task 5 – Unit Testing for Print/Download Features

**Specific features for Deployment 2:**
* Choose your ingredients (up to 5): via type-in field with auto complete drop down options for recognized ingredients
* Exclude ingredients: type-in field with same auto complete drop down as include ingredients.
    * implemented to minimize API calls: if a search is modified to exclude an ingredient, the sorting is done through a local cache array(ELEPHANT?) of the recipes and their ingredients from original search.
* Search function/recipes in tile grid displays only after 'search' button is clicked. IE not every time a key in pressed or ingredient is selected.
* Log in feature has been added.
* Recipes can be saved in association with specific user login. Save button does not dispay if user is not logged in.
* Search history of the last 30 days or 100 searches displays in history tab. It is locally saved for both logged in and non-logged in users.
* API calling minimized by implementing local cache of recipes that have been recently search.

**Specific features for Deployment 3:**
* Shopping List page: a dedicated Shopping List page accessible from the navbar. Users can add a recipe's ingredients to the list from the recipe tile, manually add custom items (e.g. "paper towels"), check items off, remove individual items, or clear the whole list. Duplicate ingredients across recipes are merged with combined amounts. Persisted to MongoDB for logged-in users so the list survives across sessions and devices.
* Dark mode toggle: a theme toggle in the navbar switches the entire app between light and dark color schemes. Implemented with CSS custom properties so all pages and components stay consistent. The user's selection persists across page refreshes.
* Recipe servings scaler: the recipe modal now has +/- buttons to adjust serving size, and all ingredient amounts scale proportionally. A Reset button restores the original servings. Scaled amounts carry through when the recipe is added to the Shopping List.
* Cook-time filter: a dropdown on the results page filters recipes by cook time (<30 min, 30–60 min, >60 min, or any). Filtering runs client-side against a backup of the full results so changing the filter doesn't trigger a new API call.
* Category-based ingredient exclusion: typing a category like "dairy" or "gluten" into the Exclude Ingredients box now routes to Spoonacular's intolerances API, excluding all matching ingredients in one go instead of requiring the user to type each one.
* Arrow-key autocomplete navigation: both the ingredient input and the exclude-ingredient input support Up/Down arrow keys to walk through autocomplete suggestions, Enter to select, with the active suggestion auto-scrolling to stay visible. Mouse clicking still works, and arrow key and mouse navigation are integrated (i.e. hover with mouse + arrow down -> 'hover' over the ingredient below where mouse hover and Enter while hovering with mouse selects).
* Exact-match exclusion: ingredient exclusions now match exact names instead of substrings — excluding "rice" no longer also excludes recipes containing "licorice". Exact matching expands to include all strings containing the exact string pre- or post-ceded by a space, to ensure different types of the same ingredient are group excluded (i.e. "rice" excludes "jasmine rice").
* History management: the History page now has a Clear All History button (with a confirmation prompt) and a per-entry remove button so users can delete individual searches without wiping everything.
* API result caching with TTL: search results are cached locally so adding/removing exclusions on the same ingredient set doesn't trigger another API call. A time-to-live invalidates stale results.
* "New Search" reset: the New Search button in the navbar now fully clears ingredients, exclusions, intolerances, search results, sort order, and cook-time filter, returning the user to a clean search page.
* Logged-in user display: when a user is logged in, their email is shown in the navbar next to the logout button. Hidden cleanly when logged out.
* History page scroll fix: the History page now loads at the top showing the most recent search instead of auto-scrolling to the bottom.
* User-facing error handling: save failures and other recoverable errors now surface a user-readable message with actionable suggestions, instead of failing silently.
* Public hosting: the app is deployed to a publicly accessible URL with automatic redeploys when the base code changes, so users no longer need to run it locally.

**Potential future features/improvements:**
- Operation Make it Better: 
    `Implemented in Dev2` text entry of ingredients; recepies are returned based on compliance with 'only use ingredients listed by user'
- Operation Make it Better-er:
    `Not Implemented` search for recepies based on compliance with 'ingredients not listed by user are...' CHEAP to find, EASY to find, etc
- Dificult Side Quest:
    `Not Implemented` user input images of ingredients, rather than text entry of ingredients. Ingredients are accurately catagorized in such a way that MVP (and potential future) search functions work as normal with image ingredient entry.
- (Hopefully) Easy Side Quest:
    `Not Implemented` filter recepies by TYPE of food (i.e. cusine)
- Operation Independance Day:
     `Implemented in Dev3` host our own database, so as API is used to query recepies, database is built, so in future API becomes less relevant for accessing recipes from existing database of recipies
- Side Quest Search and Destroy:
    `Implemented in Dev2` searching can be modified to exclude specific ingredients using the text entry format that included ingredients use, in a different text field
- Side Quest Save Me: 
    `Impelemented in Dev2` recipes can be saved on the webapp in association with a specific user

**User Stories for Features**
- Details for each user story and acceptance criteria can be found in Jira.

>`COMPLETE` User Story 1: Individual UI Tiles for Recipes Returned (frontend)
>
>   As a user, I would like to see recipes displayed as individual tiles after entering my available ingredients so that I can quickly browse what I'm able to cook with what I have on hand.

>`COMPLETE` User Story 2: Form Display for User Input (frontend)
>
>   As a user, I would like a form where I can enter the ingredients I currently have in my kitchen so that the app can find recipes I can actually make right now.

>`DUPLICATE` User Story 3: Full Recipe Listing (frontend)
>
>   As a user, I would like to view the full details of a recipe I selected from my search results so that I can see all the ingredients and step-by-step instructions needed to make the dish.

>`COMPLETE` User Story 4: Download/Print Recipe (frontend)
>
>   As a user, I would like to download or print a recipe so that I can follow the instructions in my kitchen without needing to keep the app open on my device.

>`COMPLETE` User Story 5:Navigation Toolbar (frontend)
>
>   As a user, I would like a navigation toolbar so that I can easily switch between searching for recipes with my ingredients, viewing my cooking history, and accessing my saved recipe collection.

>`DUPLICATE` User Story 6: User Form Data (Requests) (backend)
>
>   As a back end developer, I would like the app to accept and process the list of ingredients I submit so that it can search for recipes that match what I have available.

>`COMPLETE` User Story 7: Make Multiple API Requests for Recipe Listing (backend)
>
>   As a back end developer, I would like the app to search across multiple sources or queries based on my ingredient list so that I get a comprehensive set of recipes I can make with what I have.

>`COMPLETE` User Story 8: Filter Recipes for Multiple Ingredients from Multiple Calls (backend)
>
>   As a back end developer, I would like the app to intelligently combine and filter results from multiple searches so that I see recipes ranked by how well they match the ingredients I have on hand.

>`COMPLETE` User Story 9: Storing User Recipe History Locally (backend)
>
>   As a back end developer, I would like the app to keep track of recipes I've viewed so that I can easily find and revisit dishes I was interested in without searching for them again.

>`COMPLETE` User Story 10: Non-Temporary Library Storage (backend)
>
>   As a logged-in user, I would like to save favorite recipes to a personal library tied to my account so that I can build a go-to collection of meals and access them anytime from a dedicated Saved Recipes page.

> `COMPLETE` User Story 11: Recipe Loading Validation
>
>   As a user, I would like the app to verify that recipe data loads correctly so that I am never shown broken, incomplete, or incorrect recipe information in my search results.

> `COMPLETE` User Story 12: Filter Out Ingredients
>
>   As a user, I would like to exclude specific ingredients from my search so that I can avoid recipes containing things I don't want to use, such as allergens or ingredients I dislike.

> `COMPLETE` User Story 13: User Login
>
>   As a user, I would like to create an account and log in so that the app can track my personal search history and saved recipes across sessions.

> `COMPLETE` User Story 14: User Profiles
>
>   As a logged-in user, I would like a profile tied to my login so that my preferences, history, and saved recipes are personal to me and not shared with other users.

> `COMPLETE` User Story 15: Image Loading Validation
>
>   As a user, I would like recipe images to load correctly and display a fallback when they don't so that the app looks polished and I'm never shown broken images. 

> `COMPLETE` User Story 16: Hosted Web Application
>
>   As a user, I would like to access the app from a public URL rather than running it locally so that I can use it from any device without needing to set up the project myself. 
><br/>   As a developer, I want the webapp and server to be globally accessible, so that users can access the app from any device without running it locally.

> `COMPLETE` User Story 17: Shopping List Generator
>
> As a user, I want to generate a shopping list from a recipe, so that I know exactly what ingredients I need to buy without manually writing them down.

> `FUTURE` User Story 18: SOLID Principles Refactor
>
> As a team manager, I want my team's code to follow SOLID principles, so that the codebase is maintainable, testable, and extensible for future sprints.

> `COMPLETE` User Story 19: API Caching Optimization
>
> As a user, I want my search results to be cached, so that adding or removing ingredient exclusions doesn't waste API calls or slow down my experience.


> `COMPLETE` User Story 20: Page Bug Fixes
>
> As a user, I want the app pages to work correctly, so that I can navigate and use the app without unexpected behavior.

> `COMPLETE` User Story 21: History Management
>
> As a user, I want to be able to edit and clear my search history, so that I can remove old or unwanted searches and keep my history clean.

> `COMPLETE` User Story 22: Improved Search & Error Handling
>
> As a user, I want better error messages, smarter exclusions, and keyboard-friendly autocomplete, so that I can troubleshoot issues, exclude ingredient categories easily, and navigate the app efficiently.


> `COMPLETE` User Story 23: Recipe Tile Verification
>
> As a user, I want recipe tiles to only display working links and verified content, so that I don't encounter broken links or invalid recipe data.


> `COMPLETE` User Story 24: Exclusion Filter Bug Fix
> > **Note:** This is associated with **USER STORY 19 (API Caching)** and/or **USER STORY 20 (Bug Fixes)** — it's a bug in the exclusion filtering logic, not a standalone story.
>
> As a user, I want ingredient exclusion to match exact ingredient names, so that excluding "rice" doesn't also remove recipes containing "licorice."


## Images
  #### Example Query: ####
Find recipe with: ☑ chicken | ☑ parmesan | ☑ cream
![Example query](./media/chicken_alfredo.jpg) <br/> &nbsp;&nbsp;&nbsp;&nbsp; _**Chicken Alfredo**_


## Usage
1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173/` in your browser
3. Use the ingredient search form to select ingredients you have at home
4. Click Search to find matching recipes
5. Browse recipe tiles with names, images, and links
6. Download or print any recipe as a PDF


## Project Status
MVP deployed: _functional_ on 02/27/2026 (Feb.)
<br/>Dep2 deployed: _functional_ on 03/30/2026 (Mar.)
<br/>Dev3 deployed: _functional_ on 04/24/2026 (Apr.)

Project is: _in progress_ as of 03/31/2026 (Mar.)

### Sprint 1 Contributions

#### Patrick Rucker

| Jira Task | Title | Bitbucket PR |
|:---------:|-------|-------------------|
| [SCRUM-35](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-35) | Project Scaffolding — Vite + React + React Router Setup | [PR #2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/2) |
| [SCRUM-36](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-36) | The toolbar contains links/buttons for at least: Ingredient Search, Recipe History, and My Saved Recipes | [PR #4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/4) |
| [SCRUM-37](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-37) | The currently active page is visually indicated on the toolbar (e.g., highlighted or underlined) | Included in [PR #4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/4) |
| [SCRUM-38](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-38) | The toolbar is responsive and remains accessible and functional on mobile screen sizes | [PR #9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/9) |
| [SCRUM-58](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-58) | New search button (same as ingredient search, but clears search...) | Included in [PR #4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/4) |
| [SCRUM-67](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-67) | Implement tool tips when hovering over each button on the main tool bar | [PR #19](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/19) |
| [SCRUM-68](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-68) | Merge teams code on dev branch: merges SCRUM-19 to dev, testing and fixing bugs | [Commit fd58154](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/fd58154), [Commit cccfe67](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/cccfe67) |
| [SCRUM-69](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-69) | Merge teams code on dev branch: merges SCRUM-9 to dev, testing and fixing bugs | [Commit e317572](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/e317572) |
| [SCRUM-70](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-70) | Merge teams code on dev branch: merges SCRUM-55 to dev, testing and fixing bugs | [Commit 8258098](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8258098), [Commit f1962dc](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f1962dc), [Commit 112dcec](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/112dcec), [Commit 7a1d6c0](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/7a1d6c0), [Commit 8d964f5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8d964f5) |
| [SCRUM-71](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-71) | Fix Spoonacular API rate limiting and recipe tile click handler | [Commit c26926e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c26926e) |
| [SCRUM-72](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-72) | Set up Vitest and write unit tests for core components and API services | [PR #27](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/27) |

#### Christian Johnson

| Jira Task | Title | Bitbucket Artifact |
|-----------|-------|-------------------|
| [SCRUM-12](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-12) | Error MESSAGES for users | [PR #14](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/14) |
| [SCRUM-13](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-13) | The form validates that at least one ingredient has been entered before allowing submission | [PR #11](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/11) |
| [SCRUM-14](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-14) | Upon submission, the app searches for matching recipes and transitions to display the results | [PR #5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/5) |
| [SCRUM-56](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-56) | Backend error handling for no recipes found → error message for user | [PR #13](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/13) |
| [SCRUM-11](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-11) | There are multi-select buttons for ingredients (nice to have: sorted by ingredient type) and a SEARCH or ENTER button | [PR #8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/8) (Merged), [PR #15](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/15) (Open — In Progress) |

#### Juan Estrada

| Jira Task | Title | Bitbucket Artifact |
|-----------|-------|-------------------|
| [SCRUM-16](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-16) | The backend makes at least one API call per submitted ingredient to the external recipe API | [PR #6](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/6) |
| [SCRUM-17](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-17) | API calls are handled asynchronously so that multiple requests can be processed concurrently without long wait times | [PR #7](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/7) |
| [SCRUM-18](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-18) | If an individual API call fails, the system handles the error gracefully and still returns results from successful calls | [PR #10](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/10), [PR #30](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/30) |
| [SCRUM-19](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-19) | All API responses are collected and aggregated before sending a unified response to the frontend | [PR #20](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/20) |

#### Miguel Alvarez

| Jira Task | Title | Bitbucket Artifact |
|-----------|-------|-------------------|
|[SCRUM-6](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-6)| Create recipe tile object with RECIPE NAME, THUMBNAIL, SUMMARY and LINK fields|[PR #28](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/28), [Commit 53df8fd](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/53df8fd5d2bc451b56957fe22ed3acfc3ce33a56) |
|[SCRUM-7](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-7)|Tiles are rendered in a responsive grid layout that adjusts to different screen sizes (desktop, tablet, mobile)|Included in SCRUM-9 branch — [Commit c90b4d8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c90b4d8), [Commit 2a24fb6](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2a24fb6df83cfd0102f1a44e6524316b6c67e548) |
|[SCRUM-8](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-8)|Error Handling for if there are no recipes that match with ingredients provided|[PR #28](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/28), [Commit 6073d36](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6073d36dc703c8aa8d73ccb7f71e291707860745) |
|[SCRUM-9](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-9)|Link functionality for each tile AND error handling for broken links|[Commit 51b3ada](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/51b3ada), [Commit c90b4d8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c90b4d8) |

#### Tina Carter

| Jira Task | Title | Bitbucket Artifact |
|-----------|-------|-------------------|
| [SCRUM-2](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-2) | README | [PR #1](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/1) |
| [SCRUM-31](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-31) | Design the Print/Download UI Component | [PR #26](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/26) |
| [SCRUM-32](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-32) | Implement the Print Functionality (React + Browser API) | [PR #24](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/24) |
| [SCRUM-33](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-33) | Implement the PDF Download Functionality (Client-Side Generation) | [PR #23](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/23) |
| [SCRUM-34](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-34) | Normalize recipe calls into unified format with print formatting | Included in [PR #24](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/24) |
| [SCRUM-55](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-55) | Unit Testing/error handling for Print/Download Features | [PR #25](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/25) |





### Sprint 2 Contributions

**Sprint Duration:** March 9, 2026 – March 27, 2026

**Sprint Goal:** Improved WebApp: Operation Make it Better, Operation Independence Day, Side Quest Search and Destroy, and Side Quest Save Me as well as some bug fixes.

**Sprint Summary:**
SCRUM Sprint 2 consisted of 43 work items totaling ~79.5 story points. By sprint end, 78 story points (98%) were completed with only 1.5 story points remaining in progress (SCRUM-96 — load webpage on global server/url). The sprint focused on five major feature areas:
- **User Story 9:** Storing User Recipe History Locally
- **User Story 10:** Non-Temporary Library Storage
- **User Story 11/12:** Recipe Validation & Ingredient Exclusion Filtering
- **User Story 13/14:** User Login / Profile Page via Auth0 + MongoDB
- **User Story 15/16:** Image Error Handling & Web Hosting

#### Patrick Rucker

| Jira Task                                                    | Title                                                        | Bitbucket PR                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [SCRUM-48](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-48) | The history stores key recipe details (title, ID, and timestamp of when I last viewed it) | [PR #32](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/32) — Commits: [b8c79cf](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/b8c79cf), [5077003](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5077003) |
| [SCRUM-47](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-47) | Each time the user submits an ingredient search, the search query and returned recipes are automatically added to their search history | [PR #33](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/33) — Commits: [56d9d77](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/56d9d77) |
| [SCRUM-49](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-49) | The history is persisted using local storage so it survives page refreshes and is not lost when the tab is closed | [PR #34](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/34) — Commits: [625001d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/625001d) |
| [SCRUM-102](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-102) | The user can view their search history from the Search History page, showing past searches in reverse chronological order | [PR #43](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/43) — Commits: [4d68b9b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/4d68b9b), [f3d4a3b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f3d4a3b), [40aca52](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/40aca52) |
| [SCRUM-51](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-51) | A "Save to Library" button is available on each full recipe listing page | [PR #44](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/44) — Commits: [f614ac5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f614ac5), [cdb26c5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/cdb26c5) |
| [SCRUM-54](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-54) | I can view, access, and remove recipes from my saved library through the navigation toolbar | [PR #49](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/49) — Commits: [f0e277d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f0e277d), [f30f1f8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f30f1f8) |
| [SCRUM-107](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-107) | If the user tries to save a recipe they have already saved, the app prevents the duplicate and indicates the recipe is already in their collection | [PR #50](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/50) — Commits: [55e3127](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/55e3127) |
| [SCRUM-113](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-113) | Fix infinite re-render loop caused by ValidationCheck in RecipeTile | [PR #52](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/52) — Commits: [d4e7a2c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d4e7a2c), [d94078f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d94078f) |
| [SCRUM-114](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-114) | Set a limit on how much history is stored (100-entry cap + 30-day expiration) | [PR #55](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/55) — Commits: [de1b887](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/de1b887), [cfa23a9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/cfa23a9) |
| [SCRUM-41](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-41) | The submitted ingredients are parsed and made available for downstream recipe API query construction | [PR #58](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/58) — Commits: [cba66e0](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/cba66e0), [bd947c6](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/bd947c6) |
| [SCRUM-42](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-42) | The endpoint responds within a reasonable time frame (e.g., < 2 seconds) under normal conditions | [PR #59](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/59) — Commits: [a6eb920](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a6eb920), [6ca616a](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6ca616a), [ab0908e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ab0908e) |
| [SCRUM-115](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-115) | Returned recipes that have HTML instructions are parsed and displayed as readable plain text | [PR #60](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/60) — Commits: [de59325](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/de59325), [c9b79b0](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c9b79b0) |
| [SCRUM-116](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-116) | Add debounce and API call counter to ingredient autocomplete | [PR #69](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/69) — Commits: [eaeac4b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/eaeac4b), [fe68d25](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/fe68d25) |
| [SCRUM-118](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-118) | Fix ingredient filter. Re-add ExcludeIngredients filter and autocomplete debug logging | [PR #72](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/72) — Commits: [6b27ee8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6b27ee8) |

#### Christian Johnson

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-11](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-11) | There are multi-select buttons for ingredients and a SEARCH or ENTER button (autocomplete text input) | [PR #51](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/51) — Commits: [e646a40](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/e646a40), [a562757](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a562757), [216ed04](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/216ed04), [23c901d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/23c901d), [aa1977c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/aa1977c) |
| [SCRUM-39](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-39) | The backend exposes an endpoint that accepts the user's submitted ingredient list via an HTTP request | Included in [PR #51](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/51) |
| [SCRUM-40](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-40) | The endpoint validates incoming data and returns an appropriate error response if required fields are missing or malformed | [PR #63](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/63) — Commits: [36e1500](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/36e1500), [9720a85](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9720a85) |
| [SCRUM-79](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-79) | Before displaying a recipe tile, the app validates that required fields are present and non-empty | [PR #36](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/36) — Commits: [c61d195](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c61d195) |
| [SCRUM-80](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-80) | Recipes with missing or malformed data are filtered out and not displayed to the user | [PR #37](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/37) |
| [SCRUM-83](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-83) | If a recipe's image fails to load, a placeholder image is shown instead of a broken image icon | Included in [PR #53](https://bitbucket.org/%7Bcd7474ab-60fb-40f8-b95b-40e9ea2a8221%7D/%7Be88d2cd0-b6a0-4eff-8b19-9dbcb4629875%7D/pull-requests/53) |
| [SCRUM-85](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-85) | If all recipes from a search fail validation, the user sees a meaningful error message with the option to try a new search | [PR #42](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/42) |
| [SCRUM-86](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-86) | The app logs validation failures to the console for debugging without exposing technical errors to the user | [PR #41](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/41) |

#### Juan Estrada

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-43](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-43) | Recipes that match more of my entered ingredients are prioritized and ranked higher in the results | [PR #35](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/35) |
| [SCRUM-44](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-44) | Duplicate recipes returned across different API calls are merged into a single entry | [PR #38](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/38) |
| [SCRUM-45](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-45) | The final filtered list is sorted by relevance (e.g., number of matching ingredients from my list) | [PR #45](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/45) — Commits: [e952348](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/e952348), [5471d78](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5471d78), [a01a20a](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a01a20a), [3457ca3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3457ca3) |
| [SCRUM-46](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-46) | The filtered results are returned to the frontend in a consistent, structured format (e.g., JSON array) | [PR #47](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/47) — Commits: [ab6f2e2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ab6f2e2), [52c4e9d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/52c4e9d), [d269e4e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d269e4e), [aba0176](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/aba0176), [2ee9e45](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2ee9e45) |
| [SCRUM-104](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-104) | Design the Exclude Ingredient UI Component | [PR #64](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/64) — Commits: [8640125](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8640125), [0d9c5de](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0d9c5de), [9802faa](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9802faa), [f696e74](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f696e74), [53e8e33](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/53e8e33) |
| [SCRUM-106](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-106) | Implement Add/Remove Logic for Excluded Ingredients | [PR #65](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/65) — Commits: [01e508b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/01e508b), [70e7d6c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/70e7d6c), [86fa804](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/86fa804), [f4d3520](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f4d3520) |
| [SCRUM-108](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-108) | Backend Filtering for Excluded Ingredients | [PR #66](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/66) — Commits: [fd46127](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/fd46127), [625b6fd](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/625b6fd), [240f49e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/240f49e) |
| [SCRUM-110](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-110) | Handle Empty Results Due to Exclusions | [PR #67](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/67) — Commits: [d57689e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d57689e), [ccdec98](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ccdec98) |
| [SCRUM-111 / Remove MealDB](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-111) | Remove MealDB, switch to Spoonacular-only pipeline | [PR #68](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/68) — Commits: [af78b41](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/af78b41), [07a34d9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/07a34d9), [14f9818](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/14f9818), [273b7f2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/273b7f2), [40fdb9f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/40fdb9f) |
| [SCRUM-119 / Bugfix](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-119) | Filter API Reduce Usage | [PR #74](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/74) — Commits: [a412169](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a4121690c0cb626c43c31a58a5bd2ac8e3eafd12), [8654168](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/865416860c1c5fe75df85be512477a0f6caeb51a), [8b62246](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8b62246b8ac662d88f3ffed6460b490bcdbb1f13), [af48ded](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/af48ded0b7e1c7b65460167b4da873afd20dc0b3), [7c8e0d7](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/7c8e0d7227e2f8a611f3ba79cc4f636ca77b0a9c), [9c76ac8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9c76ac8fb29f078982fce84d4916ebc3d4cc89b3), [c4a4d73](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c4a4d738f709efd9f36fc9d40f6008afc73bc9a2) [6207d51](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6207d517f3f422dc126d61443482319bb5e1dbc9) |

#### Miguel Alvarez

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-88](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-88) | Create MongoDB for Users | [PR #46](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/46) — Commits: [c909791](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c909791), [c09724e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c09724e) |
| [SCRUM-92](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-92) | Create User Login/Log Off | [PR #54](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/54) — Commits: [c474416](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c474416), [a838fc3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a838fc3), [869d5a1](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/869d5a1) |
| [SCRUM-95](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-95) | JWT Context to be used T/O Application | Handled in [PR #54](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/54) (SCRUM-92 login/logout implementation) |
| [SCRUM-94](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-94) | Handle Recipe to UserData | [PR #62](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/62) — Commits: [8aca092](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8aca092), [df66f91](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/df66f91) |
| [SCRUM-109](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-109) | Saved and Recent Recipes show Login page for non logged-in users | [PR #57](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/57) + [PR #61](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/61) — Commits: [7fa2884](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/7fa2884) |
| [SCRUM-99](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-99) | Add/Remove Saved Recipes | Handled in [PR #62](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/62) — SCRUM-94/109 Save/Delete connects with MongoDB |
| [SCRUM-112](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-112) | Save Recipe Button Added to Recipe Tiles | Handled in [PR #44](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/44) (SCRUM-51 — Patrick Rucker) |
| [SCRUM-118](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-118) | Fix ingredient filter. Re-add ExcludeIngredients filter and autocomplete debug logging | [PR #72](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/72) — Commits: [12fd9d8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/12fd9d8701e8e6b2bd3a5a0313476042e171dcf0) |

#### Tina Carter

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-74](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-74) | Image elements have error handling that detects when an image fails to load | [PR #31](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/31) — Commits: [9daff47](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9daff47), [85aa3dd](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/85aa3dd), [b585f6b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/b585f6b) |
| [SCRUM-76](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-76) | Unloading images display a placeholder of the same dimensions as the intended image | [PR #53](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/53) — Commits: [1e93586](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/1e93586) |
| [SCRUM-77](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-77) | Placeholder image is a stylized placeholder | [PR #56](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/56) — Commits: [b49d3df](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/b49d3df), [d7638b0](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d7638b0), [6ae3285](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6ae3285), [703399f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/703399f), [465008f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/465008f) |
| [SCRUM-93](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-93) | Create a globally accessible server | Included in [PR #70](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/70) (documented alongside SCRUM-103) — Commits: [1f5ffa2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/1f5ffa2), [608df3b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/608df3b) |
| [SCRUM-103](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-103) | Document deployment steps taken so far | [PR #70](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/70) — Commits: [1f5ffa2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/1f5ffa2), [10a8799](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/10a8799), [aef3966](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/aef3966), [191605e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/191605e), [c502399](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c502399), [787a5da](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/787a5da) |
| [SCRUM-96](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-96) | Load webpage on global server/url (non-local host) | IN PROGRESS — [PR #117 research](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/71) ongoing |
| [SCRUM-117](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-117) | Research websites and servers for hosting | [PR #71](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/71) — Commits: [359471e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/359471e), [32722cf](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/32722cf), [c6ed1ba](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c6ed1ba) |
|[SCRUM-120 / Organization]() | Move files for better repo organization, remove testing files before merge to main | [PR #75](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/75) — Commits: [6b0c517](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6b0c517b98bd92de90a05e262e244a6d34036190), [8bd3a49](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8bd3a496d4e633cc48b5ea34235bf717672e6525) |

**Note:** SCRUM-96 (load webpage on global server/url) remained In Progress at sprint end (1.5 story points). This task required substantial server research and setup; the research phase (SCRUM-117) was completed and merged. The actual hosting deployment will be completed in Sprint 3.


### Sprint 3 Contributions

**Sprint Duration:** April 6, 2026 – April 24, 2026

**Sprint Goal:** Production deployment of the WebApp (global hosting + CI/CD), Operation Shopping List, dark mode, recipe scaling/filtering, autocomplete polish, persistent error handling, and team-wide unit testing.

**Sprint Summary:**
SCRUM Sprint 3 consisted of ~46 work items totaling ~162 story points. By sprint end, ~159 story points were completed with one task (SCRUM-172 — Tina's unit test creation) remaining In Progress. The sprint focused on six major feature areas:
- **User Story 17/18:** Global Hosting & Continuous Deployment (SCRUM-96, 98, 100, 105)
- **User Story 19:** Shopping List (SCRUM-131, 132, 134, 135, 136, 137, 138, 166)
- **User Story 20:** History Management Improvements (SCRUM-142, 143, 144, 145, 154)
- **User Story 21:** Caching & Performance (SCRUM-139, 140)
- **User Story 22:** UI/UX Polish — Dark Mode, Autocomplete, Recipe Scaling, Cook Time, Filters (SCRUM-150, 153, 159, 160, 162, 164, 165, 167, 178, 179)
- **User Story 23:** Persistent Error Handling, Generalized Exclusions, and Team Unit Testing (SCRUM-146, 147, 148, 149, 168–177, 180)

#### Patrick Rucker

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-131](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-131) | Create a ShoppingList component that displays ingredients needed for a selected recipe | [PR #85](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/85) — Commits: [ecce8ae](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ecce8ae), [12e1b8a](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/12e1b8a), [9b380d1](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9b380d1), [d09bd93](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d09bd93), [4ec1e23](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/4ec1e23), [3e57f75](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3e57f75), [3ddac1d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3ddac1d), [c64e726](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c64e726), [bffb6b3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/bffb6b3), [db10d79](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/db10d79), [2830e64](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2830e64) |
| [SCRUM-134](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-134) | Support combining ingredients from multiple saved recipes into one consolidated shopping list | Bundled in [PR #85](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/85) (SCRUM-131 ShoppingList component) — exception per assignment rules |
| [SCRUM-141](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-141) | Fix "New Search" button so it actually clears the user's search (ingredients, results, and exclusions) | [PR #79](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/79) — Commits: [587d5d2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/587d5d2), [bcc3ca9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/bcc3ca9) |
| [SCRUM-142](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-142) | Fix History page so it no longer auto-scrolls to the bottom on load | [PR #82](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/82) — Commits: [9003f5a](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9003f5a) |
| [SCRUM-143](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-143) | When logged in, display "Logged in as [email/username]" in the navbar next to the logout button | [PR #83](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/83) — Commits: [f48d59e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f48d59e) |
| [SCRUM-162](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-162) | Dark Mode Toggle with CSS | [PR #95](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/95) — Commits: [608029e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/608029e), [1bde8f8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/1bde8f8), [5195aa5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5195aa5), [5ae5010](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5ae5010), [a2034f3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a2034f3), [e3fcceb](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/e3fcceb), [7b747d2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/7b747d2), [6fb59e5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6fb59e5), [6f20aab](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6f20aab), [96bbc63](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/96bbc63), [8bd8e1b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8bd8e1b), [3f77b4b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3f77b4b) |
| [SCRUM-164](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-164) | Scale Recipe Servings and Adjust Ingredient Amounts | [PR #97](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/97) — Commits: [f919714](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f919714), [2437d1f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2437d1f), [912bd5c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/912bd5c), [18c23d9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/18c23d9), [4b36fd1](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/4b36fd1), [d8a32d9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d8a32d9), [c18357e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c18357e) |
| [SCRUM-167](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-167) | Fix darkmode for input box and autocomplete highlight (currently not adjusting to darkmode/light mode correctly) | [PR #98](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/98) — Commits: [f51d9d9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f51d9d9), [2c312ed](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2c312ed), [0c11ff4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0c11ff4) |
| [SCRUM-168](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-168) | Unit Testing Planning | [PR #103](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/103) — Commits: [db0eedd](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/db0eedd) |
| [SCRUM-170](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-170) | Create unit tests; generate results document — added 22 unit tests for ThemeContext, spoonacular, withTimeout | [PR #105](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/105) — Commits: [bc881a1](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/bc881a1) |
| [SCRUM-178](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-178) | Fix bug with user input text box not matching the exclude ingredients text box | [PR #116](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/116) — Commits: [edb8895](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/edb8895) |
| [SCRUM-179](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-179) | Fix new search button functionality (restore missing lastFetchedIntolerances state in RecipeContext) | [PR #117](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/117) — Commits: [255c32a](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/255c32a) |
| [SCRUM-180](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-180) | Update README with newly implemented features | [PR #118](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/118) — Commits: [c1c5fbb](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c1c5fbb) |

---

#### Christian Johnson

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-144](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-144) | Implement a "Clear All History" button on the History page | [PR #78](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/78) — Commits: [5bca072](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5bca072), [1454fca](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/1454fca), [8495c5f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8495c5f), [5846309](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5846309) |
| [SCRUM-145](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-145) | Allow removal of individual search entries from history (per-entry delete button) | [PR #81](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/81) — Commits: [d29d805](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d29d805), [ebdcb88](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ebdcb88), [fb52b2a](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/fb52b2a) |
| [SCRUM-154](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-154) | Implement user confirmation for the ClearHistoryButton | [PR #87](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/87) — Commits: [f39a943](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f39a943) |
| [SCRUM-159](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-159) | Show Cook Time / Prep Time on Recipe Tiles | [PR #93](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/93) — Commits: [eee09a3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/eee09a3) |
| [SCRUM-160](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-160) | Filter Recipes by Cook Time | [PR #110](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/110) — Commits: [2177cb0](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2177cb0), [b162cad](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/b162cad), [5f45c86](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5f45c86), [4359cda](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/4359cda), [2d24485](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2d24485), [4a9fb6b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/4a9fb6b), [9a8e605](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9a8e605), [a8b8fd6](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a8b8fd6), [875ccfb](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/875ccfb), [a70902c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a70902c), [3f5d76a](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3f5d76a), [e118692](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/e118692), [99b7830](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/99b7830) |
| [SCRUM-173](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-173) | Unit Test Planning/Documentation — Christian | [PR #108](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/108) — Commits: [5a81c9c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5a81c9c), [20d86a8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/20d86a8) |
| [SCRUM-174](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-174) | Unit Test Creation — Christian | [PR #109](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/109) — Commits: [6fffbf5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6fffbf5), [6078a7d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/6078a7d), [3fc1e0e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3fc1e0e), [c8fd866](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c8fd866) |

---

#### Juan Estrada

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-96](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-96) | Load webpage on global server/url (non-local host) | [PR #86](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/86) — Commits: [954d167](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/954d167), [a3bc8d7](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a3bc8d7), [d39c038](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d39c038), [ff9d09e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ff9d09e), [895a3e3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/895a3e3), [7134b52](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/7134b52), [0f7487f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0f7487f), [003e6ad](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/003e6ad), [3850ef4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3850ef4), [93b5283](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/93b5283), [90b026c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/90b026c) |
| [SCRUM-98](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-98) | The hosted app connects to the Spoonacular API successfully from the production environment | [PR #89](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/89) — Commits: [e922cd2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/e922cd2) |
| [SCRUM-100](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-100) | Loading of webpage is in a reasonable time and error page | [PR #90](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/90) — Commits: [1d8e8d4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/1d8e8d4) |
| [SCRUM-105](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-105) | Automatically update website after changes to base code (CI/CD) | [PR #91](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/91) — Commits: [fd9dcff](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/fd9dcff), [53f33d4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/53f33d4), [243b70f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/243b70f) |
| [SCRUM-146](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-146) | Add user-facing error handler when a recipe fails to save, with actionable suggestions | [PR #96](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/96) — Commits: [ee9809d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ee9809d), [732e6b6](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/732e6b6), [2516195](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2516195), [0017cd4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0017cd4) |
| [SCRUM-147](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-147) | Improve error handling to include persistent error logging | [PR #100](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/100) — Commits: [d6ea80c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/d6ea80c), [2a86186](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2a86186), [c50db44](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c50db44), [296df81](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/296df81), [c7bc5c8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c7bc5c8), [cbfde79](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/cbfde79) |
| [SCRUM-148](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-148) | Create a database/collection to store logged errors rather than relying on console.log | [PR #99](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/99) — Commits: [f4859eb](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/f4859eb), [8404ab5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/8404ab5), [a84d8f4](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a84d8f4), [620841f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/620841f) |
| [SCRUM-149](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-149) | Allow generalized ingredient exclusion by category (e.g., "dairy" excludes milk, cream, etc.) | [PR #101](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/101) — Commits: [484e057](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/484e057), [2ddaba9](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2ddaba9), [106868e](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/106868e), [bed8154](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/bed8154), [ed54120](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ed54120), [fe6c239](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/fe6c239), [4fff910](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/4fff910), [523fa90](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/523fa90) |
| [SCRUM-169](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-169) | Unit Testing Plan | [PR #112](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/112) — Commits: [ad1f7af](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ad1f7af), [db4ad96](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/db4ad96) |
| [SCRUM-175](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-175) | Unit Test Creation — Juan | [PR #113](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/113) — Commits: [51756c3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/51756c3), [b8eefbb](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/b8eefbb), [eff6d2b](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/eff6d2b) |

---

#### Miguel Alvarez

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-135](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-135) | Persist the shopping list to MongoDB so it survives across sessions (new endpoint or extend user document) | [PR #102](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/102) — Commits: [b3f8e1c](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/b3f8e1c), [2ef5ddf](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/2ef5ddf), [0869593](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0869593), [de8e630](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/de8e630) + [PR #106](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/106) — Commits: [03a63c8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/03a63c8), [5fed8f0](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5fed8f0), [5e477e1](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/5e477e1), [0eefbe3](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0eefbe3) |
| [SCRUM-136](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-136) | Add a dedicated Shopping List page accessible from the navbar | [PR #77](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/77) & [PR #85](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/85) (Shopping List feature stack)|
| [SCRUM-137](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-137) | Allow users to manually add custom items to the list (e.g., "paper towels") | [PR #94](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/94) — Commits: [0aba605](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0aba605), [25f40a0](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/25f40a0) |
| [SCRUM-138](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-138) | Add a "Clear List" button to reset the shopping list | [PR #94](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/94) (SCRUM-137) — Commits: [23489f6](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/23489f6126c8fce5df7d40ea5509888d3e6b5ded)|
| [SCRUM-139](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-139) | Cache unfiltered results to avoid re-fetches on exclusion removal — added local caching | [PR #80](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/80) — Commits: [ac10b17](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ac10b17) |
| [SCRUM-140](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-140) | Implement time-to-live (TTL) for cache invalidation so stale results don't persist indefinitely | [PR #84](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/84) — Commits: [31a2fbb](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/31a2fbb) |
| [SCRUM-176](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-176) | Unit Test Planning — Miguel Alvarez | [PR #114](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/114) — Commits: [3f936dc](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/3f936dc) |
| [SCRUM-177](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-177) | Unit Test Creation — Miguel Alvarez | [PR #115](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/115) — Commits: [ca8d922](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/ca8d922) |

---

#### Tina Carter

| Jira Task | Title | Bitbucket PR |
|-----------|-------|--------------|
| [SCRUM-132](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-132) | Add a "Generate Shopping List" button to the recipe modal (next to Save/Download) | [PR #77](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/77) — Commits: [e609c70](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/e609c70), [0d1ca53](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/0d1ca53), [cbf8aa5](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/cbf8aa5), [227d812](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/227d812) |
| [SCRUM-150](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-150) | Arrow keys for autocomplete (toggle for include and exclude ingredient selection) | [PR #88](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/88) — Commits: [fb1658d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/fb1658d) |
| [SCRUM-153](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-153) | Change substring matching to exact matching in exclusion filter | Squashed into the dev3 → main release merge [PR #119](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/119) (commit [93912c6](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/93912c6)); draft branch [PR #92](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/92) merge was not documented correctly|
| [SCRUM-165](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-165) | Arrow keys for autocomplete scroll display of suggestions | [PR #107](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/107) — Commits: [77b4e60](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/77b4e60) |
| [SCRUM-166](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-166) | "Add to Shopping List" button visibly informs user it worked (or didn't) — UI feedback | [PR #104](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/104) — Commits: [9df38ab](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/9df38ab), [df69cc7](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/df69cc7), [124d571](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/124d571), [31eff86](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/31eff86), [67f2d70](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/67f2d70), [19ca92d](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/19ca92d), [a7f8ae2](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/a7f8ae2), [23ef868](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/23ef868), [118367f](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/118367f), [29562ad](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/29562ad), [72347b8](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/72347b8), [c0eb094](https://bitbucket.org/cs3398-hutts-s26/hutts-project/commits/c0eb094) |
| [SCRUM-171](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-171) | Unit Test Planning/Documentation — Tina | [PR #120](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/120) (SCRUM-172) |
| [SCRUM-172](https://cs3398-hutts-s26.atlassian.net/browse/SCRUM-172) | Unit Test Creation — Tina | [PR #120](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/120) |
| Sprint Merge | Development branch 3 → main (Sprint 3 release merge) | [PR #119](https://bitbucket.org/cs3398-hutts-s26/hutts-project/pull-requests/119) |

---

Note: Tasks are grouped by their Jira assignee (not by PR author). A few tasks did not have a dedicated merged PR and are listed with associated SCRUM PRs: SCRUM-134 and SCRUM-136 were folded into the Shopping List feature PRs (#77, #85); SCRUM-138 was bundled with Miguel's SCRUM-137 PR (#94); SCRUM-153 work was squashed into the final dev3 → main release merge (#119); SCRUM-171 was merged along with SCRUM-172 (#120). SCRUM-172 was _In Progress_ at sprint end, and was completed on 27/04/2026 with PR #120. SCRUM-161 (Show Dietary Tags on Recipe Tiles) was added to Sprint 3 but was not completed and is not included above.


## Room for Improvement
Include areas you believe need improvement / could be improved. Also add TODOs for future development.

Room for improvement:
- Improvement to be done 1
- Improvement to be done 2

To do:
- MVP
- improved search style
    * image user entry
- improved search method
- databse


## Acknowledgements
Give credit here.
- This project was inspired by...
- This project was based on [this tutorial](https://www.example.com).
- Many thanks to...


## Contact
Created by Miguel Alvarez, Tina Carter, Juan Estrada, Christian Johnson, Patrick Rucker
