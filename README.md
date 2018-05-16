
# Building Voice Controlled IoT using Arduino and Amazon Alexa
![Tutorial Header](https://m.media-amazon.com/images/G/01/mobile-apps/dex/alexa/alexa-skills-kit/tutorials/fact/header._TTH_.png)
*Disclaimer: This is a documentation on a [personal project](https://github.com/AlexXiong97/NTU-DIP), the source code has not been audit or heavily tested, thus no guarantee on its security, it's **NOT production ready**, please use it at your own risk.*

## Project Overview
This documentation is streamlined from an original project that uses Amazon Alexa to accept voice commands to move a robotic arm whose motors are controlled by an Arduino, to play a [sliding puzzle](https://en.wikipedia.org/wiki/Sliding_puzzle). With application specific parts stripped away, this repo focus on a generally referrable and reusable structure/template that achieves: **duplex communication between Arduino and Alexa Skill via HTTP API call**.

More specifically, an Arduino Webclient will be set up to query states from or update new states to Alexa Skill running on Amazon Lambda function through a defined API in JSON format.
## Requirements /    Prerequisites
Hardware:
 - Arduino Uno <small>( Mega, Yun, etc. definitely works as well, but this doc is more specific to Arduino Uno whose network capability is limited, so if you unfortunately chose Arduino Uno like I did, read on :) )</small>
 - Arduino Ethernet Shield
 - (optional) Amazon Alexa Echo

Environment:tion ready**, please use it at your own risk.*
 - Node.js 6.10 LTS (recommend install [Node Version Manager](https://github.com/creationix/nvm) for nodejs version switching)
 - Install and Setup [ASK CLI](https://developer.amazon.com/docs/smapi/quick-start-alexa-skills-kit-command-line-interface.html)

Amazon Account:
 - Register for [AWS account](https://aws.amazon.com/)
 - Register for [Amazon Developer Account](https://developer.amazon.com/)
## Before Going Further, You Should Know
- If you're able to assign your Arduino with **a globally addresssable, static IP address**; or if you are able to configure the router forwarding table under which your Arduino resides, then I'd **strongly recommend using [MQTT](http://mqtt.org/documentation) Subscribe&Publish Standard**. Here is an [MQTT client library](https://github.com/knolleary/pubsubclient) for Arduino Ethernet Shield.
- In another word, **this doc is ONLY for those who wants to duplex communication but whose Arduino can only connect to an institutional network** (e.g. university, company) or private network **that relies on a proxy server or NAT server for internet access**.
	- A quick way to find out, is to [look up ip address info](https://whatismyipaddress.com/ip-lookup), click on `Get IP Detail` and look at `Assignment` field to see whether it's statically assigned IP.
- This doc assumes basic understanding of
	- how a custom Alexa Skill works
	- concepts like Interaction Model, Utterance, Intents, Slot Type
- If you are totally new to developing Alexa skill, it is strongly recommended to go through a [few examples](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs#samples) for conceptual familiarity.
- By the time of development, only `ask-sdk` version1 exits, but by the time of writing, there has been a newer release, still, no worry at all, [migration](https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs/wiki/ASK-SDK-Migration-Guide) using `ask-sdk-v1adaptor` is simple! Plus the update of `ask-sdk` only affects minimal code in Alexa skill, the rest of the steps, configuration procedure remain unchanged.

## Table of Contents & Things You Will Learn

- **[STEP 0:](./0-system-architecture.md) System Architecture**

- **STEP 1: Alexa Skill built with `ASK-SDK` and `ASK CLI`**

- **STEP 2: Invoking another Lambda Function**
  - to modulate and decouple the web server logic from that of the Alexa skill's core logic

- **STEP 3: Configuring `Amazon API Gateway`**

- **STEP 4: Implement Web Server in another Lambda Function and connecting the two**

- **STEP 5: Configuring `Amazon CloudFront`**
	- accept HTTP request instead of HTTPS, while avoiding `cdn` for JSON request

- **STEP 6: Implement Arduino WebClient**
	- to parse JSON response and initiate HTTP request

- (Additional) A hacky way to keep Alexa Echo waiting for minutes without ending the session

## Contribution
This write-up doesn't put completeness on top, but instead it give disproportionate emphasis/details on things matter or things I wish I could have read or have as a guide during my development experience.

If you find this write-up useful and intend to wrap it into a more full-fledged documentation, please feel free to fork this repo or submit any issues. Any Pull Request are welcomed!

Plus, all code and markdown files are all under MIT license.
