var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
  
});

function start() {

    queryAllProducts();

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\nPlease select your purchase from the items presented below.")
        console.log("\n-------------------------------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      }
      console.log("-------------------------------------------------\n");

      var response = res[i];

      postPurchase(response);
    });
    
  }
  
}

// function to handle item up for purchase
function postPurchase() {
    // prompt for info about the item being put up for purchase
    inquirer
      .prompt([
        {
          name: "item",
          type: "input",
          message: "What is the item you would like to purchase?"
        },
        {
          name: "units",
          type: "input",
          message: "How many units of the product would you like to purchase?"
        }
      ])
      .then(function(answer) {
        // when finished prompting, insert a new item into the db with that info
        //var chosenItem;
        //var chosenUnits;

            var chosenItem = answer.item;
            var chosenUnits = answer.units;

            getPrice();
        
        function getPrice(){
          connection.query(
            "SELECT price, stock_quantity FROM products WHERE ?",
            [
              {
                item_id: chosenItem,
              }
            ],
            function(err, results) {
              if (err) throw err;
              
              var chosenItemPrice = results[0].price;
              var chosenItemQty = results[0].stock_quantity;
              
              
              // determine if there is enough quantity on hand
              if (chosenUnits <= chosenItemQty) {

                var updatedItemQty = chosenItemQty - chosenUnits;
                var purchaseTotal = chosenUnits * chosenItemPrice
                
                // if there is enough quantity on hand then update products table
                connection.query(
                  "UPDATE products SET ? WHERE ?",
                  [
                    {
                      stock_quantity: updatedItemQty
                    },
                    {
                      item_id: chosenItem
                    }
                  ],
                  function(error) {
                    
                    // if there is enough quantity on hand inform customer of success and present customer with total purchase price
                    if (error) throw err;

                    console.log("Item Quantity updated successfully!");
                    console.log("\nYour Total Purchase Price is: $" + purchaseTotal + ".00");
                    
                    // transactions completed and exit application
                    connection.end();
                  }
                );
              }
                    else {
                      // if there is not enough quantity on hand, apologize to the customer and have them start over
                      console.log("\nInsufficient quantity on hand. Please try your purchase again...");
                      start();
                    }
                    }
                )};

        }
    )};

            