# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Unreleased

## 2.1.0 - 2018-08-19
- Renamed `windows()` to `compile()`, you provide what platform you want here. **note only windows works here**.
- `windows({...})` still works but is deprecated and will be removed in 3.\*.\*
- \[[Issue #1](https://github.com/GameMakerDiscord/Rubber/issues/1)\] Windows: Projects will compile if they are missing platform options.
- \[[Issue #6](https://github.com/GameMakerDiscord/Rubber/issues/6) \] Iterative Compiling, aka do not delete build files after a build. 

## 2.0.4 - 2018-08-19
- Checked if you actually own what you want to export to
- Removed temporary folder after compiling

## 2.0.3 - 2018-08-16
- Added type declarations so you can import rubber with typescript

## 2.0.2 - 2018-08-15
- Remove a test project that got accidentally published

## 2.0.1 - 2018-08-15
- On windows, cli wont actually launch.

## 2.0.0 - 2018-08-15
- Rewrite in TypeScript
- **BREAKING CHANGE** Total JS api change.
