![Version][version-shield]
![Issues][issues-shield]
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![LinkedIn][linkedin-shield]][linkedin-url]
[![Next.js][Next.js]][Next-url]
[![React.js][React.js]][Next-url]

📚 [**About The Project**](#about-the-project) • 📃 [**Requirements**](#requirements) • 🚀 [**Getting Started**](#getting-started) • 💬 [**Feedback**](#feedback)

# Table of Contents

- [About The Project](#about-the-project)
  - [Overview](#overview)
  - [The Problem](#the-problem)
  - [The Solution: MeetMinder](#the-solution-meetminder)
    - [Core Features](#core-features)
- [Requirements](#requirements)
  - [Hardware](#hardware)
  - [Software](#software)
  - [Connectivity](#connectivity)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Creating Environment Variables](#creating-environment-variables)
  - [Configuration File Setup: appconfig.json](#configuration-file-setup-appconfigjson)
  - [Building the Application](#building-the-application)
- [Deployment](#deployment)
- [Running the Application](#running-the-application)
  - [Install PM2](#install-pm2)
  - [Configuring PM2 and Starting the Application](#configuring-pm2-and-starting-the-application)
  - [Install Unclutter](#install-unclutter)
  - [Configure Your Pi to Start the LXDE Environment](#configure-your-pi-to-start-the-lxde-environment)
  - [Create a Chromium Start Script](#create-a-chromium-start-script)
- [License](#license)

## License

This project is licensed under the terms of the GPL license.

## About the Project

### Overview

In the dynamic landscape of organizational operations, managing the availability of meeting rooms poses a constant challenge. Offices often require these spaces for a variety of purposes, ranging from impromptu meetings to brief, private phone calls. However, the current methods of room availability checks are cumbersome and can lead to disruptions or unnecessary delays.

**MeetMinder** emerges as a solution to these challenges, offering real-time insights into meeting room statuses, thereby fostering seamless room management for organizations.

### The Problem

Traditional approaches to verify room availability are fraught with inefficiencies:

- **Intrusive Checks:** Risk of interrupting ongoing meetings by physically checking room occupancy.
- **Immediate Evictions:** Instances where one might occupy a room, only to be ousted due to a pre-scheduled meeting.
- **Cumbersome Searches:** Navigating through calendars or booking systems is time-consuming and inefficient.

These methods are intrusive, time-consuming, and often lead to professional embarrassment or workflow disruption.

### The Solution: **MeetMinder**

MeetMinder epitomizes convenience and efficiency in this domain. Positioned strategically next to the meeting room, a screen provides at-a-glance information on room status, ensuring employees make informed decisions without the need to disrupt ongoing sessions or engage in tedious checks.

#### Core Features

MeetMinder optimizes room management by displaying:

- **Current Room Status:** Easily ascertain whether a room is occupied or available.
- **Upcoming Meeting Alerts:** View the start time of the next meeting.
- **Ongoing Meeting Duration:** Understand how long the current meeting will last.
- **Event Queue:** Preview the next three events scheduled in the room.
- **Event Details:** Discern the context with the names of the meetings.

With these features, MeetMinder streamlines the process of meeting room allocation, reduces workplace disruptions, and contributes to organizational efficiency.

## Requirements

To ensure smooth deployment and operational success, MeetMinder necessitates specific hardware components and software subscriptions. Below is a checklist of the essential requirements:

### hardware

- **Display:** Any monitor or digital display screen compatible with standard connection interfaces (HDMI/USB-C/VGA).
- **Mini PC:** A compact computer, connected to the display, capable of continuous operation (Confirmed compatibility with Raspberry Pi 3 B+ and Raspberry Pi 4 models).

### Software

- **Google Workspace Subscription:** Active subscription to access necessary API features and calendar resources.

### Connectivity

- **Stable Internet Connection:** Essential for real-time data retrieval and system operations. MeetMinder requires continuous internet access to function, as it relies on cloud-based services for updates on meeting schedules and room availability statuses.

It is imperative that users ensure these requirements are met for seamless installation, setup, and utilization of MeetMinder’s features. The absence of a consistent internet connection, notably, will impede the system's ability to provide updated information, thereby negating its primary benefits.

Please note, while the system has been tested on specified hardware, it is adaptable with any setup meeting the criteria mentioned above. Users should ensure stable internet connectivity for optimal performance.

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed the latest version of Node.js and npm. You can check by running `node --version` and `npm --version` in your terminal.
- **Raspberry Pi Configuration:** You should have a Raspberry Pi prepared with the latest Raspberry Pi OS. Ensure it is updated to its most recent version for maximum compatibility and performance. Refer to the [Raspberry Pi documentation](https://www.raspberrypi.com/documentation/) for update instructions and system setup.
- **Google Cloud Platform (GCP) Service Account:** Establish a service account with the necessary permissions within GCP. This account must have explicit access rights to interact with calendar resources, particularly those associated with meeting rooms. Follow the [GCP documentation](https://cloud.google.com/iam/docs/service-accounts-create) for detailed steps on creating and configuring service accounts with appropriate permissions.

Failure to meet these prerequisites may lead to interruptions in the setup process or limitations in the functionalities of MeetMinder. I recommend a thorough review of this section before commencing the installation.

### Creating environment variables

For secure and successful operation, MeetMinder requires the configuration of specific environment variables. These variables store sensitive data and credentials, allowing for authenticated interaction with Google Workspace's services.

#### Required Environment Variables

`GOOGLE_CLIENT_EMAIL`: This variable holds the unique client email address associated with your Google Cloud Platform service account. It is utilized to authenticate the application's requests sent to Google APIs.

- Type: String
- Format: some_name@your_gcp_project_name.iam.gserviceaccount.com
- Obtaining the Client Email: You can find this information in the GCP console under your service account settings.

`GOOGLE_PRIVATE_KEY`: This variable holds the private key from your GCP service account, necessary for secure transactions and requests. It is instrumental in accessing Google Workspace calendar resources securely.

- Type: String (Multiline)
- Security Note: Ensure this key remains confidential to prevent unauthorized access.
- Obtaining the Private Key: Upon creating a service account in your GCP console, you are prompted to download a JSON file containing this key.

**Important:** Never include sensitive credentials in your codebase or version control. Always use environment variables or other secure means of storage.

By properly setting up these environment variables, you ensure the secure and efficient functioning of MeetMinder, enabling it to interact with Google's services without exposing sensitive information.

### Configuration File Setup: `appconfig.json`

To customize and operate MeetMinder effectively, users must create a configuration file named appconfig.json in the project's root directory. This file will hold essential settings and preferences, allowing for a personalized user experience. Here's how to structure this file and the information it needs to contain:

```
{
    "roomNames": [
        "First Room Name",
        "Second Room Name",
        // ... additional room names
    ],
    "calendarIds": [
        "first_calendar_id@resource.calendar.google.com",
        "second_calendar_id@resource.calendar.google.com",
        // ... additional calendar IDs
    ],
    "backgroundColor": "#HexColorCode",
    "cardColor": "#HexColorCode",
    "fontColor": "#HexColorCode",
    "additionalFontColor": "#HexColorCode"
}
```

- **roomNames:** An array of strings, each one specifying the name of a meeting room as you want it displayed in the application.
- **calendarIds:** An array of strings, each one representing the unique identifier for a Google Calendar associated with a specific meeting room. These should correspond in order to the room names specified above.
- **backgroundColor:** A string representing the hexadecimal color code for the application's background color.
- **cardColor:** A string representing the hexadecimal color code for the background color of information cards within the application.
- **fontColor:** A string representing the hexadecimal color code for the general text color within the application.
- **additionalFontColor:** A string representing the hexadecimal color code for any secondary text or details within the application.

### Building the Application

After successfully setting up the project environment and implementing the necessary configurations, the next step involves building the application. This process compiles the application and gets it ready for deployment. Follow the steps below to build your application:

#### Step 1: Open a Terminal or Command Prompt

Navigate to your project's root directory in the terminal or command prompt.

`cd path/to/your/project`

#### Step 2: Run the Build Script

With the terminal now in your project's root directory, execute the following command to start the build process. This command tells npm to run the script named "build" that's defined in package.json. It triggers the series of tasks necessary to build the application.

`npm run build`

## Deployment

After the successful building of the application, the next phase is deployment. For this project, we are focusing on deploying the application to a Raspberry Pi. This section provides a step-by-step guide on how to transfer your build to the Raspberry Pi using Secure Copy (SCP), a method for securely transferring files between local and remote hosts.

Open a terminal on your local machine and use the scp command to securely transfer the build directory to your Raspberry Pi. Replace `[PI_IP_ADDRESS]` with your Raspberry Pi's actual IP address and `[USER]` with your Raspberry Pi username (default is usually 'pi').

`scp -r path/to/your/build [USER]@[PI_IP_ADDRESS]:/destination/path/on/your/pi`

## Running the Application

To ensure your application reliably runs without interruption, we recommend using PM2, a process manager for Node.js applications. PM2 can automate the process of keeping your application running, even if your Raspberry Pi reboots.

### Install PM2

If you haven't installed PM2 on your Raspberry Pi, you can do so by using the following command: `npm install pm2 -g`

### Configuring PM2 and Starting the Application

Navigate to your application directory and use PM2 to start your application.

```
cd /path/to/your/application
pm2 start npm --name "your-app-name" -- start
```

To make sure PM2 starts automatically on boot, use the following command:

`pm2 startup`

This command will output another command with a path to the pm2 executable. Run that command. **For example:**

`sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u pi --hp /home/pi`

Finally, save the current PM2 processes and their states with the following command, so they can automatically restart on reboot:

`pm2 save`

#### Reboot

Now that everything is set up, reboot your Raspberry Pi to ensure everything starts correctly.

`sudo reboot`

After your Raspberry Pi restarts, MeetMinder should start automatically in Chromium, displayed in full screen.

### Install Unclutter

"Unclutter" is a utility for hiding the mouse cursor when not in use, which is particularly useful for touchscreen or presentation uses like in kiosk systems. If you do not have "unclutter" installed, you can add it to your Raspberry Pi by following the command below.

`sudo apt-get install unclutter`

### Configure Your Pi to Start the LXDE Environment

Edit the LXDE-pi autostart file. This file allows you to define what commands or scripts will run after the LXDE environment starts.

`vim ~/.config/lxsession/LXDE-pi/autostart`

Add the following lines at the end of the file. These commands disable screen savers, power management, and any screen blanking. Additionally, it sets up Chromium in kiosk mode to start displaying MeetMinder automatically.

```
@lxpanel --profile LXDE-pi
@pcmanfm --desktop --profile LXDE-pi
@xscreensaver -no-splash
@/home/pi/start-chrome.sh
@unclutter -idle 0
@xset s off
@xset -dpms
@xset s noblank
```

### Create a Chromium Start Script

Create a new script file that will start Chromium in kiosk mode, pointing it to the application running on localhost.

First, navigate to the home directory and create a new script file:

`cd ~`
`vim start-chrome.sh`

Then, add the following script:

```
#!/bin/bash
DISPLAY=:0 /usr/bin/chromium-browser --noerrdialogs --disable-infobars --kiosk https://localhost:3000
```

Make the script executable:

`chmod +x start-chrome.sh`

[version-shield]: https://img.shields.io/badge/version-_v1.0-blue
[issues-shield]: https://img.shields.io/badge/issues-_0_open-green
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/anna-pominchuk-7a69a3121/
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
