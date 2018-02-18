# Code Institute Stream Two Project

This is a project website for Code Institute Full Stack Development course Stream Two. It is a flask-based data dashboard project using d3 and Crossfilter, designed to present a set of data in a way which is clear and informative for the site user. The data which I have chosen to use is a list of match results from the World Snooker Championship, during the time that the event has been played at the Crucible Theatre in Sheffield (from 1977 to the most recent championship at the time of development, that of 2017).

## Contents
1. [Planning](#planning)
2. [Front End Development](#front-end-development)
    * [Responsive Design](#responsive-design)
    * [Page Styling](#page-styling)
    * [Use of Custom JavaScript](#use-of-custom-javascript)
3. [Back End Development](#back-end-development)
4. [External JavaScript Libraries](#external-javascript-libraries)
5. [Use of Data](#use-of-data)
    * [Champions](#champions)
    * [Results](#results)
    * [Match Data](#match-data)
    * [Player Data](#player-data)
    * [Rivialries](#rivalries)
    * [Year Stats](#year-stats)
    * [Career Data](#career-data)
6. [Deployment](#deployment)
7. [Testing](#testing)
8. [Issues](#issues)

## Planning

Planning for the site involved devising a list of potential questions which a user to the site might wish to answer by viewing or filtering the available. I considered those who may be reporting on a championship or simply viewing as a spectator, thinking about the kind of things that they may want to know in order to aid their enjoyment and understanding.

During the development process a number of wireframes were created both using the 'Pencil' software and a simple pen and paper method, as I considered the best way to lay out the charts and tables that I wanted to include. Having decided that I would like to incorporate a considerable number of these, I decided that the site should be divided into a number of different pages, each presenting elements of the data from a particular angle.

The site development began with the creation of an appropriate file structure for a Flask-based project. This was then deployed to GitHub along with the README.md file and a skeleton HTML template.

## Front End Development

### Responsive Design

The site was designed responsively using 'mobile first' principles. A break point was set for devices with a viewport wider than 800 pixels. The CSS for the default view, i.e. device width below 801 pixels, was placed in the main CSS file, with differing rules for wider devices stored separately. Within the default CSS, a number of small alterations were required for very narrow devices. These were mainly slight alterations to the font size and the hiding of flag icons, and such rules were placed in a media query withing the main CSS file.

### Page Styling

Design elements were chosen reflecting the snooker theme. A green background was used for the page header to represent a snooker table, while coloured elements reflecting the colours of snooker balls were also included and each page given a difference coloured header along this theme. The navigation menu items were decorated with CSS elements styled to look like snooker balls of different colours.

### Use of Custom JavaScript

A very simple JavaScript file was included on all pages of the site to enable the user to toggle the navigation menu on and off when viewing the site on a device below 800 pixels in width.

Additionally, JavaScript was used on the Results and Players pages in order to prevent charts from being rendered until such time as the user made a selection from a drop-down menu. This was done because on these pages, it is not intended that the entire data set should be viewed at once and therefore only the selection menus are rendered on page load. The rest of the charts are rendered from a separate script when the first selection is made from the menu. The JavaScript also hides the page content below the select menu in order to prevent the chart headings from being displayed when the charts are not rendered.

## Back End Development

The back end of the site runs using a Flask application and a Mongo database. The application uses the render_template module from Flask to construct each page, with a default layout HTML page from which two content blocks are called. The first of these renders the main HTML for each page above the site footer, while the second ensures that the JavaScript file specific to a given page is included above the closing body tag.

The Mongo database includes three collections of data, one relating to the results of individual matches, one to the records of each player in a given year and one to the complete career statistics of each player. For each one, a separate route is create within the Flask application and the required fields are listed. This enables the relevant collection to be called when the charts for a given page are being constructed.

## External JavaScript Libraries

The charts in the site are built using DC, D3 and Crossfilter and so the JavaScript files for each of these have to be included in the page template. Queue is used to ensure that the data is available before any of the charts are rendered, while Intro is included to enable to inclusion of an explanatory 'Site Tour' on each page.

Additionally, JQuery has been included and used in two different ways on the site. Firstly it is used in creating a simple script for the Career Data page whereby the user can toggle between two different data tables, each displaying different statistics for a player. JQuery is also used in two renderlets on DC.js select menus, whereby the chosen value is extracted and then displayed in an empty div at the beginning of the data dashboard.

## Use of Data

Each individual page on the site makes different use of the available data. Five of the pages use the data collection which consists of match results. The Year Stats page uses the collection of players' performances across an individual tournament, while the Career Data page uses the collection of players' full career statistics.

For the collection of match results, each result is entered into the database twice, with each player designated as 'Player 1' in one entry and 'Player 2' in the other. This was done to allow the data to be used to collate the statistics for an individual player, by ensuring that all of that player's results could be found by using the same key. For charts which were not relating to an individual player, this required that the collection be filtered to include only entries where 'Player 1' was the winner of the match, in order to prevent double counting.

### Champions

The Champions page focuses specifically on tournament finals and the players who won the final. The charts on this page use the match results data, pre-filtered to prevent double counting. The collection is also filtered by 'Round' to ensure that only tournament finals are included.

The page includes a simple number display which counts the tournament finals and therefore tells the user how many completed tournaments are included in the data set. There are four charts which can be used to filter the data. Row charts are included to show how many times each player has won the tournament or been beaten in the final. The number of rows is capped to show only the players whose count is more than one, players with one win or one defeat are grouped as 'others'. Two pie charts are included, one which allows filtering by nationality and the other by the margin of victory in the final. The latter of these charts is included to allow the user to see at a glance which were the closest or most one-sided finals. For example, selecting a victory margin of '1' will immediately show all those finals which were won in a deciding frame.

The second half of the page is simply a data table list of all the final results, with the winner listed first each time. This list is filtered depending on the selections which are made from the charts. On this basis, the user can quickly see the results of all finals which were won or lost by a particular player, or every tournament which was won by a player from a particular country.

### Results

The Results page also uses the match results data, filtered to prevent double counting. This page was designed to show the user data about a particular tournament, based on a choice made from a select menu listing each year which is included in the data set. Because this filtering by year is required, only that select menu is rendered when the page loads. The other charts on the page are rendered only when a year is chosen. This is done by calling a simple JavaScript function when the selection is changed, rendering the charts and removing the CSS class which initially hides the chart headings.

The page shows the chosen year, extracted from the select menu choice using a renderlet and placed in pre-positioned div element. Below this are two number displays showing the total number of matches and frames played in the chosen year. A pie chart is also included which shows the victory margin for each game. This can be used in a similar way to the 'margin' chart on the Champions page - if a user wishes to see at a glance how many matches went to a deciding frame that year, they can do so by selecting the value '1'. As the margins are ordered by value not by frequency, the user can also select the last segment on the pie chart to see the most one-sided game that year.

The results themselves are listed in a data table in the second half of the page. Results are grouped by tournament round and as on the Champions page, shown with the match winner listed first.

### Match Data



### Player Data



### Rivialries



### Year Stats



### Career Data



## Deployment

Once the basic outline of the Flask application and one individual HTML page had been set up, the project was immediately committed to GitHub.  Having completed the styling and layout for the first page and created the charts for it, the project and the database were deployed to Heroku in order to begin testing on other devices.

## Testing

Much of the site development was done on a Windows PC using the Chrome browser, and making use of the developer tools to view at different screen sizes and troubleshoot any problems which may occur. The site was then further tested in the Firefox browser and on Android devices of different sizes.

## Issues

One notable problem that I came across during the development of the site related to the vertical lines which reach up from the tick marks on the x-axis of a row chart. By default from the DC style sheet, these display with an opacity of 0.5, however when the row charts were rendered on Chrome some of these lines would disappear after rendering, especially after filtering when an elastic x-axis was present.

Attempted debugging using the Chrome developer tools indicated that if the opacity were set to 1, all lines would remain on the chart as expected but any opacity lower than 1 caused the problem to occur. The issue presented in exactly the same was on Chrome on a Windows PC and on Android, but was not replicated on Firefox. As yet I have been unable to find any explanation for this, but it may be that it is a bug relating the Chrome browser.