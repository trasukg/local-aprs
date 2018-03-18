
# Local-APRS Requirements

## Overall

The Local-APRS hardware and software needs to support the following general
requirements:

- Users connect over WiFi
- System provides one native WiFi that's used for configuration and for
  small-scale deployments.  
- Administrator signs on to a webapp on the native WiFi for configuration.  
- There is also a network connection to support larger-scale deployments, where
  you'd want an external WiFi access point.  In this scenario, you might want
  the Pi to provide DNS and DHCP services (let's say if this is a stand-alone
  deployment that happens to need an external AP), 
  or you might want to integrate with a
  pre-existing network.
- External network connection also supports use in a home network, for
  programming, testing, etc.  
- The radio can be switched on and off by the Pi.  This could be used for
  part-time operation to conserve battery life, or to power-cycle the radio if
  it goes funny.  
- The radio can act as a local fill-in digipeater.  This feature can be turned
  off or on in the configuration screen.  
- The unit can provide switched (controllable) power to four external
  peripherals, connected by Power-Pole connectors.  
- The system provides a web-based APRS client.  Users connect to the web page
  and can see the tactical situation, and exchange messages with other APRS
  users.  
- Power is provided by a Power-pole connection.  The aprs unit itself does not
  have batteries or charging capability.


## Sound Card Packet Interface

- Interface is to a Motorola GM300 radio  
- Microphone input needs 80 mV for 60% deviation
- RX Audio output supplies 600mVrms at 60% deviation
- Microphone input to sound card should be about the same as for the radio  
- 1K/10K ladder should do.  


