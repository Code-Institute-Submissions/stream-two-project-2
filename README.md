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

During the development process, a number of wireframes were created using the 'Pencil' software as I considered the best way to lay out the charts and tables that I wanted to include. Having decided that I would like to incorporate a considerable number of these, I decided that the site should be divided into a number of different pages, each presenting elements of the data from a particular angle.

The site development began with the creation of an appropriate file structure for a Flask-based project. This was then deployed to GitHub along with the README.md file and a skeleton HTML template.

## Front End Development

### Responsive Design

The site was designed responsively using 'mobile first' principles. A break point was set for devices with a viewport wider than 800 pixels. The CSS for the default view, i.e. device width below 801 pixels, was places in the main CSS file, with rules for wider devices stored separately.

### Page Styling

Design elements were chosen reflecting the snooker theme. A green background was used for the page header to represent a snooker table, while coloured elements reflecting the colours of snooker balls were also included. The navigation menu items were decorated with CSS elements styled to look like snooker balls of different colours.

### Use of JavaScript

A very simple JavaScript file was included on all pages of the site to enable the user to toggle the navigation menu on and off when viewing the site on a device below 800 pixels in width.

## Back End Development

## External Libraries

## Use of Data

## Deployment

## Testing