/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part 
* of this assignment has been copied manually or electronically from any other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Rahul Pankaja Edirisinghe Student ID: 133360222 Date: 24/03/2023 March 24th 2023
*
* Online (Cyclic) Link: https://busy-crab-fedora.cyclic.app/
*
********************************************************************************/


var express = require("express");
var path = require("path");
const moduleAccess = require('./modules/collegeData');
const exphbs = require("express-handlebars");
var app = express();

var HTTP_PORT = process.env.PORT || 8080;


//Main Paths 
//Get Students
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    helpers:{
        //Taken from assignment Instructions--------
        navLink: function(url, options){
            return '<li' + 
            ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
            '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
            throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
            return options.inverse(this);
            } else {
            return options.fn(this);
            }
        }
        //-----------------------------------------
    }
}));
app.set("view engine", ".hbs");

//Taken from assignment Instructions--------
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
    next();
   });
//-----------------------------------------

app.get("/students", (req, res) => {
    
    let response = undefined;

    if(req.query.course){//has course param:
        if(req.query.course <= 11 && req.query.course >= 1){
            moduleAccess.getStudentsByCourse(req.query.course).then(function(studentData){
                console.log("Successfully retrieved " + (studentData.length) + " students");
                //res.json(studentData);
                res.render("students", {student: studentData});
            }).catch(errorMessageS=>{
                console.log(errorMessageS);
                //res.json({message: errorMessageS});
                res.render("students", {message: errorMessageS});
            });
        }else{
            res.json({message: "Enter Valid Course Number: 1-11"});
        }
    }else{//if no param then: 
 
        moduleAccess.getAllStudents().then(function(studentData){
            console.log("Successfully retrieved " + (studentData.length) + " students");
            //res.json(studentData);
            res.render("students", {student: studentData});
        }).catch(errorMessageS=>{
            console.log(errorMessageS);
            //res.json({message: errorMessageS});
            res.render("students", {message: errorMessageS});
        });
    }
});

//Students by Num
app.get("/student/:num", (req, res) => {
    moduleAccess.getStudentByNum(req.params.num).then(function(studentData){
        console.log("Successfully retrieved " + (studentData.firstName + " " + studentData.lastName + " " + studentData.course));
        //res.json(studentData);
        res.render("student", {student: studentData});
    }).catch(errorMessageS=>{
        console.log(errorMessageS);
        //res.json({message: errorMessageS});
        res.render("student", {message: errorMessageS});
    });
});

//Courses by ID
app.get("/course/:id", (req, res) => {
    moduleAccess.getCourseById(req.params.id).then(function(courseData){
        console.log("Successfully retrieved " + (courseData.courseId + "-" + courseData.courseCode + " " + courseData.courseDescription));
        //res.json(studentData);
        res.render("course", {course: courseData});
    }).catch(errorMessageS=>{
        console.log(errorMessageS);
        //res.json({message: errorMessageS});
        res.render("course", {message: errorMessageC});
    });
});

//get TAs
/*
app.get("/tas", (req, res) => {
    moduleAccess.getTAs().then(function(t_a_Data){
        console.log("Successfully retrieved " + (t_a_Data.length) + " TAs");
        res.json(t_a_Data);
    }).catch(errorMessageT=>{
        console.log(errorMessageT);
        res.json({message: errorMessageT});
    });
});*/

//
app.get("/courses", (req, res) => {
    moduleAccess.getCourses().then(function(courseData){
        console.log("Successfully retrieved " + (courseData.length) + " courses");
        //res.json(courseData);
        res.render("courses", {course: courseData});
    }).catch(errorMessageC=>{
        console.log(errorMessageC);
        //res.json({message: errorMessageC});
        res.render("courses", {message: errorMessageC});
    });
});

//HTML Paths
//node --watch server.js
app.get("/", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/home.html"));
    res.render("home");
});

app.get("/about", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/about.html"));
    res.render("about");
});

app.get("/htmlDemo", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/htmlDemo.html"));
    res.render("htmlDemo");
});

app.get("/students/add", (req, res) => {
    //res.sendFile(path.join(__dirname,"/views/addStudent.html"));
    res.render("addStudent");
});

app.post("/students/add", (req, res) => {
    //res.json(req.body);
    moduleAccess.addStudent(req.body).then(function(Data){
        console.log("Successfully added new Student");
        //var path = "/student/" + Data;
        //res.redirect(path);
        res.redirect("/students");
    }).catch(errorMessageT=>{
        console.log(errorMessageT);
        res.json({message: errorMessageT});
    });
});

app.post("/student/update", (req, res) => {
    console.log(req.body);
    //req.json()  
    moduleAccess.updateStudent(req.body).then(function(studentData){
        console.log("Successfully updated " + (studentData.studentNum) + "'s data");
        //res.json(studentData);
        res.redirect("/students");
        //res.render("student", {student: studentData});
    }).catch(errorMessageUS=>{
        console.log(errorMessageUS);
        //res.json({message: errorMessageC});
        res.render("student", {message: errorMessageUS});
    });
});

//Server Initialization and Error Handling
//<label><input checkbox></label> helps -> can click text
app.use((req,res,next)=>{
    //res.status(404).send("Uh Oh Bro - 4 0 4");
    //res.status(404).sendFile(path.join(__dirname,"/views/E404.html"));
    res.status(404).render("E404");
});

// setup http server to listen on HTTP_PORT
moduleAccess.initialize().then(function(returnedData){//create an object and use that? is this beacuse of local saved files?
    app.listen(HTTP_PORT, ()=>{console.log("Server listening on port: " + HTTP_PORT)});
}).catch(errorMessage=>{
    console.log(errorMessage);
});

