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
Run the full test suite:
```bash
npm test
```
This runs all 38 unit tests using [Vitest](https://vitest.dev/). Tests cover the API services, RecipeContext, and all React components. All fetch calls are mocked — no API keys or internet connection needed.

Tests are not avaiable on the main branch. To access tests, see dev or dev2, or any further out development, feature, or bug fix branch.

To run tests for a specific file or folder:
```bash
npx vitest run src/api/__tests__/         # API service tests only
npx vitest run src/context/__tests__/     # RecipeContext tests only
npx vitest run src/components/            # All component tests
```

To run tests in watch mode (re-runs on file changes):
```bash
npm test -- --watch
```

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
* Code review
* Other guidelines

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
* Search history of the last 30 days (ELEPHANT) or 100 searches (ELEPHANT) displays in history tab. It is locally saved for non-logged in users, and associated with specific login when the user is logged in (is this true ELEPHANT).
* API calling was minimized by implementing local cache of recipes that have been recently search. (ELEPHANT)

**Potential future features/improvements:**
- Operation Make it Better: 
    `Implemented in Dep2` text entry of ingredients; recepies are returned based on compliance with 'only use ingredients listed by user'
- Operation Make it Better-er:
    search for recepies based on compliance with 'ingredients not listed by user are...' CHEAP to find, EASY to find, etc
- Dificult Side Quest:
    user input images of ingredients, rather than text entry of ingredients. Ingredients are accurately catagorized in such a way that MVP (and potential future) search functions work as normal with image ingredient entry.
- (Hopefully) Easy Side Quest:
    filter recepies by TYPE of food (i.e. cusine)
- Operation Independance Day:
     host our own database, so as API is used to query recepies, database is built, so in future API becomes less relevant for accessing recipes from existing database of recipies
- Side Quest Search and Destroy:
    `Implemented in Dep2` searching can be modified to exclude specific ingredients using the text entry format that included ingredients use, in a different text field
- Side Quest Save Me: 
    `Impelemented in Dep2` recipes can be saved on the webapp in association with a specific user

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

> `SPRINT 3` User Story 16: Hosted Web Application
>
>   As a user, I would like to access the app from a public URL rather than running it locally so that I can use it from any device without needing to set up the project myself. 
><br/>   As a developer, I want the webapp and server to be globally accessible, so that users can access the app from any device without running it locally.

> `SPRINT 3` User Story 17: Shopping List Generator
>
> As a user, I want to generate a shopping list from a recipe, so that I know exactly what ingredients I need to buy without manually writing them down.

> `SPRINT 3` User Story 18: SOLID Principles Refactor
>
> As a team manager, I want my team's code to follow SOLID principles, so that the codebase is maintainable, testable, and extensible for future sprints.

> `SPRINT 3` User Story 19: API Caching Optimization
>
> As a user, I want my search results to be cached, so that adding or removing ingredient exclusions doesn't waste API calls or slow down my experience.


> `SPRINT 3` User Story 20: Page Bug Fixes
>
> As a user, I want the app pages to work correctly, so that I can navigate and use the app without unexpected behavior.

> `SPRINT 3` User Story 21: History Management
>
> As a user, I want to be able to edit and clear my search history, so that I can remove old or unwanted searches and keep my history clean.

> `SPRINT 3` User Story 22: Improved Search & Error Handling
>
> As a user, I want better error messages, smarter exclusions, and keyboard-friendly autocomplete, so that I can troubleshoot issues, exclude ingredient categories easily, and navigate the app efficiently.


> `SPRINT 3` User Story 23: Recipe Tile Verification
>
> As a user, I want recipe tiles to only display working links and verified content, so that I don't encounter broken links or invalid recipe data.


> `SPRINT 3` User Story 24: Exclusion Filter Bug Fix
> > **Note:** This belongs under **USER STORY 19 (API Caching)** or **USER STORY 20 (Bug Fixes)** — it's a bug in the exclusion filtering logic, not a standalone story.
>
> As a user, I want ingredient exclusion to match exact ingredient names, so that excluding "rice" doesn't also remove recipes containing "licorice."


## Images
  #### Example Query: ####
Find recipe with: ☑ chicken | ☑ parmesan | ☑ cream
![Example query](./media/chicken_alfredo.jpg)


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


### Next Steps (Sprint 3)

#### <span style="font-size: 20px;">Miguel Alvarez:</span>
## <span style="font-size: 18px;">User Story 17: Shopping List Generator</span>
### Tasks: 
- [ ] Persist the shopping list to MongoDB so it survives across sessions (new endpoint or extend user document)
- [ ] Add a dedicated Shopping List page accessible from the navbar
- [ ] Allow users to manually add custom items to the list (e.g., "paper towels")
- [ ] Add a "Clear List" button to reset the shopping list
### Acceptance Critera:
4. Shopping list persists across sessions — refreshing the browser or logging in from another device shows the same list
5. User can clear the entire list or remove individual items
## <span style="font-size: 18px;">User Story 19: API Caching Optimization</span>
### Tasks:
- [ ] Cache unfiltered results to avoid re-fetches on exclusion removal (TTL to be determined)
- [ ] Implement time-to-live (TTL) for cache invalidation so stale results don't persist indefinitely
### Acceptance Criteria:
1. API calls are minimized.... idk ELEPHANT

#### <span style="font-size: 20px;">Tina Carter:</span>
## <span style="font-size: 18px;">User Story 22: Improved Search & Error Handling</span>
### Tasks:
- [ ] Implement arrow key navigation for autocomplete suggestions in both the ingredient input and exclusion input (instead of requiring mouse click)
### Acceptance Criteria: 
4. Autocomplete suggestions for ingredients (include and exclude) can be toggled through with arrow keys and selected with 'enter' as well as keeping mouse clickability functionality.
## <span style="font-size: 18px;">User Story 17: Shopping List Generator</span>
### Tasks: 
- [ ] Add a "Generate Shopping List" button to the recipe modal (next to Save/Download)
### Acceptance Critera:
1. User can click "Add to Shopping List" on any recipe and its ingredients appear on the Shopping List page
## <span style="font-size: 18px;">User Story 23: Recipe Tile Verification</span>
### Tasks:
- [ ] Remove or flag broken links in recipe tiles (reference: [linkcheckermd](https://github.com/Microsoft/linkcheckermd), [linkcheckerhtml](https://github.com/BillDietrich/linkcheckerhtml) — note: React libraries for this typically only handle embedded links like images)
- [ ] Review and address any remaining recipe verification issues (team to discuss)
### Acceptance Criteria:
1. No recipe tile displays any broken link (whether it is a rotten or incorrect link) to user.
2. All links that do dispay in recipe tiles lead to valid web pages.
3. ELEPHANT ??? Incorrect links (i.e. missing 'http://' or other link-markers) are considered broken links.
## <span style="font-size: 18px;">User Story 24: Exclusion Filter Bug Fix</span>
> **Note:** This belongs under **USER STORY 18 (API Caching)** or **USER STORY 19 (Bug Fixes)** — it's a bug in the exclusion filtering logic, not a standalone story.
### Tasks:
- [ ] Change substring matching to exact matching in exclusion filter (see: RecipeContext.jsx lines 200-202)
  - Current: `i.name.toLowerCase().includes(excl)` — "rice" matches "licorice"
  - Fix: `i.name.toLowerCase() === excl` — "rice" only matches "rice"
### Acceptance Criteria:
1. No unrelated ingredients are filtered out for any valid input to exclude ingredient function (i.e. "rice" will not exclude "licourice").
2. All forms of valid ingredient entries to exclude are excluded (i.e. "rice" will excluder "jasmine rice").


#### <span style="font-size: 20px;">Juan Estrada</span>
## <span style="font-size: 18px;">User Story 16: Global Access Setup (Continued)</span>
### Tasks:
- [ ] Finish implementing global access of webapp/server creation
### Acceptance Critera:
1. Webapp functionality is the same when accessed through localhost or internet-accessable URL
2. Webapp does not face loading issues when accessed from a network other than server's network

## <span style="font-size: 18px;">User Story 22: Improved Search & Error Handling</span>
### Tasks:
- [ ] Add user-facing error handler when a recipe fails to save, with actionable suggestions (e.g., "Clear your cookies" or "Check your network connection")
- [ ] Improve error handling to include persistent error logging (see: try/catch in RecipeTile.jsx lines 63-67 — may exist in other locations as well)
  - [ ] Create a database/collection to store logged errors rather than relying on console.log
- [ ] Allow generalized ingredient exclusion by category (e.g., type "dairy" to exclude all dairy products instead of individually typing "milk", "cream", "heavy cream", etc.)
### Acceptance Criteria: 
1. All errors that occur are uniquely logged in error loggin databse.
2. Error are either hiden from the user (i.e. hide broken images and links) or create alert() with relevant (to the user) error information.
3. Exlude ingredients can pass 'categories' of ingredients and either appropriately filter out that categoy (i.e. dairy, gluten, meat, other common dietary restrictions) or informs user that that is an invalid search-exclusion term.

#### <span style="font-size: 20px;">Christian Johnson:</span>
## <span style="font-size: 18px;">User Story 21: History Management</span>
### Tasks:
- [ ] Implement a "Clear All History" button on the History page
- [ ] Allow removal of individual search entries from history (per-entry delete button)
### Acceptance Criteria:
1. History page displays 'Clear All History' (or similar button)
2. Upon user pressing button, all history is removed from user view and local webpage history. (Maybe include 'are you sure' confirmation?)
3. Individual Searchs can be removed from history without breaking history page formatting through use of a clear to understand 'remove' or simmilar button.

#### <span style="font-size: 20px;">Patrick Rucker:</span>
## <span style="font-size: 18px;">User Story 17: Shopping List Generator</span>
### Tasks: 
- [ ] Create a ShoppingList component that displays ingredients needed for a selected recipe
- [ ] Allow users to check off ingredients they already have, removing them from the list
- [ ] Support combining ingredients from multiple saved recipes into one consolidated shopping list (e.g., two recipes both need "flour" → show "flour" once with combined amounts)
### Acceptance Critera:
1. User can click "Add to Shopping List" on any recipe and its ingredients appear on the Shopping List page
2. Duplicate ingredients from multiple recipes are merged with combined quantities (e.g., 1 cup flour + 2 cups flour = 3 cups flour)
3. User can check off items they already have, and checked items are visually distinguished (strikethrough or dimmed)
## <span style="font-size: 18px;">User Story 20: Page Bug Fixes</span>
### Tasks:
- [ ] Fix "New Search" button so it actually clears the user's search (ingredients, results, and exclusions)
- [ ] Fix History page so it no longer auto-scrolls to the bottom on load
- [ ] When logged in, display "Logged in as [email/username]" in the navbar next to the logout button
### Acceptance Criteria:
1. Pressing the 'New Search' button returns user to search page with all fields cleared.
2. Hsitory page automatically loads to display most recent search. All old searches must be scrolled down to (page down).
3. When logged in, user information is displayed in navbar. No empty fields or placeholder display when user is not logged in. Information persists reguardless of what page the user is on.

#### <span style="font-size: 20px;">Group:</span>
## <span style="font-size: 18px;">User Story 18: SOLID Principles Refactor</span>
### Tasks:
- [ ] Make codebase more SOLID — specific actions to be discussed (see: SOLID-ANALYSIS.md in Slack)

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
