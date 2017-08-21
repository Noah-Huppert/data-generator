# data-generator
A quick to generate large amounts of test data.

# Usage
Run the `genSchemas.js` file with one positional command line argument for the "schema list name". This value tells the 
program which set of keys you would like to use for your test date.

Usage: `node genSchemas.js location`  
This will output a large amount of test data to out/. 

# Defining Your Own Schema Lists
In the `genSchemas.js` file there is a object named `items`. This object holds numerous keys, each which then hold an 
array of keys themselves. 

Each of the object keys is a list name, this is passed via the command line interface. The keys in the arrays are [Chance.js](http://chancejs.com/) 
or [Faker.js](https://github.com/FotoVerite/Faker.js) keys. Although you will find some do not work due to a downstream issue.
