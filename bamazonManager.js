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
  
  // run the runSearch function after the connection is made to prompt the user
  runSearch();
  
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
       case "View Products for Sale":
        queryAllProducts();
        break;
      
       case "View Low Inventory":
        queryLowInventory();
        break;

      case "Add to Inventory":
        postInventory();
        break;

      case "Add New Product":
        postNewProduct();
        break;
      }
    });
}

// function to list all products for sale
function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\nProducts for sale are presented below.")
        console.log("\n-------------------------------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      }
      console.log("-------------------------------------------------\n");

      connection.end();
      
    });
    
  }
  
  // function to check low item inventory (any items <= 5)
  function queryLowInventory() {
      connection.query("SELECT * FROM products WHERE stock_quantity < 5 ", function(err, res) {
          if (err) throw err;
          console.log("\nProducts with Low Inventory are presented below.")
          console.log("\n-------------------------------------------------");
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("-------------------------------------------------\n");
        
        connection.end();

      });
      
    }

    // function to handle item up for inventory update
    function postInventory() {
        // prompt for info about the item being put up for inventory update
        inquirer
          .prompt([
            {
              name: "item",
              type: "input",
              message: "What is the item you would like to update?"
            },
            {
              name: "units",
              type: "input",
              message: "How many units of the product would you like to update?"
            }
          ])
          .then(function(answer) {

              var chosenItem = answer.item;
              var chosenUnits = answer.units;

                connection.query("SELECT stock_quantity FROM products WHERE ?", 
                [
                  {
                    item_id: chosenItem
                  }
                ],

                function(err, res) {
                if (err) throw err;

                  var updateQty;

                  updateQty = parseInt(res[0].stock_quantity) + parseInt(chosenUnits);
                  
                  // if there is enough quantity on hand then update products table
                  connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: updateQty
                      },
                      {
                        item_id: chosenItem
                      }
                    ],
                    function(error) {
                      
                      // inform manager of success and present manager with message
                      if (error) throw err;
                      
                      console.log("Item Stock Quantity updated successfully!");
                      
                      // transactions completed and exit application
                      connection.end();
                    }
                  )
                  
                }

                )}
              )}

              function postNewProduct() {
                // prompt for info about the item being put up for auction
                inquirer
                  .prompt([
                    {
                      name: "item_id",
                      type: "input",
                      message: "What is the Item id you would like to submit?"
                    },
                    {
                      name: "product_name",
                      type: "input",
                      message: "What is the Product Name you would like to submit?"
                    },
                    {
                      name: "department_name",
                      type: "input",
                      message: "What is the Department Name you would like to submit?"
                    },
                    {
                      name: "price",
                      type: "input",
                      message: "What Price would you like to place your new product?"
                    },
                    {
                      name: "stock_quantity",
                      type: "input",
                      message: "What Stock Quantity would you like to place on your new product?"
                    },
                    
                  ])
                  .then(function(answer) {
                    // when finished prompting, insert a new item into the db with that info
                    connection.query(
                      "INSERT INTO products SET ?",
                      {
                        item_id: answer.item_id,
                        product_name: answer.product_name,
                        department_name: answer.department_name,
                        price: answer.price,
                        stock_quantity: answer.stock_quantity,
                        
                      },
                      function(err) {
                        if (err) throw err;
                        console.log("Your update was successful!");
                        // end and exit
                        connection.end();
                      }
                    );
                  });
              }
              
                  
                  
                  