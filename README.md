# Flack - Flask based Chat Application

Web Programming with Python and JavaScript

When the user first time visits the application, they are prompted to type in their name which is stored in
local storage so the browser remembers the name of the user next time they come. When the user first visits the website 
default channel is general channel that is already stored in the server memory. Users can create channels and send messages
and the current channel is stored in local storage so that when the user visits next time, the browser remembers its channel.

The server side memory only holds the most recent 100 messages of a channel. The code for that can be seen in the msg() function in the server side.

Users are not allowed to send empty messages or create channels with empty names or create channels with similar names. 

In the index.js file, the channels and messages are retrieved making ajax requests to the server.

As an additional feature, user can delete their own messages. The messages disappear instantly and are deleted from server
after pressing the deletion button. The coding is done on the server side to delete channels.
