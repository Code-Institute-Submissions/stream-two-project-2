# Code Institute Stream Two Project

This is a project website for Code Institute Full Stack Development course Stream Two. It is a flask-based data dashboard project using d3 and Crossfilter, designed to present a set of data in a way which is clear and informative for the site user. The data which I have chosen to use is a list of match results from the World Snooker Championship, during the time that the event has been played at the Crucible Theatre in Sheffield (from 1977 to the most recent championship at the time of development, that of 2017).

## Contents
1. [Preparation](#preparation)
2. [Front End Development](#front-end-development)
    * [Responsive Design](#responsive-design)
    * [Page Styling](#page-styling)
    * [Use of JavaScript](#use-of-javascript)
3. [Back End Development](#back-end-development)
4. [External Libraries](#external-libraries)
5. [Use of Data](#use-of-data)
6. [Deployment](#deployment)
7. [Testing](#testing)

## Preparation

Planning for the site involved devising a list of potential questions which a user to the site might wish to answer by viewing or filtering the available. I considered those who may be reporting on a championship or simply viewing as a spectator, thinking about the kind of things that they may want to know in order to aid their enjoyment and understanding.

During the development process a number of wireframes were created both using the 'Pencil' software and a simple pen and paper method, as I considered the best way to lay out the charts and tables that I wanted to include. Having decided that I would like to incorporate a considerable number of these, I decided that the site should be divided into a number of different pages, each presenting elements of the data from a particular angle.

The site development began with the creation of an appropriate file structure for a Flask-based project. This was then deployed to GitHub along with the README.md file and a skeleton HTML template.

## Front End Development

### Responsive Design

The site was designed responsively using 'mobile first' principles. A break point was set for devices with a viewport wider than 800 pixels. The CSS for the default view, i.e. device width below 801 pixels, was placed in the main CSS file, with differing rules for wider devices stored separately. Within the default CSS, a number of small alterations were required for very narrow devices. These were mainly slight alterations to the font size and the hiding of flag icons, and such rules were placed in a media query withing the main CSS file.

### Page Styling

Design elements were chosen reflecting the snooker theme. A green background was used for the page header to represent a snooker table, while coloured elements reflecting the colours of snooker balls were also included and each page given a difference coloured header along this theme. The navigation menu items were decorated with CSS elements styled to look like snooker balls of different colours.

### Use of JavaScript

A very simple JavaScript file was included on all pages of the site to enable the user to toggle the navigation menu on and off when viewing the site on a device below 800 pixels in width.

Additionally, JavaScript was used on the Results and Players pages in order to prevent charts from being rendered until such time as the user made a selection from a drop-down menu. This was done because on these pages, it is not intended that the entire data set should be viewed at once and therefore only the selection menus are rendered on page load. The rest of the charts are rendered from a separate script when the first selection is made from the menu. The JavaScript also hides the page content below the select menu in order to prevent the chart headings from being displayed when the charts are not rendered.

## Back End Development

The back end of the site runs using a Flask application and a Mongo database. The application uses the render_template module from Flask to construct each page, with a default layout HTML page from which two content blocks are called. The first of these renders the main HTML for each page above the site footer, while the second ensures that the JavaScript file specific to a given page is included above the closing body tag.

The Mongo database includes three collections of data, one relating to the results of individual matches, one to the records of each player in a given year and one to the complete career statistics of each player. For each one, a separate route is create within the Flask application and the required fields are listed. This enables the relevant collection to be called when the charts for a given page are being constructed.

## External Libraries

The charts in the site are built using DC, D3 and Crossfilter and so the JavaScript files for each of these have to be included in the page template. Queue is used to ensure that the data is available before any of the charts are rendered, while Intro is included to enable to inclusion of an explanatory 'Site Tour' on each page.

Additionally, JQuery has been included and used in creating a simple script for the Career Data page whereby the user can toggle between two different data tables, each displaying different statistics for a player.

## Use of Data

The data relating to individual matches was used to create an overview of the tournament history, with focus on the results of tournament finals and data about the tournament winners. Match data was also used to create summaries of each year's championship and also charts relating to matches played by a selected player.

The data relating to tournament and career records was used to create charts which gave a wider overview of a player's performance, in a context which looked beyond individual matches.

## Deployment

Once the basic outline of the Flask application and one individual HTML page had been set up, the project was immediately committed to GitHub.  Having completed the styling and layout for the first page and created the charts for it, the project and the database were deployed to Heroku in order to begin testing on other devices.

## Testing

Much of the site development was done on a Windows PC using the Chrome browser, and making use of the developer tools to view at different screen sizes and troubleshoot any problems which may occur. The site was then further tested in the Firefox browser and on Android devices of different sizes.