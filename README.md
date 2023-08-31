<div align="center">
  
  ![Title](/public/title.png?raw=true "Supply Manager Title")
  
</div>
<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-blue?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E">
  <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/shadcn%2Fui-black?style=for-the-badge&logo=shadcn&logoColor=white">
  <img src="https://img.shields.io/badge/Recharts-turquoise?style=for-the-badge">
</p>
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff&style=for-the-badge">
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white">
  <img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white">
  <img src="https://img.shields.io/badge/Neon-brightgreen?style=for-the-badge">
</p>

# Introduction

Supply Manager is a full-stack web application that allows warehouse managers to access performance metrics and manage their employees.

I created this project as part of a 4-week hackathon hosted by [DonTheDeveloper](https://www.youtube.com/@DonTheDeveloper), which aimed to create an MVP that would solve a real-world problem. I decided to remake my current workplace's software because it is slow, outdated, and rented from another company.

Originally, I planned on creating different sections to manage the different aspects of the warehouse (shipping, receiving, order filling, lift driving, etc.). However, because of the time limit, I decided to create only the order-filling management section and polish it as much as possible.

# Description

Supply Manager is modeled after the software for managing a grocery distribution center. Items are processed in the distribution center in the following manner:

- Cases are received on pallets in bulk on the receiving dock of the distribution center.
- These pallets are checked and scanned into the system by receivers.
- Then, put-away lift drivers take the pallets and place them in slots in racks that are labeled with identifying numbers and letters.
- Replenishment lift drivers take the pallets down from the racks as needed and place them in slots on the ground level to be picked by order fillers.
- Order fillers drive by and pick the required number of cases from each slot for their trips.
- Once order fillers complete their trips, they place identification labels on the trips and have them shrink-wrapped.
- Then, the trips are brought to different doors on the shipping dock to be loaded onto truck trailers by loaders.
- If an order filler could not pick all their cases for a trip because a slot was empty, a chase order filler returns later to retrieve the cases before the trip is loaded onto the trailer.
- Finally, loaders scan off each pallet as they load it onto the trailer.

Every item brought into the warehouse is tracked as it makes its way to the shipping trailers.

# Project Overview

## Dashboard

The dashboard contains charts showing information about the shipping team for the current day and the past week, including:

- The number of unassigned, assigned, and completed trips for the current day
- The number of trips completed each day for the past week
- The number of cases shipped each day for the past week
- The five highest-performing order fillers

## Team Management

On this page, you can view a summary of all your order fillers, including their average performance, total cases picked, and completed standard hours for the selected day.

## Order Filler Details

This page allows you to examine each order filler’s information individually. You can view information on every trip they completed each day and the items on each trip. If a trip is assigned to an order filler, and no cases have been picked yet, you can unassign that trip from the order filler.

## Trip Management

Here you can view a summary of all trips on any given day. The dropdown menu on the right of each table row allows you to do the following:

- View the trip details (individual items on each trip)
- Assign the trip to an order filler if the trip is currently unassigned
- Unassign the trip from an order filler if the trip is assigned and has not had any cases picked yet

# Current Features

- Dashboard
- Order Filler Performance Details
- Order Filler Summary
- Trip Summary
- Trip Details
- Assigning and Unassigning Trips

# Future Improvements and Optimizations

Much of the code in this project is unoptimized and not written according to best practices. Due to the time limit and the nature of this hackathon, I chose to get the MVP up and running as quickly as possible instead of trying to make my code perfect. I plan on making the following improvements once the hackathon is over, including, but not limited to:

- **API documentation:** Much of the API I developed for the backend is difficult to understand and uses jargon specific to where I work. I plan on writing API documentation that explains the meaning of all the variable names used.
- **Refactor code into separate functions and components:** Some files contain many different components that should be placed in their own files.
- **Data pagination:** The backend currently fetches more data than the client requires per request. For example, instead of retrieving only the 10 trips the user needs to see on the trip management page, the backend fetches and preloads all the trips for the selected date. The code must be rewritten to retrieve only the data that is required.
- **Replace `any` types with correct types:** This was my first project developed using TypeScript, which I learned as I went along. Because of the deadline, I declared some variables with the `any` type to save time figuring out how to define them.
- **Make the app mobile-friendly:** Although the site has a mobile navbar, the rest is not easily usable on mobile devices. Due to the nature of this site, it doesn’t need to work on mobile as it would mostly be used on laptop and desktop computers in a warehouse, but I will work on making it mobile-friendly in the future.

## Known Bugs

- A small bug in the combo boxes lets you search employees only by username, not by full name.

# Credits

**Food item names:** USDA FoodData Central Data (https://fdc.nal.usda.gov/download-datasets.html)

**Avatar images:** https://www.freepik.com/free-vector/bundle-with-set-face-business-people_6196665.htm#query=profile avatar&position=19&from_view=keyword&track=ais
