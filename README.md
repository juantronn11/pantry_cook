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

### Running the Development Server
Start the local dev server:
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

> `IN PROGRESS` User Story 16: Hosted Web Application
>
>   As a user, I would like to access the app from a public URL rather than running it locally so that I can use it from any device without needing to set up the project myself. 


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





# Sprint 2 Contributions

**Sprint Duration:** March 9, 2026 – March 27, 2026

**Sprint Goal:** Improved WebApp: Operation Make it Better, Operation Independence Day, Side Quest Search and Destroy, and Side Quest Save Me as well as some bug fixes.

**Sprint Summary:**
SCRUM Sprint 2 consisted of 43 work items totaling ~79.5 story points. By sprint end, 78 story points (98%) were completed with only 1.5 story points remaining in progress (SCRUM-96 — load webpage on global server/url). The sprint focused on five major feature areas:
- **User Story 9:** Storing User Recipe History Locally
- **User Story 10:** Non-Temporary Library Storage
- **User Story 11/12:** Recipe Validation & Ingredient Exclusion Filtering
- **User Story 13/14:** User Login / Profile Page via Auth0 + MongoDB
- **User Story 15/16:** Image Error Handling & Web Hosting


### Next Steps (Sprint 2)

#### Patrick Rucker

- New Feature | Seperate Users: implement search history functionality tied to a user's login `User Story 9`
- New Feature | Seperate Users: implement save page of recipes tied to a user's login `User Story 10`

#### Christian Johnson

- New Feature | Searching: ingredient entry by type in with auto-fill rather than field of buttons `User Story 2` `User Story 6`
- Error correction: check for recipe loading correctly and do not load incorrect recipes

#### Juan Estrada

- New Feature | Searching: 'filter out' ingredient
- New Feature | Searching: exclusively search by ingredient (i.e. recipe contains no ingredients not selected)

#### Miguel Alvarez

- New Feature | Seperate Users: create login functionality
- New Feature | Seperate Users: implement user profiles and tie to log-in

#### Tina Carter

- Error correction: check for image loading correctly
- New Feature | Backend: host webapp on server rather than local

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
