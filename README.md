# Local-APRS

local-aprs is a 'local' web server and client for aprs messages.  Imagine
an event.  There are 10 amateurs there with handheld radios, but do those
handhelds have APRS capability?  Probably not.  But chances are, those same
amateurs are carrying smart phones.  And those phones (or tablets)
usually have GPS receivers.  Now, the event may not have good internet
coverage on the cell system, which is to be expected (or perhaps we're in a
"when all else fails" scenario).  So we don't want to count on connections to
APRS-IS, or any internet connection.  How about if we had a local aprs server that
could be setup on-site?  The local server would consist of a radio, TNC, a
server (like a Raspberry Pi perhaps), and a wifi access point.

The individual users connect to the local-aprs server through their wireless
devices, on the local wi-fi.  Now they can see tactical information
(bulletins, object status, etc) on their cell-phones even though there may
not be internet or cellular coverage.  And they're connected to the wider-area
tactical situation through APRS.  They can exchange messages, set beacons,
update objects, etc.  They still have the handheld radios, obviously,
for coordination and instructions, and anything that doesn't fit on APRS,
but the voice channel now doesn't have to be tied up with
status and position reports.

Event controllers or others could also access the tactical situation through
tablets or laptops.  This is not unlike Bob's [ZipLan](http://aprs.org/APRS-docs/ZIP-LAN.TXT) concept, only implemented with
wi-fi.

Effectively, local-aprs allows multiple amateurs to share the APRS radio
hardware within the range of the local wi-fi access point.  Then data can be
shared over the range of the APRS digipeaters, as usual.

The same basic system could be used in a home network, so you can check the
"over-the-air" APRS status through your phone, tablet, or installed in a car,
to connect with APRS messaging (put the radio and wifi interface in the trunk,
and then see the status on your phone).

# System Architecture

There is a server component running under Node.js that connects to the TNC and
radio through whatever serial connections are required.  The proof-of-concept
system uses a Raspberry Pi connected to a Pac-Comm 320 TNC, connected to a
Yaesu FT2400 radio.

The server component runs the Express web server, and starts up a monitor
on the serial port.  When data comes in, it gets passed through the KISS framing
parser and APRS parser contained in the 'utils-for-aprs' project, and stored in
JSON format.  The last
hour's packets are stored for replay when a client connects.  Live packets
are repeated out to the clients using web sockets.

The client is an AngularJS application that's served out by the server.  It runs
in the client's browser, and communicates back to the server using web sockets.
It uses the Bootstrap and UI-Bootstrap libraries to provide responsive-web
characteristics, so it runs on a variety of devices.

Upon initial connection, the server plays back the last hour's packets, so that
the user has an instantly-available view of the APRS situation.  (Note - this
is a neat thing about APRS.  Since the protocol has a "Net Cycle Time" of 30
minutes max, all the senders will repeat their packets within this time.  So
the server doesn't have to do any "intelligent" status recording.  It just has to
replay the packets, and the clients are automatically current). The web socket
connection remains open.  Any APRS packets received by the TNC are
sent out the web socket connections by the server.

The server can also serve out local copies of "slippy map" tiles for the local
area, to support clients that are big enough to display maps.

The client will need to authenticate to the server and also establish the identity
of the human user, so that the right call sign, etc, can be used.  It is also
possible to establish a receive-only connection that doesn't require a call sign
(e.g. for EOC displays or unlicensed users monitoring the tactical situation).

When the client wants to send an APRS message, it sends the message to the server
using its open websocket connection.  The packet is in the JSON format
as produced by the APRSParser. The server sends the packet out over the TNC
as a "third-party" packet, and also handles re-sends and the packet decay
algorithm (the server "owns" the radio, so gets to manage the traffic over it).

If required, the server can also run a local digipeater.

This project includes the code for the web socket server that connects to the
TNC and radio.  The TNC connection is KISS-over-TCP to localhost:8001

The client application will be separate, as will the map server.  All the pieces
will end up as separate applications that are installed behind a front-end web
server (e.g. Apache).

# Running the system

Right now, the system is a development-mode system. In
order to run, clone the repository and then run   
    gulp  
Copy the 'config.json.sample' file to 'config.json' and edit it to reflect the
required KISS port and KISS host.  For example, if you're using Dire Wolf
on the local machine, then you'd set them as follows:

    {
      "kiss-host": "localhost",
      "kiss-port": 8001,
      "standardPacketMinutesToLive": 60,
      "bulletinHoursToLive": 4,
      "announcementHoursToLive": 24
    }

If you were using 'share-tnc' on a host called 'raspberrypi', you'd set it like:

    {
      "kiss-host": "raspberrypi",
      "kiss-port": 8001,
      "standardPacketMinutesToLive": 60,
      "bulletinHoursToLive": 4,
      "announcementHoursToLive": 24
    }

Now, run 'npm start' or 'gulp run', and the system will startup
and begin to serve out the application,
which you can access at localhost:3000.

# Portability

local-aprs has been tested on OSX and Windows 7, and should be good to go
wherever you can run Node.
