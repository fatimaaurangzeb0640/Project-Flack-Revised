document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('cchannel').innerHTML = localStorage.getItem('channelstart');

    
       if (localStorage.getItem('name')===null)

    {    
        let name = prompt("Please enter your name", "");
         localStorage.setItem('name', name );

    }      
          
    document.getElementById("name").innerHTML =
    "" + localStorage.getItem('name') + "'s Account";



  //For retrieving messages
    //channel = localStorage.getItem('startchannel');
  getMessages();
  //For displaying channels
  getChannels();

  messagebox = document.getElementById("sendmessage");
  messagebox.disabled = true;

  channelbox = document.getElementById("createchannel");
  channelbox.disabled = true;

    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);


   
    // When connected, configure buttons
    socket.on('connect', () => {
      
        // Adding a new channel
        document.getElementById("createchannel").onclick = () =>  {
              
            const channel = document.getElementById("channelname").value;
            // Clear input field
            document.getElementById("channelname").value = "";
            
            socket.emit('make channel', {'channel': channel});
            
                  
              };

        //Sending a message
        document.getElementById("sendmessage").onclick = function sendMessage()  {
                  
         var currentDate = new Date();
          let day = currentDate.getDay().toString();
          let month = (currentDate.getMonth() + 1).toString();
          let year = currentDate.getFullYear().toString();
          let hours = new Date().getHours();
          let minutes = new Date().getMinutes();
          let name = localStorage.getItem('name');
          let channel = localStorage.getItem('channelstart');
          let time = day.concat('/', month, '/', year,' ', hours,':', minutes);

          const message = document.getElementById("message").value;
           
          // Clear input field
            document.getElementById("message").value = "";
           //message sent
            socket.emit('send message', {'channel' : channel, 'name': name, 'message': message, 'time': time});

                  
              };

          });


    socket.on('channel made', data => {
            channelname = data.channelname;

            if (channelname === "")
            {
           }
else
    {  
            appendChannels(channelname);
           
    }

           

  
          });    
         document.addEventListener('click', event => {
          const element = event.target;
          if (element.className === 'channels') {
            b = element.innerHTML;
            openChannels(b);
            getMessages(); 
          };
        });
    
        

            
              
          // When message is sent
              socket.on('message sent', data => {
                //cchannel = document.getElementById("cchannel");
                cchannel = localStorage.getItem('channelstart');
                channel = data["channel"];
                name = data["name"];
                messagetext = data["message"];
                time = data["time"];
                // To not send messages in the wrong channel
            if(channel === cchannel){
                      createMessage();
             }
           
      
        });

        // Can't submit an empty message
        document.getElementById("message").onkeyup = () => {
          if (document.getElementById("message").value.length > 0)
              document.getElementById("sendmessage").disabled = false;
          else
              document.getElementById("sendmessage").disabled = true;
      };

              // Can't submit an empty channel
              document.getElementById("channelname").onkeyup = () => {
                if (document.getElementById("channelname").value.length > 0)
                    document.getElementById("createchannel").disabled = false;
                else
                    document.getElementById("createchannel").disabled = true;
            };
      

        
      
      });

           
        function getMessages() {

          channel = localStorage.getItem('channelstart'); 

          // Open new request to get new posts.
          const request = new XMLHttpRequest();
          request.open('POST', '/retrievemessages');
          request.onload = () => {
              const data = JSON.parse(request.responseText);
              data.forEach(add_message);
          };
          const data = new FormData();
          data.append('channel', channel)

          request.send(data);

      };


      // Add a new message with given contents to DOM.
      function add_message(contents) {
          channel = contents["channel"];
          name = contents["name"];
          messagetext = contents["message"];
          time = contents["time"];

          createMessage();
     
  };


//Getting channels via ajax request
      function getChannels()
      {
        const request = new XMLHttpRequest();
        request.open('POST', '/getchannels');
        request.onload = () => {
            const data = JSON.parse(request.responseText);
            data.forEach(appendChannels);
        };
        request.send();

      }

      function appendChannels(contents)
      {
        button = document.createElement('button');
        button.setAttribute("class", "channels");
        button.innerHTML = contents;      
        li = document.createElement('li');
        li.setAttribute("class", "cc");
        li.appendChild(button);
       //li.innerHTML = contents;
       ul = document.getElementById("channellist");
       ul.appendChild(li);
      }
     

      function openChannels(b)

      {
        localStorage.setItem('channelstart', b);
        //channel = localStorage.getItem('channelstart');
        document.getElementById("cchannel").innerHTML = localStorage.getItem('channelstart');
        
        // To remove messages of previous channel
          div = document.getElementById("grid"); 
          while (div.firstChild) {
          div.removeChild(div.firstChild);
          }


      }
    function createMessage()
    {
      message = document.createElement('div');
      message.setAttribute("class", "msg");
      message.innerHTML = name.concat(': ', messagetext,' ',time)

     
      deletebutton = document.createElement('button');
      deletebutton.setAttribute("class", "delete");
      deletebutton.innerHTML = "Delete" ;
       wholemessage = document.createElement('div');
       wholemessage.setAttribute("class", "wm");
       wholemessage.appendChild(message);
       wholemessage.appendChild(deletebutton);

      grid = document.getElementById("grid");
      grid.appendChild(wholemessage);
      var elements = document.getElementsByClassName("delete");

      for (var i = 0; i < elements.length; i++) {
        n = elements[i].previousSibling.innerHTML;
        name ="";
        for(j=0; j<n.length; j++)
        {
          if(n.charAt(j)===":")
          { 
            name = n.substring(0,j);
            break;
          }
        }
        if (name === localStorage.getItem('name'))
        {elements[i].disabled = false;}
        else
        {elements[i].disabled =true;} 
 }


    }
      

      // If delete button is clicked, delete the message.
      document.addEventListener('click', event => {
      const element = event.target;
      if (element.className === 'delete') {
        content = element.previousSibling.innerHTML;
        channel = localStorage.getItem('channelstart');
        name = localStorage.getItem('name');
        contentlength = content.length;
        spacecount = 0;
        messagecount = contentlength - 1;

        //getting the time
        while (spacecount !== 2)
        {
          if (content.charAt(messagecount) === " ")
          { spacecount = spacecount + 1; }
          messagecount = messagecount - 1;
        }

      time = content.substring(messagecount + 2, contentlength);
        
        // getting the message
        for(i = 0; i < contentlength ; i++ )
        {
          if (content.charAt(i)===":")
          {
            message = content.substring(i + 2, messagecount + 1);
            break;
          }
        }
          deleteMessage(channel, name, message, time);

          element.parentElement.remove();
                }
            });

            function deleteMessage(channel, name, message, time)
            {
               // Open new request to delete messages.
               const request = new XMLHttpRequest();
               request.open('POST', '/deletemessages');
               request.onload = () => {
               const data = JSON.parse(request.responseText);
               if (int(data.value) === 1)
               {
                 alert("Message deleted")
               }
                      };
       
               const data = new FormData();
               data.append('channel', channel);
               data.append('name', name);
               data.append('message', message);
               data.append('time', time);
        
               request.send(data);
                
            }
       
       
            document.getElementById("message").onkeyup = () => {
              if (document.getElementById("message").value.length > 0)
                  document.getElementById("sendmessage").disabled = false;
              else
                  document.getElementById("sendmessage").disabled = true;
          };
