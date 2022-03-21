# Heron Mapping Client 2
This is the repository for the Heron Mapping Client 2, also known as Heron2.

Heron2 is the next generation [Heron](https://heron-mc.org/) web mapping client.
Heron's concept has proved successful, but unfortunately the
technology (i.e. the libraries) behind Heron is now quite outdated.

This project is a pilot to investigate how the underlying technology can be 
modernized while retaining the current Heron concept.

As a proof-of-concept, a "very basic" version of Heron2 is created based on more
recent versions of Openlayers, GeoExt and ExtJS. With this we want to demonstrate the
added value of a renewed Heron for current and potential users.

A live demo of Heron2 can be found [here](https://heron2.webmap.nl/examples/)

The source code documentation can be found [here](http://195.201.113.200/heron2/doc/)

# Software
Heron2 is based on:
* OpenLayers 4.6.4
* GeoExt 3.1.0
* ExtJS 6.2.0
* Proj4js 2.4.4

Furthermore, Sencha Cmd 6.5.2.15 is used for building the source code and Yuidoc 0.10.2 for
generating the documentation.

# Design Goals
The following goals were assumed when creating Heron2:
* Use of the next generation OpenLayers (version >= 3.0).
* Keep using ExtJS for GUI components (for possible re-use of original Heron code).
* Use of a more recent version of ExtJS.
* Demonstrate that Heron 2 is technically feasible.
* Retain Heron's concept of working with config.js files.
* Keep content and layout of Heron config.js files unaltered as much as possible.
* Preview on Heron 2.0 for potential users . What can they expect?
* Show potential users the benefits of the new capabilities (see examples):
  * Support of new geo data types (OpenLayers).
  * More options for styling features (OpenLayers).
  * Possibility of on-the-fly raster edits (OpenLayers).
  * Higher performance when drawing point data (OpenLayers/WebGL).
  * Rotating Maps (OpenLayers).
  * Easy extension with (BI) charts (ExtJS).
  * Responsive Design for working on different devices (ExtJS).

# Directories
This project contains the following directories:
* /build - built version of the source code, with examples.
* /doc - documentation files (Yuidoc).
* /examples - example files.
* /ext - ExtJS source code.
* /overrides - files for overriding default OpenLayers, ExtJS, etc. functionality.
* /resources - resources (css, fonts, i18n files, HeronInit.js).
* /src - source code files.
* /yuidoc - Yuidoc files, templates, etc.

# Examples
The `/examples` directory contains a variety of Heron2 examples to demonstrate the
implemented functionality of Heron2. Some examples (see ol_*) are aimed at 
showing the new features of OpenLayers 3.

Shared config files are located in: `/shared`.

# HeronInit.js
The file `/resources/HeronInit.js` contains the main initialization settings of Heron2.

This file is not minimized during the build process, so settings can be changed
(for instance enabling debug mode) after deploying Heron2.

# Future
More recent versions of OpenLayers, GeoExt and ExtJS are now available. 
The currently used libraries can be replaced with these new ones.

Until now, the functionality is still very basic and a lot of energy is still needed
to match the functionality of the original Heron version.

# Heron2 is Open and Free Source
Heron2 is available under the [GNU GPL v3 license](https://www.gnu.org/licenses/gpl-3.0.html).