# Data Generator
A quick script to generate large amounts of test data. Takes advantage of two already existing random data generation libraries, [Chance.js](http://chancejs.com/) and [Faker.js](https://github.com/FotoVerite/Faker.js), to actually create the data.

# Usage
Usage: `node genSchemas.js <Category>`  

Run the `genSchemas.js` file with one positional command line argument for the data category. This value tells the 
program the theme of the test data to generate.

Avliable categories:

- location
- user
- web

# Defining Your Own Categories
In the `genSchemas.js` file there is a object named `items`. This object holds numerous keys, each which then hold an 
array of keys themselves. 

Each of the object keys is a category name. The user specifies which category to use via the command line interface. The keys in the arrays are [Chance.js](http://chancejs.com/) 
or [Faker.js](https://github.com/FotoVerite/Faker.js) keys. Although you will find some do not work due to a downstream library issue.
