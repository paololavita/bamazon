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
  //queryAllSongs();
  //postAuction();
});

function start() {

    queryAllProducts();

function queryAllProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log("\n-------------------------------------------------");
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
      }
      console.log("-------------------------------------------------\n");

      var test = res[i];

      postPurchase(test);
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
        var chosenItem;
        var chosenUnits;

            chosenItem = answer.item
            chosenUnits = answer.units

        console.log("\nChosen Item: " + chosenItem);
        console.log("\nChosen Units: " + chosenUnits);
        
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
                    //console.log(results);
                    console.log("\nChosen Item Price: " + results[0].price);
                    console.log("\nChosen Item Quantity: " + results[0].stock_quantity);

                    connection.end();
                    }
                )};

        getPrice();







        }
    )};

            