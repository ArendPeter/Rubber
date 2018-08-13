# Rubber
Wrapper for IGOR.exe, aka compile gamemaker projects via command line.
*"Robots Unethically Building ~~Better~~ Executables Recklessly".

This tool is called from the command line, takes in a yyz/yyp and output a zip, installer,
or just run the game. For now, this only runs on windows, compiling to windows. Alternativly
there is an api that you can call from javascript.

Maintained by: ImDaveead

## Notes
I would like some of these untested features to be confirmed to work or fail, so that it can be resolved.

- ~~Project using shaders might not work~~ **Works**
- Using steam is not tested
- Running on mac not supported.
- Using configurations not tested

## Setup

You will need installed
1. GameMaker Studio 2 Desktop (inside default install directory).
1. Node.js with npm installed.

To install rubber globally, run `npm install -g gamemaker-rubber`, and you should be all good.

## Usage
`rubber <project_path> platform <platform options>` Basic Usage

`rubber <project_path> windows -zip windows.zip` Simple Compile For Windows VM
`rubber <project_path> windows -yyc -zip windows.zip` Simple Compile For Windows YYC
`rubber <project_path> windows -test` Equivilent to pressing the play button

### All Windows Options
- `-verbose` Enables IGOR Verbose
- `-yyc` Complies using YYC instead of VM
- `-debug` Enables debug mode
- `-config <name>` Changes the config (default 'default')

You can only set one of these
- `-zip <filename>` Set export type to Zipfile and set the output path
- `-installer <filename>` Set export type to Nsis Installer and set the output path
- `-test` Set export type to zipfile and set the output path
