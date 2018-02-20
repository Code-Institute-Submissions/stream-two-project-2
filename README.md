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
	* [Rivalries](#rivalries)
	* [Year Stats](#year-stats)
	* [Career Data](#career-data)
6. [Deployment](#deployment)
7. [Testing](#testing)
8. [Issues](#issues)

## Planning

Planning for the site involved devising a list of potential questions which a user to the site might wish to answer by viewing or filtering the available data. I considered those who may be reporting on a championship or simply viewing as a spectator, thinking about the kind of things that they may want to know in order to aid their enjoyment and understanding.

These questions included:

* Who has won the most championships?
* What were the results for a particular year?
* Who has won or lost the most matches?
* Who has won or lost the most deciding frames?
* What is a given player's record in the tournament?
* What is the head-to-head record between two given players?
* Which players have met each other most often?
* Who played the most frames in a tournament?
* Who had the best frame winning percentage?
* Which players from a given country have reached each stage of the tournament?

During the development process a number of wireframes were created both using the 'Pencil' software and a simple pen and paper method, as I considered the best way to lay out the charts and tables that I wanted to include. Having decided that I would like to incorporate a considerable number of these, I decided that the site should be divided into a number of different pages, each presenting elements of the data from a particular angle.

## Front End Development

### Responsive Design

The site was designed responsively using 'mobile first' principles. A break point was set for devices with a viewport wider than 800 pixels. The CSS for the default view, i.e. device width below 801 pixels, was placed in the main CSS file, with differing rules for wider devices stored separately. Within the default CSS, a number of small alterations were required for very narrow devices. These were mainly slight alterations to the font size and the hiding of flag icons, and such rules were placed in a media query withing the main CSS file.

### Page Styling

Design elements were chosen reflecting the snooker theme. A green background was used for the page header to represent a snooker table, while coloured elements reflecting the colours of snooker balls were also included and each page given a difference coloured header along this theme. The navigation menu items were decorated with CSS elements styled to look like snooker balls of different colours.

### Use of Custom JavaScript

A very simple JavaScript file was included on all pages of the site to enable the user to toggle the navigation menu on and off when viewing the site on a device below 800 pixels in width. In the same file, a JavaScript function is defined to create the flag icons which appear in data tables to denote a player's nationality.

Additionally, JavaScript was used on the Results and Players pages in order to prevent charts from being rendered until such time as the user made a selection from a drop-down menu. This was done because on these pages, it is not intended that the entire data set should be viewed at once and therefore only the selection menus are rendered on page load. The rest of the charts are rendered from a separate script when the first selection is made from the menu. The JavaScript also hides the page content below the select menu in order to prevent the chart headings from being displayed when the charts are not rendered.

Similar use of JavaScript is made on the Match Data page where there is a data table which can either hold all match results or only those which match the user's selections from the charts. The user has the option to show the data table by clicking a button, at which time the table will be rendered for the first time. Another button gives the option to subsequently hide the data table.

Further use is made on the Rivalries page, where the details for the head-to-head between two players remains hidden until such time as the user chooses both 'Player 1' and 'Player 2'. This is achieved by setting both to 'false' in a JavaScript object and then using functions to change each to 'true' when a selection is made. Another function is then run to check whether both and true and if they are the CSS class which hides the charts is removed.

## Back End Development

The back end of the site runs using a Flask application and a Mongo database. The application uses the render_template module from Flask to construct each page, with a default layout HTML page from which two content blocks are called. The first of these renders the main HTML for each page above the site footer, while the second ensures that the JavaScript file specific to a given page is included above the closing body tag.

The Mongo database includes three collections of data, one relating to the results of individual matches, one to the records of each player in a given year and one to the complete career statistics of each player. For each one, a separate route is create within the Flask application and the required fields are listed. This enables the relevant collection to be called when the charts for a given page are being constructed.

## External JavaScript Libraries

The charts in the site are built using DC, D3 and Crossfilter and so the JavaScript files for each of these have to be included. Queue.js is used to ensure that the data is available before any of the charts are rendered, while Intro.js is included to enable to inclusion of an explanatory 'Site Tour' on each page. Both DC and Intro.js also have their own specific style sheets which are included.

Additionally, JQuery has been included and used in two different ways on the site. Firstly it is used in creating a simple script for the Career Data page whereby the user can toggle between two different data tables, each displaying different statistics for a player. JQuery is also used in two renderlets on DC.js select menus, whereby the chosen value is extracted and then displayed in an empty div at the beginning of the data dashboard.

All of these external files are stored together within the 'lib' directory.

## Use of Data

Each individual page on the site makes different use of the available data. Five of the pages use the data collection which consists of match results. The Year Stats page uses the collection of players' performances across an individual tournament, while the Career Data page uses the collection of players' full career statistics. By filtering in a combination of different charts, it is possible that the same data could be extracted in more than one way but having been approached from a different angle, or subsequently leading the user to further filtering in a different way.

For the collection of match results, each result is entered into the database twice, with each player designated as 'Player 1' in one entry and 'Player 2' in the other. This was done to allow the data to be used to collate the statistics for an individual player, by ensuring that all of that player's results could be found by using the same key. For charts which were not relating to an individual player, this required that the collection be filtered to include only entries where 'Player 1' was the winner of the match, in order to prevent double counting.

### Champions

The Champions page focuses specifically on tournament finals and the players who won the final. The charts on this page use the match results data, pre-filtered to prevent double counting. The collection is also filtered by 'Round' to ensure that only tournament finals are included.

The page includes a simple number display which counts the tournament finals and therefore tells the user how many completed tournaments are included in the data set. There are four charts which can be used to filter the data. Row charts are included to show how many times each player has won the tournament or been beaten in the final. The number of rows is capped to show only the players whose count is more than one, players with one win or one defeat are grouped as 'others'. Two pie charts are included, one which allows filtering by nationality and the other by the margin of victory in the final. The latter of these charts is included to allow the user to see at a glance which were the closest or most one-sided finals. For example, selecting a victory margin of '1' will immediately show all those finals which were won in a deciding frame.

The second half of the page is simply a data table list of all the final results, with the winner listed first each time. This list is filtered depending on the selections which are made from the charts. On this basis, the user can quickly see the results of all finals which were won or lost by a particular player, or every tournament which was won by a player from a particular country.

### Results

The Results page also uses the match results data, filtered to prevent double counting. This page was designed to show the user data about a particular year's tournament, based on a choice made from a select menu listing each year which is included in the data set. Because this filtering by year is required, only that select menu is rendered when the page loads. The other charts on the page are rendered only when a year is chosen. This is done by calling a simple JavaScript function when the selection is changed, rendering the charts and removing the CSS class which initially hides the chart headings.

The page shows the chosen year, extracted from the select menu choice using a renderlet and placed in pre-positioned div element. Below this are two number displays showing the total number of matches and frames played in the chosen year. A pie chart is also included which shows the victory margin for each game. This can be used in a similar way to the 'margin' chart on the Champions page - if a user wishes to see at a glance how many matches went to a deciding frame that year, they can do so by selecting the value '1'. As the margins are ordered by value not by frequency, the user can also select the last segment on the pie chart to see the most one-sided game that year.

The results themselves are listed in a data table in the second half of the page. Results are grouped by tournament round and as on the Champions page, shown with the match winner listed first.

### Match Data

The Match Data page also uses the results data but uses it to display statistics which give an overview of tournament history. Two row charts in the first half of the data dashboard show the players with the most match wins and the most match defeats in the tournament. In the second half of the dashboard a pie chart shows the most common victory margins, while another row chart shows the most common scorelines. The data can further be filtered by year or by round using select menus. A group is used to render the charts as the page loads as there is a data table which is not rendered until requested by the user.

Using these charts in conjunction with one another, site users can extract information such as the players have won the most deciding frames, or the players who have been knocked out in the quarter-finals on the most occasions. Victory margins and scorelines were included separately because margins may be compared in matches of different lengths, whereas a scoreline will be specific to a particular length of match.

The data table gives the user the option to display results should they wish. This section is hidden and the data table which holds the results is not rendered until such time as the user clicks a 'Show Results' button. Alongside is another button marked 'Hide Results', which allows the user to hide the data table should they wish. These buttons are controlled through JavaScript similar to that which removes the hidden content on the Results page.

The data table is included so that having filtered the charts, the user can see a list of those results which match their selections. The user is provided with a note to inform them that showing the results without filtering will display the entire data set and may take time to render.

### Player Data

The Player Data page is, like the Results page, designed to show the charts only when a selection is made from the available options. Again a select menu is rendered on page load but the other charts are rendered only when the name of a player is chosen, using the same JavaScript function. Also like the results page, a renderlet is used to display clearly the chosen player's name above all the data.

The charts which are rendered on the selection of a player begin with a pie chart showing the number of match wins and losses that player has had, as well as number displays which give a count of frames won and lost. There is a row chart of the most frequent opponents faced by the chosen player, while another pie chart shows the margin of victory or defeat. Finally, a second row chart shows the number of matches the player has played in each different round of the tournament.

All of these charts can be used to filter the data table which appears in the second half of the data dashboard, which shows a complete list of the player's tournament results. These are grouped by year and ordered by round. The filters can be used to show a variety of statistics about the player's tournament history, such as listing just their defeats or their record in deciding frames, or their results in a specific round of the tournament. The latter filter may be of particular use for a player who reached, for example, the semi-finals of a future tournament and a site user wished to see their record in past semi-finals.

### Rivalries

The Rivalries page is the only one which uses two separate crossfilter instances to display data differently. One half of the page allows the user to select two different players from select menus ('Player 1' and 'Player 2') and then display the head-to-head record between them, both in terms of matches won and frames won. A list of all the matches between the player is displayed underneath in a data table.

Similarly to the Results and Player Data pages, the charts relating to the individual match-up are not rendered when the page loads, neither are the chart heading displayed. JavaScript is used to hide the headings until such time as a selection is made for both 'Player 1' and 'Player 2', with the CSS hiding the charts then being removed and the charts and data table being rendered. Again, this is done to prevent the entire data set being loaded into the data table thus slowing down the page loading time.

On the other half of the page, there is a row chart showing the match-ups which have occurred most frequently in the tournament. The top 20 are displayed and the chart can be filtered by the stage of the tournament using a select menu.

### Year Stats

The Year Stats page is included primarily to enable the site user to answer questions relating to the number of frames played in a particular year or the highest percentage of frames won. In the case of the latter in particular, it enables comparison of tournament winners and allows conclusions to be drawn about the most dominant tournament performances, as well as which players who were eliminated earlier in the tournament were arguably unlucky not to progress further.

The records themselves are shown in two data tables in the second half of the data dashboard, with the top ten records listed for both frames played and percentage won. The column that they are sorted by is highlighted, while CSS is used to limit the number of rows shown. In order to accomplish this, the records are grouped by 'record-type', which is the same for all of them. This ensures that all records are in one single group and allows for easy control of the number of rows which appear.

The records can be filtered based on either nationality or the stage of the tournament that the player reached, through two row charts in the first half of the dashboard. Additionally, select menus enable filtering by year or by player. The filters enable the site user to compare champions or see the best performances from a given country, as well as being able to see the best performances for a particular player.

### Career Data

The Career Data page uses the data collection which gives the cumulative statistics for a player's entire career in the championship. The main focus of the page is a large data table which shows the overall statistics for each player. This table is actually two data tables which return different statistics, one of which is displayed by default on page load. The other table is hidden and the user is able to toggle between the two using a button which calls a simple JavaScript function. Multiple tables were used for two reasons. Firstly, the number of columns which needed to be included would have presented layout difficulties. Secondly, the data on each table is more logically presented using different sorting criteria, making separate tables a good way of presenting the data clearly.

The default table, visible when the page loads, shows the number of matches and frames played by each player in the tournament, as well as the win-loss record for each of these. The records are sorted firstly by the number of matches won and secondly by the number played (i.e. for all players who have never won a match in the tournament, those who have made more appearances will be sorted above those who have qualified only once). The second table shows the number of times each player has reached each stage of the tournament. It is sorted first by the number of tournament wins, then by the number of final defeats, then by semi-final defeats and so on back through the tournament.

A number of charts are available to filter the data. The records can be filtered by player nationality using a pie chart, with the number of slices limited to show the most commonly represented nations. Another pie chart allows filtering by the player's best tournament performance. This is intended to allow a user to compare easily the records of all players who, for example, have reached the semi-finals but no further. There is also a row chart which shows the number of players who made their tournament debut in each year. This enables comparison of players who began their careers at a similar time.

## Deployment

The site development began with the creation of an appropriate file structure for a Flask-based project. Once the basic outline of the Flask application and one individual HTML page had been set up, the project was immediately committed to GitHub.  Having completed the styling and layout for the first page and created the charts for it, the project and the database were [deployed to Heroku](http://the-crucible.herokuapp.com) in order to begin testing on other devices.

Content was commited to GitHub on a regular basis when a new piece of site functionality had been completed, and further committed to Heroku when testing on other devices was required.

## Testing

Much of the site development was done on a Windows PC using the Chrome browser, and making use of the developer tools to view at different screen sizes and troubleshoot any problems which may occur. The site was further tested in the Firefox browser and on Android devices of different sizes, making sure that the responsive layout worked as intended across a variety of screen resolutions.

The testing of the site functionality involved considering the user questions which had been considered in the planning stage. Thinking back to these questions meant that it could be ensured that the charts which had been included allowed the user to find out the required information easily, as well as presenting it in a clear and understandable way.

Each page was tested using a variety of different combinations of filters to ensure that the information could be extracted as intended. Further explanation could be given to the user by means of the Site Tour functionality provided by Intro.js.

## Issues

One notable problem that I came across during the development of the site related to the vertical lines which reach up from the tick marks on the x-axis of a row chart. By default from the DC style sheet, these display with an opacity of 0.5, however when the row charts were rendered on Chrome some of these lines would disappear after rendering, especially after filtering when an elastic x-axis was present.

Attempted debugging using the Chrome developer tools indicated that if the opacity were set to 1, all lines would remain on the chart as expected but any opacity lower than 1 caused the problem to occur. The issue presented in exactly the same was on Chrome on a Windows PC and on Android, but was not replicated on Firefox. As yet I have been unable to find any explanation for this, but it may be that it is a bug relating the Chrome browser.