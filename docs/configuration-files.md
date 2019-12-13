
# Configuration Files

## Requirements

* The server needs to know where to connect to the radio  
* Server needs to know how long to keep the recorded packets.  
* Server needs to know whether transmissions are allowed in general  
* Server may want to allow or limit transmissions per call sign.  
* Server needs to know the transmission call sign for third-party transmissions  
* Server may want to provide a set of predefined status options that the user
can pick out.  
* Server may want to provide a set of predefined destination calls for
messaging (e.g. at a hamfest) or an event.  
* The client may want to have a set of destination calls with additional
information over the call sign (e.g. a kind of contact list).  
* Server needs to pass on the packet transmission profile to the
clients - e.g. how long to wait before retransmit, etc.  
* Client needs to know the user's call sign for transmissions.  
* User will have preferences for the local client - beaconing, auto-responder,
etc.  
* Server may or may not want to allow the client preferences to override certain
things.  
* The server may want to provide a set of defaults for client preferences  
* An authorized user can update the server configuration and any values provided
to the clients.  
* Client preferences are stored in local storage on the browser.  
* Client preferences are keyed to the server identifier, so that if you use the
same device (browser, phone, etc) against multiple local-aprs servers, the
preferences are kept separately.  

## Design

* The server keeps a client-configuration file.  The client downloads this
file when it connects to the server.
* The server also keeps a file that tells the client what fields in the
client-configuration file can be overridden by the client side.
  * Some fields are purely configuration and not user preferences. In other words they shouldn't be shown in an editor page.
* The client stores a client-side configuration on the client, only if the
user has done any overrides.  This file is also downloaded on connection.  
* The client merges the server and client configurations according to the
override file, to form an effective configuration, that is made available
through a selector.
* The schema for the configuration is defined in a ClientConfiguration class.
* The client has a screen where the user can edit their preferences.
