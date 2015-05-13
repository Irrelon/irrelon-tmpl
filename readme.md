# Irrelon Tmpl
A high-performance templating engine built for basic template rendering and advanced
data-binding behaviours. Influenced by jsRender, jsViews and Handlebars.

## Status - UNSTABLE
This project is currently under development and should not be used in production at present.
It is being developed by Irrelon Software Limited, a UK registered company.

## Project Principles
* Templates should be easy to debug
* Data linking shouldn't require data-link="" in attributes of elements (e.g. jsViews)
* Hard and soft fail modes when outputting variables. If a variable doesn’t exist and a
property access is attempted on it, if in soft fail mode, don’t error. This means we can
pass data into templates if it exists or not if it doesn’t but the template will render
regardless. Useful when outputting form data and using the same template for create and edit.

## ForerunnerDB Integration Plugin
* Ability to reference forerunner collections directly from templates with the ForerunnerDB
* Ability to query forerunner collections from template code
* Operate with data from forerunner without passing the data directly into it

## What Currently Works?
* Basic variable output
* If statements + else + else if
* For statements
* Switch statements
* Variable declaration inside a template
* Create template instances that contain pre-compiled template functions
* Unit tests

## What Doesn't Work?
* Data binding of any kind
* Controlling encoding of output (e.g. escaped HTML vs pure strings)