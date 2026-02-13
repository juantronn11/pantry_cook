# README #

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for? ###

* Search for recepies that don't require you to buy new ingredients.
What you’re creating?
Who you’re doing it for, your audience (may be same as the previous question)?
Why you’re doing this, the impact or change you hope to make?

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
- API EveryCook (https://github.com/everycook/EveryCook)
- Mongodb
    * the avaiability of this potential resource for open source work is currently being discussed
- Mealdb (https://www.themealdb.com/api.php)
- JavaScript ver. TBD, Flask (maybe), 
- Webapp library: React ver. 19.2*
    * or other version TBD. 19.2.4 is the most recent stable update of React per [React Reference Overview](https://react.dev/reference/react)
- UML visualisation (maybe XXXX)


## Features
List the ready features here:
- MVP: webpage with radial buttons of searchable ingredients (API is queried for recipies matching each button chosen, overlaping recipes returned), returns (visible to user) list of recepies (format TBD*)
    * list of images of recepies (with name?) that are clickable links, just list of recipe names that are clickable links; API returns as json
- initially, the only retention is user is returned a downloadable recipe

Potential future features/improvements:
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
- improved search method
- databse


## Acknowledgements
Give credit here.
- This project was inspired by...
- This project was based on [this tutorial](https://www.example.com).
- Many thanks to...


## Contact
Created by Miguel Alvarez, Tina Carter, Juan Estrada, Christina Johnson, Patrick Rucker
