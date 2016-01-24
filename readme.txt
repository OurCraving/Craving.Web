This project is using Node server + gulp, not runnable under IIS now (unless we point the server to the built folder). 

In order to run it, make sure:
1) Node and GitShell (or something can run npm/bower/gulp) are installed (CMD in Administrator mode actually worked)
2) Open GitShell, locate to the root folder of this project
3) run the following commands if it's the first time:

	npm install
	bower install

4) now we can build it

	gulp --theme md build:d

   if it's for the deployment, use

	gulp --theme md build:d --release true

5) to run it locally

	gulp --theme md 

================================================================

this project was originally based on a theme purchased online. there is a build-able theme: [ourcraving], which is now obsolete. 

the new theme is based on material design, so only files under [md] folders are needed; however, there might have some javascript are shared with [ourcraving].


=================================================================
this is a command to help remove a folder that is too long 

	robocopy /MIR c:\test E:\UserData\HomeDrives

see this page 

http://clintboessen.blogspot.ca/2014/05/how-to-delete-files-which-exceed-255.html