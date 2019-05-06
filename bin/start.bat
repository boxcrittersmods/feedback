@echo off
title webserver
cd "%~dp0/.."
:start
bundle exec jekyll s
goto :start