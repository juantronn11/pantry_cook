# README #
# Recipe App

### What is this repository for? ###

This is the README document for CS 3398.253 Spring 2026 Hutt's semester project: Recipe App.
The purpose of this project is to provide a UI where you can input ingredients (i.e. what you have at home)
and be provided recipes that use those ingredients and only those ingredients. This is for people who want 
to cook with what they already have. This app has the potential to reduce home food waste and povide a way to 
cook on budget.

## Table of Contents
* [How do I get set up?](#how-do-I-get-set-up)
* [General Info](#general-information)
* [Contribution Guidelines](#contribution-guidelines)
* [Technologies Used](#technologies-used)
* [Features](#features)
* [Images](#images)
* [Setup](#setup)
* [Usage](#usage)
* [Project Status](#project-status)
* [Room for Improvement](#room-for-improvement)
* [Acknowledgements](#acknowledgements)
* [Contact](#contact)

## How do I get set up?
* Summary of set up
* Configuration
* Dependencies
* Database configuration
* How to run tests
* Deployment instructions

## General Information
- Provide general information about your project here.
- What problem does it (intend to) solve?
- What is the purpose of your project?
- Why did you undertake it?

## Contribution guidelines

* Writing tests
* Code review
* Other guidelines

## Technologies Used
- API EveryCook Recipe Database (open source from GitHub) (https://github.com/everycook/EveryCook)
- Mongodb (potential)
    * the avaiability of this potential resource for open source work is currently being discussed
- Mealdb (https://www.themealdb.com/api.php) (www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata)
- JavaScript ver. TBD, Flask (maybe), Express ver. TBD
- Webapp library: React ver. 19.2*
    * or other version TBD. 19.2.4 is the most recent stable update of React per [React Reference Overview](https://react.dev/reference/react)
- UML visualisation (maybe figma)
- OTHER:
    * react router, query


## Features
- MVP: webpage with radial buttons of searchable ingredients (API is queried for recipies matching each button chosen, overlaping recipes returned), returns (visible to user) list of recepies (format TBD*)
    * list of images of recepies (with name?) that are clickable links, just list of recipe names that are clickable links; API returns as json
- initially, the only retention is: user is returned a downloadable recipe

**Specific features for MVP:**
* Choose your ingredient: Radial Buttons search form for ingredients 
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

**Potential future features/improvements:**
- Operation Make it Better:
    text entry of ingredients; recepies are returned based on compliance with 'only use ingredients listed by user'
- Operation Make it Better-er:
    search for recepies based on compliance with 'ingredients not listed by user are...' CHEAP to find, EASY to find, etc
- Dificult Side Quest:
    user input images of ingredients, rather than text entry of ingredients. Ingredients are accurately catagorized in such a way that MVP (and potential future) search functions work as normal with image ingredient entry.
- (Hopefully) Easy Side Quest:
    filter recepies by TYPE of food (i.e. cusine)
- Operation Independance Day:
     host our own database, so as API is used to query recepies, database is built, so in future API becomes less relevant for accessing recipes from existing database of recipies


## Images
  #### Example Query: ####
Find recipe with: ☑ chicken | ☑ parmesan | ☑ cream
![Example query](./media/chicken_alfredo.jpg)


## Usage
How does one go about using it?
Provide various use cases and code examples here.

`write-your-code-here`


## Project Status
Project is: _in progress_ as of 13/02/2026 (Feb.)


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
Created by Miguel Alvarez, Tina Carter, Juan Estrada, Christina Johnson, Patrick Rucker
