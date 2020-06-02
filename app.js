const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.get("/",function(req,res)
{
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res)
{
    console.log(req.body);
    // res.send("Hello");
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var emailId = req.body.emailId;

    var data = {
        members:[
            {
                email_address:emailId,
                status:"subscribed",
                merge_fields:
                {
                    FNAME:firstName,
                    LNAME:lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);

    var url = "https://us10.api.mailchimp.com/3.0/lists/b4d547a46d";

    var options={
        method:"POST",
        auth:"kishore_mkv:9e1b9ba11390755b13aa1b69b6338fde-us10"
    }

    const request = https.request(url,options,function(response)
    {
        
        
        response.on("data",function(data)
        {
            // console.log(data);
            data = JSON.parse(data);
            console.log(data);
            if(data.total_created)
            {
                res.sendFile(__dirname+"/success.html");
            }
            else
            {
                res.sendFile(__dirname+"/failure.html");

            }
        })
    });
    request.write(jsonData);
    request.end();
})

app.listen(process.env.PORT||"3000",function()
{
    console.log("Server running!");
});

//9e1b9ba11390755b13aa1b69b6338fde-us10
// b4d547a46d

// {"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}